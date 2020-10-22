var mongoose = require('mongoose')
var express = require('express');
var router = express.Router();
var autoIncrement = require('mongoose-auto-increment')

var uri = process.env.DB_LOCALHOST


var ProductSchema = new mongoose.Schema({
  Id: {type: Number, default: 0, unique: true},
  Name: String,
  Brand: String,
  Price: Number,
  Quantity: Number,
  ProductSales: Number,
  Stock: String,
  Note : String,
  MaxSize: String,
  CreatedDate: Date,
  CreatedBy:String,
  UpdatedDate:Date,
  UpdatedBy:String,
  IsDeleted: Boolean,
})
var Product = mongoose.model('Product', ProductSchema, 'Products')
module.exports.Product = Product

