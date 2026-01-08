const jwt =require("jsonwebtoken");

const generatejwt =(userId,username,role)=>{
	try{
		const payLoad={
			id:userId,
			role:role,
			username,
		}
		const token = jwt.sign(payLoad,process.env.JWT_SECRET,{
			expiresIn:process.env.JWT_EXPIRES_IN
		});
		return token;
	}catch(err){
		console.log(err);
	}
}

module.exports= generatejwt;
