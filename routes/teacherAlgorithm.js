var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var async = require('async');
var Teacher = require('../models/Teacher.js');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {
    list: []
  }

  var getAlgorithm = (uid)=>{
    console.log("这是getAlgorithm函数");
    return new Promise((resolve,reject)=>{
      Algorithm.aggregate([
        {
          $match: {uid: uid}
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

  var getTeacher = (tno)=>{
    console.log("这是getTeacher函数");
    return new Promise((resolve,reject)=>{
      Teacher.findTeacher({tno: tno}, (error, result) => {
        if (error) {
          console.log("获取教师信息失败");
        }else{
          console.log("getTeacher成功");
          resolve(result);
        }
      });
    });
  }

  var getData = async (tno)=>{
    console.log("这是getData函数");
    data.list = await getAlgorithm(tno);
    var teacher = await getTeacher(tno);
    // console.log(data.list);
    // console.log(teacher);
    res.render('teacherAlgorithm', { title: '算法管理页', teacher: teacher[0], data: data });
  }

  getData(req.session.teacher.tno);
});

router.get('/create', function(req, res, next) {
  console.log("createAlgorithm请求")
  var znnameExist = (znname, uid)=>{
    console.log("这是znnameExist函数");
    return new Promise((resolve,reject)=>{
      Algorithm.algorithmCount({znname: znname, uid: uid}, (error, result) => {
        if (error) {
          console.log("获取znnameExist失败");
        }else{
          console.log("获取znnameExist成功");
          resolve(result);
        }
      });
    });
  }

  var ennameExist = (enname, uid)=>{
    console.log("这是ennameExist函数");
    return new Promise((resolve,reject)=>{
      Algorithm.algorithmCount({enname: enname, uid: uid}, (error, result) => {
        if (error) {
          console.log("获取ennameExist失败");
        }else{
          console.log("获取ennameExist成功");
          resolve(result);
        }
      });
    });
  }

  var check = async function (data, uid) {
    var znflag = await znnameExist(data.znname, uid);
    var enflag = await ennameExist(data.enname, uid);
    if (znflag > 0) {
      res.send({
        status: -1,
        msg: "算法已存在"
      });
      return;
    } else if (enflag > 0) {
      res.send({
        status: -1,
        msg: "英文名被占用"
      });
      return;
    } else {
      res.send({
        status: 1,
        msg: "开始创建"
      });
      return;
    }
  }

  check(req.query, req.session.teacher.tno);
});

router.get('/upload', function(req, res, next) {
  Teacher.findTeacher({tno: req.session.teacher.tno}, (err, result) => {
    res.render('teacherAlgorithmUpload', { title: '上传算法', teacher: result[0] });
  });
});

router.get('/public', function(req, res, next) {
  console.log("发布")
  var condition = {id : req.query.id};
  var update = {$set : {state : true, time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}};
  var options = {upsert : true};
  Algorithm.updateAlgorithm(condition, update, options, (err)=>{
    if(err){
      console.log(err);
      res.send({
        status: -1,
        msg: "发布失败"
      });
    }else{
      res.send({
        status: 1,
        msg: "发布成功"
      });
    }
  });
});

router.get('/depublic', function(req, res, next) {
  console.log("发布")
  var condition = {id : req.query.id};
  var update = {$set : {state : false, time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}};
  var options = {upsert : true};
  Algorithm.updateAlgorithm(condition, update, options, (err)=>{
    if(err){
      console.log(err);
      res.send({
        status: -1,
        msg: "取消发布失败"
      });
    }else{
      res.send({
        status: 1,
        msg: "取消发布成功"
      });
    }
  });
});

router.get('/delete', function(req, res, next) {

  var getAlgorithm = (id)=>{
    return new Promise((resolve, reject)=>{
      Algorithm.findAlgorithm({id: id}, (error, result)=>{
        if(error) {
          console.log("getAlgorithm失败"+error);
        }else{
          resolve(result);
        }
      });
    });
  }

  var deleteAlgorithm = (id)=>{
    return new Promise((resolve, reject)=>{
      Algorithm.deleteAlgorithm({id: id}, (error)=>{
        if(error) {
          console.log("getAlgorithm失败"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  function deleteall(path) {
    var files = [];
    if(fs.existsSync(path)) {
      files = fs.readdirSync(path);
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

  var deleteData = async (id)=>{
    const algorithms = await getAlgorithm(id);
    var flag = await deleteAlgorithm(id);
    if(flag){
      deleteall("public"+algorithms[0].path);
      res.send({
        status: 1,
        msg: "删除成功"
      });
    }else{
      res.send({
        status: -1,
        msg: "删除失败"
      });
    }
  }
  deleteData(req.query.id);
  
});


router.post('/upload/save', multer({
  dest: 'public/Algorithm'
}).array('file', 10), (req, res, next)=>{
  const files = req.files;
  var data = req.body
  var fname = req.body.tid;
  console.log(fname);
  const fileList = [];
  var name;
  for (var i in files) {
      var file = files[i];
      name = file.originalname.split('.')[0];
      var suffix = file.originalname.split('.')[1];
      if(!fs.existsSync(`public/Algorithm/${fname}`)){
        fs.mkdirSync(`public/Algorithm/${fname}`, 0777);
      }
      if (!fs.existsSync(`public/Algorithm/${fname}/${name}`)){
          fs.mkdirSync(`public/Algorithm/${fname}/${name}`, 0777);
      }
      fs.renameSync(file.path, `public/Algorithm/${fname}/${name}/index.${suffix}`);
      file.path = `public/Algorithm/${fname}/${name}/index.${suffix}`;
      fileList.push(file);
  };
  console.log(fileList);
  var algorithm = new Algorithm({
      id       : Date.now(),
      znname   : req.body.zn_name,
      enname   : req.body.en_name,
      path     : `/Algorithm/${fname}/${name}`,
      folder   : `${name}`,
      describe : req.body.describe,
      author   : req.body.tname,
      time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      uid      : req.body.tid,
      state    : false
  });

  var saveAlgorithm = (algorithm)=>{
    return new Promise((resolve, reject)=>{
      algorithm.save((error)=>{
        if(error) {
          console.log("算法保存数据库出错");
          resolve(false);
        }else{
          resolve(true);
        }
      });
    });
  }

  var save = async (algorithm)=>{
    var flag = saveAlgorithm(algorithm)
    if(flag){
      res.send({
          status: 1,
          msg: "上传成功",
          data: fileList
      });
    }else{
      res.send({
          status: -1,
          msg: "上传失败",
          data: fileList
      });
    }
  }

  save(algorithm);
});


module.exports = router;
