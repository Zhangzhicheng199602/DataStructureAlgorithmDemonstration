var express = require('express');
var router = express.Router();
var async = require('async');
var Student = require('../models/Student.js');
var Teacher = require('../models/Teacher.js');
var Submitted = require('../models/Submitted.js');
var moment = require('moment');//专门用来处理时间格式的

router.get('/', function(req, res, next){
    
    var tno = req.session.teacher.tno;

    var page = req.query.page || 1;       //前端传来的当前页码（没有则默认为1）
    var pageSize = 10;                    //每次请求条数即每页显示笔记数
    var data = {
        total: 0,                         //笔记总共有多少页
        curPage: page,                    //当前页
        list: []                          //当前页的笔记列表
    }

    //获取学生信息
    var getTeacher = function(tno){
        console.log("这是getTeacher函数");
        return new Promise((resolve, reject)=>{
            Teacher.findTeacher({tno: tno}, (err, result) => {
                resolve(result);
            });
        });
    };

    //计算页数
    var pageCount = function(tno) {
        console.log("这是pageCount函数");
        return new Promise((resolve, reject)=>{
            Submitted.submittedCount({tid: tno}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    //获取笔记数据
    var getNoteList = function(tno) {
        console.log("这是getNoteList函数");
        return new Promise((resolve, reject)=>{
            Submitted.aggregate([
                {
                    $match: {tid: tno}
                },
                {
                    $skip: (page-1)*pageSize
                },
                {
                    $limit: pageSize
                },
                {
                    $lookup: {
                        from: "students",
                        localField: "uid",
                        foreignField: "sno",
                        as: "student"
                    }
                },
                {
                    $unwind : "$student"
                },
                {
                    $sort:{ time: -1}
                }
            ],(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(result);
                }
            });
        });
    };

    //获取返回客户端的数据
    var getData = async function(tno) {
        console.log("这是getData函数");
        var teacher = await getTeacher(tno);
        data.total = await pageCount(tno);
        // console.log(data.total);
        data.list = await getNoteList(tno);
        // console.log(data.list);
        if(data.list.length == 0 && page > 1) {     //当前页笔记记录为0条
            res.redirect('?page='+((page-1) || 1)) //重定向上一页
        } else {
            // console.log(data.list);
            res.render('teacherNote',{title: '实验笔记', teacher: teacher[0], data: data});
        }   
    };

    getData(tno);
});

/* GET teacherReadNote page. */
router.get('/read', function(req, res, next) {
    var curPage = req.query.page || 1;
    var data = {
      curPage: curPage
    }
    async.series([
      function(callback){
        Submitted.findSubmitted({id: req.query.noteId}, (err, result)=>{
          callback(null, result);
        });
      },
      function(callback){
        Teacher.findTeacher({tno: req.session.teacher.tno}, (err, result) => {
          callback(null, result);
        });
      }
    ], function(err, result){
      res.render('teacherReadNote', { title: '查看笔记', teacher: result[1][0], note: result[0][0], data: data });
    });
});

router.get('/deleteMany', function(req, res, next) {
    var curPage = req.query.page || 1;
    var idList = req.query.idList;
    var data = {
        status: -1,
        mag: "",
        curPage: curPage
    }

    
    Submitted.deleteManySubmitted({id : {$in: idList}},(err, result)=>{
        if(err){
            console.log("批量删除失败"+err);
        }else{
            if (result.ok){
                data.msg = "删除成功"
                data.status = 1;
            }else{
                data.msg = "删除失败"
                data.status = -1;
            }
            res.send(data);
        }
    });
});
  

module.exports = router;
