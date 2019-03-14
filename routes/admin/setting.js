/**
 * Created by Administrator on 2019/1/14.
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');
var tools = require('../../model/tools.js');

/**
 * 跳转到系统设置首页
 * /admin/setting
 */
router.get('/', async (ctx) => {
    let result = await DB.find('setting', {});
    await ctx.render('admin/setting/index', {
        list: result[0]
    })
});
/**
 * 修改系统设置
 * /admin/setting/doEdit
 * site_title
 * site_logo
 * site_keywords
 * site_description
 * site_icp
 * site_qq
 * site_tel
 * site_address
 * site_status
 */
router.post('/doEdit', tools.multer().single("site_logo"), async (ctx) => {
    try {
        var site_title = ctx.req.body.site_title;
        var site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : '';
        var site_keywords = ctx.req.body.site_keywords;
        var site_description = ctx.req.body.site_description;
        var site_icp = ctx.req.body.site_icp;
        var site_qq = ctx.req.body.site_qq;
        var site_tel = ctx.req.body.site_tel;
        var site_address = ctx.req.body.site_address;
        var site_status = ctx.req.body.site_status;
        if (site_logo) {
            var json = {
                site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status
            }
        } else {
            var json = {
                site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status
            }
        };
        let updateResult = await DB.update('setting', {}, json);
        if (updateResult.result.ok) {
            ctx.redirect(ctx.state._host + '/admin/setting');
        } else {
            await ctx.render('admin/error', {
                message: '修改系統設置失败',
                redirect: ctx.state._host + '/admin/setting'
            });
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/setting'
        });
    }
});

module.exports = router.routes();