var express = require('express');
var router = express.Router();
var ProductModels = require('../models/Product')
var ProductController = require('../controllers/ProductController')
var categoryController = require('../controllers/categoryController');
var userController = require('../controllers/userController');
var orderController = require('../controllers/orderController');
var adminController = require('../controllers/adminController');

/* GET home page. */

router.get('/', adminController.index);

router.get('/login', adminController.login);

router.post('/login', adminController.userLogin);
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

router.get('/customer-list/lock-unlock-user/:id', userController.lock_unlock_user);

router.post('/customer-list/edit-customer/:id', userController.edit_user);

/* staff */
router.get('/staff-list', userController.staff_list);

router.get('/staff-list/lock-unlock-user/:id', userController.lock_unlock_user);

router.post('/staff-list/edit-staff/:id', userController.edit_user);

router.post('/staff-list/add-staff', userController.add_staff);

/* order */

router.get('/order-list', orderController.order_list);

router.get('/order-list/change-status/:id/:status', orderController.change_status);

router.get('/order-list/order-detail/:id', orderController.order_detail);


module.exports = router;