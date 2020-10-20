require('dotenv').config()
var ProductModel = require('../Models/Product')
var mongoose = require('mongoose');

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
                console.log(data)
                await res.render('product_list', { title: 'Product', layout: 'Index_Layout', data: data ,pages: pages});
            })
        }
    });
}
exports.InsertNewProduct = async function (req, res, next) {
    var newItem = new Product({
        Id: new mongoose.Types.ObjectId(),
        Name: req.body.Name,
        Brand: req.body.Brand,
        Price: req.body.Price,
        Quantity: req.body.Quantity,
        ProductSales: 0,
        Status: "Active",
        Stock: "In Stock",
        IsDeleted: false
    })
    newItem.save(function (err, result) {
        if (err) throw err;
        console.log(result)
    })
    await res.render('product_add', { title: 'Add Product', layout: 'Index_Layout' });

}