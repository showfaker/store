/**
 * Created by Administrator on 2019/1/10.
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');


/**
 * 跳转到轮播图管理首页
 * /admin/banner
 * 参数:
 * list:        列表信息
 * totalPages:  总页数
 * page:        当前页数
 */
router.get('/', async (ctx) => {
    var page = ctx.query.page || 1;
    var limit = 10;
    var json = {
        page,
        limit,
        sortJson:{
            "add_time": -1
        }
    }
    let result = await DB.find('banner', {}, {}, json);
    let count = await DB.count('banner', {});
    var totalPages = Math.ceil(count/limit);
    await ctx.render('admin/banner/index', {
        list: result,
        totalPages: totalPages,
        page: page
    })
});
/**
 * 跳转到添加轮播图首页
 * /admin/banner/add
 */
router.get('/add', async (ctx) => {
    await ctx.render('admin/banner/banner-add')
});
/**
 * 添加轮播图
 * /admin/banner/doAdd
 * 参数：
 *  title:  标题名称
    url:    路径地址
    pic:    图片
    status: 状态
    sort:   排序
    add_time:   新增时间
 */
router.post('/doAdd', tools.multer().single("pic"), async (ctx) => {
    let title = ctx.req.body.title;
    let url = ctx.req.body.url;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) :'';
    let status = ctx.req.body.status;
    let sort = ctx.req.body.sort;
    let add_time = tools.getAddTime();
    let json = {
        title,url,pic,status,sort,add_time
    }
    let insertResult = await DB.insert('banner', json);
    if (insertResult.result.ok) {
        ctx.redirect(ctx.state._host + '/admin/banner');
    } else {
        await ctx.render('admin/error', {
            message: '添加到数据库失败',
            redirect:ctx.state._host+'/admin/banner/add'
        });
    }
});
/**
 * 跳转到编辑轮播图页面
 * /admin/banner/edit
 */
router.get('/edit', async (ctx) => {
    let id = ctx.query.aid;
    let result = await DB.find('banner', {"_id": DB.getObjectId(id)});
    await ctx.render('admin/banner/banner-edit', {
        list: result[0],
        prevPage: ctx.state._global.referer
    })
});
/**
 * 修改轮播图页面
 * /admin/banner/doEdit
 * 参数:
 * id
 * title
 * pic
 * url
 * sort
 * status
 * prevPage
 */
router.post('/doEdit', tools.multer().single("pic"), async (ctx) => {
    let id = ctx.req.body.id;
    let title = ctx.req.body.title;
    let prevPage = ctx.req.body.prevPage;
    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let url = ctx.req.body.url;
    let sort = ctx.req.body.sort;
    let status = ctx.req.body.status;
    if (pic) {
        var json = {
            title,pic,url,sort,status
        }
    } else {
        var json = {
            title,url,sort,status
        }
    }
    let updateResult = await DB.update('banner', {"_id": DB.getObjectId(id)}, json);
    if (updateResult.result.ok) {
        ctx.redirect(prevPage);
    } else {
        await ctx.render('admin/error', {
            message: '修改到数据库失败',
            redirect:ctx.state._host+'/admin/banner'
        });
    }
});

module.exports = router.routes();