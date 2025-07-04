var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nunjucks = require('nunjucks'); // Added Nunjucks

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/apiRoutes');

var app = express();
const http = require('http').createServer(app);
require('dotenv').config()
const PORT = process.env.PORT;

// View engine setup
// Commented out EJS setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// Configure Nunjucks
app.set('views', path.join(__dirname, 'views'));
nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: true // Auto-reload templates in development
});
app.set('view engine', 'njk'); // Using .html files with Nunjucks syntax

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

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
  res.render('error'); // This will now use Nunjucks
});

http.listen(PORT, (req, res) => {
  console.log(`Server is running on ${PORT} port.`);
});

module.exports = app;