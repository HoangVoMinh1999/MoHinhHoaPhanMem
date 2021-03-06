var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var homeController = require('../controllers/homeController');
var productController = require('../controllers/productController');
var userController = require('../controllers/userController');
var cartController = require('../controllers/cartController');
var checkoutController = require('../controllers/checkoutController');
var orderController = require('../controllers/orderController');

/* GET home page. */
router.get('/', homeController.home);

router.use(flash());

// Login
router.get('/login', userController.login);

router.post('/login', userController.userLogin);

// LOGOUT
router.get('/logout', userController.logout);

router.get('/register', userController.register);

router.post('/register', userController.postRegister);

router.get('/profile', userController.profile);

router.get('/changepassword', userController.changepassword);

router.post('/changepassword', userController.postchangepassword);

router.get('/product', productController.product_list);

router.get('/product/detail/:id', productController.product_detail);

router.get('/cart', cartController.cart);

router.get('/cart/:id', cartController.deleteproduct);

router.get('/product/:id', cartController.addproduct);

router.get('/product/detail/:id/:quantity', cartController.adddetailproduct);

router.get('/search-product', productController.search_product);

router.get('/checkout', checkoutController.checkout);

router.get('/confirmation', checkoutController.confirmation);

router.get('/order', orderController.order);

router.get('/order-detail/:id', orderController.order_detail);

router.get('/order-detail/cancel-order/:id', orderController.cancel_order);

router.get('/wishlist', userController.wishlist);

router.get('/add-wishlist/:id', userController.add_wishlist);

router.get('/remove-wishlist/:id', userController.remove_wishlist);

module.exports = router;