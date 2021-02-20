//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 学生 Schema
var studentSchema = new mongoose.Schema({
    id       : {type : Number},
    sno      : {type : String},
    sname    : {type : String},
    sclass   : {type : String}
});

// 添加学生静态方法，静态方法在Model层就能使用
//查找
studentSchema.statics.findStudent = function(condition, callback) {
    this.model('Student').find(condition, callback);
}

//删除
studentSchema.statics.deleteStudent = function(condition, callback) {
    this.model('Student').deleteOne(condition, callback);
}

//批量删除
studentSchema.statics.deleteManyStudent = function(condition, callback) {
    this.model('Student').deleteMany(condition, callback);
}

//更新
studentSchema.statics.updateStudent = function(condition, update, options, callback) {
    this.model('Student').update(condition, update, options, callback);
}

//数量
studentSchema.statics.studentCount = function(condition, callback) {
    this.model('Student').countDocuments(condition, callback);
}

// 学生模型
var studentModel = db.model('Student', studentSchema);

module.exports = studentModel;