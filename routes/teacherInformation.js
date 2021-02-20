var express = require('express');
var async = require('async');
var router = express.Router();
var User = require('../models/User.js');
var Teacher = require('../models/Teacher.js');

/* GET teacherInformation page. */
router.get('/', function(req, res, next) {
    async.series([
      function(callback) {
        Teacher.findTeacher({tno: req.session.teacher.tno}, (err, result) => {
          callback(null,result) 
        });
      },
      function(callback) {
        User.findUser({username: req.session.teacher.tno}, (err, result) => {
          callback(null,result) 
        });
      }
    ], function(err, result) {
      res.render('teacherInformation', { title: '教师信息', teacher: result[0][0], user: result[1][0]});
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
    var condition = {tno : req.body.tno};
    var update = {$set : {tname : req.body.tname}};
    var options = {upsert : true};
    Teacher.updateTeacher(condition, update, options, (err)=>{
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
    var condition = {username : req.body.tno};
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