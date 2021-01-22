var express = require('express');
var router = express.Router();
var ProductModels = require('../models/Product')
var ProductController = require('../controllers/ProductController')
var categoryController = require('../controllers/categoryController');
var userController = require('../controllers/userController');
const { route } = require('./users');

/* GET home page. */
router.post('/', function(req, res, next) {
    res.render('index', { title: 'Index', layout: "Index_Layout" });
});

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Index', layout: "Index_Layout" });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login', layout: 'Login_Layout' });
});
//#region  Product
router.get('/product-list', ProductController.ShowProducts);

router.post('/product-list', ProductController.UpdateProduct_ProductList);

router.get('/product-detail', ProductController.ProductDetail);

router.get('/add-product', function(req, res, next) {
    res.render('products/product_add', { title: 'Add Product', layout: 'Index_Layout' });
});

router.post('/add-product', ProductController.InsertNewProduct)

router.get('/edit-product', ProductController.EditProduct);

/* category */
router.get('/category-list', categoryController.category_list);

router.post('/category-list/add-category', categoryController.add_category);

router.post('/category-list/edit-category/:id', categoryController.edit_category);

router.get('/category-list/delete-category/:id', categoryController.delete_category);

/* customer */

router.get('/customer-list', userController.customer_list);

router.get('/staff-list', userController.staff_list);
module.exports = router;