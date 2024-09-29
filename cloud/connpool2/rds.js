const mysql=require('mysql2/promise')
const fs = require('fs');
const {get_secret}=require('./secret.js')
const {backoff_logic}=require('./backoff.js')

async function pool(){
	try{
		const creds=await get_secret('arn:aws:secretsmanager:ap-south-1:542662511196:secret:rds!db-ef88a022-7a7f-4688-8fad-3c65b6827bc9-YdAKO9')
		const username=creds.username
		const password=creds.password
		const pool = mysql.createPool({
			host:'rdsproxy-fords.proxy-chkmr1yoinan.ap-south-1.rds.amazonaws.com',
			user:username,
			password:password,
			ssl:{
				ca : fs.readFileSync('root.pem'),
				rejectUnauthorized: true,
				checkServerIdentity: (host, cert) => {
                                        const error = tls.checkServerIdentity(host, cert);
                                        if (error) {
                                                throw error;
                                        }
                                }
			}
	
		})
		return pool
	}
	catch(error)
	{
		throw error
	}
}

async function exe_query(){
	let new_pool
	try{
		new_pool=await backoff_logic(pool,6)
		const [res]=await new_pool.query('show databases')
		return res
	}
	catch(error)
	{
		throw error
	}
	finally{
		process.on('SIGINT',async()=>{
			new_pool.end()
                })
	}
}

;(async()=>{
	try{
		const data=await backoff_logic(exe_query,6) 
		console.log(data)
	}
	catch(error)
	{
		console.log(error)
	}
})()

