var express = require('express');
var router = express.Router();

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
router.get('/product-list',function(req,res,next){
  res.render('product_list',{title:'Product',layout:'Index_Layout'});
});
module.exports = router;
