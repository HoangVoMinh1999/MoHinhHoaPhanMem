var Order = require('../models/order');
exports.checkout = (req, res, next) => {
    res.render('shop/checkout', { title: 'checkout' });
}

exports.confirmation = (req, res, next) => {
    if (req.session.userSession) {
        const order = new Order({
            products: req.session.cart.products,
            quantity: req.session.cart.quantity,
            total: req.session.cart.total,
            status: 'Chờ xác nhận'
        })
        order.save();
        res.render('shop/confirmation', { title: 'confirmation' });
    } else {
        res.redirect('/login');
    }


}

exports.order = (req, res, next) => {
    if (req.session.userSession) {
        res.render('shop/order');
    } else {
        res.redirect('/login');
    }

}