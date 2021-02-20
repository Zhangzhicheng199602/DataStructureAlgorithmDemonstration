var express = require('express');
var router = express.Router();
var Student = require('../models/Student.js');
var fs = require('fs');
var async = require('async');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的


/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
    list: []
  }
  var getAlgorithm = ()=>{
    console.log("这是getAlgorithm函数");
    return new Promise((resolve,reject)=>{
      Algorithm.aggregate([
        {
          $match: {state: true}
        },
        {
          $sort: {time: -1}
        }
      ],(error, result)=>{
        if (error) {
          console.log("获取算法列表失败");
        }else{
          console.log("getAlgorithm成功");
          resolve(result);
        }
      });
    });
  }

  var getStudent = (sno)=>{
    console.log("这是getStudent函数");
    return new Promise((resolve,reject)=>{
      Student.findStudent({sno: sno}, (error, result) => {
        if (error) {
          console.log("获取教师信息失败");
        }else{
          console.log("getStudent成功");
          resolve(result);
        }
      });
    });
  }

  var getData = async (sno)=>{
    console.log("这是getData函数");
    data.list = await getAlgorithm();
    var student = await getStudent(sno);
    res.render('studentAlgorithm', { title: '算法选择页', student: student[0], data: data });
  }

  getData(req.session.student.sno);
});

module.exports = router;
