const Product = require("../models/product.model.js");
const ApiError =require("../utils/api.error.handle.js")

exports.getAllproducts=async(req,res,next)=>{
	try{
		const products= await Product.find();
		res.json({
			products,
		})

	}catch(err){
		next(err);
	}
}
exports.getAProduct=async (req,res,next)=>{
	try{
		const id =req.params.id;
		const product = await Product.findById(id);
		
		if(!product){
			return next(new ApiError(404,"Product not found"))
		}
		res.json({
			data:product
		})

	}catch(err){
		next(err);
	}
}
exports.createProduct=async(req,res,next)=>{
	try{
		const {name,price,color,size,stock,category,description}=req.body;

		if(!name||!price||!color||!size||!category||!description||!stock){
			return next(new ApiError(204,"Fill all the info"));
		}
		const product=new Product({name,price,color,size,stock,category,description})
		await product.save()
		res.status(201).json({
			message:"Product Created",
			product});
	}catch(err){
		next(err);
	}
}

exports.updateProduct= async (req,res,next)=>{
	try{
		const id= req.params.id;
		const product=await Product.findByIdAndUpdate(id,req.body,{new:true});
		if(!product){
			return next(new ApiError(404,"Product Not found"));
		}
		res.json({
			data:product
		})
	}catch(err){
		next(err);
	}
}
exports.deleteProduct=async (req,res,next)=>{
	try{
		const id= req.params.id;

		const product=await Product.findByIdAndDelete(id);

		if(!product){
			return next(new ApiError(404,"Product Not found"));
		}
		res.json({
			message:"Deleted Successfully"
		})
	}catch(err){
		next(err);
	}
	
}


