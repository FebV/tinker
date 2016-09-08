var express = require('express');
var router = express.Router();
var vali = require('validator');
var fs = require('fs');


/* GET users listing. */
router.get('/', function(req, res) {
  var users = req.db.users;
  console.log('get users');
  users.find({}).toArray(function(err, docs) {
    if(err) 
      return res.stdShort(-2);
    return res.stdData(docs);
  });
});

router.get('/:id/info', function(req, res, next) {
  if(req.params.id == 'i')
    return next();
  var users = req.db.users;
  var ObjectId = require('mongodb').ObjectID;
  console.log(req.params.id);
  users.find({_id: ObjectId(req.params.id)}).toArray(function(err, docs) {
    var user = docs[0];
    var obj = {
      _id: user._id,
      username: user.username,
      school: user.school,
      pic: user.pic,
      nickname: user.nickname,
      phone: user.phone,
      type: user.type
    }
    res.stdData(obj);
  });
});

router.post('/', function(req, res) {
  var p = req.body;
  console.log('in');
  var legal = p.username
              // && vali.isAlpha(p.username)
              && p.password
              && p.school
              && p.nickname
              // && vali.isNumeric(p.phone)
              && (p.type == 1 || p.type == 2);
  console.log(legal);
  if(!legal)
    return res.stdShort(1);

  var pic = null;
  if(req.files && req.files.pic) {
    var unix = Date.now();
    fs.rename(req.files.pic.path, 'public/uploads/pics/'+unix);
    pic = 'uploads/pics/'+unix;
  }
  var obj = {
      username: p.username,
      password: p.password,
      school: p.school,
      pic: pic,
      nickname: p.nickname,
      phone: p.phone,
      type: p.type
    }

  var users = req.db.users;
  users.count({username: p.username}, function(err, result) {
    if(err != null)
      return res.stdShort(-2);

    if(result !== 0) 
      return res.stdShort(2)


    users.insertOne(obj, function(err, result) {
      if(!!err)
        return res.stdShort(-2);

      return res.stdShort(0);

      })
  });
});

router.get('/i/info', function(req, res){
  var users = req.db.users;
  users.find({_id: req.userId}).toArray(function(err, result) {
    if(err)
      return res.stdShort(-2);
    var user = result[0];
    var obj = {
      _id: user._id,
      username: user.username,
      school: user.school,
      pic: user.pic,
      nickname: user.nickname,
      phone: user.phone,
      type: user.type
    }
    return res.stdData(obj);  
  });
});


module.exports = router;
