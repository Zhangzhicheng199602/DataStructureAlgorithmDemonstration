var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log("首页请求");
  res.render('index', { title: '首页' });
});

module.exports = router;
