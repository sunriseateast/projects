const {backoff_logic}=require('./backoff.js')
const {get_secret}=require('./secret.js')
const Redis = require("ioredis");
async function pool(){
	const creds=await get_secret('arn:aws:secretsmanager:ap-south-1:542662511196:secret:newredis-HNiucX')
	const Username=creds.Username
	const Password=creds.Password
	const cluster=new Redis.Cluster(
		[
			{
				port:6379,
				host:'clustercfg.redis-fords.dytw5e.aps1.cache.amazonaws.com'
			}
		],
		{
			dnsLookup: (address, callback) => callback(null, address),
			redisOptions:{
				username:Username,
				password:Password,
				tls: {},
		
			},
			retryStrategy(times) {
    				const delay = Math.min(times * 50, 2000);
    				return delay;
  			},
			scaleReads: "slave",
			connectTimeout:10000,
                        maxRetriesPerRequest:2,
                        commandTimeout:10000,
			maxConnections: 20,
		}
	)
	return cluster

}

async function query(){
	let cluster
	try{
		cluster=await pool()
		const data=await cluster.get('foo')
		return data
	}
	catch(error)
	{
		throw error
	}
	finally{
		if(cluster)
		{
			cluster.disconnect()
		}
	}
}

;(async()=>{
	try{
		const data=await backoff_logic(query,6)
		console.log(data)
	}
	catch(error)
	{
		console.log(error)
	}

})()


