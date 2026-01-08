const router= require("express").Router();
const {
	getAllproducts,
	getAProduct,
	createProduct,
	updateProduct,
	deleteProduct
}=require("../controllers/product.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const { authorize } = require("../middlewares/role.middleware.js");

router.get("/",getAllproducts);
router.get("/:id",getAProduct);
router.post("/",authMiddleware,authorize("admin"),createProduct);
router.put("/:id",authMiddleware,authorize("admin"),updateProduct);
router.delete("/:id",authMiddleware,authorize("admin"),deleteProduct); 

module.exports=router;
