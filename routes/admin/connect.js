var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools');

/**
 * 评论管理首页
 */
router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let limit = 10;
    let count = await DB.count('connect', {});
    let result = await DB.find('connect', {}, {}, {
        page,limit,
        sortJson: {
            "add_time": -1
        }
    })
    await ctx.render('admin/connect/index', {
        list: result,
        page: page,
        totalPages: Math.ceil(count/limit)
    });
});

/**
 * 修改评论界面
 */
router.get('/edit', async (ctx) => {
    await ctx.render('admin/connect/connect-add');
});

module.exports = router.routes();