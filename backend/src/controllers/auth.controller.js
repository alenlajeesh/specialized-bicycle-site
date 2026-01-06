const User = require("../models/user.model.js");
const generatejwt=require("../utils/generate.jwt.js")
const {hashPassword,hashCompare}=require("../utils/hash.bcrypt.js")
const ApiError =require("../utils/api.error.handle.js");



exports.registerAuth=async(req,res,next)=>{
	try{
		const {username,email,password}=req.body;
		if(!username||!email||!password){
			return next(new ApiError(400,"Invalid username,password,or email"))
		}
		const existUser= await User.findOne({email});
		if(existUser){
			return next(new ApiError(400),"Email already exist");
		}
		
		const hashPass= await hashPassword(password);

		const user=new User({
			username,
			email,
			password:hashPass
		})

		await user.save();
		res.status(201).json({
			success:true,
			message:"User successfully created!!"
		})

	}
	catch(err){
		next(err);
	}
}

exports.loginAuth=async(req,res,next)=>{
	try{
		const {email,password}= req.body;
		if(!email||!password){
			return next(new ApiError(400,"Invalid Email or password"))
		}
		const user= await User.findOne({email}).select("+password");

		if(!user){
			return next(new ApiError(404,"User not found"));
		}

		const isMatch =await hashCompare(password,user.password);
		if(!isMatch){
			return next(new ApiError(401,"Wrong Password"));
		}

		const token =generatejwt(user._id,user.username);
		res.json({
			success:true,
			message:"Successfully Logged in",
			token
		})

	}
	catch(err){
		next(err);
	}
}
