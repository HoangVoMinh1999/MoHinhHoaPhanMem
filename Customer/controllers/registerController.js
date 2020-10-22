var User = require('../models/user');
var Role = require('../models/role');
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//Set up mongoose connection
mongoose.connect(process.env.URL_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function(callback) {
    console.log("connection succeeded");
})

exports.register = (req, res, next) => {
    res.render('users/register', { title: 'Register' });
}

exports.postRegister = (req, res, next) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let user = User.findOne({ username: req.body.username },
        function(err, obj) {
            if (obj !== null) {
                res.render('users/register', { title: 'Best Store', message: 'username already exist' });
            } else {
                if (password !== confirmpassword) {
                    res.render('users/register', { title: 'Register', message: 'Wrong password !!!' });
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    Role.find({}).exec(function(err, list_roles) {
                        if (err) { return next(err) }
                        user = new User({
                            firstname: firstname,
                            lastname: lastname,
                            username: username,
                            phone: phone,
                            email: email,
                            password: bcrypt.hashSync(password, salt),
                            role: list_roles[2]
                        });
                        user.save(function(err, result) {});
                        res.redirect('/login');
                    });
                }
            }
        });

}