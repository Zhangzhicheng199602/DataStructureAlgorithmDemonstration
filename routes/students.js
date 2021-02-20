var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Student = require('../models/Student.js');



/* GET studentLogin page. */
router.get('/', function(req, res, next) {
  res.render('studentLogin', { title: '学生登录页' });
});

/* GET studentHome page. */
router.get('/home', function(req, res, next) {
  Student.findStudent({sno: req.session.student.sno}, (err, result) => {
    res.render('studentHome', { title: '学生主页', student: result[0] });
  });
});


/**
 * 注册登录注销
 * status -3 : 服务器错误
 * status -1 : 用户已存在
 * status 0  : 注册失败
 * status 1  : 注册成功
 * status 2  : 登录成功
 * status -2 : 登录失败
 * status 3  : 注销失败
 * status 4  : 注销成功
*/
//注册
router.post('/regist', function(req, res, next) {
  // console.log(req.body);
  User.findUser({username: req.body.sno}, (err, result) => {
    if(err) {
      // console.log("服务器错误,请稍后重试!");
      res.send({
        status: -3,
        msg: "服务器错误"
      });
      return;
    }
    if (result.length != 0) {
      // console.log("用户存在");
      res.send({
        status: -1,
        msg: "用户已存在!"
      });
      return;
    }
    var user = new User({
      id: Date.now(),
      username: req.body.sno,
      password: req.body.password1,
      character: "student",
      state: true
    });

    var student = new Student({
      id: user.id,
      sno: req.body.sno,
      sname: req.body.sname,
      sclass: req.body.sclass,
    });

    user.save((error1) => {
      if (error1) {
        res.send({
          status: 0,
          msg: "注册失败!"
        });
      } else {
        student.save((error2) => {
          if (error2) {
            User.deleteUser({id: user.id}, (error3) => {
              res.send({
                status: 0,
                msg: "注册失败!"
              });
            });
          } else {
            res.send({
              status: 1,
              msg: "注册成功!"
            });
          }
        });
      }
    });
  });
});

//登录
router.post('/login', function(req, res, next) {
  User.findUser(req.body, (error, result) => {
    if (error) {
      res.send({
        status: -3,
        msg: "服务器错误"
      });
    } else {
      if (result.length > 0 && result[0].character == "student") {  
        req.session.student = {
          login: true,
          sno: result[0].username 
        };
        res.send({
          status: 2,
          msg: "登录成功"
        });
      } else {
        res.send({
          status: -2,
          msg: "用户名或密码错误"
        });
      }
    }
  });
});

//注销
router.get('/logout', function(req, res, next){
  delete req.session.student;
  if (!req.session.student && !req.session.teacher && !req.session.admin){
    req.session.destroy();
    res.send({
      status: 4,
      msg: "注销成功"
    });
  }
  else if (req.session.student) 
  {
    res.send({
      status: 3,
      msg: "注销失败"
    });
  }
  else
  {
    res.send({
      status: 4,
      msg: "注销成功"
    });
  }
});

module.exports = router;