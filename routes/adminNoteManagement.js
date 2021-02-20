var express = require('express');
var async = require('async');
var router = express.Router();
var User = require('../models/User.js');
var Admin = require('../models/Admin.js');
var Note = require('../models/Note.js');
var Submitted = require('../models/Submitted.js');

/* GET adminNoteManagement page. */
router.get('/', function(req, res, next) {
    var layid = req.query.layid || 0;
    console.log(layid);
    var page = req.query.page || 1;

    var pageSize = 10;                    //每次请求条数即每页显示笔记数
    var data = {
        layid: layid,
        total: 0,                         //笔记总共有多少页
        curPage: page,                    //当前页
        list: []                          //当前页的笔记列表
    }

    //计算页数
    var notePageCount = function() {
        console.log("这是notePageCount函数");
        return new Promise((resolve, reject)=>{
            Note.noteCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    var submittedPageCount = function() {
        console.log("这是submittedPageCount函数");
        return new Promise((resolve, reject)=>{
            Submitted.submittedCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    
    var getNoteList = function(){
        console.log("这是getNoteList函数");
       return new Promise((resolve,result)=>{
            Note.aggregate([
                {
                    $sort: {id: -1}
                },
                {
                    $skip: (page-1)*pageSize
                },
                {
                    $limit: pageSize
                },
                {
                    $lookup:{
                        from: "students",
                        localField: "uid",
                        foreignField: "sno",
                        as: "student"
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "id": 1,
                        "title": 1,
                        "content": 1,
                        "time": 1,
                        "author": 1,
                        "uid": 1,
                        "class": "$student.sclass",
                    }
                },
                {
                    $unwind : "$class"
                }
            ],(error,result)=>{
                if (error) {
                    console.log(error);
                }else{
                    resolve(result);
                }
            })
       });
    }

    var getSubmittedList = function(){
        return new Promise((resolve,result)=>{
            Submitted.aggregate([
                 {
                     $sort: {id: -1}
                 },
                 {
                     $skip: (page-1)*pageSize
                 },
                 {
                     $limit: pageSize
                 },
                 {
                     $lookup:{
                         from: "teachers",
                         localField: "tid",
                         foreignField: "tno",
                         as: "teacher"
                     }
                 },
                 {
                    $lookup:{
                        from: "students",
                        localField: "uid",
                        foreignField: "sno",
                        as: "student"
                    }
                },
                 {
                     $project: {
                         "_id": 1,
                         "id": 1,
                         "title": 1,
                         "content": 1,
                         "time": 1,
                         "author": 1,
                         "uid": 1,
                         "tid": 1,
                         "class": "$student.sclass",
                         "teacher": "$teacher.tname"
                     }
                 },
                 {
                    $unwind : "$class"
                 },
                 {
                    $unwind : "$teacher"
                 }
             ],(error,result)=>{
                 if (error) {
                     console.log(error);
                 }else{
                     resolve(result);
                 }
             })
        });
     }
 

    var getNoteData = async function() {
        data.total = await notePageCount();
        data.list = await getNoteList();
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
            // console.log(result);
            res.render('adminNoteManagement', { title: '笔记管理', admin: result[0], data: data});
        });
    }

    var getSubmittedData = async function() {
        data.total = await submittedPageCount();
        data.list = await getSubmittedList();
        // console.log(data);
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
            // console.log(result);
            res.render('adminNoteManagement', { title: '笔记管理', admin: result[0], data: data});
        });
    }

    if (data.layid == 0) {
        getNoteData();
        return;
    }


    if (data.layid == 1) {
        getSubmittedData();
        return;
    }
});


router.get('/deleteMany', function(req, res, next){
    var reqData = {
        layid: req.query.layid,
        list: req.query.list,
        page: req.query.page
    }
    console.log(reqData);

    var deleteManyNote = function(noteIdList) {
        console.log("子函数_学生笔记批量删除:"+noteIdList);
        return new Promise((resolve,reject)=>{
            Note.deleteManyNote({id : {$in: noteIdList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_学生笔记批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManySubmitted = function(submittedIdList) {
        console.log("子函数_已提交笔记批量删除:"+submittedIdList);
        return new Promise((resolve,reject)=>{
            Submitted.deleteManySubmitted({id : {$in: submittedIdList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_已提交笔记批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteMany = async function() {
        var data = {
            layid: reqData.layid,
            page: reqData.page,
            status: -1,
            msg: ""
        }
        if (reqData.layid == 0) {
            var result = await deleteManyNote(reqData.list);
            if (result) {
                data.msg = "删除成功";
                data.status = 1;
                res.send(data);
                return;
            }else{
                data.msg = "删除失败";
                data.status = -1;
                res.send(data);
                return;
            }
        }
        if (reqData.layid == 1) {
            var result = await deleteManySubmitted(reqData.list);
            if (result) {
                data.msg = "删除成功";
                data.status = 1;
                res.send(data);
                return;
            }else{
                data.msg = "删除失败";
                data.status = -1;
                res.send(data);
                return;
            }
        }
    }

    deleteMany();
});

module.exports = router;