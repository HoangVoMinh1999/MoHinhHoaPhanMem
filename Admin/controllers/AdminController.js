var User = require('../models/User');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// login
exports.index = (req, res, next) => {
    if (req.session.userSession) {
        res.render('index', { title: 'Index', layout: "Index_Layout" });
    } else {
        res.redirect('/login');
    }
}
exports.login = (req, res, next) => {
    if (req.session.userSession) {
        res.redirect('/')
    } else {
        res.render('login', { title: 'Login', layout: 'Login_Layout' });
    }
}
passport.use(new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    },
    function(req, usernameField, passwordField, done) {
        User.findOne({ username: usernameField, role: 0 }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (!bcrypt.compareSync(passwordField, user.password)) {
                return done(null, false, { message: 'Incorrect username' });
            }
            console.log(user);
            req.session.userSession = user;
            return done(null, user);

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
    res.redirect('/login');
}