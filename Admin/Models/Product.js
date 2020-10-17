var mongoose = require('mongoose')
var express=require('express');
var router = express.Router();

var uri = process.env.DB_LOCALHOST
mongoose.connect(uri , { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, function (err, res) {
    if (err) {
    console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uri);
    }
  });

var ProductSchema = new mongoose.Schema({
    Id:String,
    Name:String,
    Brand:String,
    Price:Number,
    Quantity:Number,
    Status:String,
    Stock:String,
    IsDeleted:Boolean,
})
var Product = mongoose.model('Product',ProductSchema,'Products')


module.exports.Product = Product

