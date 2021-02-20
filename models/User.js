//引包
var mongoose = require('mongoose');
var db = require('./db.js');

// 用户 Schema
var userSchema = new mongoose.Schema({
    id       : {type : Number},
    username : {type : String},
    password : {type : String},
    character: {type : String},
    state    : {type : Boolean}
});

// 添加用户静态方法，静态方法在Model层就能使用
//查找
userSchema.statics.findUser = function(condition, callback) {
    this.model('User').find(condition, callback);
}

//删除
userSchema.statics.deleteUser = function(condition, callback) {
    this.model('User').deleteOne(condition, callback);
}

//批量删除
userSchema.statics.deleteManyUser = function(condition, callback) {
    this.model('User').deleteMany(condition, callback);
}

//更新
userSchema.statics.updateUser = function(condition, update, options, callback) {
    this.model('User').update(condition, update, options, callback);
}

//数量
userSchema.statics.userCount = function(condition, callback) {
    this.model('User').countDocuments(condition, callback);
}

// 用户模型
var userModel = db.model('User', userSchema);

module.exports = userModel;