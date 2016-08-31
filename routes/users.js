var express = require('express');
var router = express.Router();
var vali = require('validator');


/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = req.myObj.db;
  db.collection('users').find().toArray(function(err, docs) {
    db.close();
    res.stdData(docs);
  });
});

router.post('/', function(req, res) {
  var p = req.body;

  var legal = vali.isAlpha(p.username)
              && p.password
              && p.school
              && p.nickname
              && vali.isNumeric(p.phone)
              && (p.type == 1 || p.type == 2);
  if(!legal)
    return res.stdShort(1);
  var users = req.myObj.db.collection('users');
  users.count({username: p.username}, function(err, result) {

    if(result !== 0) 
      return res.stdShort(2)

    users.insertOne(p, function(err, result) {

      if(!!err)
        return res.stdShort(-2);

      return res.stdShort(0);

      })
  });

  // users.insertOne(p, function(err, r) {
  //   if(err == null) {
  //     db.close();
  //     res.stdShort(0);
  //   }
  // });
})

module.exports = router;
