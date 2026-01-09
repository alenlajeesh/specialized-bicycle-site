const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadImage } = require('../controllers/multer.controller');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../assets')); // save in assets folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image!'), false);
};

const upload = multer({ storage, fileFilter });

// POST /api/v1/image
router.post('/', upload.single('image'),uploadImage);

module.exports = router;


