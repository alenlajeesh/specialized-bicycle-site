const mongoose =require("mongoose");

const cartSchema = mongoose.Schema({
	userId:{
		type:mongoose.Schema.Types.ObjectId,
		required:true,
		unique:true
	},
	items:[
		{
			productId:{
				type:mongoose.Schema.Types.ObjectId,
				required:true
			},
			quantity:{
				type:Number,
				required:true,
				min:1
			}
		}
	]
},{timestamps:true});

module.exports= mongoose.model("Cart",cartSchema);
