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

//---Product
router.get('/product-list',ProductController.ShowProducts);

router.post('/product-list',function(req,res,next){
  res.render('product_list',{title:'Product',layout:'Index_Layout'});
});

router.get('/product-detail',ProductController.ShowProductBy_id);


router.get('/add-product',function(req,res,next){
  res.render('product_add',{title:'Add Product',layout:'Index_Layout'});
});

router.post('/add-product',ProductController.InsertNewProduct)

router.get('/edit-product',function(req,res,next){
  res.render('product_edit',{title:'Edit Product',layout:'Index_Layout'});
});
module.exports = router;
