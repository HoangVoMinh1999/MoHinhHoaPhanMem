var User = require('../models/user');
var Role = require('../models/role');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var sess;
// login
exports.login = (req, res, next) => {
    res.render('users/login', { title: 'Login' });
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
            sess = user;


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
    // delete session in server

    req.session.destroy();
    res.redirect('/');
}

exports.register = (req, res, next) => {
    res.render('users/register', { title: 'Register' });
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
                    Role.find({}).exec(function(err, list_roles) {
                        if (err) { return next(err) }
                        user = new User({
                            firstname: firstname,
                            lastname: lastname,
                            username: username,
                            phone: phone,
                            email: email,
                            address: address,
                            password: bcrypt.hashSync(password, salt),
                            isDeleted: false,
                            role: list_roles[2]
                        });
                        user.save(function(err, result) {});
                        res.redirect('/login');
                    });
                }
            }
        });
}

exports.profile = (req, res, next) => {
    res.render('users/profile', { title: 'Profie' });
}

exports.changepassword = (req, res, next) => {
    res.render('users/changepassword', { title: 'Change password' });
}
exports.postchangepassword = (req, res, next) => {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confpassword;
    User.findOne({ username: sess.username }, function(err, user) {
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