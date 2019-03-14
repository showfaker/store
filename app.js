const Koa = require('koa'),//koa模块框架
    Router = require('koa-router')(),//koa路由模块
    render = require('koa-art-template'),//渲染模块
    bodyParser = require('koa-bodyparser'),//koa-bodyparser模块
    static = require('koa-static'),//静态资源库模块
    session = require('koa-session'),//session中间件
    sd = require('silly-datetime'),//时间拓展模块
    jsonp = require('koa-jsonp'),//koa-jsonp模块
    path = require('path');//nodejs配置模块
//引入子模块
var admin = require('./routes/admin.js');//后台管理
var api = require('./routes/api.js');//api接口管理
var index = require('./routes/index.js');//前台管理
var app = new Koa();

//配置jsonp callback
app.use(jsonp());
//配置session 中间件
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa-sess',
    maxAge: 646000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,  /*每次请求都会重新设置session*/
    renew: false
};
app.use(session(CONFIG, app));
//配置中间件及静态资源库
app.use(bodyParser());
//app.use(static('.'));         /*不安全*/
app.use(static(__dirname + '/static'));
//配置模块
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){return sd.format(value, 'YYYY-MM-DD HH:mm');} /*扩展模板里面的方法*/
});
//启动路由
app.use(Router.routes()).use(Router.allowedMethods());
Router.use(index);
Router.use('/admin', admin.routes());
Router.use('/api', api.routes());
app.listen(8006, () => {
    console.log('node.js serve start');
});

