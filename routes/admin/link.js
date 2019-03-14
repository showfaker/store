var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');

/**
 * 跳转到友情链接管理
 * /admin/link/
 * 参数:
 * list:        列表信息
 * totalPages:  总页数
 * page:        当前页数
 */
router.get('/', async (ctx) => {
    var page = ctx.query.page || 1;
    var limit = 10;
    let count = await DB.count('link', {});
    let result = await DB.find('link', {}, {}, {
        page,
        limit,
        sortJson: {
            "add_time": -1
        }
    })
    var totalPages = Math.ceil(count/limit);
    await ctx.render('admin/link/index', {
        list: result,
        totalPages: totalPages,
        page: page
    })
});
/**
 * 跳转到添加友情链接
 * /admin/link/add
 */
router.get('/add', async (ctx) => {
    await ctx.render('admin/link/link-add')
});
/**
 * 增加友情链接
 * /admin/link/doAdd
 * 参数：
 * title:       标题
    pic         图片
    url         地址
    sort        排序
    status      状态
    add_time    添加时间
 */
router.post('/doAdd', tools.multer().single("pic"), async (ctx) => {
    try {
        let title = ctx.req.body.title;
        let url = ctx.req.body.url;
        let sort = ctx.req.body.sort;
        let status = ctx.req.body.status;
        let add_time = tools.getAddTime();
        let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
        var json = {
            title,pic,url,sort,status,add_time
        }
        let insertResult = await DB.insert('link', json);
        if (insertResult.result.ok) {
            ctx.redirect(ctx.state._host + '/admin/link')
        } else {
            await ctx.render('admin/error', {
                message: "添加数据失败",
                redirect: ctx.state._host + '/admin/link/add'
            })
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/link/add'
        })
    }
});
/**
 * 跳转到修改友情链接
 * /admin/link/edit?aid=
 */
router.get('/edit', async (ctx) => {
    let id = ctx.query.aid;
    let result = await DB.find('link', {"_id": DB.getObjectId(id)});
    await ctx.render('admin/link/link-edit', {
        list: result[0],
        prevPage: ctx.state._global.referer
    })
});
/**
 * 修改友情链接 
 * /admin/link/doEdit
 * 参数:
 * _id:         数据id
 * title:       标题
    pic:        图片
    url:        链接地址
    sort:       排序号
    status:     状态
    prevPage：  上个页面
 */
router.post('/doEdit', tools.multer().single("pic"), async (ctx) => {
    try {
        let id = ctx.req.body.id;
        let title = ctx.req.body.title;
        let url = ctx.req.body.url;
        let sort = ctx.req.body.sort;
        let status = ctx.req.body.status;
        let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
        let prevPage = ctx.req.body.prevPage;
        if (pic) {
            var json ={
                title,url,sort,status,pic
            }
        } else {
            var json ={
                title,url,sort,status
            }
        }
        let updateResult = await DB.update('link', {"_id": DB.getObjectId(id)}, json)
        if (updateResult.result.ok) {
            ctx.redirect(prevPage);
        } else {
            await ctx.render('admin/error', {
                message: '修改数据失败',
                redirect: ctx.state._host + '/admin/link'
            })
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/link'
        })
    }
});






module.exports = router.routes();