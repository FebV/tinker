var express = require('express');
var router = express.Router();
var vali = require('validator');


/* GET users listing. */
router.get('/', function(req, res) {
  var users = req.db.users;
  users.find().toArray(function(err, docs) {
    res.stdData(docs);
  });
});

router.post('/', function(req, res) {
  var p = req.body;
  console.log(p);
  var legal = vali.isAlpha(p.username)
              && p.password
              && p.school
              && p.nickname
              && vali.isNumeric(p.phone)
              && (p.type == 1 || p.type == 2);
  if(!legal)
    return res.stdShort(1);

  var users = req.db.users;
  users.count({username: p.username}, function(err, result) {
    if(err != null)
      return res.stdShort(-2);

    if(result !== 0) 
      return res.stdShort(2)


    users.insertOne(p, function(err, result) {
      if(!!err)
        return res.stdShort(-2);

      return res.stdShort(0);

      })
  });
});

router.post('')

module.exports = router;
