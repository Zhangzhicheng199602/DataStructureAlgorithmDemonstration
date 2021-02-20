var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var Teacher = require('../models/Teacher.js');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的

/* GET teacherCreateAlgorithm page. */
router.get('/', function(req, res, next) {
    var data = req.query;
    var sourceFile = {
      html: '',
      css: '',
      js: '',
    }
    sourceFile.html = fs.readFileSync(`public/Algorithm/module/index.html`,'utf-8');
    sourceFile.css = fs.readFileSync(`public/Algorithm/module/index.css`,'utf-8');
    sourceFile.js = fs.readFileSync(`public/Algorithm/module/index.js`,'utf-8');
    var tno = req.session.teacher.tno; //教师职工号
    Teacher.findTeacher({tno: tno}, (err, result) => {
      res.render('teacherCreateAlgorithm', { title: data.znname, teacher: result[0], data: data , sourceFile: sourceFile});
    });
});

router.get('/save', function(req, res, next) {
   
  console.log(req.query);

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

  var getTeacher = function(tno) {
    return new Promise((resolve, reject)=>{
      Teacher.findTeacher({tno: tno}, (error, result)=>{
        if(error) {
          console.log("getTeacher失败"+error);
        }else{
          resolve(result[0]);
        }
      });
    });
  }

  var createAlgorithm = function(data) {
    return new Promise((resolve, reject)=>{
      var algorithm = new Algorithm(data);
      algorithm.save((error)=>{
        if(error) {
          console.log("算法保存数据库出错");
          resolve(false);
        }
        else{
          resolve(true);
        }
      });
    });
  }

    var saveAlgorithm = async function(data) {
        var teacher = await getTeacher(req.session.teacher.tno);
        if(!fs.existsSync(`public/Algorithm/${teacher.tno}`)){
          fs.mkdirSync(`public/Algorithm/${teacher.tno}`, 0777);
        }
        if(!fs.existsSync(`public/Algorithm/${teacher.tno}/${data.enname}`)){
          fs.mkdirSync(`public/Algorithm/${teacher.tno}/${data.enname}`, 0777);
        }
        var path = `/Algorithm/${teacher.tno}/${data.enname}`;
        fs.writeFileSync(`public/${path}/index.html`, data.html);
        fs.writeFileSync(`public/${path}/index.css`, data.css);
        fs.writeFileSync(`public/${path}/index.js`, data.js);
        var algorithmData = {
          id       : Date.now(),
          znname   : data.znname,
          enname   : data.enname,
          path     : path,
          folder   : data.enname,
          describe : data.describe,
          author   : teacher.tname,
          time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          uid      : teacher.tno,
          state    : false
        }
        if(fs.existsSync(`public/${path}/index.html`) && fs.existsSync(`public/${path}/index.css`) && fs.existsSync(`public/${path}/index.js`)){
          var result = await createAlgorithm(algorithmData);
          if (result) {
            res.send({
              status: 1,
              msg: "保存成功"
            });
          }else{
            deleteall(`public/${path}`);
            res.send({
              status: -1,
              msg: "保存失败"
            });
            return;
          }
        }else{
          res.send({
            status: -1,
            msg: "保存失败"
          });
          return;
        }
    }

    saveAlgorithm(req.query)
});
module.exports = router;