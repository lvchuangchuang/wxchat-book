const Koa = require('koa');
const koaJson = require('koa-json');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const http = require('http');
const fs = require('fs');
const async = require('async');
const query = require('./config/mysql.js');
// const logger = require("koa-logger");

const app = new Koa();

app.use(bodyParser());
app.use(koaJson());
// 注册日志
// app.use(logger());

app.use(async function(ctx, next) {
    ctx.execSql = query;
    await next();
});

// routes
fs.readdirSync(path.join(__dirname, 'routes')).forEach(function(file) {
    if (file.indexOf('.js') !== -1) {
        const route = require(path.join(__dirname, 'routes', file)).routes();
        app.use(route);  // 由于readdirSync方法返回一个包含所有文件和子目录的数组，您可能需要检查每个文件是否为JS文件，以避免出现其他类型的文件和目录。
    }
});

app.use(function(ctx, next) {
    ctx.redirect('/404.html');
});

app.on('error', function(error, ctx) {
    console.log('something error: ' + JSON.stringify(ctx.onerror));
    ctx.redirect('/500.html');
});

http.createServer(app.callback())
    .listen(8000)
    .on('listening', function() {
        console.log('服务器监听端口: ' + 8000);
    });