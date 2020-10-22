var express = require('express');
var router = express.Router();
var productController = require('../controllers/productController');
var loginController = require('../controllers/loginController');
var registerController = require('../controllers/registerController');
var cartController = require('../controllers/cartController');
var checkoutController = require('../controllers/checkoutController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shop/index', { title: 'Express' });
});

router.get('/login', loginController.login);

router.get('/register', registerController.register);

router.post('/register', registerController.postRegister);

router.get('/product', productController.product_list);

router.get('/cart', cartController.cart);

router.get('/checkout', checkoutController.checkout);

router.get('/detail', productController.product_detail);

router.get('/confirmation', checkoutController.confirmation);

module.exports = router;