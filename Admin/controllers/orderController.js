const { resource } = require("../app")

var Order = require('../models/order');
const User = require("../models/User");

exports.order_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    Order.find().lean().exec(function(err, list_order) {
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

exports.change_status = (req, res, next) => {
    let id = req.params.id;
    let status = req.params.status;
    Order.findOne({ _id: id }, function(err, order) {
        if (!order) {
            res.redirect('back');
        } else {
            order.status = status;
            order.save();
            res.redirect('back');
        }
    })
}

exports.order_detail = (req, res, next) => {
    let id = req.params.id;
    Order.findOne({ _id: id }, function(err, order) {
        User.findOne({ _id: order.userId }, function(err, user) {
            for (var i = 0; i < order.products.length; i++) {
                order.products[i].price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.products[i].price);
            }
            res.render('orders/order-detail', {
                order: order,
                user: user,
                layout: 'Index_Layout'
            });
        })
    })
}