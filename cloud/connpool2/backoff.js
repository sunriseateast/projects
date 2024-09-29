const sleep=async (ms)=>{new Promise(function(resolve,reject){
	setTimeout(()=>{resolve()},ms)
})}
async function backoff_logic(fn,retries){
	let counter=1
	while(counter<=retries){
		try{
			const data=await fn()
			return data
		}
		catch(error)
		{	
			counter ++
			if(counter===retries){
				throw error
			}
			conn_ms=Math.min(1000,Math.pow(2,counter)+Math.floor(Math.random()*100))
			sleep(conn_ms)
		}
	}
}
module.exports={backoff_logic}
