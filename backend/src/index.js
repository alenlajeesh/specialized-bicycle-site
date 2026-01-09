const express= require("express");
const cors =require("cors");
const path = require('path');
const dotenv= require("dotenv").config();

const authRouter =require("./routes/auth.router.js");
const productRouter =require("./routes/product.router.js");
const cartRouter =require("./routes/cart.router.js");
const imageRoutes = require('./routes/multer.router.js');

const errorHandler= require("./middlewares/error.middleware.js")
const connectDB =require("./config/db.js")

const app =express()
connectDB();

app.use(express.json());
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/products",productRouter)
app.use("/api/v1/cart",cartRouter);
app.use('/api/v1/image', imageRoutes);

app.use(errorHandler);
app.listen(process.env.PORT,()=>{
	console.log("Server Started at ",process.env.PORT);
})
