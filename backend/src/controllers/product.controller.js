const Product = require("../models/product.model.js");
const ApiError = require("../utils/api.error.handle.js");
const path = require("path");
const fs = require("fs").promises;
// GET all products
exports.getAllproducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

// GET single product
exports.getAProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

// CREATE product ✅ FIXED
exports.createProduct = async (req, res, next) => {
  try {

    const {
      name,
      price,
      color,
      size,
      stock,
      category,
      description,
      imageUrl, // ✅ THIS WAS MISSING
      isActive = true,
    } = req.body;

    // Validation
    if (
      !name ||
      !price ||
      !color ||
      !size ||
      !stock ||
      !category ||
      !description ||
      !imageUrl // ✅ REQUIRED
    ) {
      return next(new ApiError(400, "All fields including image are required"));
    }

    const product = new Product({
      name,
      price,
      color,
      size,
      stock,
      category,
      description,
      imageUrl, // ✅ SAVED TO DB
      isActive,
    });

    await product.save();

    res.status(201).json({
      message: "Product Created",
      product,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE product
exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!product) {
      return next(new ApiError(404, "Product Not found"));
    }

    res.json({ data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE product
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ApiError(404, "Product Not found"));
    }

    // Delete the image file if it exists
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, "../../assets", path.basename(product.imageUrl));
        try {
			await fs.access(imagePath);
			await fs.unlink(imagePath);
		}catch (err) {
			console.error("Error accessing or deleting file:", imagePath, err.message);
		}  

	}

    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    next(err);
  }
};
