//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 已提交实验笔记 Schema
var submittedSchema = new mongoose.Schema({
    id       : {type : Number},
    title    : {type : String},
    content  : {type : String},
    time     : {type : String},
    author   : {type : String},
    uid      : {type : String},
    tid      : {type : String}
});

// 添加已提交实验笔记静态方法，静态方法在Model层就能使用
//查找
submittedSchema.statics.findSubmitted = function(condition, callback) {
    this.model('Submitted').find(condition, callback);
}

//删除
submittedSchema.statics.deleteSubmitted = function(condition, callback) {
    this.model('Submitted').deleteOne(condition, callback);
}

//批量删除
submittedSchema.statics.deleteManySubmitted = function(condition, callback) {
    this.model('Submitted').deleteMany(condition, callback);
}

//更新
submittedSchema.statics.updateSubmitted = function(condition, update, options, callback) {
    this.model('Submitted').update(condition, update, options, callback);
}

//数量
submittedSchema.statics.submittedCount = function(condition, callback) {
    this.model('Submitted').countDocuments(condition, callback);
}

// 笔记模型
var submittedModel = db.model('Submitted', submittedSchema);

module.exports = submittedModel;