const { resource } = require("../app")

var Order = require('../models/order');

exports.order_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    Order.find().lean().exec(function(err, list_order) {
        console.log(list_order);
        if (err) return next(err);
        var listOrdersInOnePage = [],
            page_number = [];
        for (let i = 0; i < list_order.length; i++) {
            if (Math.floor(i / 4) == page - 1) {
                var data = list_order[i];
                data['number'] = i + 1;
                listOrdersInOnePage.push(data);
            }
            if (i / 4 == Math.floor(i / 4)) {
                page_number.push((i / 4) + 1);
            }
        }
        res.render('orders/order-list', {
            currentPage: page,
            page_number: page_number,
            listOrdersInOnePage: listOrdersInOnePage,
            layout: 'Index_Layout'
        });
    })

}