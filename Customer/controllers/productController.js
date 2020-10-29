const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

exports.product_list = (req, res, next) => {
    let page = Number(req.query.page);
    let action = req.query.act;
    if (action === 'asc') {
        Product.find({}).lean().sort([
                ['price', 'ascending']
            ]).skip(6 * page - 6).limit(6)
            .exec(function(err, list_products) {
                if (err) { return next(err) }
                Product.count({}, function(err, count) {
                    console.log("Number of users: ", count);
                    let pages_number = [1];
                    let pages_link = ['1&act=asc'];
                    let page_size = Math.ceil(count / 6);
                    for (let index = 2; index <= page_size; index++) {
                        pages_number.push(index);
                        pages_link.push(index + '&act=asc');
                    }
                    Category.find({}).lean().exec(function(err, list_categories) {
                        if (err) { return next(err) }
                        res.render('shop/product', {
                            title: 'Trang sản phẩm',
                            product_list: list_products,
                            pagination_number: pages_number,
                            pagination_link: pages_link,
                            last_page: page_size,
                            category_list: list_categories,
                        });
                    })

                })
            });

    } else if (action === 'desc') {
        Product.find({}).lean().sort([
                ['price', 'descending']
            ]).skip(6 * page - 6).limit(6)
            .exec(function(err, list_products) {
                if (err) { return next(err) }
                Product.count({}, function(err, count) {
                    console.log("Number of users: ", count);
                    let pages_number = [1];
                    let pages_link = ['1&act=desc'];
                    let page_size = Math.ceil(count / 6);
                    for (let index = 2; index <= page_size; index++) {
                        pages_number.push(index);
                        pages_link.push(index + '&act=desc');
                    }
                    Category.find({}).lean().exec(function(err, list_categories) {
                        if (err) { return next(err) }
                        res.render('shop/product', {
                            title: 'Trang sản phẩm',
                            product_list: list_products,
                            pagination_number: pages_number,
                            pagination_link: pages_link,
                            last_page: page_size,
                            category_list: list_categories,
                        });
                    })

                })
            });

    } else {
        Product.find({}).lean().skip(6 * page - 6).limit(6)
            .exec(function(err, list_products) {
                if (err) { return next(err) }
                Product.count({}, function(err, count) {
                    console.log("Number of users: ", count);
                    let pages_number = [1];
                    let pages_link = [1];
                    let page_size = Math.ceil(count / 6);
                    for (let index = 2; index <= page_size; index++) {
                        pages_number.push(index);
                        pages_link.push(index);
                    }
                    Category.find({}).lean().exec(function(err, list_categories) {
                        if (err) { return next(err) }
                        res.render('shop/product', {
                            title: 'Trang sản phẩm',
                            product_list: list_products,
                            pagination_number: pages_number,
                            pagination_link: pages_link,
                            last_page: page_size,
                            category_list: list_categories
                        });
                    })

                })
            });
    }

};

exports.product_detail = (req, res, next) => {
    var id = req.params.id;
    async.parallel({
        product: function(callback) {
            Product.findById(id).lean()
                .exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.product == null) {
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        Category.findById(results.product.cateId).lean().exec(function(err, cate) {
            if (err) { return next(err); }

            res.render('shop/detail', { title: 'Chi tiết sản phẩm', product: results.product, category: cate });
        });

    });

};