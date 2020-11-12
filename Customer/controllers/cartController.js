const { session } = require("passport");
var Cart = require('../models/cart');
var Product = require('../models/product');

exports.cart = (req, res, next) => {
    if (req.session.cart) {
        res.render('shop/cart', { title: 'Cart' });

    } else {
        res.redirect('/login');
    }

}
exports.addproduct = (req, res, next) => {
    if (req.session.userSession) {
        var id = req.params.id;
        Product.findById(id).lean()
            .exec(function(err, product) {
                if (err) { return next(err) }
                if (!product) {
                    var err = new Error('Product not found');
                    err.status = 404;
                    return next(err);
                } else {
                    Cart.findOne({ userId: req.session.userSession._id }, function(err, cart) {
                        if (err) { return done(err); }
                        if (!cart) {
                            var err = new Error('Cart not found');
                            err.status = 404;
                            return next(err);
                        } else {
                            let itemIndex = cart.products.findIndex(p => p.productId == id);

                            if (itemIndex > -1) {
                                //product exists in the cart, update the quantity
                                let productItem = cart.products[itemIndex];
                                if (productItem.quantity < product.quantity) {
                                    productItem.quantity = productItem.quantity + 1;
                                    productItem.total = productItem.quantity * productItem.price;
                                    cart.products[itemIndex] = productItem;
                                } else if (productItem.quantity == product.quantity) {
                                    productItem.total = productItem.quantity * productItem.price;
                                    cart.products[itemIndex] = productItem;
                                }
                            } else {
                                //product does not exists in cart, add new item
                                var productId = id;
                                var name = product.title;
                                var imagePath = product.imagePath;
                                var quantity = 1;
                                var price = product.price;
                                var total = product.price;
                                cart.products.push({ productId, name, imagePath, quantity, price, total });
                            }
                            cart.total = 0
                            cart.quantity = 0;
                            for (var i = 0; i < cart.products.length; i++) {
                                cart.total = cart.total + cart.products[i].total;
                                cart.quantity = cart.quantity + cart.products[i].quantity;
                            }
                            cart.save(function(err, result) {});
                            req.session.cart = cart;
                            res.redirect('back');
                        }
                    })

                }
            });
    } else {
        res.redirect('/login');
    }
}
exports.adddetailproduct = (req, res, next) => {
    if (req.session.userSession) {
        var id = req.params.id;
        var qty = req.params.quantity;
        console.log(qty);
        console.log(id);
        Product.findById(id).lean()
            .exec(function(err, product) {
                if (err) { return next(err) }
                if (!product) {
                    var err = new Error('Product not found');
                    err.status = 404;
                    return next(err);
                } else {
                    Cart.findOne({ userId: req.session.userSession._id }, function(err, cart) {
                        if (err) { return done(err); }
                        if (!cart) {
                            var err = new Error('Cart not found');
                            err.status = 404;
                            return next(err);
                        } else {
                            let itemIndex = cart.products.findIndex(p => p.productId == id);

                            if (itemIndex > -1) {
                                //product exists in the cart, update the quantity
                                let productItem = cart.products[itemIndex];
                                if ((productItem.quantity + parseInt(qty)) < product.quantity) {
                                    productItem.quantity = productItem.quantity + parseInt(qty);
                                    productItem.total = productItem.quantity * productItem.price;
                                    cart.products[itemIndex] = productItem;
                                } else if (productItem.quantity == product.quantity) {
                                    productItem.total = productItem.quantity * productItem.price;
                                    cart.products[itemIndex] = productItem;
                                } else if ((productItem.quantity + parseInt(qty)) > product.quantity) {
                                    productItem.quantity = product.quantity;
                                    productItem.total = productItem.quantity * productItem.price;
                                    cart.products[itemIndex] = productItem;
                                }
                            } else {
                                //product does not exists in cart, add new item
                                var productId = id;
                                var name = product.title;
                                var imagePath = product.imagePath;
                                var quantity = qty;
                                var price = product.price;
                                var total = qty * product.price;
                                cart.products.push({ productId, name, imagePath, quantity, price, total });
                            }
                            cart.total = 0
                            cart.quantity = 0;
                            for (var i = 0; i < cart.products.length; i++) {
                                cart.total = cart.total + cart.products[i].total;
                                cart.quantity = cart.quantity + cart.products[i].quantity;
                            }
                            cart.save(function(err, result) {});
                            req.session.cart = cart;
                            res.redirect('back');
                        }
                    })

                }
            });
    } else {
        res.redirect('/login');
    }
}
exports.deleteproduct = (req, res, next) => {
    if (req.session.userSession) {
        var id = req.params.id;
        Cart.findOne({ userId: req.session.userSession._id }, function(err, cart) {
            if (err) { return done(err); }
            if (!cart) {
                var err = new Error('Cart not found');
                err.status = 404;
                return next(err);
            } else {
                let itemIndex = cart.products.findIndex(p => p.productId == id);
                cart.products.splice(itemIndex, 1);
                cart.total = 0;
                cart.quantity = 0;
                for (var i = 0; i < cart.products.length; i++) {
                    cart.total = cart.total + cart.products[i].total;
                    cart.quantity = cart.quantity + cart.products[i].quantity;
                }
                cart.save(function(err, result) {});
                req.session.cart = cart;
                res.redirect('/cart');
            }
        })
    }
}