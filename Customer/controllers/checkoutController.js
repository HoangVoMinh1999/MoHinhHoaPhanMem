var Cart = require('../models/cart');
var Order = require('../models/order');
exports.checkout = (req, res, next) => {
    res.render('shop/checkout', { title: 'checkout' });
}

exports.confirmation = (req, res, next) => {

    if (req.session.userSession) {
        Cart.findOne({ _id: req.session.cart._id }, function(err, cart) {

            const order = new Order({
                userId: req.session.userSession._id,
                products: req.session.cart.products,
                quantity: req.session.cart.quantity,
                total: req.session.cart.total,
                status: 'Chờ xác nhận'
            })
            cart.products = [];
            cart.quantity = 0;
            cart.total = 0;
            req.session.cart = cart;
            cart.save();
            order.save();
            res.render('shop/confirmation', { title: 'confirmation' });
        })

    } else {
        res.redirect('/login');
    }
}