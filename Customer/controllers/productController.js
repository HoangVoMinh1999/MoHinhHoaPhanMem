const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

exports.product_list = (req, res, next) => {
    let page = Number(req.query.page);
    Product.find({}).lean().skip(6 * page - 6).limit(6)
        .exec(function(err, list_products) {
            if (err) { return next(err) }
            Product.count({}, function(err, count) {
                console.log("Number of users: ", count);
                let pages = [1];
                let page_size = Math.ceil(count / 6);
                for (let index = 2; index <= page_size; index++) {
                    pages.push(index);
                }
                Category.find({}).lean().exec(function(err, list_categories) {
                    if (err) { return next(err) }
                    res.render('shop/product', {
                        title: 'Trang sản phẩm',
                        product_list: list_products,
                        pagination: pages,
                        last_page: page_size,
                        category_list: list_categories
                    });
                })

            })
        });
};

exports.product_detail = (req, res, next) => {
    res.render('shop/detail', { title: 'Chi tiết sản phẩm' });
};