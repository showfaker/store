var router = require('koa-router')();
var DB = require('../../model/db');
var tools = require('../../model/tools');

/**
 * 用户管理首页
 */
router.get('/', async (ctx) => {
    let page = ctx.query.page || 1;
    let limit = 10;
    let count = await DB.count('customer', {});
    let result = await DB.find('customer', {}, {}, {
        page,limit
    })
    await ctx.render('admin/customer/index', {
        list: result,
        page: page,
        totalPages: Math.ceil(count/limit)
    });
});

/**
 * 增加用户界面
 */
router.get('/add', async (ctx) => {
    await ctx.render('admin/customer/customer-add');
});

/**
 * 增加用户
 * @param{
 *  cusname:    账户名称
 *  nickname:   昵称
 *  password:   密码
 *  pic:        头像
 *  telephone:  手机号码
 *  status:     状态
 *  income:     游戏币
 *  add_time:   注册时间
 *  log_time:   最新登陆时间
 * }
 */
router.post('/doAdd', tools.multer().single('pic') , async (ctx) => {
    try {
        let cusname = ctx.req.body.cusname;
        let nickname = ctx.req.body.nickname;
        let password = tools.md5("123456");
        let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';
        let telephone = ctx.req.body.telephone;
        let status = "1";
        let income = 100;
        let add_time = tools.getAddTime();
        let log_time = tools.getAddTime();
        let findResult = await DB.find('customer', {"cusname": cusname});
        
        if (findResult.length > 0) {//已存在当前用户的信息，则改变填写的名称、昵称、图片和手机号码
            let updateResult = await DB.update('customer', {"_id": findResult[0]._id}, {
                cusname,
                nickname,
                pic,
                telephone
            });
        } else {//不存在则增加用户
            let insertResult = await DB.insert('customer', {
                cusname,
                nickname,
                password,
                pic,
                telephone,
                income,
                status,
                add_time,
                log_time
            });
    
        }
        ctx.redirect(ctx.state._host + '/admin/customer');
    } catch(err) {
        await ctx.render('admin/error', {
            message: err,
            redirect: ctx.state._host + '/admin/customer'
        })
    }
});





module.exports = router.routes();