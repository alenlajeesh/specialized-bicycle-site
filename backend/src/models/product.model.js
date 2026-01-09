const mongoose =require("mongoose");

const productSchema= mongoose.Schema({
	name:{
		type:String,
		required:true,
	},
	price:{
		type:Number,
		required:true
	},
	color:{
		type:String,
		required:true
	},
	size:{
		type:Number,
		required:true,
	},
	stock:{
		type:Number,
		required:true
	},
	isActive:{
		type:Boolean,
		default:true
	},
	category:{
		type:String,
		enums:["Bike","Gear"],
		required:true
	},
	description:{
		type:String,
		required:true
	},imageUrl:{
		type:String,
		required:true
	}
},{timestamps:true})

module.exports=mongoose.model("Products",productSchema);

