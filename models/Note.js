//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 实验笔记 Schema
var noteSchema = new mongoose.Schema({
    id       : {type : Number},
    title    : {type : String},
    content  : {type : String},
    time     : {type : String},
    author   : {type : String},
    uid      : {type : String},
    state    : {type : Boolean}
});

// 添加实验笔记静态方法，静态方法在Model层就能使用
//查找
noteSchema.statics.findNote = function(condition, callback) {
    this.model('Note').find(condition, callback);
}

//删除
noteSchema.statics.deleteNote = function(condition, callback) {
    this.model('Note').deleteOne(condition, callback);
}

//批量删除
noteSchema.statics.deleteManyNote = function(condition, callback) {
    this.model('Note').deleteMany(condition, callback);
}

//更新
noteSchema.statics.updateNote = function(condition, update, options, callback) {
    this.model('Note').update(condition, update, options, callback);
}

//数量
noteSchema.statics.noteCount = function(condition, callback) {
    this.model('Note').countDocuments(condition, callback);
}

// 笔记模型
var noteModel = db.model('Note', noteSchema);

module.exports = noteModel;