var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  // return res.stdShort(0);
  var jobs = req.db.jobs;

  jobs.find().toArray(function(err, docs) {
    if(err)
      return res.stdShort(2);
    
    return res.stdData(docs)
  });
});

router.post('/', function(req, res) {
  var p = req.body;
  var legal = p.position
              && p.token;
  var jobs = req.db.jobs;
  if(!legal)
    return res.stdShort(1);
  var obj = {
    pic: p.pic ? p.pic : null,
    aud: p.aud ? p.aud : null,
    position: p.position,
    time: Date.now(),
    state: 1,
    desc: p.desc ? p.desc : null,
    userId : req.userId
  };
  jobs.insertOne(obj, function(err, docs) {
    if(err)
      return res.stdShort(-2);

    return res.stdShort(0);
  });
});

module.exports = router;
