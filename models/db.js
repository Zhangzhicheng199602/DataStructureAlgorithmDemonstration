//引包
var mongoose = require('mongoose');

//连接数据库
mongoose.connect('mongodb://localhost/DB_DSAV', {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// 数据库连接成功
db.once('open', () => {
    console.log("数据库连接成功");
});

// 数据库连接断开
db.once('disconnected', function () {
    console.log('数据库连接断开');
});

module.exports = db;