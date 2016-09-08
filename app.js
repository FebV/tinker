var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var formidable = require('formidable');


var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var jobs = require('./routes/jobs');
var market = require('./routes/market');
var order = require('./routes/order');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer({dest: '/public/uploads'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function isEmpty(obj) {
  var t;  
    for (t in obj)  
        return !1;  
    return !0;
}

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
    req.db = {};
    req.db.users = db.collection('users');
    req.db.jobs = db.collection('jobs');
    // req.db.jobPics = db.collection('jobPics');
    if(isEmpty(req.body) && req.method == 'POST') {
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        console.log(req.body);
          console.log('inverse');
          req.body = fields;
          req.files = files;
          console.log(req.body);
          return next();
        // console.log(require('moment').format());
      });
    }
    next();
    req.db.db = db;
  });
};

var checkAuth = function(req, res, next) {
    
    var token = req.query.token ? req.query.token : req.body.token;
    if(!token)
      return res.stdShort(1);
    req.db.users.find({token: token}).toArray(function(err, docs) {
      if(err)
        return res.stdShort(-2);
      if(docs.length < 1)
        return res.stdShort(4);
      // console.log(docs[0]._id)
      req.userId = docs[0]._id;
      next();
    });
};

var stdResponse = function(req, res, next) {
  var statusList = {
    '-4': '与容联服务器通讯失败',
    '-3': '页面不存在',
    '-2': '数据库查询失败',
    '-1': '数据库连接失败',
    '0': 'OK',
    '1': '参数不合法',
    '2': '用户名已经被注册',
    '3': '用户名密码错误',
    '4': 'token校验失败',
    '5': '身份不符',
    '6': 'jobId不合法',
    '7': 'jobId不存在',
  }
  res.stdShort = function(code) {
    var obj = {
      code: code,
      status: statusList[code],
      data: null
    }
    var json = JSON.stringify(obj);
    console.log(json);
    res.send(json);
  }

  res.std = function(code, status, data) {
    var obj = {
      code: code,
      status: status,
      data: data
    }
    var json = JSON.stringify(obj);
    console.log(json);
    res.send(json);
  }

  res.stdData = function(data) {
    var obj = {
      code: 0,
      status: 'OK',
      data: data
    }
    var json = JSON.stringify(obj);
    console.log(json);
    res.send(json);
  }
  next();
}

app.use(stdResponse);
app.use(injectMongo);
app.use('/api/auth/im', checkAuth);
app.use('/api/users/i/', checkAuth);
app.use('/api/order', checkAuth);

app.use('/', routes);
app.use('/api/users', users);
app.use('/api/order', order);
app.use('/api/auth', auth);
app.use('/api/jobs', market);
app.use('/api/users/i/jobs', jobs);

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
    if(err.status == 404)
      return res.stdShort(-3);
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
  if(err.status == 404)
    return res.stdShort(-3);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
