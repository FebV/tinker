var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.myObj.db;
  db.collection('users').find().toArray( (err, docs) => {
    db.close();
    if(err == null)
      res.stdShort(0);
    else
      res.stdShort(-2);
  });

});

module.exports = router;
