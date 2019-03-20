/**
 * Created by Administrator on 2019/1/10.
 */
var Router = require('koa-router')();
var index = require('./admin/index');   //后台公共ajax请求接口
var banner = require('./admin/banner'); //轮播图模块
var manage = require('./admin/manage'); //管理员模块
var login = require('./admin/login');   //登录模块
var articlecate = require('./admin/articlecate');   //分类模块
var article = require('./admin/article');   //内容管理模块
var link = require('./admin/link');     //友情链接模块
var nav = require('./admin/nav');       //导航模块
var setting = require('./admin/setting');   //系统设置模块
var customer = require('./admin/customer');   //用户管理模块
var connect = require('./admin/connect');   //评论管理模块
var url = require('url');
const ueditor = require('koa2-ueditor');//ueditor模块 富文本编辑器
var DB = require('../model/db');        //数据库操作封装模块
//配置中间件 获取url
Router.use(async (ctx, next) => {
    /**
     * https配置
     */
    ctx.set('Access-Control-Allow-Origin', 'null');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    //友情链接、导航管理、用户管理、评论管理数据条
    let link_count = await DB.count('link', {});
    let nav_count = await DB.count('nav', {});
    let customer_count = await DB.count('customer', {});
    let connect_count = await DB.count('connect', {});
    ctx.state.linkNum = link_count || 0;
    ctx.state.navNum = nav_count || 0;
    ctx.state.customerNum = customer_count || 0;
    ctx.state.connectNum = connect_count || 0;
    ctx.state._host = 'http://' + ctx.request.header.host;
    let pathname = url.parse(ctx.request.url).pathname.substring(1);
    /**
     * Url {
        protocol: null,
        slashes: null,
        auth: null,
        host: null,
        port: null,
        hostname: null,
        hash: null,
        search: null,
        query: null,
        pathname: '/',
        path: '/',
        href: '/' }
     */
    let splitUrl = pathname.split('/');
    /*
    **********************************!!!!!!!!!!!!!!!开发模式!!!!!!!!!!!!!!!**********************************
    */
    // ctx.session.userinfo = {
    //     username: "admin"
    // }
    //全局对象信息
    ctx.state._global = {
        url: splitUrl,
        userinfo: ctx.session.userinfo,
        referer:ctx.request.headers['referer']
    };
    if (ctx.session.userinfo) {
        await next();
    } else {
        pathname == 'admin/login' || pathname == 'admin/login/tologin' || pathname == 'admin/login/code' ? await next() : ctx.redirect('admin/login');
    }
});
Router.use(index);
Router.use('/banner',banner);
Router.use('/login', login);
Router.use('/manage', manage);
Router.use('/articlecate',articlecate);
Router.use('/article', article);
Router.use('/link', link);
Router.use('/nav', nav);
Router.use('/setting', setting);
Router.use('/customer', customer);
Router.use('/connect', connect);
// 需要传一个数组：静态目录和 UEditor 配置对象
// 比如要修改上传图片的类型、保存路径
Router.all('/editor/controller', ueditor(['static', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg",".bmp"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]));



module.exports = Router;