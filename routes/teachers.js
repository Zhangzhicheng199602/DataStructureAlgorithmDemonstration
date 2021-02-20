var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var Teacher = require('../models/Teacher.js');

/* GET teacherLogin page. */
router.get('/', function(req, res, next) {
  // console.log("处理教师登录页请求");
  res.render('teacherLogin', { title: '教师登录页' });
});

/* GET teacherHome page. */
router.get('/home', function(req, res, next) {
  //console.log("处理教师主页请求");
  var tno = req.session.teacher.tno; //教师职工号

  Teacher.findTeacher({tno: tno}, (err, result) => {
    res.render('teacherHome', { title: '教师主页', teacher: result[0] });
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
 * status 3  : 用户正在审核中
 * status 4  : 注销成功
 * status 5  : 注销失败
 * 
*/
// 注册
router.post('/regist', function(req, res, next) {
  //console.log("教师注册请求");
  var tno = req.body.tno; //教师职工号
  var password = req.body.password1; //密码
  var tname = req.body.tname;  //教师姓名

  User.findUser({username: tno}, (err, result) => {
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
      username: tno,
      password: password,
      character: "teacher",
      state: false
    });

    console.log(user);

    var teacher = new Teacher({
      id: user.id,
      tno: tno,
      tname: tname
    });

    user.save((error1) => {
      if (error1) {
        res.send({
          status: 0,
          msg: "注册失败!"
        });
      } else {
        teacher.save((error2) => {
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
  //console.log("教师登录请求");
  User.findUser(req.body, (error, result) => {
    if (error) {
      res.send({
        status: -3,
        msg: "服务器错误"
      });
    } else {
      if (result.length > 0 && result[0].character == "teacher") {
        if (result[0].state == false)
        {
          res.send({
            status: 3,
            msg: "账户审核中"
          });
        } else {
          req.session.teacher = {
            login: true,
            tno: result[0].username 
          };
          res.send({
            status: 2,
            msg: "登录成功"
          });
        }
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
  //console.log("教师注销请求");
  delete req.session.teacher;
  if (!req.session.student && !req.session.teacher && !req.session.admin){
    req.session.destroy();
    res.send({
      status: 4,
      msg: "注销成功"
    });
  }
  else if (req.session.teacher) 
  {
    res.send({
      status: 5,
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