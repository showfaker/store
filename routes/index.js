/**
 * Created by Administrator on 2019/1/10.
 * 前端后台管理
 */
var router = require('koa-router')();//koa路由模块
var DB = require('../model/db');//数据库封装模块
var tools = require('../model/tools');//工具模块
const url = require('url');//nodeJS URL路径模块
var svgCaptcha = require('svg-captcha');//验证码插件

//配置中间件
router.use(async (ctx, next) => {
    ctx.state._host = 'http://' + ctx.request.header.host;//当前网址
    // console.log(ctx.session);
    //查询数据库里面的导航栏数据
    let result = await DB.find('nav', {$or:[{"status": 1}, {"status": "1"}]}, {}, {
        sortJson: {
            "sort": 1
        }
    })
    ctx.state.nav = result;//头部导航栏显示当前地址
    let pathname = url.parse(ctx.request.url).pathname;//头部路由判断
    for (let i = 0; i < result.length; i++){//通过url找到标题
        if (pathname == result[i].url) {
            ctx.state.activeUrl = result[i].title
        }
    }
    ctx.state.pathname = pathname;//路径判断
    if (ctx.session.customerInfo){//客户是否登录
        ctx.state.client = ctx.session.customerInfo.cusname;
    }
    //系统设置的网站备案号、qq、e-mai、地址
    let settingResult = await DB.find("setting", {});
    ctx.state.setting = settingResult[0]
    await next()
});
/**
 * 跳转到前台首页
 */
router.get('/', async (ctx) => {
    //系统设置的标题、logo图、关键字、描述
    let settingResult = await DB.find("setting", {});
    // console.log(settingResult[0]);
    //查询轮播图数据
    let bannerResult = await DB.find("banner", {$or:[{"status": 1}, {"status": "1"}]}, {}, {
        sortJson: {
            "sort": 1
        }
    });
    await ctx.render('reseption/index', {
        focus: bannerResult,
        setting: settingResult[0]
    })
});
/**
 * 前端登录界面
 */
router.get('/login', async (ctx) => {
    await ctx.render('reseption/login');
})

/**
 * 前端用户退出
 */
router.get('/loginout', async(ctx) => {
    ctx.session.customerInfo = null;
    await ctx.render('admin/error', {
        message: '已退出当前登录用户',
        redirect: ctx.state._host
    })
})

/**
 * 前台登录页面验证码
 */
router.get('/cusCode', async (ctx) => {
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 50,
        width: 120,
        height: 34,
        background: "#cc9966"
    });
    ctx.session.cusCode = captcha.text;
    console.log("前台验证码:"+ctx.session.cusCode);
    ctx.response.type = 'image/svg+xml';
    ctx.body = captcha.data;
});
/**
 * 前台登录客户功能，设置session
 * @param{
 *  cusName:账户
 *  cusPwd: 密码
 *  cusCode:验证码
 *  log_time:最新登录时间
 * }
 */
router.post('/tologin', async(ctx) => {
    let cusName = ctx.request.body.cusName;
    let cusPwd = tools.md5(ctx.request.body.cusPwd);
    let cusCode = ctx.request.body.cusCode;
    let log_time = tools.getAddTime();
    if (cusCode.toLowerCase() == ctx.session.cusCode.toLowerCase()){//判断验证码是否正确
        let findName = await DB.find('customer', {'cusname': cusName});
        if (findName.length > 0){//登录账户在数据库可以找到，证明账户存在
            let findMessage = await DB.find('customer', {"cusname": cusName, "password": cusPwd});
            if (findMessage.length > 0){//对登录账户和密码再次检验
                if (findMessage[0].status == 1) {//账户状态可用，登录成功
                    ctx.body={"message":"登录成功","success":true};
                    let update = await DB.update('customer', {"_id": findMessage[0]._id}, {"log_time": log_time});
                    //设置session客户信息findMessage[0]
                    ctx.session.customerInfo = {
                        cusname: findMessage[0].cusname,
                        telephone: findMessage[0].telephone,
                        pic: findMessage[0].pic,
                        nickname: findMessage[0].nickname,
                        income: findMessage[0].income
                    };
                } else {//当前账户状态不可以
                    ctx.body={"message":"当前账户状态不可以","success":false}
                }
            } else {
                ctx.body={"message":"密码不正确","success":false}
            }
        } else {
            ctx.body={"message":"账户不存在","success":false}
        }
    } else {
        ctx.body={"message":"验证码错误","success":false}
    }
})
/**
 * 前端注册界面
 */
