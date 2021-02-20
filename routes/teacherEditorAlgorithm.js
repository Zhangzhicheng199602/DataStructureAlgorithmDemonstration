var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs');
var Teacher = require('../models/Teacher.js');
var Algorithm = require('../models/Algorithm.js');
var moment = require('moment');//专门用来处理时间格式的

/* GET teacherEditorAlgorithm page. */
router.get('/', function(req, res, next) {
    console.log(req.query)
    var id = req.query.id;
    var tno = req.session.teacher.tno; //教师职工号
    var data = {
        id: 0,
        name: '',
        html: '',
        css: '',
        js: '',
        describe: ''
    }
    data.id = id;

    var getAlgorithm = function(id) {
        return new Promise((resolve, reject)=>{
            Algorithm.findAlgorithm({id: id},(error, result)=>{
                if(error) {
                    console.log(error);
                }else{
                    resolve(result[0])
                }
            });
        });
    }

    var getData = async function(id, tno) {
        var algorithm = await getAlgorithm(id);
        data.describe = algorithm.describe;
        data.name = algorithm.folder;
        data.html = fs.readFileSync(`public/${algorithm.path}/index.html`,'utf-8');
        data.css = fs.readFileSync(`public/${algorithm.path}/index.css`,'utf-8');
        data.js = fs.readFileSync(`public/${algorithm.path}/index.js`,'utf-8');
        Teacher.findTeacher({tno: tno}, (err, result) => {
            res.render('teacherEditorAlgorithm', { title: algorithm.znname, teacher: result[0], data: data });
        });
    }

    getData(id, tno);
  
});

router.get('/save', function(req, res, next) {
    
    var getAlgorithm = function(id) {
      console.log("这是getAlgorithm函数");
        return new Promise((resolve, reject)=>{
            Algorithm.findAlgorithm({id: id},(error, result)=>{
                if(error) {
                    console.log(error);
                }else{
                    resolve(result[0])
                }
            });
        });
    }

    var updateAlgorithm = function(id, describe) {
        console.log(id+";"+describe);
        console.log("这是updateAlgorithm函数");
        return new Promise((resolve, reject)=>{
          var condition = {id : id};
          var update = {
            $set : {
                      time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                      describe : describe
                    }
          };
          var options = {upsert : true};
          Algorithm.updateAlgorithm(condition, update, options, (error)=>{
            if (error) {
              console.log("updateAlgorithm错误:"+error);
            }else{
              resolve(true);
            }
          });
        });
      }

    var saveAlgorithm = async function(data) {
        var algorithm = await getAlgorithm(data.id);
        var result = await updateAlgorithm(data.id, data.describe);
        fs.writeFileSync(`public/${algorithm.path}/index.html`, data.html);
        fs.writeFileSync(`public/${algorithm.path}/index.css`, data.css);
        fs.writeFileSync(`public/${algorithm.path}/index.js`, data.js);
        res.send({
          status: 1,
          msg: "保存成功"
        });
        if(result){
          res.send({
            status: 1,
            msg: "保存成功"
          });
          return;
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