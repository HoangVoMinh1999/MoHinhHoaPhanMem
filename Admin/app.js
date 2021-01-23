var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var Handlebars = require('handlebars')
var mongoose = require('mongoose')
var mongodb = require('mongodb')
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
require('dotenv').config();
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('handlebars', hbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'Default_Layout',
    layoutDir: __dirname + '/views/layouts/',
    runtimeOptions: { allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true },
    helpers: {
        predictPage: (currentPage, step, filterByCategory, filterByUser) => {
            if (filterByCategory) {
                return "page=" + (currentPage + step).toString() + "&filterByCategory=" + (filterByCategory).toString();
            } else {
                if (filterByUser) {
                    return "page=" + (currentPage + step).toString() + "&filterByUser=" + (filterByUser).toString();
                }
            }
            return "page=" + (currentPage + step).toString();
        },
        choosePage: (page, filterByCategory, filterByUser) => {
            if (filterByCategory) {
                return "page=" + (page).toString() + "&filterByCategory=" + (filterByCategory).toString();
            } else {
                if (filterByUser) {
                    return "page=" + (page).toString() + "&filterByUser=" + (filterByUser).toString();
                }
            }
            return "page=" + (page).toString();
        },
        isDisplayedNext: (currentPage, maxPage) => {
            if (currentPage === maxPage)
                return "display: none";
        },
        isDisplayedPrevious: (currentPage, minPage) => {
            if (currentPage === minPage)
                return "display: none";
        },
        isCurrentPage: (currentPage, page) => {
            if (currentPage === page)
                return "background-color: #337ab7; color: #fff";
        },
        eq: function() {
            const args = Array.prototype.slice.call(arguments, 0, -1);
            return args.every(function(expression) {
                return args[0] === expression;
            });
        }
    }
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





app.use('/users', usersRouter);
// Setup mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true)

mongoose.connect(process.env.URL_DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connect error!'));
db.once('open', function(callback) {
    console.log("connection succeeded");
})

// passport initialize
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

//flash
app.use(flash());

//session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));

app.use('/', indexRouter);

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;