router.get('/register', async(ctx) => {
    await ctx.render('reseption/register');
})
/**
 * 注册请求
 * @param{  
 *  cusname     真实姓名
 *  cusphone    手机号码
 *  cusnickname 昵称
 *  cuspwd      密码
 *  add_time    注册时间
 *  log_time    最新登录
 * }
 */
router.post('/toregister', async(ctx) => {
    let cusname = ctx.request.body.cusname;//真实姓名
    let cusphone = ctx.request.body.cusphone;//手机号码
    let cusnickname = ctx.request.body.cusnickname;//昵称
    let cuspwd = tools.md5(ctx.request.body.cuspwd);//密码
    let add_time = tools.getAddTime();//注册时间
    let log_time = tools.getAddTime();//最新登录
    let findResname = await DB.find('customer', {"cusname": cusname});
    //判断注册用户是否存在
    if (findResname.length > 0){//存在返回注册失败，用户存在无须注册
        ctx.body={"message":"注册失败，用户存在无须注册","success":false}
    } else {//不存在注册用户
        let insertResgister = await DB.insert('customer', {"cusname": cusname, "telephone": cusphone, "nickname": cusnickname,
    "password": cuspwd, "status": "1", "add_time": add_time, "log_time": log_time, "income": 100});
        if (insertResgister){
            ctx.body={"message":"注册成功","success":true}
        } else {
            ctx.body={"message":"注册失败，请重新注册","success":false}
        }
    }
})

/**
 * 跳转到开发文档
 * 5c3c470f4b63680bd8f3cc41
 */
router.get('/dev', async (ctx) => {
    let devResult = await DB.find("articlecate", {"_id": DB.getObjectId('5c3c470f4b63680bd8f3cc41')});
    let result = await DB.find("article", {"pid": '5c3c470f4b63680bd8f3cc41'});
    await ctx.render('reseption/dev', {
        list: result,
        devSetting: devResult[0]
    })
});

/**
 * 跳转到书香门第
 */
router.get('/case', async (ctx) => {
    let pid = ctx.query.pid;
    let page = ctx.query.page || 1;
    let limit = 3;
    //获取二级分类列表信息-图文模块 5c3c4849252c400bd869f2d6
    let cateResult = await DB.find("articlecate", {"pid": '5c3c4849252c400bd869f2d6'});
    //获取二级分类id
    var articleArr = [];
    if (pid) {
        var contentResult = await DB.find("article", {"pid": pid}, {}, {
            page,limit
        });
        var articleNum = await DB.count("article", {"pid": pid});
    } else {
        for (var i = 0; i < cateResult.length; i++) {
            articleArr.push(cateResult[i]._id.toString());
        }
        //{"pid":{$in:articleArr}}
        var contentResult = await DB.find("article", {"pid": articleArr[0]}, {}, {
            page,limit
        });

        var articleNum = await DB.count("article", {"pid": articleArr[0]}); 
    }
    //获取它的关键字和描述
    let caseArtResult = await DB.find("articlecate",  {"_id": DB.getObjectId('5c3c4849252c400bd869f2d6')});
    let caseSetting = caseArtResult[0];
    await ctx.render('reseption/case', {
        caseSetting: caseSetting,
        cateResult: cateResult,
        contentResult: contentResult,
        pid: pid || articleArr[0],
        page: page,
        totalPages: Math.ceil(articleNum/limit)
    })
});

/**
 * 跳转到情报中心
 * 5c3c487a252c400bd869f2d7
 */
