var express = require('express');
var async = require('async');
var router = express.Router();
var User = require('../models/User.js');
var Admin = require('../models/Admin.js');

/* GET adminLogin page. */
router.get('/', function(req, res, next) {
  res.render('adminLogin', { title: '管理员登录页' });
});

/* GET adminHome page. */
router.get('/home', function(req, res, next) {
  Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
    res.render('adminHome', { title: '管理员主页', admin: result[0] });
  });
});

/**
 * status -3 : 服务器错误
 * status -1 : 用户已存在
 * status 0  : 注册失败
 * status 1  : 注册成功
 * status 2  : 登录成功
 * status -2 : 登录失败
 * status 3  : 用户正在审核中
 * status 4  : 注销成功
 * status 5  : 注销失败
*/
// 注册
router.post('/regist', function(req, res, next) {
  console.log(req.body);
  User.findUser({username: req.body.ano}, (err, result) => {
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
      username: req.body.ano,
      password: req.body.password1,
      character: "admin",
      state: false
    });

    var admin = new Admin({
      id: user.id,
      ano: req.body.ano,
      aname: req.body.aname
    });

    user.save((error1) => {
      if (error1) {
        res.send({
          status: 0,
          msg: "注册失败!"
        });
      } else {
        admin.save((error2) => {
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
  console.log(req.body);
  User.findUser(req.body, (error, result) => {
    if (error) {
      res.send({
        status: -3,
        msg: "服务器错误"
      });
    } else {
      if (result.length > 0 && result[0].character == "admin") {
        req.session.admin = {
          login: true,
          ano: result[0].username 
        };
        // console.log(req.session);
        if (result[0].state == false)
        {
          res.send({
            status: 3,
            msg: "账户审核中"
          });
        } else {
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
  delete req.session.admin;
  if (!req.session.student && !req.session.teacher && !req.session.admin){
    req.session.destroy();
    res.send({
      status: 4,
      msg: "注销成功"
    });
  }
  else if (req.session.admin) 
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