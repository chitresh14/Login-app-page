var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var mongoose = require('mongoose');
var app = express();

app.use(cors({
  //origin : cookies based orientation (some host don't use cookies if we use only localhost url)
  origin:['http://localhost:4200','http://127.0.0.1:4200'],
  credentials:true
}));



mongoose.connect('mongodb://localhost/loginpage',{ useNewUrlParser: true });
//passport
var passport =require('passport');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session); // to retain the seesion when server is off/retarting
app.use(session({
  name:'myname.sid', // default name of cookie is cookies.sid
  resave: false , // We dont want to save the object until & unless it get changed
  saveUninitialized : false, // we dont want to save the session/request
  // until a successful login is done (i.e. with the help of passport )
  secret: 'sceret', // use to encrypt the cookie
  cookie:{
    maxAge:36000000, // 1 day time duration
    httpOnly:false,
    secure:false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
 require('./passport-config');
app.use(passport.initialize());
app.use(passport.session());



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

// app.listen(3000,(err)=>{
//   if (err){
//       console.log('Error found in server Start',err);
//   }else{
//       console.log('connected to server at port 3000');
//   }
// });

module.exports = app;
