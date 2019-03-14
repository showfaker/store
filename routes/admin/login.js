/**
 * Created by Administrator on 2019/1/11.
 */
var router = require('koa-router')();
var tools = require('../../model/tools.js');
var DB = require('../../model/db.js');
var svgCaptcha = require('svg-captcha');
/**
 * 登录界面
 */
router.get('/', async (ctx) => {
    await ctx.render('admin/login');
});
/**
 * 退出登录
 */
router.get('/getout', async (ctx) => {
    ctx.session.userinfo = null;
    ctx.redirect(ctx.state._host+'/admin/login');
});
/**
 * 获取信息登录后台管理
 */
router.post('/tologin', async (ctx) => {
    //console.log(ctx.request.body);
    let username = ctx.request.body.username;
    let password = tools.md5(ctx.request.body.password);
    let captcha = ctx.request.body.code;
    if (captcha.toLowerCase() == ctx.session.code.toLowerCase()) {
        let findName = await DB.find('admin', {"username": username});
        if (findName.length > 0){       //用户名存在
            let msg = await DB.find('admin', {"username": username, "password": password});
            if (msg.length > 0) {
                if (msg[0].status == 1) {//用户当前状态可使用
                    //console.log('成功');
                    ctx.session.userinfo = msg[0];
                    ctx.redirect(ctx.state._host + '/admin');
                    //更新用户登录时间
                    DB.update('admin', {"_id": DB.getObjectId(msg[0]._id)}, {
                        "time": new Date()
                    });
                } else {
                    await ctx.render('admin/error', {
                        message: '当前用户状态不可使用',
                        redirect: ctx.state._host+'/admin/login'
                    })
                }
            } else {

                await ctx.render('admin/error', {
                    message: '密码错误',
                    redirect: ctx.state._host+'/admin/login'
                })
            }
        } else {
            await ctx.render('admin/error', {
                message: '用户名不存在',
                redirect: ctx.state._host+'/admin/login'
            })
        }
    } else {
        ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state._host+'/admin/login'
        })
    }
});
router.get('/code', async (ctx) => {
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: "#cc9966"
    });
    ctx.session.code = captcha.text;
    console.log(ctx.session.code);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
    //req.session.captcha = captcha.text;
    //res.type('svg');
    //res.status(200).send(captcha.data);
});

module.exports = router.routes();