var express = require('express');
var router = express.Router();
var async = require('async');
var Student = require('../models/Student.js');
var Note = require('../models/Note.js');
var Teacher = require('../models/Teacher.js');
var Submitted = require('../models/Submitted.js');
var moment = require('moment');//专门用来处理时间格式的
var multiparty = require('multiparty');
var multer = require('multer');
var fs = require('fs');

/* GET studentNote page. */
router.get('/', function(req, res, next) {
  var page = req.query.page || 1;       //前端传来的当前页码（没有则默认为1）
  var pageSize = 10;                    //每次请求条数即每页显示笔记数
  var data = {
      total: 0,                         //笔记总共有多少页
      curPage: page,                    //当前页
      list: []                          //当前页的笔记列表
  }

  //获取返回客户端的数据
  var getData = async function() {
    console.log("这是getData函数");
    var student = await getStudent();
    console.log(student);
    data.total = await pageCount();
    // console.log(data.total);
    data.list = await getNoteList(req.session.student.sno);
    // console.log(data.list);
    if(data.list.length == 0 && page > 1) {     //当前页笔记记录为0条
        res.redirect('?page='+((page-1) || 1)) //重定向上一页
    } else {
      // console.log(data.list);
      res.render('studentNote',{title: '实验笔记', student: student[0], data: data});
    }   
  };

  //获取学生信息
  var getStudent = function(){
    console.log("这是getStudent函数");
    return new Promise((resolve, reject)=>{
      Student.findStudent({sno: req.session.student.sno}, (err, result) => {
        resolve(result);
      });
    });
  };
  
  //计算页数
  var pageCount = function() {
    console.log("这是pageCount函数");
    return new Promise((resolve, reject)=>{
        Note.noteCount({}, (error, result)=>{
            resolve(Math.ceil(result / pageSize));
        });
    });
  };

  //获取笔记数据
  var getNoteList = function(sno) {
    console.log("这是getNoteList函数");
    return new Promise((resolve, reject)=>{
        Note.aggregate([ 
            {
              $match: {uid: sno}
            },
            {
              $sort: {time: -1}
            },
            {
                $skip: (page-1)*pageSize
            },
            {
                $limit: pageSize
            },
        ],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                resolve(result);
            }
        });
    });
  };

  getData();
});

/* GET studentCreateNote page. */
router.get('/create', function(req, res, next) {
  var curPage = req.query.page || 1;
  var data = {
    curPage: curPage
  }
  Student.findStudent({sno: req.session.student.sno}, (err, result) => {
    res.render('studentCreateNote', { title: '新建笔记', student: result[0], data: data });
  });
});


/* GET studentReadNote page. */
router.get('/read', function(req, res, next) {
  var curPage = req.query.page || 1;
  var data = {
    curPage: curPage
  }
  async.series([
    function(callback){
      Note.findNote({id: req.query.noteId}, (err, result)=>{
        callback(null, result);
      });
    },
    function(callback){
      Student.findStudent({sno: req.session.student.sno}, (err, result) => {
        callback(null, result);
      });
    }
  ], function(err, result){
    console.log(result);
    res.render('studentReadNote', { title: '查看笔记', student: result[1][0], note: result[0][0], data: data });
  });
});


/* GET studentEditNote page. */
router.get('/edit', function(req, res, next) {
  var curPage = req.query.page || 1;
  var data = {
    curPage: curPage
  }
  async.series([
    function(callback){
      Note.findNote({id: req.query.noteId}, (err, result)=>{
        callback(null, result);
      });
    },
    function(callback){
      Student.findStudent({sno: req.session.student.sno}, (err, result) => {
        callback(null, result);
      });
    }
  ], function(err, result){
    res.render('studentEditNote', { title: '编辑笔记', student: result[1][0], note: result[0][0], data: data});
  });
});

/* create note
 * -1 保存失败
 * 1  保存成功
 */
