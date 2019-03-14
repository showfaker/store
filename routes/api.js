/**
 * Created by Administrator on 2019/1/10.
 */
var Router = require('koa-router')();

Router.get('/', (ctx) => {
    ctx.body = 'api接口管理';
});
module.exports = Router;