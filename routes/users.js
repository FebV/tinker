var express = require('express');
var router = express.Router();

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
  var db = req.myObj.db;
  db.collection('users').insertOne(p, function(err, r) {
    if(err == null) {
      db.close();
      res.stdShort(0);
    }
  });
})

module.exports = router;
