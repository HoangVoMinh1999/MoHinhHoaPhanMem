require('dotenv').config()
var ProductModel = require('../Models/Product')
var mongoose = require('mongoose');
 
const MongoClient = require('mongodb').MongoClient
var uri = process.env.DB_LOCALHOST
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri , { useNewUrlParser: true, useUnifiedTopology: true });

var Product = ProductModel.Product

exports.ShowProducts = async function (req, res, next) {
    var data = []
    Product.find(async function(err,result){
        if (err) throw err;
        data = result.map(function(doc) {return doc})
        await res.render('product_list',{title:'Product',layout:'Index_Layout', data:data});
    })
}
exports.InsertNewProduct = async function(req,res,next){
    var newItem = new Product({
        Id:new mongoose.Types.ObjectId(),
        Name:req.body.Name,
        Brand:req.body.Brand,
        Price:req.body.Price,
        Quantity:req.body.Quantity,
        Status:"Active",
        Stock:"In Stock",
        IsDeleted:false
    })
    newItem.save(function(err,result){
        if (err) throw err;
        console.log(result)
    })
    await res.render('product_add',{title:'Add Product',layout:'Index_Layout'});

}