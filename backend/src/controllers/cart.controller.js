const Cart =require("../models/cart.model");
const ApiError =require("../utils/api.error.handle.js")

exports.addCartItem = async (req, res, next) => {
  try {
    let { productId, quantity } = req.body;
    quantity = Number(quantity);
    const userId = req.user.id;

    if (!productId || !quantity) {
      return next(new ApiError(400, "ProductId or Quantity missing"));
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

exports.getAllCartItem=async(req,res,next)=>{
	try{
		const cart= await Cart.findOne({userId:req.user.id}).populate("items.productId");

		if(!cart) return res.json({items:[],total:0});
		let total=0;
		cart.items.forEach(item=>{
			total+=item.productId.price*item.quantity;
		});

		res.json({cart,total});
	}
	catch(err){
		next(err);
	}
}

exports.updateCartItem=async(req,res,next)=>{
	try {
		const { productId, quantity } = req.body;

		if (quantity < 1) {
			return next(new ApiError(204,"Quantity must be >= 1"))
		}

		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) {
			return next(new ApiError(204,"Cart not found"))
		}

		const item = cart.items.find(
			item => item.productId.toString() === productId
		);

		if (!item) {
			return next(new ApiError(204,"Quantity must be >= 1"))
		}

		item.quantity = quantity;
		await cart.save();

		res.json(cart);
	} catch (err) {
		  next(err);
	}
}

  exports.deleteCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== id
    );
		console.log(
		"DB productId:",
			cart.items.map(i => i.productId.toString())
		);
		console.log("Requested:", id);

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

