var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var async = require('async');
var Admin = require('../models/Admin.js');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的

/* GET algorithmManagement page. */
router.get('/', function(req, res, next) {
    var page = req.query.page || 1;

    var pageSize = 10;                    //每次请求条数即每页显示笔记数
    var data = {
        total: 0,                         //笔记总共有多少页
        curPage: page,                    //当前页
        list: []                          //当前页的笔记列表
    }

    //计算页数
    var algorithmPageCount = function() {
        console.log("这是algorithmPageCount函数");
        return new Promise((resolve, reject)=>{
            Algorithm.algorithmCount({}, (error, result)=>{
                resolve(Math.ceil(result / pageSize));
            });
        });
    };

    //获取算法数据
    var getAlgorithmList = function() {
        console.log("这是getAlgorithmList函数");
        return new Promise((resolve, reject)=>{
            Algorithm.aggregate([
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
    
    //组合数据
    var getAlgorithmData = async function(ano){
        data.list = await getAlgorithmList();
        data.total = await algorithmPageCount();
        Admin.findAdmin({ano: ano}, (err, result) => {
            // console.log(data);
            res.render('adminAlgorithmManagement', { title: '算法管理', admin: result[0], data: data});
        });
    }

    getAlgorithmData(req.session.admin.ano);
});

router.get('/deleteMany', function(req, res, next) {
    var reqData = {
        list: req.query.list,
        page: req.query.page
    }

    for (var i = 0; i < reqData.list.length; i++){
        var temp = reqData.list[i];
        reqData.list[i] = parseInt(temp)
    }
    console.log(reqData);

    var deleteManyAlgorithm = function(idList) {
        console.log("子函数_算法批量删除:"+idList);
        return new Promise((resolve,reject)=>{
            Algorithm.deleteManyAlgorithm({id : {$in: idList}},(err, result)=>{
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

    var getAlgorithmPaths = function(idList) {
        console.log("getAlgorithmPaths:"+idList);
        return new Promise((resolve, reject)=>{
            Algorithm.aggregate([ 
                {
                  $match: {id: {$in: idList}}
                },
                {
                  $project:
                  {
                      _id: 0,
                      path: 1
                  }
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


    var deleteMany = async function() {
        var data = {
            page: reqData.page,
            status: -1,
            msg: ""
        }
        
        var paths = await getAlgorithmPaths(reqData.list)
        var result = await deleteManyAlgorithm(reqData.list);
        for (var i = 0; i < reqData.list.length; i++) {
            deleteall("public"+paths[i].path);
        }
        
        if (result) {
            data.status = 1;
            data.msg = "删除成功";
            res.send(data);
        } else {
            data.mag="删除失败";
            res.send(data);
        }
    }

    deleteMany();
});

module.exports = router;