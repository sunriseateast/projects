const {cache_gdata}=require('./redis.js')

;(async()=>{
	try{
		const data=await cache_gdata()
		console.log(data)
	}catch(error){
		console.log(error)
	}
})()
