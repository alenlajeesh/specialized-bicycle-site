const bcrypt = require("bcryptjs");

const hashPassword =async(data)=>{
	try{
		const saltRounds= 10;
		const hashedPassword=await bcrypt.hash(data,saltRounds);
		return hashedPassword;
	}catch(err){
		console.log(err);
	}
}

const hashCompare= async (pass,hashPass)=>{
	try{
		const isMatch =await bcrypt.compare(pass,hashPass);
		return isMatch;
	}catch(err){
		console.log(err);
	}
}

module.exports ={hashPassword,hashCompare}
