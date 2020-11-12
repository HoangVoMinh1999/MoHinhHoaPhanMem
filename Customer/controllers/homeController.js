const Product = require('../models/product');
exports.home = (req, res, next) => {
    Product.find({}).lean().limit(8)
        .exec(function(err, list_products) {
            if (err) { return next(err); }

            res.render('shop/index', { title: 'Express', product_list: list_products });
        });
}