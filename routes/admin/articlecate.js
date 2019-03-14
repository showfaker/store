/**
 * Created by Administrator on 2019/1/14.
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');

/**
 * 跳转分类管理首页
 * /admin/articlecate
 */
router.get('/', async (ctx) => {
    let result = await DB.find('articlecate', {});
    let list = tools.cateToList(result);
    await ctx.render('admin/articlecate/index', {
        list: list
    })
});
/**
 * 跳转增加分类页面
 * /admin/articlecate/add
 */
router.get('/add', async (ctx) => {
    //查找一级分类
    let result = await DB.find('articlecate', { "pid": "0" });
    await ctx.render('admin/articlecate/articleAdd', {
        catelist: result
    })
});
/**
 * 增加分类
 * /admin/articlecate/doAdd
 */
router.post('/doAdd', async (ctx) => {
    try {
        var title = ctx.request.body.title;
        var pid = ctx.request.body.pid;
        var keywords = ctx.request.body.keywords;
        var status = ctx.request.body.status;
        var description = ctx.request.body.description;
        // if (title == '' || keywords == '' || description == '') {
        //     await ctx.render('admin/error', {
        //         message: '需要输入的文本框不能为空',
        //         redirect:ctx.state._host+'/admin/articlecate/add'
        //     });
        // } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\-_]{2,8}$/g.test(title)) {
        //     await ctx.render('admin/error', {
        //         message: '请输入2-8位分类名称(可以是汉字、字母或数字)',
        //         redirect:ctx.state._host+'/admin/articlecate/add'
        //     });
        // } else {
        let json = {
            title,
            pid,
            keywords,
            status,
            description,
            add_time: new Date()
        }
        let addResult = await DB.insert('articlecate', json);
        if (addResult.result.ok) {
            ctx.redirect(ctx.state._host + '/admin/articlecate');
        } else {
            await ctx.render('admin/error', {
                message: '添加到数据库失败',
                redirect: ctx.state._host + '/admin/articlecate/add'
            });
        }
        // }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/articlecate/add'
        });
    }
});
/**
 * 跳转修改分类页面
 * /admin/articlecate/edit?aid=
 */
router.get('/edit', async (ctx) => {
    var id = ctx.query.aid;
    let findResult = await DB.find('articlecate', { "_id": DB.getObjectId(id) });
    let result = await DB.find('articlecate', { "pid": "0" });
    await ctx.render('admin/articlecate/articleEdit', {
        list: findResult[0],
        catelist: result
    })
});
/**
 * 修改分类
 * /admin/articlecate/doEdit
 */
router.post('/doEdit', async (ctx) => {
    try {
        var id = ctx.request.body.id;
        var title = ctx.request.body.title;
        var pid = ctx.request.body.pid;
        var keywords = ctx.request.body.keywords;
        var status = ctx.request.body.status;
        var description = ctx.request.body.description;
        if (title == '' || keywords == '' || description == '') {
            await ctx.render('admin/error', {
                message: '需要输入的文本框不能为空',
                redirect: ctx.state._host + '/admin/articlecate/edit?aid=' + id
            });
        } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9\-_]{2,8}$/g.test(title)) {
            await ctx.render('admin/error', {
                message: '请输入2-8位分类名称(可以是汉字、字母或数字)',
                redirect: ctx.state._host + '/admin/articlecate/edit?aid=' + id
            });
        } else {
            let json = {
                title,
                pid,
                keywords,
                status,
                description
            };
            let updateResult = await DB.update('articlecate', { "_id": DB.getObjectId(id) }, json);
            if (updateResult.result.ok) {
                ctx.redirect(ctx.state._host + '/admin/articlecate');
            } else {
                await ctx.render('admin/error', {
                    message: '修改到数据库失败',
                    redirect: ctx.state._host + '/admin/articlecate'
                });
            }
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/articlecate'
        });
    }
});

module.exports = router.routes();