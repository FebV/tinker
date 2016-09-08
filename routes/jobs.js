var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
  // return res.stdShort(0);
  var jobs = req.db.jobs;

  jobs.find({_id: req.userId}).toArray(function(err, docs) {
    if(err)
      return res.stdShort(2);
    
    return res.stdData(docs)
  });
});

router.post('/',  function(req, res) {
  var p = req.body;
  var legal = !!p.position;

  var jobs = req.db.jobs;
  var jobPics = req.db.jobPics;
  if(!legal)
    return res.stdShort(1);

  var unix = Date.now();
  var pic = null;
  var aud = null;
  if(req.files.pic) {
    fs.rename(req.files.pic.path, 'public/uploads/pics/'+unix);
    pic = 'uploads/pics/'+unix;
  }
  if(req.files.aud) {
    fs.rename(req.files.aud.path, 'public/uploads/auds/'+unix);
    aud = 'uploads/auds/'+unix;
  }
  var obj = {
    pic: pic,
    aud: aud,
    position: p.position,
    time: Date.now(),
    state: 1,
    desc: p.desc ? p.desc : null,
    userId : req.userId
  };
  jobs.insertOne(obj, function(err, docs) {
    if(err)
      return res.stdShort(-2);
    console.log(docs.ops[0]._id);
    return res.stdShort(0);
  });
  // jobPics.insertOne({}, function(err, docs) {

  // });
});

module.exports = router;
