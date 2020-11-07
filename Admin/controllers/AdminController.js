var AdminModel = require("../Models/Admin")
var Admin = AdminModel.Admin
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt')

exports.Login = passport.authenticate('local'),
{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
},
function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
}

exports.Register = function (req, res, next) {
    var username = req.body.Username
    var password = req.body.Password
    var password_02 = req.body.RepeatPassword
    if (password !== password_02) {
        res.render('Admin/register', { layout: 'Index_Layout', sMessage: "Please fill correct password !!!" })
    } else {
        Admin.findOne({ username: username }, function (err, user) {
            if (err) throw err;
            if (user != null) {
                res.render('Admin/register', { title: 'Register', layout: 'Index_Layout', sMessage: "Username is existed !!!" })
            }
            else {
                var salt = bcrypt.genSaltSync(10);
                password = bcrypt.hashSync(password, salt)
                var newAccount = new Admin({
                    username: req.body.Username,
                    password: password,
                    name: req.body.Name,
                    gender: req.body.Gender,
                    birthday: req.body.Birthday,
                    address: req.body.Address,
                    email: req.body.Email,
                    phone: req.body.Phone,

                })
                console.log(newAccount)
                newAccount.save(function (err, result) {
                    if (err) throw err;
                    res.render('Admin/register', { title: 'Register', layout: 'Index_Layout', sMessage: "Register successfully !!!" })
                })
            }
        })
    }

}
//#region  Support Config
passport.use(new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'password'
},
    function (req, usernameField, passwordField, done) {
        Admin.findOne({ username: usernameField }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!bcrypt.compareSync(passwordField, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            req.session.userSession = user;
            return done(null, user);
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
//#endregion