var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var jobs = req.db.jobs;
  var users = req.db.users;
  if(!(req.body.jobId && req.body.token))
    return res.stdShort(1);


    //调用者是否为tinker
  users.find({token: req.body.token}).toArray(function(err, result) {
    if(err)
      return res.stdShort(-2);

      console.log(result[0].type);  
    if(result[0].type == 1)
      return res.stdShort(5);

    var jobId = req.body.jobId;
    var objId = require('mongodb').ObjectID;

    if(jobId.length != '57c90516921e383208085c61'.length)
      return res.stdShort(6);

    var id = {
      tinkerId: req.userId
    }
    jobs.findOneAndUpdate({_id: objId(jobId)}, {$set: id}, {}, function(err, result) {
      if(!result.lastErrorObject.updatedExisting)
        return res.stdShort(7);
      
      return res.stdShort(0);
    });
    
  });
});


module.exports = router;