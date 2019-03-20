/**
 * Created by Administrator on 2019/1/15.
 */
var router = require('koa-router')();   //koa路由模块
var DB = require('../../model/db.js');  //数据库封装模块
var tools = require('../../model/tools.js');  //工具封装模块

/**
 * 跳转到内容管理
 * /admin/article
 */
router.get('/', async (ctx) => {
    var page = ctx.query.page || 1;
    var limit = 10;
    var count = await DB.count('article', {});
    var result = await DB.find('article', {}, {}, {
        page,
        limit,
        sortJson:{
            'add_time': -1
        }
    });
    var totalPages = Math.ceil(count/limit);
    await ctx.render('admin/article/index', {
        list: result,
        page:page,
        totalPages: totalPages
    })
});
/**
 * 跳转到增加内容
 * admin/article/add
 */
router.get('/add', async (ctx) => {
    var result = await DB.find('articlecate', {});
    var catelist = tools.cateToList(result);
    await ctx.render('admin/article/article-add', {
        catelist: catelist
    });
});
/**
 * 添加内容
 * admin/article/doAdd
 * 参数：
 * pid      级别id
 * catename 级别名称
 * title    标题
 * author   作者名
 * status   状态
 * is_best  是否精品
 * is_hot   是否最热
 * is_new   是否最新
 * keywords 密码号
 * description  文章描述
 * content      内容
 * img_url      图片地址
 */
router.post('/doAdd', tools.multer().single('img_url'), async (ctx) => {
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file ? ctx.req.file.path.substr(7) :'';
    let add_time = tools.getAddTime();
    var json={
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
    };
    let result = await DB.insert('article', json);
    ctx.redirect(ctx.state._host + '/admin/article');
});
/**
 * 跳转到修改内容
 * admin/article/edit
 */
router.get('/edit', async (ctx) => {
    var id = ctx.query.aid;
    let result = await DB.find('article', {"_id": DB.getObjectId(id)});
    var findResult = await DB.find('articlecate', {});
    var catelist = tools.cateToList(findResult);
    await ctx.render('admin/article/article-edit', {
        catelist: catelist,
        list: result[0],
        prevPage: ctx.state._global.referer
    })
});
/**
 * 修改内容
 * /admin/article/doEdit
 * id           数据id
 * pid          级别id
 * catename     级别名称
 * title        标题
 * author       作者名
 * status       状态
 * is_best      是否精品
 * is_hot       是否最热
 * is_new       是否最新
 * keywords     密码号
 * description  文章描述
 * content      内容
 * img_url      图片地址
 * prevPage     上一个页面地址
 * add_time     更新时间
 */
router.post('/doEdit', tools.multer().single("img_url"), async (ctx) => {
    var pid = ctx.req.body.pid;
    var catename = ctx.req.body.catename.trim();
    var id = ctx.req.body.id;
    var title = ctx.req.body.title.trim();
    var author = ctx.req.body.author.trim();
    var status = ctx.req.body.status;
    var is_best = ctx.req.body.is_best;
    var is_hot = ctx.req.body.is_hot;
    var is_new = ctx.req.body.is_new;
    var keywords = ctx.req.body.keywords;
    var description = ctx.req.body.description;
    var content = ctx.req.body.content || '';
    var prevPage = ctx.req.body.prevPage;
    let img_url = ctx.req.file ? ctx.req.file.path.substr(7) : '';
    let add_time = tools.getAddTime();
    if (img_url) {
        var json = {
            catename,pid,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
        };
    } else {
        var json = {
            catename,pid,title,author,status,is_best,is_hot,is_new,keywords,description,content,add_time
        };
    }

    let updateResult = await DB.update('article', {"_id": DB.getObjectId(id)}, json);
    if (prevPage) {
        ctx.redirect(prevPage);
    } else {
        ctx.redirect(ctx.state._host + '/admin/article');
    }
});



module.exports = router.routes();