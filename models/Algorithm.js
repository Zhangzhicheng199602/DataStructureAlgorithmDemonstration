//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 算法 Schema
var algorithmSchema = new mongoose.Schema({
    id       : {type : Number},
    znname   : {type : String},
    enname   : {type : String, default: "null"},
    path     : {type : String},
    describe : {type : String, default: "无描述"},
    folder   : {type : String},
    author   : {type : String},
    time     : {type : String},
    uid      : {type : String},
    state    : {type : Boolean, default: false}
});

// 添加算法静态方法，静态方法在Model层就能使用
//查找
algorithmSchema.statics.findAlgorithm = function(condition, callback) {
    this.model('Algorithm').find(condition, callback);
}

//删除
algorithmSchema.statics.deleteAlgorithm = function(condition, callback) {
    this.model('Algorithm').deleteOne(condition, callback);
}

//批量删除
algorithmSchema.statics.deleteManyAlgorithm = function(condition, callback) {
    this.model('Algorithm').deleteMany(condition, callback);
}

//更新
algorithmSchema.statics.updateAlgorithm = function(condition, update, options, callback) {
    this.model('Algorithm').update(condition, update, options, callback);
}

//数量
algorithmSchema.statics.algorithmCount = function(condition, callback) {
    this.model('Algorithm').countDocuments(condition, callback);
}

var algorithmModel = db.model('Algorithm', algorithmSchema);

module.exports = algorithmModel;