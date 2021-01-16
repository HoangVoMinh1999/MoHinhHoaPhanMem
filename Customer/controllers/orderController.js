var Order = require('../models/order');
exports.order = (req, res, next) => {
    if (req.session.userSession) {
        Order.find({ userId: req.session.userSession._id }).lean().exec(function(err, list_orders) {
            if (err) return next(err);
            console.log(list_orders);
            res.render('shop/order', { list_orders: list_orders });
        })

    } else {
        res.redirect('/login');
    }

}
exports.order_detail = (req, res, next) => {
    if (req.session.userSession) {
        let id = req.params.id;
        Order.findOne({ _id: id }).lean().exec(function(err, order) {
            res.render('shop/order-detail', { order: order });
        })

    } else {
        res.redirect('/login');
    }



}