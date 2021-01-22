var User = require('../models/User');

exports.customer_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    User.find({ role: 2 }).lean().exec(function(err, list_user) {
        if (err) return next(err);
        var listCustomerInOnePage = [],
            page_number = [];
        for (let i = 0; i < list_user.length; i++) {
            if (Math.floor(i / 4) == page - 1) {
                var data = list_user[i];
                data['number'] = i + 1;
                listCustomerInOnePage.push(data);
            }
            if (i / 4 == Math.floor(i / 4)) {
                page_number.push((i / 4) + 1);
            }
        }
        res.render('users/customer-list', {
            currentPage: page,
            page_number: page_number,
            listCustomerInOnePage: listCustomerInOnePage,
            layout: 'Index_Layout'
        });
    });
}

exports.lock_unlock_user = (req, res, next) => {
    let id = req.params.id;
    User.findOne({ _id: id }, function(err, user) {
        if (user.isDeleted) {
            user.isDeleted = false;
            user.save();
            res.redirect('back');
        } else {
            user.isDeleted = true;
            user.save();
            res.redirect('back');
        }
    })
}

exports.edit_user = (req, res, next) => {
    let id = req.params.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let address = req.body.address;
    User.findOne({ _id: id }, function(err, user) {
        if (!user) {
            res.redirect('back');
        } else {
            user.firstname = firstname;
            user.lastname = lastname;
            user.address = address;
            user.save();
            res.redirect('back');
        }
    })
}

exports.staff_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    User.find({ role: 1 }).lean().exec(function(err, list_user) {
        if (err) return next(err);
        var listUserInOnePage = [],
            page_number = [];
        for (let i = 0; i < list_user.length; i++) {
            if (Math.floor(i / 4) == page - 1) {
                var data = list_user[i];
                data['number'] = i + 1;
                listUserInOnePage.push(data);
            }
            if (i / 4 == Math.floor(i / 4)) {
                page_number.push((i / 4) + 1);
            }
        }
        res.render('users/staff-list', {
            currentPage: page,
            page_number: page_number,
            listUserInOnePage: listUserInOnePage,
            layout: 'Index_Layout'
        });
    })
}