const fs = require('fs');
const mysql = require('mysql2/promise');
const {ssm_gpd}=require('./gpass.js')


const sleep=async (ms)=>{new Promise(function(resolve,reject){
	setTimeout(()=>{resolve()},ms)
})}


// function to create connection
async function connection(){
		try{
			const passwd=await ssm_gpd('arn:aws:secretsmanager:ap-south-1:542662511196:secret:rds!db-abaed5c2-ed75-49c9-bc59-80f893b7fc33-Bulmwd','AWSCURRENT')
			const pool=mysql.createPool({
				host:'connect-rds.chkmr1yoinan.ap-south-1.rds.amazonaws.com',
				user:'admin',
				password:passwd,
				ssl:{
					ca : fs.readFileSync('global-bundle.pem')
				}
			})
			return pool
		}catch(error){
			throw new Error(error.message)
			
		}
}

// function to execute query
async function query(pool,rds_query){
	let conn_counter=1
	while(conn_counter<6){		//  Here we implement backoff with jitter using while() await sleep
		try{
			const [data]=await pool.query(rds_query) 	//  here we destructure the o/p [[]]=[[a],[b]]=>[[a]]
			return data
	
		}catch(error){
			if(conn_counter===5){
				throw new Error(error)
			}
			conn_counter++
			conn_ms=Math.min(1000,Math.pow(2,conn_counter)+Math.floor(Math.random()*100))
			await sleep(conn_ms)
		}
	}
	
}

async function rds_gdata(){
	let pool
	try{
		pool=await connection()			//  If any error it will not create new instance
		await query(pool,"use demo")	//  of pool instead it uses same same pool
		const query_data=await query(pool,"select * from user where name='roshan'")		// which hepls to reduce CPU utilization
		return query_data
	}catch(error){
		throw new Error(error)
	}finally{
		if(pool){
			await pool.end()
		}
	}
}

module.exports={rds_gdata}

