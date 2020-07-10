var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var rateLimit = require('express-rate-limit');
var hbs = require('express-hbs');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var cors = require("cors");

var apiRouter = require('./routes/api');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'not-bacon'
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    done(null, true);
  })
);

// view engine setup
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 10
});

app.use(limiter);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api', passport.authenticate('jwt', {session: false}), apiRouter);

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
