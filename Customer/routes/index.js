var express = require('express');
var router = express.Router();
var session = require('express-session');
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var productController = require('../controllers/productController');
var userController = require('../controllers/userController');
var cartController = require('../controllers/cartController');
var checkoutController = require('../controllers/checkoutController');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shop/index', { title: 'Express' });
});

router.get('/', function(req, res, next) {
    res.locals.data = req.session.userSession;
    next();
});
router.use(flash());

// Login
router.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));
router.get('/login', userController.login);



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

            var sessData = req.session;
            sessData.userSession = user;

            return done(null, user);
        });
    }
));

passport.serializeUser((user, done) => done(null, user));

router.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    }
)

// LOGOUT
router.get('/logout', userController.logout);

router.get('/register', userController.register);

router.post('/register', userController.postRegister);

router.get('/product', productController.product_list);

router.get('/cart', cartController.cart);

router.get('/checkout', checkoutController.checkout);

router.get('/detail', productController.product_detail);

router.get('/confirmation', checkoutController.confirmation);

module.exports = router;