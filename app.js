//引包
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//引入session模块
var session = require('express-session');

//引入路由文件
var indexRouter = require('./routes/index');
var studentRouter = require('./routes/students');
var teacherRouter = require('./routes/teachers');
var adminRouter = require('./routes/admins');
var studentNoteRouter = require('./routes/studentNote');
var teacherNoteRouter = require('./routes/teacherNote');
var studentInformationRouter = require('./routes/studentInformation');
var teacherInformationRouter = require('./routes/teacherInformation');
var adminInformationRouter = require('./routes/adminInformation');
var studentAlgorithmRouter = require('./routes/studentAlgorithm');
var teacherAlgorithmRouter = require('./routes/teacherAlgorithm');
var teacherEditorAlgorithmRouter = require('./routes/teacherEditorAlgorithm');
var teacherCreateAlgorithmRouter = require('./routes/teacherCreateAlgorithm');
var adminUserManagementRouter = require('./routes/adminUserManagement');
var adminNoteManagementRouter = require('./routes/adminNoteManagement');
var adminAlgorithmManagementRouter = require('./routes/adminAlgorithmManagement');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session配置
app.use(session({
  secret: 'algorithm-visualizer',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000*60*60 }  // 指定session的有效时长，单位是毫秒值
}))

//请求拦截
app.get('/student/*', function(req, res, next){
  if (req.session.student) {
    var login = req.session.student.login || false;
    if (!login) {
      return res.redirect('/student')
    }
  } else {
    return res.redirect('/student')
  }
  next();
});

app.get('/teacher/*', function(req, res, next){
  if (req.session.teacher) {
    var login = req.session.teacher.login || false;
    if (!login) {
      return res.redirect('/teacher')
    }
  } else {
    return res.redirect('/teacher')
  }
  next();
});

app.get('/admin/*', function(req, res, next){
  if (req.session.admin) {
    var login = req.session.admin.login || false;
    if (!login) {
      return res.redirect('/admin')
    }
  } else {
    return res.redirect('/admin')
  }
  next();
});

app.use('/', indexRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);
app.use('/admin', adminRouter);
app.use('/student/note', studentNoteRouter);
app.use('/teacher/note',teacherNoteRouter);
app.use('/student/information',studentInformationRouter);
app.use('/teacher/information',teacherInformationRouter);
app.use('/admin/information',adminInformationRouter);
app.use('/student/algorithm',studentAlgorithmRouter);
app.use('/teacher/algorithm',teacherAlgorithmRouter);
app.use('/teacher/teacherEditorAlgorithm',teacherEditorAlgorithmRouter);
app.use('/teacher/teacherCreateAlgorithm',teacherCreateAlgorithmRouter);
app.use('/admin/userManagement',adminUserManagementRouter);
app.use('/admin/noteManagement',adminNoteManagementRouter);
app.use('/admin/algorithmManagement',adminAlgorithmManagementRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
