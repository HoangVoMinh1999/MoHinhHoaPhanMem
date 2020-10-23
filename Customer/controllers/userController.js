var User = require('../models/user');
var Role = require('../models/role');
var bcrypt = require('bcrypt');


// login
exports.login = (req, res, next) => {
    res.render('users/login', { title: 'login' });
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