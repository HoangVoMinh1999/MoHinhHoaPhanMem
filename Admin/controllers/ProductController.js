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

exports.ShowProducts = async function (req, res, next) {
    var data = []
    var query = req.query.Page;
    Product.countDocuments({}, function (err, count) {
        if (err) throw err;
        if (count > 0) {
            var temp = count % 10 != 0 ? Math.floor(count/10) + 1 : count/10 
            var pages = createNumberArray(temp)
            Product.find({IsDeleted: false}).skip((query-1)*10).limit(10).lean().exec(async function (err, result) {
                if (err) throw err;
                data = result.map(function (doc) { return doc })
                await res.render('products/product_list', { title: 'Product', layout: 'Index_Layout', data: data ,pages: pages});
            })
        }
    });
}
exports.UpdateProduct_ProductList = async function(req,res,next){
    var query = mongoose.Types.ObjectId(req.body._id)
    let item = null
    if (req.body.Name != undefined){
        item = {
            Name: req.body.Name,
            Brand: req.body.Brand,
            Price: req.body.Price,
            Quantity: req.body.Quantity,
            ProductSales: req.body.ProductSales,
            MaxSize:req.body.MaxSize,
            Stock: req.body.Stock,
            Note:req.body.Note,
            UpdatedDate : new Date().toLocaleDateString(),
        }
    }
    else
    {
        query = req.body._id;
        item = {
            IsDeleted:true,
            UpdatedDate : new Date().toLocaleDateString(),
        }
    }
    Product.findByIdAndUpdate(query,item ,{ runValidators: true },async function(err){
        if (err) throw err;
        console.log("Update Successfully !!!")
    })
    var data = []
    Product.countDocuments({IsDeleted: false}, function (err, count) {
        if (err) throw err;
        if (count > 0) {
            var temp = count % 10 != 0 ? Math.floor(count/10) + 1 : count/10 
            var pages = createNumberArray(temp)
            Product.find({IsDeleted: false}).skip((query-1)*10).limit(10).lean().exec(async function (err, result) {
                if (err) throw err;
                data = result.map(function (doc) { return doc })
                await res.render('products/product_list', { title: 'Product', layout: 'Index_Layout', data: data ,pages: pages});
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
        Stock: "In Stock",
        Note:req.body.Note != null ? req.body.Note : "",
        CreatedDate: new Date().toLocaleDateString(),
        UpdatedDate: new Date().toLocaleDateString(),
        IsDeleted: false
    })
    newItem.save(function (err, result) {
        if (err) throw err;
    })
    await res.render('products/product_add', { title: 'Add Product', layout: 'Index_Layout' });
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
            Stock: result.Stock != "" ? result.Stock : "None",
            Note:result.Note != null ? result.Note : "Chưa có thông tin ghi chú",
        })
        data.push(item)
        await res.render('products/product_detail', { title: 'Detail', layout: 'Index_Layout',data:data });
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
            Stock: result.Stock != "" ? result.Stock : "None",
            Note:result.Note != null ? result.Note : "Chưa có thông tin ghi chú",
        })
        data.push(item)
        await res.render('products/product_edit', { title: 'Edit Product', layout: 'Index_Layout',data:data });
    })
}

//--- Support Function

function createNumberArray(N){
    var A = new Array(N);
    for (i = 0;i< N;i++)
    {
        A[i] = i+1;
    }
    return A
}