router.get('/info', async (ctx) => {
    //获取分类、当前页数、设置最多显示多少条数据
    let pid = ctx.query.pid;
    let page = ctx.query.page || 1;
    let limit = 3;
    //获取路径
    let pathname = url.parse(ctx.request.url).pathname;
    //通过路径获取nav路由的名称及描述
    let navResult = await DB.find("nav", {"url": pathname});
    let articlecateResult = await DB.find("articlecate", {"title": navResult[0].title});
    //情报中心下属分类
    let cateResult = await DB.find("articlecate", {"pid": '5c3c487a252c400bd869f2d7'});
    //二级分类
    var firstArr = [];
    //判断分类id获取内容
    if (pid) {
        var articleResult = await DB.find("article", {"pid": pid}, {}, {
            page,
            limit
        });
        var articleNum = await DB.count("article", {"pid": pid}); 
    } else {
        for (var i = 0; i < cateResult.length; i++){
            firstArr.push(cateResult[i]._id.toString());
        }
        var articleResult = await DB.find("article", {"pid": firstArr[0]}, {}, {
            page,limit
        });
        var articleNum = await DB.count("article", {"pid": firstArr[0]}); 
    }
    await ctx.render('reseption/info', {
        cateResult: cateResult,
        articlecateResult: articlecateResult[0],
        pid: pid || firstArr[0],
        articleResult: articleResult,
        totalPages: Math.ceil(articleNum/limit),
        page: page
    })
});

/**
 * 跳转到评论留言
 */
router.get('/service', async (ctx) => {
    //获取当前页数、设置最多显示多少条数据
    let page = ctx.query.page || 1;
    let limit = 10;
    //查询评论留言
    let count = await DB.count('connect', {});
    let connectResult = await DB.find('connect', {}, {}, {
        page,
        limit,
        sortJson: {
            "add_time": -1
        }
    });
    await ctx.render('reseption/service',{
        page: page,
        totalPages: Math.ceil(count/limit),
        connectResult: connectResult
    })
});
/**
 * 评论留言
 * @param{
 *  cusname:    用户名
 *  telephone:  手机号码
 *  pic:        头像
 *  connect:    评论
 *  add_time:   记录时间
 * }
 */
router.post('/service/comment', async(ctx) => {
    let connect = ctx.request.body.comment;
    let customerInfo = ctx.session.customerInfo;
    let add_time = tools.getAddTime();
    if (customerInfo){//用户已经登录，可以将评论记录
        let insertComment = await DB.insert('connect', {
            cusname: customerInfo.cusname,
            nickname: customerInfo.nickname,
            pic:    customerInfo.pic,
            telephone: customerInfo.telephone,
            connect: connect,
            add_time: add_time
        });
        if (insertComment.result.ok){
            ctx.body={"message":"评论成功","success":true}
        } else {
            ctx.body={"message":"评论失败","success":false}
        }
    } else {//用户未登录
        ctx.body={"message":"用户未登录","success":false}
    }
})

/**
 * 跳转到关于博客
 */
router.get('/about', async (ctx) => {
    await ctx.render('reseption/about')
});

/**
 * 跳转到网页详情
 */
router.get('/contect/:id', async (ctx) => {
    let id = ctx.params.id;
    let result = await DB.find("article", {"_id": DB.getObjectId(id)}, {}, {sortJson: {
        "add_time": 1
    }});
    let catename = result[0].catename;
    let articlecateResult = await DB.find("articlecate", {"title": catename});
    if (articlecateResult[0].pid != "0") {//二级分类
        let firstCate = await DB.find("articlecate", {"_id": DB.getObjectId(articlecateResult[0].pid)});
        let navResult = await DB.find("nav", {"title": firstCate[0].title});
        let pathname = navResult[0].url;
        ctx.state.pathname = pathname;
    } else {//顶级分类
        let navResult = await DB.find("nav", {"title": articlecateResult[0].title});
        let pathname = navResult[0].url;
        ctx.state.pathname = pathname;
    }
    await ctx.render('reseption/contect', {
        list: result[0]
    })
})

module.exports = router.routes();