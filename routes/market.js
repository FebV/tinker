var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var jobs = req.db.jobs;
  jobs.find({}).toArray(function(err, result) {
    if(err)
      return res.stdShort(-2);
    return res.stdData(result);
  })
});


module.exports = router;