//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 管理员 Schema
var adminSchema = new mongoose.Schema({
    id       : {type : Number},
    ano      : {type : String},
    aname    : {type : String}
});

// 添加管理员静态方法，静态方法在Model层就能使用
//查找
adminSchema.statics.findAdmin = function(condition, callback) {
    this.model('Admin').find(condition, callback);
}

//删除
adminSchema.statics.deleteAdmin = function(condition, callback) {
    this.model('Admin').deleteOne(condition, callback);
}

//批量删除
adminSchema.statics.deleteManyAdmin = function(condition, callback) {
    this.model('Admin').deleteMany(condition, callback);
}

//更新
adminSchema.statics.updateAdmin = function(condition, update, options, callback) {
    this.model('Admin').update(condition, update, options, callback);
}

//数量
adminSchema.statics.adminCount = function(condition, callback) {
    this.model('Admin').countDocuments(condition, callback);
}

// 管理员模型
var adminModel = db.model('Admin', adminSchema);

module.exports = adminModel;