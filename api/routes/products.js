const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    cb(null, false);
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1042 * 1024 * 10
    },
    fileFilter: fileFilter
});


const ProductController = require('../controllers/product')


// Get all products
router.get('/', ProductController.products_get_all);


// Add product
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_add_product);


// Get one product
router.get('/:productId', ProductController.products_get_one);


// Edit product
router.patch('/:productId', checkAuth, ProductController.products_edit_product);


//Delete a product
router.delete('/:productId', checkAuth, ProductController.product_delete);


module.exports = router;