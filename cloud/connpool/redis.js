// This module use to create the connection pool
// as well as pass query with SDK


const { ElastiCacheClient,  DescribeUsersCommand} = require("@aws-sdk/client-elasticache");
const {ssm_gpd}=require('./gpass.js')
const {rds_gdata}=require('./rds.js')
const Redis = require("ioredis");


// function to create connection pool only
async function connection(){
	let counter=1
	try{

		// Block of code to get status of user in Elasticache(Active,Modifying)
		const client = new ElastiCacheClient();
			const input = {
					Engine: "redis",
					Filters: [
							{
								Name: 'user-id',	// In SDK it mentioned as "UserID" which not work
								Values: [
										"roshan",
									],
							},
					],
			};
		const command = new DescribeUsersCommand(input);
		const response = await client.send(command);
		const Status=response.Users[0].Status

		// Block of code to get the passwd from SecreteManager
		if(Status==='active'){
			passwd=await ssm_gpd('arn:aws:secretsmanager:ap-south-1:542662511196:secret:for-redis-uCJCqm','AWSCURRENT')
		}
		else{
			passwd=await ssm_gpd('arn:aws:secretsmanager:ap-south-1:542662511196:secret:for-redis-uCJCqm','AWSPREVIOUS')
		}


		// Block of code to create connection pool
        const pool = new Redis.Cluster(
                [
                        {
                                host: 'clustercfg.connect-redis.dytw5e.aps1.cache.amazonaws.com',
                                port: 6379,
                        },
                ],
                {
                    dnsLookup: (address, callback) => callback(null, address),
                    maxConnections: 20,
                    connectionTimeout: 5000,
                    redisOptions: {
                            tls: true,	// When transit mode is enable in cache tls should be true
                            username:'roshan',
                            password:passwd
                        },
					clusterRetryStrategy:function (times) {		// Retry mech. is provided by ioredis
  						const delay = Math.min(100 + times * 2, 2000);
  						return delay;
					}
                }
        	);
		pool.on('error', async (err) => {			//	When there is error while creating pool try
			if(counter==5){							//  catch wrapper is unable to catch the error.
				await pool.quit()					//  EmittEvents manage the error.
				console.log('Here is error',err)	//  ioredis bydefault retries for infinite time.
			}										//  to implement backoff logic we add counter here
			else{									//  directly instead using while{} await sleep(ms)
				counter++
			}
		})
		if(counter!=5){
			return pool
		}
	}catch(error){
		throw new Error(error)
	}
}

// function to execute query
async function query(pool){
	const sleep=async (ms)=>{new Promise(function(resolve,reject){
		setTimeout(()=>{resolve()},ms)
	})}
	let conn_counter=1
	while(conn_counter<6){			//  Here we implement backoff with jitter using while() await sleep
		try{
			const data=await pool.get("101")
			if(data==null){
				const [data]=await rds_gdata()
				await pool.set(data.id,data.name)
				return data
			}
			else{
				return data
			}

		}catch(error){
			if(conn_counter==5){
				throw new Error(error)
			}
			else{
				conn_counter++
				let conn_ms=Math.min(1000,Math.pow(2,conn_counter)+Math.floor(Math.random()*100))
				await sleep(conn_ms)
			}
		}
	}
}


async function cache_gdata(){
	let pool
	try{
		pool=await connection()
		const data=await query(pool)	//  If any error it will not create new instance
		return data						//  of pool instead it uses same pool
										// which hepls to reduce CPU utilization
	}catch(error){
		throw new Error(error)
	}finally{
		if(pool){
			await pool.quit()
		}
	}
}





module.exports={cache_gdata}
