//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 教师 Schema
var teacherSchema = new mongoose.Schema({
    id       : {type : Number},
    tno      : {type : String},
    tname    : {type : String}
});

// 添加管理员静态方法，静态方法在Model层就能使用
//查找
teacherSchema.statics.findTeacher = function(condition, callback) {
    this.model('Teacher').find(condition, callback);
}

//删除
teacherSchema.statics.deleteTeacher = function(condition, callback) {
    this.model('Teacher').deleteOne(condition, callback);
}

//批量删除
teacherSchema.statics.deleteManyTeacher = function(condition, callback) {
    this.model('Teacher').deleteMany(condition, callback);
}

//更新
teacherSchema.statics.updateTeacher = function(condition, update, options, callback) {
    this.model('Teacher').update(condition, update, options, callback);
}

//数量
teacherSchema.statics.teacherCount = function(condition, callback) {
    this.model('Teacher').countDocuments(condition, callback);
}

// 管理员模型
var teacherModel = db.model('Teacher', teacherSchema);

module.exports = teacherModel;