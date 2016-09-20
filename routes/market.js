var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var p = req.query;
  var jobs = req.db.jobs;
  var query = {};
  if(p.jobId) {
    var jobId = p.jobId;
    var objId = require('mongodb').ObjectID;
    query._id = objId(jobId);
  }
  jobs.find(query).toArray(function(err, result) {
    if(err)
      return res.stdShort(-2);
    if(!query._id) {
      for(var i of result)
      {
        i.aud = null;
      }
    }else{
      result = result[0];
    }
    return res.stdData(result);
  })
});


router.post('', function(req, res) {
  var p = req.body;
  var legal = p.jobId;

  var jobs = req.db.jobs;
  if(!legal)
    return res.stdShort(1);

  if(p.jobId) {
    var obj = {
      state: p.state
    };
    var jobId = p.jobId;
    var objId = require('mongodb').ObjectID;

    if(jobId.length != '57c90516921e383208085c61'.length)
      return res.stdShort(6);

    jobs.findOneAndUpdate({_id: objId(jobId)}, {$set: obj}, {}, function(err, result) {
      if(!result.lastErrorObject.updatedExisting)
        return res.stdShort(7);
      
      return res.stdShort(0);
    });
  }
});
module.exports = router;