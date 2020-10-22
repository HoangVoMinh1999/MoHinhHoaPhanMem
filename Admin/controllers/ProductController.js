require('dotenv').config()
var ProductModel = require('../Models/Product')
var mongoose = require('mongoose');
const { report } = require('../app');

const MongoClient = require('mongodb').MongoClient
var uri = process.env.DB_LOCALHOST
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

var Product = ProductModel.Product

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})
function createNumberArray(N){
    var A = new Array(N);
    for (i = 0;i< N;i++)
    {
        A[i] = i+1;
    }
    return A
}

exports.ShowProducts = async function (req, res, next) {
    var data = []
    Product.countDocuments({}, function (err, count) {
        if (err) throw err;
        if (count > 0) {
            var temp = count % 10 != 0 ? new Int16Array(count/10) + 1 : count/10 
            var pages = createNumberArray(temp)
            Product.find().lean().exec(async function (err, result) {
                if (err) throw err;
                data = result.map(function (doc) { return doc })
                await res.render('product_list', { title: 'Product', layout: 'Index_Layout', data: data ,pages: pages});
            })
        }
    });
}
exports.UpdateProduct_ProductList = async function(req,res,next){
    var query = mongoose.Types.ObjectId(req.body._id)
    let item = {
        Name: req.body.Name,
        Brand: req.body.Brand,
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        ProductSales: req.body.ProductSales,
        MaxSize:req.body.MaxSize,
        Status: req.body.Status,
        Stock: req.body.Stock,
        Note:req.body.Note,
    }
    console.log(item)
    Product.findByIdAndUpdate(query,item ,{ runValidators: true },async function(err){
        if (err) throw err;
        console.log("123")
    })
    var data = []
    Product.countDocuments({}, function (err, count) {
        if (err) throw err;
        if (count > 0) {
            var temp = count % 10 != 0 ? new Int16Array(count/10) + 1 : count/10 
            var pages = createNumberArray(temp)
            Product.find().lean().exec(async function (err, result) {
                if (err) throw err;
                data = result.map(function (doc) { return doc })
                await res.render('product_list', { title: 'Product', layout: 'Index_Layout', data: data ,pages: pages});
            })
        }
    });
}

exports.InsertNewProduct = async function (req, res, next) {
    var newItem = new Product({
        Name: req.body.Name,
        Brand: req.body.Brand,
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        ProductSales: 0,
        MaxSize:req.body.MaxSize,
        Status: "Active",
        Stock: "In Stock",
        Note:req.body.Note != null ? req.body.Note : "",
        IsDeleted: false
    })
    newItem.save(function (err, result) {
        if (err) throw err;
    })
    await res.render('product_add', { title: 'Add Product', layout: 'Index_Layout' });
}

exports.ProductDetail = async function(req,res,next){
    var query = mongoose.Types.ObjectId(req.query._id)
    var data = []
    Product.findById(query).lean().exec(async function(err,result){
        if (err) throw err
        let item = new Product({
            _id: result._id,
            Name: result.Name,
            Brand: result.Brand,
            Price: result.Price,
            Quantity: result.Quantity,
            ProductSales: result.ProductSales,
            MaxSize:result.MaxSize,
            Status: result.Status,
            Stock: result.Stock,
            Note:result.Note != null ? result.Note : "Chưa có thông tin ghi chú",
        })
        data.push(item)
        await res.render('product_detail', { title: 'Detail', layout: 'Index_Layout',data:data });
    })
}

exports.EditProduct = async function(req,res,next){
    var query = mongoose.Types.ObjectId(req.query._id)
    var data = []
    Product.findById(query).lean().exec(async function(err,result){
        if (err) throw err
        let item = new Product({
            _id : result._id,
            Name: result.Name,
            Brand: result.Brand,
            Price: result.Price,
            Quantity: result.Quantity,
            ProductSales: result.ProductSales,
            MaxSize:result.MaxSize,
            Status: result.Status,
            Stock: result.Stock,
            Note:result.Note != null ? result.Note : "Chưa có thông tin ghi chú",
        })
        data.push(item)
        await res.render('product_edit', { title: 'Edit Product', layout: 'Index_Layout',data:data });
    })
}