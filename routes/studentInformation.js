var express = require('express');
var router = express.Router();
var async = require('async');
var User = require('../models/User.js');
var Student = require('../models/Student.js');


/* GET studentInformation page. */
router.get('/', function(req, res, next) {
    async.series([
      function(callback) {
        Student.findStudent({sno: req.session.student.sno}, (err, result) => {
          callback(null,result) 
        });
      },
      function(callback) {
        User.findUser({username: req.session.student.sno}, (err, result) => {
          callback(null,result) 
        });
      }
    ], function(err, result) {
      res.render('studentInformation', { title: '学生信息', student: result[0][0], user: result[1][0]});
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
    var condition = {sno : req.body.sno};
    var update = {$set : {sname : req.body.sname, sclass : req.body.sclass}};
    var options = {upsert : true};
    Student.updateStudent(condition, update, options, (err)=>{
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
    var condition = {username : req.body.sno};
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