router.post('/create/save', function(req, res, next) {
  console.log(req.body);
  var note = new Note({
    id       : Date.now(),
    title    : req.body.title,
    content  : req.body.content,
    time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
    author   : req.body.user,
    uid      : req.body.uid,
    state    : false
  });

  note.save((error)=>{
    if(error){
      console.log(err);
      res.send({
        status: -1,
        msg: "保存失败"
      });
    }else{
      res.send({
        status: 1,
        msg: "保存成功"
      });
    }
  });
});

/* edit note
 * -1 保存失败
 * 1  保存成功
 */
router.post('/edit/save', function(req, res, next) {
  console.log(req.body);
  var condition = {id : req.body.id};
  var update = {$set : {title : req.body.title, content : req.body.content, time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')}};
  var options = {upsert : true};
  Note.updateNote(condition, update, options, (err)=>{
    if(err){
      console.log(err);
      res.send({
        status: -1,
        msg: "保存失败"
      });
    }else{
      res.send({
        status: 1,
        msg: "保存成功"
      });
    }
  });
});


/* delete note
 * -1 删除失败
 * 1  删除成功
 */
router.get('/delete', function(req, res, next) {
  console.log("删除");
  Note.deleteNote({id: req.query.noteId}, (err, result)=>{
    if(err){
      console.log(err);
      res.send({
        status: -1,
        msg: "删除失败"
      });
    }else{
      res.send({
        status: 1,
        msg: "删除成功"
      });
    }
  });
});

/**
 * select teacher
 */
router.get('/selectTeacher', function (req, res, next) {
  //获取教师信息的组合
  var getTeacherList = function(){
    console.log("这是getTearcherList函数");
    return new Promise((resolve, reject)=>{
      Teacher.aggregate([
          {
            $lookup:{
                from: "users",
                localField: "id",
                foreignField: "id",
                as: "user"
            }
          },
          {
              $project: {
                "id": 1,
                "tno": 1,
                "tname": 1,
                "state": "$user.state",
              }
          },
          {
            $unwind : "$state"
          },
          {
            $match: {state: true}
          }
      ],(err,result)=>{
        if (err) {
            console.log("getTearcherList error");
        }else{
            resolve(result);
        }
      });
    });
  }
  //返回给客户端组装好的数据
  var sendTeacherList = async function() {
    console.log("接收来自客户端的获取教师信息");
    var teacherList = await getTeacherList();
    res.render('selectTeacher', {teachers: teacherList});
  } 
  sendTeacherList();
});


/* submit note
 * -1 提交失败
 * 1  提交成功
 */
router.get('/submit', function(req, res, next) {
  console.log("提交");
  console.log(req.query);
  

  //获取笔记
  var getNote = function(noteId) {
    console.log("这是getNote函数");
    return new Promise((resolve, reject)=>{
      Note.findNote({id: noteId}, (error, result)=>{
        if (error) {
          console.log("getNote错误："+error);
        } else {
          resolve(result);
        }
      });
    });
  }

  var findSubmitted = function(note) {
    console.log("这是findSubmitted函数");
    return new Promise((resolve, reject)=>{
      Submitted.findSubmitted({id: note.id}, (error, result)=>{
        if (error) {
          console.log("findSubmitted错误:"+error);
        }else{
          resolve(result.length);
        }
      });
    });
  }

  var saveSubmitted = function(note, tno) {
    console.log("这是saveSubmitted函数");
    return new Promise((resolve, reject)=>{
      var submitted = new Submitted({
        id       : note.id,
        title    : note.title,
        content  : note.content,
        time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        author   : note.author,
        uid      : note.uid,
        tid      : tno
      });
      submitted.save((error)=>{
        if (error) {
          console.log("saveSubmitted错误:"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  var updateSubmitted = function(note, tno) {
    console.log("这是updateSubmitted函数");
    return new Promise((resolve, reject)=>{
      var condition = {id : note.id};
      var update = {
        $set : {
                  title    : note.title,
                  content  : note.content,
                  time     : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                  author   : note.author,
                  uid      : note.uid,
                  tid      : tno
                }
      };
      var options = {upsert : true};
      Submitted.updateNote(condition, update, options, (err)=>{
        if (error) {
          console.log("updateSubmitted错误:"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  var updateNote = function(noteId) {
    console.log("这是updateNote函数");
    return new Promise((resolve, reject)=>{
      var condition = {id : noteId};
      var update = {
        $set : { state: true }
      };
      var options = {upsert : true};
      Note.updateNote(condition, update, options, (error)=>{
        if (error) {
          console.log("updateNote错误:"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  //提交笔记
  var submitNote = async function() {
    console.log("这是submitNote函数");
    var note = await getNote(req.query.noteId);
    var find = await findSubmitted(note[0]);
    var flag = false;
    if(find) {
      flag = updateSubmitted(note[0], req.query.tno);
      if (flag) {
        var flag1 = updateNote(req.query.noteId)
        if (flag1) {
          res.send({
            status: 1,
            msg: "提交成功"
          });
        }else{
          Submitted.deleteSubmitted({id: req.query.noteId});
          res.send({
            status: -1,
            msg: "提交失败"
          });
        }
      } else {
        res.send({
          status: -1,
          msg: "提交失败"
        });
      }
    }else{
      flag = saveSubmitted(note[0], req.query.tno);
      if (flag) {
        var flag2 = updateNote(req.query.noteId)
        if (flag2) {
          res.send({
            status: 1,
            msg: "提交成功"
          });
        }else{
          Submitted.deleteSubmitted({id: req.query.noteId});
          res.send({
            status: -1,
            msg: "提交失败"
          });
        }
      } else {
        res.send({
          status: -1,
          msg: "提交失败"
        });
      }
    }
  }
  submitNote();
});


/* desubmit note
 * -1 撤销失败
 * 1  撤销成功
 */
router.get('/desubmit', function(req, res, next) {
  console.log("撤销提交");
  var updateNote = function(noteId) {
    console.log("这是updateNote函数");
    return new Promise((resolve, reject)=>{
      var condition = {id : noteId};
      var update = {
        $set : { state: false }
      };
      var options = {upsert : true};
      Note.updateNote(condition, update, options, (error)=>{
        if (error) {
          console.log("updateNote错误:"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  var desubmit = function(noteId) {
    console.log("这是desubmit函数");
    return new Promise((resolve, reject)=>{
      Submitted.deleteSubmitted({id: noteId}, (error)=>{
        if (error) {
          console.log("desubmit错误:"+error);
        }else{
          resolve(true);
        }
      });
    });
  }

  var deleteSubmitted = async ()=>{
    var flag = false;
    var flag1 = false;
    flag = await desubmit(req.query.noteId);
    if (flag) {
      flag1 = updateNote(req.query.noteId);
      if (flag1) {
        res.send({
          status: 1,
          msg: "撤销成功"
        });
      }else {
        res.send({
          status: -1,
          msg: "撤销失败"
        });
      }
    } else {
      res.send({
        status: -1,
        msg: "撤销失败"
      });
    }
  }
  
  deleteSubmitted();
});

router.post('/upload', function(req, res, next) {
  console.log("上传");
  var form = new multiparty.Form()
  form.parse(req, function(err, fields, files) {
      if(err) {
          console.log('上传失败', err)
      } else {
          console.log('文件列表', files)
          var file = files.filedata[0]
          // 读取流
          var read = fs.createReadStream(file.path)
          var newPath = '/uploads/images/' + file.originalFilename
          console.log(newPath);
          // 写入流
          var write = fs.createWriteStream('public' + newPath)
          // 管道流，图片写入指定目录
          read.pipe(write)
          write.on('close', function() {
            console.log('上传成功')
            res.send({err: '', msg: newPath})
          })
      }
  })
})


module.exports = router;
