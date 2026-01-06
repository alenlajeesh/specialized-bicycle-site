const router = require("express").Router();
const {loginAuth,registerAuth}= require("../controllers/auth.controller.js");

router.post("/login",loginAuth);
router.post("/register",registerAuth);

module.exports= router;

