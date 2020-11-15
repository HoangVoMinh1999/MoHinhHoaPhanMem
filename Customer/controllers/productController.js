const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

exports.product_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    let sortby = req.query.sortby || "none";
    let category = req.query.category || "none";
    console.log(page);
    console.log(sortby);
    console.log(category);
    if (sortby != "none") {
        if (category != "none") {
            Product.find({ cateId: category }).lean().sort([
                    ['price', sortby]
                ]).skip(6 * page - 6).limit(6)
                .exec(function(err, list_products) {
                    if (err) { return next(err) }
                    Product.count({ cateId: category }, function(err, count) {
                        console.log("Number of users: ", count);
                        let pages_number = [1];
                        let page_size = Math.ceil(count / 6);
                        for (let index = 2; index <= page_size; index++) {
                            pages_number.push(index);
                        }
                        Category.find({}).lean().exec(function(err, list_categories) {
                            if (err) { return next(err) }
                            res.render('shop/product', {
                                title: 'Trang sản phẩm',
                                product_list: list_products,
                                pagination_number: pages_number,
                                last_page: page_size,
                                category_list: list_categories,
                                sortby: sortby,
                                page: page,
                                category: category
                            });
                        })

                    })
                });
        } else {
            Product.find({}).lean().sort([
                    ['price', sortby]
                ]).skip(6 * page - 6).limit(6)
                .exec(function(err, list_products) {
                    if (err) { return next(err) }
                    Product.count({}, function(err, count) {
                        console.log("Number of users: ", count);
                        let pages_number = [1];
                        let page_size = Math.ceil(count / 6);
                        for (let index = 2; index <= page_size; index++) {
                            pages_number.push(index);
                        }
                        Category.find({}).lean().exec(function(err, list_categories) {
                            if (err) { return next(err) }
                            res.render('shop/product', {
                                title: 'Trang sản phẩm',
                                product_list: list_products,
                                pagination_number: pages_number,
                                last_page: page_size,
                                category_list: list_categories,
                                sortby: sortby,
                                page: page,
                                category: category
                            });
                        })

                    })
                });
        }
    } else {
        if (category != "none") {
            Product.find({ cateId: category }).lean().skip(6 * page - 6).limit(6)
                .exec(function(err, list_products) {
                    if (err) { return next(err) }
                    Product.count({ cateId: category }, function(err, count) {
                        console.log("Number of users: ", count);
                        let pages_number = [1];
                        let page_size = Math.ceil(count / 6);
                        for (let index = 2; index <= page_size; index++) {
                            pages_number.push(index);
                        }
                        Category.find({}).lean().exec(function(err, list_categories) {
                            if (err) { return next(err) }
                            res.render('shop/product', {
                                title: 'Trang sản phẩm',
                                product_list: list_products,
                                pagination_number: pages_number,
                                last_page: page_size,
                                category_list: list_categories,
                                sortby: sortby,
                                page: page,
                                category: category
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
                        let page_size = Math.ceil(count / 6);
                        for (let index = 2; index <= page_size; index++) {
                            pages_number.push(index);
                        }
                        Category.find({}).lean().exec(function(err, list_categories) {
                            if (err) { return next(err) }
                            res.render('shop/product', {
                                title: 'Trang sản phẩm',
                                product_list: list_products,
                                pagination_number: pages_number,
                                last_page: page_size,
                                category_list: list_categories,
                                sortby: sortby,
                                page: page,
                                category: category
                            });
                        })

                    })
                });
        }

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