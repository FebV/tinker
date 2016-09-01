var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var p = req.body;
  var vali = p.username
             && p.password;
  if(!vali)
   return res.stdShort(1);


  var users = req.db.users;
  var crypto = require('crypto');
  var data = p.username + Date.now();
  var md5 = crypto.createHash('md5').update(data).digest("hex");
  var token = {
    token: md5
  }
  users.findOneAndUpdate({username: p.username, password: p.password}, {$set: token}, {}, function(err, result) {
    if(!result.lastErrorObject.updatedExisting)
      return res.stdShort(3);
    
    return res.stdData(token);
    
  });
});


module.exports = router;
