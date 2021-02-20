var express = require('express');
var async = require('async');
var router = express.Router();
var fs = require('fs');
var User = require('../models/User.js');
var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Teacher = require('../models/Teacher.js');
var Note = require('../models/Note.js');
var Submitted = require('../models/Submitted.js');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的

/* GET adminUserManagement page. */
router.get('/', function(req, res, next) {
    var layid = req.query.layid || 0;
    console.log(layid);
    var page = req.query.page || 1;
    var character;

    var pageSize = 10;                    //每次请求条数即每页显示笔记数
    var data = {
        layid: layid,
        total: 0,                         //笔记总共有多少页
        curPage: page,                    //当前页
        list: []                          //当前页的笔记列表
    }

    //计算页数
    var studentPageCount = function() {
        console.log("这是studentPageCount函数");
        return new Promise((resolve, reject)=>{
            Student.studentCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    var teacherPageCount = function() {
        console.log("这是teacherPageCount函数");
        return new Promise((resolve, reject)=>{
            Teacher.teacherCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    var adminPageCount = function() {
        console.log("这是adminPageCount函数");
        return new Promise((resolve, reject)=>{
            Admin.adminCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    //获取用户数据
    var getStudentList = function() {
        console.log("这是getStudentList函数");
        return new Promise((resolve, reject)=>{
            Student.aggregate([
                {
                    $sort: {id: -1}
                },
                {
                    $skip: (page-1)*pageSize
                },
                {
                    $limit: pageSize
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

    var getTeachertList = function() {
        console.log("这是getTeacherList函数");
        return new Promise((resolve, reject)=>{
            Teacher.aggregate([
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
                        from: "users",
                        localField: "tno",
                        foreignField: "username",
                        as: "user"
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "id": 1,
                        "tno": 1,
                        "tname": 1,
                        "state": "$user.state",
                    }
                },
                {
                    $unwind : "$state"
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

    var getAdminList = function() {
        console.log("这是getAdminList函数");
        return new Promise((resolve, reject)=>{
            Admin.aggregate([
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
                        from: "users",
                        localField: "ano",
                        foreignField: "username",
                        as: "user"
                    }
                },
                {
                    $project: {
                        "_id": 1,
                        "id": 1,
                        "ano": 1,
                        "aname": 1,
                        "state": "$user.state",
                    }
                },
                {
                    $unwind : "$state"
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
    
    //组合数据
    var getStudentData = async function(){
        var students = await getStudentList();
        data.total = await studentPageCount();
        var temp = [];
        students.map((ele, index)=>{
          var item = {
            _id: ele._id,
            id: ele.id,
            sno: ele.sno,
            sname: ele.sname,
            sclass: ele.sclass,
            time: moment(ele.id).format('YYYY-MM-DD HH:mm:ss'),
            __v: ele.__v
          }
          temp.push(item);
        });
        data.list = temp;
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
            // console.log(data);
            res.render('adminUserManagement', { title: character+'用户管理', admin: result[0], data: data});
        });
    }

    var getTeacherData = async function(){
        var teachers = await getTeachertList();
        data.total = await teacherPageCount();
        var temp = [];
        teachers.map((ele, index)=>{
          var item = {
            _id: ele._id,
            id: ele.id,
            tno: ele.tno,
            tname: ele.tname,
            time: moment(ele.id).format('YYYY-MM-DD HH:mm:ss'),
            state: ele.state,
            __v: ele.__v
          }
          temp.push(item);
        });
        data.list = temp;
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
            // console.log(JSON.stringify(data, null, 2));
            res.render('adminUserManagement', { title: character+'用户管理', admin: result[0], data: data});
        });
    }

    var getAdminData = async function(){
        var admins = await getAdminList();
        data.total = await adminPageCount();
        var temp = [];
        admins.map((ele, index)=>{
          var item = {
            _id: ele._id,
            id: ele.id,
            ano: ele.ano,
            aname: ele.aname,
            time: moment(ele.id).format('YYYY-MM-DD HH:mm:ss'),
            state: ele.state,
            __v: ele.__v
          }
          temp.push(item);
        });
        data.list = temp;
        Admin.findAdmin({ano: req.session.admin.ano}, (err, result) => {
            // console.log(JSON.stringify(data, null, 2));
            res.render('adminUserManagement', { title: character+'用户管理', admin: result[0], data: data});
        });
    }

    if(layid == 0){
        character = "学生";
        getStudentData();
        return;
    }

    if(layid == 1){
        character = "教师";
        getTeacherData();
        return;
    }

    if(layid == 2){
        character = "管理员";
        getAdminData();
        return;
    }
 
});

router.get('/disable', function(req, res, next){
    console.log(req.query)
    var id = req.query.id;
    var data = {
        layid: req.query.layid,
        mssg: "",
        status: ""
    };

    var condition = {id : id};
    var update = {$set : {state : false}};
    var options = {upsert : true};
    User.updateUser(condition, update, options, (err)=>{
        if (err) {
            console.log('禁用失败');
            data.status = -1;
            data.msg = "操作失败";
            res.send(data);
            return;
        }else{
            console.log('禁用成功');
            data.status = 1;
            data.msg = "操作成功";
            res.send(data);
            return;
        }
    });
});

router.get('/enable', function(req, res, next){
    console.log(req.query)
    var id = req.query.id;
    var data = {
        layid: req.query.layid,
        mssg: "",
        status: ""
    };

    var condition = {id : id};
    var update = {$set : {state : true}};
    var options = {upsert : true};
    User.updateUser(condition, update, options, (err)=>{
        if (err) {
            console.log('禁用失败');
            data.status = -1;
            data.msg = "操作失败";
            res.send(data);
            return;
        }else{
            console.log('禁用成功');
            data.status = 1;
            data.msg = "操作成功";
            res.send(data);
            return;
        }
    });
});

router.get('/deleteMany', function(req, res, next) {
    var reqData = {
        layid: req.query.layid,
        list: req.query.list,
        page: req.query.page
    }

    console.log(reqData);

    var deleteManyUser = function(usernameList) {
        console.log("子函数_用户批量删除:"+usernameList);
        return new Promise((resolve,reject)=>{
            User.deleteManyUser({username : {$in: usernameList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManyStudent = function(snoList) {
        console.log("子函数_学生批量删除:"+snoList);
        return new Promise((resolve,reject)=>{
            Student.deleteManyStudent({sno : {$in: snoList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_学生批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManyTeacher = function(tnoList) {
        console.log("子函数_教师批量删除:"+tnoList);
        return new Promise((resolve,reject)=>{
            Teacher.deleteManyTeacher({tno : {$in: tnoList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_教师批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManyAdmin = function(anoList) {
        console.log("子函数_管理员批量删除:"+anoList);
        return new Promise((resolve,reject)=>{
            Admin.deleteManyAdmin({ano : {$in: anoList}},(err, result)=>{
                if (err) {
                    resolve(false);
                }
                else{
                    console.log("子函数_管理员批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManyNote = function(uidList) {
        console.log("子函数_笔记批量删除:"+uidList);
        return new Promise((resolve,reject)=>{
            Note.deleteManyNote({uid : {$in: uidList}},(err, result)=>{
                if (err) {
                    resolve(false);;
                }
                else{
                    console.log("子函数_笔记批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    var deleteManySubmitted = function(tidList) {
        console.log("子函数_已提交笔记批量删除:"+tidList);
        return new Promise((resolve,reject)=>{
            Submitted.deleteManySubmitted({tid : {$in: tidList}},(err, result)=>{
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

    var deleteManyAlgorithm = function(uidList) {
        console.log("子函数_算法批量删除:"+uidList);
        return new Promise((resolve,reject)=>{
            Algorithm.deleteManyAlgorithm({uid : {$in: uidList}},(err, result)=>{
                if (err) {
                    resolve(false);;
                }
                else{
                    console.log("子函数_算法批量删除结果："+JSON.stringify(result, null, 2));
                    resolve(true);
                }
            });
        });
    }

    function deleteall(path) {
        console.log("deleteall:"+path);
        var files = [];
        if(fs.existsSync(path)) {
          files = fs.readdirSync(path);
          console.log("files:"+files);
          files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteall(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
    }

    var deleteMany = async function() {
        var data = {
            layid: reqData.layid,
            page: reqData.page,
            status: -1,
            msg: ""
        }
        if (reqData.layid == 0) {
            console.log("学生批量删除");
            var result1 = await deleteManyUser(reqData.list);
            var result2 = await deleteManyStudent(reqData.list);
            var result3 = await deleteManyNote(reqData.list);
            console.log(result1 + " " + result2 + " " + result3);
            if (result1) {
                if (result2) {
                    if (result3) {
                        data.msg = "账户及相关数据删除完毕";
                        data.status = 1;
                        res.send(data);
                    }else{
                        data.msg = "用户账户删除，笔记相关数据未删除完毕"
                        res.send(data);
                    }
                }else{
                    data.msg = "用户账户删除，学生表相关数据未删除完毕";
                    res.send(data);
                }
            } else {
                data.mag="操作失败";
                res.send(data);
            }
        }
        if (req.query.layid == 1) {
            console.log("教师批量删除");
            var result1 = await deleteManyUser(reqData.list);
            var result2 = await deleteManyTeacher(reqData.list);
            for (var i = 0; i < reqData.list.length; i++) {
                deleteall("public/Algorithm/"+reqData.list[i]);
            }
            var result3 = await deleteManySubmitted(reqData.list);
            var result4 = await deleteManyAlgorithm(reqData.list);
            console.log(result1 + " " + result2 + " " + result3);
            if (result1) {
                if (result2) {
                    if (result3) {
                        if (result4) {
                            data.msg = "账户及相关数据删除完毕";
                            data.status = 1;
                            res.send(data);
                        }else{
                            data.msg = "账户删除,算法相关数据未删除完毕";
                            res.send(data);
                        }
                    }else{
                        data.msg = "账户删除，笔记相关数据未删除完毕"
                        res.send(data);
                    }
                }else{
                    data.msg = "账户删除，教师表相关数据未删除完毕";
                    res.send(data);
                }
            } else {
                data.mag="操作失败";
                res.send(data);
            }
        }
        if (req.query.layid == 2) {
            console.log("管理员批量删除");
            var result1 = await deleteManyUser(reqData.list);
            var result2 = await deleteManyAdmin(reqData.list);
            if (result1) {
                if (result2) {
                    data.msg = "账户及相关数据删除完毕";
                    data.status = 1;
                    res.send(data);
                }else{
                    data.msg = "账户删除，管理员数据未删除完毕";
                    res.send(data);
                }
            } else {
                data.mag="操作失败";
                res.send(data);
            }
        }
    }

    deleteMany();
});


module.exports = router;