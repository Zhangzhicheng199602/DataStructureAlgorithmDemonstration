var express = require('express');
var async = require('async');
var router = express.Router();
var User = require('../models/User.js');
var Admin = require('../models/Admin.js');

/* GET adminInformation page. */
router.get('/', function(req, res, next) {
    async.series([
      function(callback) {
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
          callback(null,result) 
        });
      },
      function(callback) {
        User.findUser({username: req.session.admin.ano}, (err, result) => {
          callback(null,result) 
        });
      }
    ], function(err, result) {
      res.render('adminInformation', { title: '管理员信息', admin: result[0][0], user: result[1][0]});
    });
});

/**
 * 修改个人信息及密码
 * -1 修改失败
 *  1 修改成功
 */
//修改信息
router.post('/saveInformation', function(req, res, next) {
    // console.log(req.body);
    var condition = {ano : req.body.ano};
    var update = {$set : {aname : req.body.aname}};
    var options = {upsert : true};
    Admin.updateAdmin(condition, update, options, (err)=>{
        if (err) {
            // console.log("修改失败");
            res.send({
                status: -1,
                msg: "修改失败"
            });
        } else {
            // console.log("修改成功");
            res.send({
                status: 1,
                msg: "修改成功"
            });
        }
    });
});
//修改密码
router.post('/savePassword', function(req, res, next) {
    // console.log(req.body);
    var condition = {username : req.body.ano};
    var update = {$set : {password : req.body.password1}};
    var options = {upsert : true};
    User.updateUser(condition, update, options, (err)=>{
        if (err) {
            // console.log("修改失败");
            res.send({
                status: -1,
                msg: "修改失败"
            });
        } else {
            // console.log("修改成功");
            res.send({
                status: 1,
                msg: "修改成功"
            });
        }
    });
});

module.exports = router;