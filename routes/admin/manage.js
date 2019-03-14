/**
 * Created by Administrator on 2019/1/10.
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');

router.get('/', async (ctx) => {
    let list = await DB.find('admin', {});
    await ctx.render('admin/manage/index', {
        list: list
    })
});
router.get('/add', async (ctx) => {
    await ctx.render('admin/manage/maAdd');
});
/**
 * 添加管理员
 * http://localhost:8006/admin/manage/manageAdd
 */
router.post('/manageAdd', async (ctx) => {
    /**
     * 1.获取输入的信息    ctx.request.body
     * 2.校验信息是否正确
     * 3.在数据库中查看是否存在
     * 4.insert信息
     */
    try{
        var username = ctx.request.body.username;
        var password = ctx.request.body.password;
        var rpassword = ctx.request.body.rpassword;
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9\-_]{4,12}$/g.test(username)) {
            await ctx.render('admin/error',{
                message:'请输入4-12位用户名(仅限文字、字母、数字,_-)',
                redirect:ctx.state._host+'/admin/manage/add'
            })
        } else if (!/^[a-zA-Z0-9]{6,14}$/.test(password) || password.length < 6) {
            await ctx.render('admin/error',{
                message:'密码格式输入不正确(仅限6位以上的文字、字母、数字)',
                redirect:ctx.state._host+'/admin/manage/add'
            })
        } else if (password != rpassword) {
            await ctx.render('admin/error',{
                message:'密码和确认密码不一致',
                redirect:ctx.state._host+'/admin/manage/add'
            })
        } else {
            let result = await DB.find('admin', {"username": username});
            if (result.length > 0) {
                await ctx.render('admin/error',{
                    message:'用户已存在，请重新输入用户名',
                    redirect:ctx.state._host+'/admin/manage/add'
                })
            } else {
                let pwd = tools.md5(password);
                let addResult = await DB.insert('admin', {"username":username, "password":pwd, "status":1,"time":new Date()});
                ctx.redirect(ctx.state._host+'/admin/manage');
            }
        }
    } catch(err) {
        await ctx.render('admin/error',{
            message: err,
            redirect:ctx.state._host+'/admin/manage/add'
        })
    }
});
 router.get('/edit', async (ctx) => {
     //console.log(ctx.query);
     let id = ctx.query.aid;
     let result = await DB.find('admin', DB.getObjectId(id));
     //console.log(result);
     await ctx.render('admin/manage/maEdit', {
         list: result[0]
     })
 });
router.post('/manageEdit', async (ctx) => {
    try {
        var id = ctx.request.body._id;
        //let username = ctx.request.body.username;
        var password = ctx.request.body.password;
        var rpassword = ctx.request.body.rpassword;
        if (password != '') {
            if (!/^[a-zA-Z0-9]{6,14}$/.test(password) || password.length < 6) {
                await ctx.render('admin/error',{
                    message:'密码格式输入不正确(仅限6位以上的文字、字母、数字)',
                    redirect:ctx.state._host+'/admin/manage/edit?aid='+id
                })
            } else if (password != rpassword) {
                await ctx.render('admin/error',{
                    message:'密码和确认密码不一致',
                    redirect:ctx.state._host+'/admin/manage/edit?aid='+id
                })
            } else {
                let updateResult = await DB.update('admin', {"_id": DB.getObjectId(id)}, {"password": tools.md5(password)});
                ctx.redirect(ctx.state._host+'/admin/manage');
            }
        } else {
            ctx.redirect(ctx.state._host+'/admin/manage');
        }
    } catch(err) {
        await ctx.render('admin/error',{
            message: err,
            redirect:ctx.state._host+'/admin/manage'
        })
    }
});

module.exports = router.routes();
