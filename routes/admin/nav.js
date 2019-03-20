/**
 * Created by Administrator on 2019/1/14.
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');

/**
 * 跳转到导航管理首页
 * /admin/nav
 */
router.get('/', async (ctx) => {
    var page = ctx.query.page || 1;
    var limit = 10;
    let count = await DB.count('nav', {});
    let result = await DB.find('nav', {}, {}, {
        page,
        limit
    });
    let totalPages = Math.ceil(count/limit);
    await ctx.render('admin/nav/index', {
        list: result,
        totalPages: totalPages,
        page: page
    })
});
/**
 * 跳转增加导航页面
 * /admin/nav/add
 */
router.get('/add', async (ctx) => {
    await ctx.render('admin/nav/nav-add')
});
/**
 * 增加导航
 * /admin/nav/doAdd
 */
router.post('/doAdd', async (ctx) => {
    try {
        var title = ctx.request.body.title;
        var url = ctx.request.body.url;
        var icon = ctx.request.body.icon;
        var sort = ctx.request.body.sort;
        var status = ctx.request.body.status;
        var add_time = tools.getAddTime();
        var json = {
            title,
            url,
            icon,
            sort,
            status,
            add_time
        }
        let addResult = await DB.insert('nav', json);
        if (addResult.result.ok) {
            ctx.redirect(ctx.state._host + '/admin/nav');
        } else {
            await ctx.render('admin/error', {
                message: '添加到数据库失败',
                redirect: ctx.state._host + '/admin/nav/add'
            });
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/nav/add'
        });
    }
});
/**
 * 跳转修改导航页面
 * /admin/nav/edit?aid=
 */
router.get('/edit', async (ctx) => {
    var id = ctx.query.aid;
    let result = await DB.find('nav', { "_id": DB.getObjectId(id)});
    await ctx.render('admin/nav/nav-edit', {
        list: result[0],
        prePage: ctx.state._global.referer
    })
});
/**
 * 修改导航
 * /admin/nav/doEdit
 */
router.post('/doEdit', async (ctx) => {
    try {
        var id = ctx.request.body.id;
        var title = ctx.request.body.title;
        var url = ctx.request.body.url;
        var icon = ctx.request.body.icon;
        var sort = ctx.request.body.sort;
        var status = ctx.request.body.status;
            let json = {
                title,
                url,
                sort,
                status
            };
            let updateResult = await DB.update('nav', { "_id": DB.getObjectId(id) }, json);
            if (updateResult.result.ok) {
                ctx.redirect(ctx.state._host + '/admin/nav');
            } else {
                await ctx.render('admin/error', {
                    message: '修改到数据库失败',
                    redirect: ctx.state._host + '/admin/nav'
                });
            }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/nav'
        });
    }
});

module.exports = router.routes();