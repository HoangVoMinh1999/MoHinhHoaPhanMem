var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
var Handlebars = require('handlebars')
var mongoose = require('mongoose')
var mongodb = require('mongodb')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.engine('handlebars', hbs({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'Default_Layout',layoutDir:__dirname+'/views/layouts/',    runtimeOptions: {allowProtoPropertiesByDefault: true, allowProtoMethodsByDefault: true}}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login',indexRouter);
app.use('/product-list',indexRouter);
app.use('/product-detail',indexRouter);
app.use('/add-product',indexRouter);


app.use('/users', usersRouter);
// Setup mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true)
var uri = process.env.DB_LOCALHOST
var db = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, res) {
  if (err) {
    console.log('ERROR connecting to: ' + uri + '. ' + err);
  } else {
    console.log('Succeeded connected to: ' + uri);
  }
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
