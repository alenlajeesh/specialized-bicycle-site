const router= require("express").Router();
const {
	getAllproducts,
	getAProduct,
	createProduct,
	updateProduct,
	deleteProduct
}=require("../controllers/product.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

router.get("/",getAllproducts);
router.get("/:id",getAProduct);
router.post("/",authMiddleware,createProduct);
router.put("/:id",authMiddleware,updateProduct);
router.delete("/:id",authMiddleware,deleteProduct); 

module.exports=router;
