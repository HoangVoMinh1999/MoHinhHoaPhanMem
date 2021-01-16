var User = require('../models/user');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Cart = require('../models/cart');
var Product = require('../models/product');

// login
exports.login = (req, res, next) => {
    if (req.session.userSession) {
        res.redirect('/')
    } else {
        res.render('users/login', { title: 'Login' });
    }

}

passport.use(new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    },
    function(req, usernameField, passwordField, done) {
        User.findOne({ username: usernameField }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, req.flash('message', 'Incorrect username.'));
            }
            if (!bcrypt.compareSync(passwordField, user.password)) {
                return done(null, false, req.flash('message', 'Incorrect password.'));
            }

            req.session.userSession = user;
            Cart.findOne({ userId: user._id },
                function(err, cart) {
                    if (err) { return done(err); }
                    if (!cart) {
                        var newCart = Cart({
                            userId: user._id
                        });
                        newCart.save(function(err, result) {});
                        req.session.cart = newCart;
                    } else {
                        req.session.cart = cart;
                    }
                    return done(null, user);
                })

        });
    }
));

passport.serializeUser((user, done) => done(null, user));

exports.userLogin = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    }


// logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
}

exports.register = (req, res, next) => {
    if (req.session.userSession) {
        res.redirect('/');
    } else {
        res.render('users/register', { title: 'Register' });
    }

}

exports.postRegister = (req, res, next) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let phone = req.body.phone;
    let email = req.body.email;
    let address = req.body.address;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let user = User.findOne({ username: req.body.username },
        function(err, obj) {
            if (obj !== null) {
                res.render('users/register', { title: 'Best Store', message: 'Username already exist' });
            } else {
                if (password !== confirmpassword) {
                    res.render('users/register', { title: 'Register', message: 'Wrong password !!!' });
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    user = new User({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        phone: phone,
                        email: email,
                        address: address,
                        password: bcrypt.hashSync(password, salt),
                        isDeleted: false,
                        role: 2
                    });
                    user.save(function(err, result) {});
                    res.redirect('/login');
                }
            }
        });
}

exports.profile = (req, res, next) => {
    if (req.session.userSession) {
        res.render('users/profile', { title: 'Profie' });
    } else {
        res.redirect('/login');
    }

}

exports.changepassword = (req, res, next) => {
    if (req.session.userSession) {
        res.render('users/changepassword', { title: 'Change password' });
    } else {
        res.redirect('/login');
    }

}
exports.postchangepassword = (req, res, next) => {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confpassword;
    User.findOne({ username: req.session.userSession.username }, function(err, user) {
        if (err) { return done(err); }
        if (user) {
            var hash = user.password;
            if (bcrypt.compareSync(oldpassword, hash)) {
                if (oldpassword != newpassword) {
                    if (newpassword == confirmpassword) {
                        user.password = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(10));
                        user.save(function(err, result) {});
                        res.redirect('/profile');
                    } else {
                        res.render('users/changepassword', { title: 'Change password', message: 'Wrong new password' });
                    }
                } else {
                    res.render('users/changepassword', { title: 'Change password', message: 'Password not change' });
                }

            } else {
                res.render('users/changepassword', { title: 'Change password', message: 'Wrong old password' });
            }
        } else {
            res.render('users/changepassword', { title: 'Change password', message: 'Not user' });
        }
    })
}
exports.wishlist = (req, res, next) => {
    if (req.session.userSession) {

        res.render('users/wishlist');
    } else {
        res.redirect('/login');
    }
}
exports.add_wishlist = (req, res, next) => {
    let id = req.params.id;
    Product.findOne({ _id: id }, function(err, product) {
        if (err) return next(err);
        User.findOne({ _id: req.session.userSession._id }, function(err, user) {
            if (err) return next(err);
            let itemIndex = user.wishlist.findIndex(p => p.productId == id);
            if (itemIndex > -1) {
                res.redirect('back');
            } else {
                var productId = id;
                user.wishlist.push({ productId });
                req.session.userSession = user;
                user.save();
                res.redirect('back');
            }
        });
    });
}

exports.remove_wishlist = (req, res, next) => {
    let id = req.params.id;
    Product.findOne({ _id: id }, function(err, product) {
        if (err) return next(err);
        User.findOne({ _id: req.session.userSession._id }, function(err, user) {
            if (err) return next(err);
            let itemIndex = user.wishlist.findIndex(p => p.productId == id);
            if (itemIndex > -1) {
                user.wishlist.splice(itemIndex, 1);
                req.session.userSession = user;
                user.save();
                res.redirect('back');
            } else {
                res.redirect('back');

            }
        });
    });
}