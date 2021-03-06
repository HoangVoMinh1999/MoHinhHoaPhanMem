const Product = require('../models/product');
const Category = require('../models/category');
const async = require('async');

exports.product_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    let sortby = req.query.sortby || "none";
    let category = req.query.category || "none";
    if (sortby != "none") {
        if (category != "none") {
            Product.find({ cateId: category }).lean().sort([
                    ['price', sortby]
                ]).skip(6 * page - 6).limit(6)
                .exec(function(err, list_products) {
                    if (err) { return next(err) }
                    for (var i = 0; i < list_products.length; i++) {
                        list_products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(list_products[i].price);
                    }
                    Product.count({ cateId: category }, function(err, count) {
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
                    for (var i = 0; i < list_products.length; i++) {
                        list_products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(list_products[i].price);
                    }
                    Product.count({}, function(err, count) {
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
                    for (var i = 0; i < list_products.length; i++) {
                        list_products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(list_products[i].price);
                    }
                    Product.count({ cateId: category }, function(err, count) {
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
                    for (var i = 0; i < list_products.length; i++) {
                        list_products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(list_products[i].price);
                    }
                    Product.count({}, function(err, count) {
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
    var check = -1;
    Product.findOne({ _id: id }).lean().exec(function(err, product) {
        if (err) { return next(err); }
        if (product == null) {
            var err = new Error('Product not found');
            err.status = 404;
            return next(err);
        } else {
            if (req.session.userSession) {
                let itemIndex = req.session.userSession.wishlist.findIndex(p => p.productId == id);
                if (itemIndex > -1) {
                    check = 1;
                } else {
                    check = 0;
                }
                Category.findById(product.cateId).lean().exec(function(err, cate) {
                    if (err) { return next(err); }

                    res.render('shop/detail', { title: 'Chi tiết sản phẩm', product: product, category: cate, check: check });
                });
            } else {
                Category.findById(product.cateId).lean().exec(function(err, cate) {
                    if (err) { return next(err); }

                    res.render('shop/detail', { title: 'Chi tiết sản phẩm', product: product, category: cate, check: check });
                });
            }
        }
    })

};
exports.search_product = (req, res, next) => {
    let find = req.query.find;
    let page = Number(req.query.page) || Number(1);
    let category = req.query.category || "none";
    console.log(find);
    Product.find({ title: { "$regex": find, "$options": "i" } }).lean().skip(6 * page - 6).limit(6).exec(function(err, list_products) {
        if (err) { return next(err) }
        for (var i = 0; i < list_products.length; i++) {
            list_products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(list_products[i].price);
        }
        Product.count({}, function(err, count) {
            let pages_number = [1];
            let page_size = Math.ceil(count / 6);
            for (let index = 2; index <= page_size; index++) {
                pages_number.push(index);
            }
            Category.find({}).lean().exec(function(err, list_categories) {
                if (err) { return next(err) }
                res.render('shop/search-product', {
                    product_list: list_products,
                    pagination_number: pages_number,
                    last_page: page_size,
                    category_list: list_categories,
                    page: page,
                    category: category,
                    find: find
                });
            })

        })

    });

}