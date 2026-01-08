const router =require("express").Router();
const authMiddleware=require("../middlewares/auth.middleware.js")
const {
	getAllCartItem,
	updateCartItem,
	deleteCartItem,
	addCartItem
}=require("../controllers/cart.controller.js")

router.get("/",authMiddleware,getAllCartItem);
router.post("/add",authMiddleware,addCartItem);
router.put("/update",authMiddleware,updateCartItem);
router.delete("/:id",authMiddleware,deleteCartItem);

module.exports= router;
