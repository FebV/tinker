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


router.post('/im', function(req, res) {  
  req.db.users.find({_id: req.userId}).toArray(function(err, result) {
    if(err)
      return res.stdShort(-2);
    var rongcloudSDK = require( 'rongcloud-sdk' );
    rongcloudSDK.init( '8w7jv4qb78a3y', 'vpg5GbuM4A0' );
    // console.log(typeof(''+result[0]._id)+'  '+typeof(result[0].nickname))
    rongcloudSDK.user.getToken( ''+result[0]._id, result[0].nickname, 'http://121.250.222.124:3000/avatar.png', function( err, resultText ) {
      if( err ) {
        return res.stdShort(-4);
      }
      else {
        var result = JSON.parse( resultText );
        if( result.code === 200 ) {
          return res.stdData(result);
        }
      }
    });
  });
});


module.exports = router;
