var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const moment = require('moment');
require('dotenv').config();

const passport = require('passport');
const protect = require('./src/Middleware/authMid')
const jwtSettings = require('./src/config/jwtSettings');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

moment.locale('vi');

// connect db.
var connectDB = require('./db/connect')

const start = async () => {
  try {
    await connectDB(process.env.EXPRESS_DB_CONNECT)
  } catch (error) {
    console.log(error);
  }
}

start()

//import các route sẽ sử dụng
var authRouter = require('./src/routes/auth.route');
var usersRouter = require('./src/routes/user.route');
var departmentsRouter = require('./src/routes/department.route');
var positionsRouter = require('./src/routes/position.route');
var bonuspunishsRouter = require('./src/routes/bonuspunish.route');
var dayoffsRouter = require('./src/routes/dayOff.route');
var newsRouter = require('./src/routes/new.route');
var messageRouter = require('./src/routes/message.route');
var departmentCalendarRouter = require('./src/routes/departmentCalendar.route')
var userShiftRouter = require('./src/routes/userShift.route')
var chatRouter = require('./src/routes/chat.route')
// route truy vấn cho các tiện tích
var utilitiesRouter = require('./src/routes/utilities.route');

// 
const { findDocument } = require('./src/helpers/MongoDbHelper');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS: kiểm soát phạm vi truy cập
app.use(
  cors({
    origin: '*',
  }),
);

// Passport: Bearer Token
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = jwtSettings.SECRET;
opts.audience = jwtSettings.AUDIENCE;
opts.issuer = jwtSettings.ISSUER;

passport.use(
  new JwtStrategy(opts, function (payload, done) {
    console.log('\n🚀 JwtStrategy 🚀\n');
    const _id = payload.uid;
    findDocument(_id, 'users')
      .then((result) => {
        if (result) {
          return done(null, result);
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        return done(err, false);
      });
  }),
);

// END: PASSPORT

//Khai báo các route sử dụng
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/departments', departmentsRouter);
app.use('/positions', positionsRouter);
app.use('/bonuspunishs', bonuspunishsRouter);
app.use('/dayoffs', dayoffsRouter);
app.use('/news', newsRouter);
app.use('/message', protect, messageRouter);
app.use('/departmentcalendar', protect, departmentCalendarRouter);
app.use('/usershift', protect, userShiftRouter);
app.use('/chat', protect, chatRouter);
// các dịch vụ tra cứu, tính toán
app.use('/utilities', utilitiesRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
