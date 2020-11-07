var express = require('express');
var router = express.Router();
var ProductModels = require('../Models/Product')
var ProductController= require('../controllers/ProductController')

/* GET home page. */
router.post('/', function(req, res, next) {
  res.render('index', { title: 'Index',layout:"Index_Layout" });
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index',layout:"Index_Layout" });
});

router.get('/login',function(req,res,next){
  res.render('login',{title:'Login',layout:'Login_Layout'});
});
//#region  Product
router.get('/product-list',ProductController.ShowProducts);

router.post('/product-list',ProductController.UpdateProduct_ProductList);

router.get('/product-detail',ProductController.ProductDetail);

router.get('/add-product',function(req,res,next){
  res.render('products/product_add',{title:'Add Product',layout:'Index_Layout'});
});

router.post('/add-product',ProductController.InsertNewProduct)

router.get('/edit-product',ProductController.EditProduct);
module.exports = router;
