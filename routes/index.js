var express = require('express');
var router = express.Router();
var validator = require('validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('<a href="https://github.com/FebV/tinker">tinker for SOing</a>')

});

module.exports = router;
