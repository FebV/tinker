var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middle ware
var injectMongo = function(req, res, next) {
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/tinker';
  MongoClient.connect(url, function(err, db) {
    if(err != null)
    {
      res.send(JSON.stringify({code: -1, status: '数据库连接失败', data: null}));
      return;
    }
    req.myObj = {};
    req.myObj.db = db;
    next();
  });
}

var stdResponse = function(req, res, next) {
  var statusList = {
    '-2': '数据库查询失败',
    '-1': '数据库连接失败',
    '0': 'OK',
    '1': '参数不合法',
    '2': '用户名已经被注册'
  }
  res.stdShort = function(code) {
    var obj = {
      code: code,
      status: statusList[code],
      data: null
    }
    res.send(JSON.stringify(obj));
  }

  res.std = function(code, status, data) {
    var obj = {
      code: code,
      status: status,
      data: data
    }
    res.send(JSON.stringify(obj));
  }

  res.stdData = function(data) {
    var obj = {
      code: 0,
      status: 'OK',
      data: data
    }
    res.send(JSON.stringify(obj));
  }
  next();
}

app.use(injectMongo);
app.use(stdResponse);

app.use('/api', routes);
app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
