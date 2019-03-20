/**
 * Created by Administrator on 2019/1/12.
 */
/**
 * 后台管理首页
 */
var router = require('koa-router')();
var DB = require('../../model/db.js');

router.get('/', async (ctx) => {
    await ctx.render('admin/index')
});
/**
 * 修改状态
 * /admin/changeStatus
 */
router.get('/changeStatus', async (ctx) => {
    var db=ctx.query.collectionName; /*数据库*/
    var attr=ctx.query.attr; /*属性*/
    var id=ctx.query.id; /*更新的 id*/
    var data= await DB.find(db,{"_id": DB.getObjectId(id)});
    if(data.length>0){
        if(data[0][attr]=='1'){
            var json = { /*es6 属性名表达式*/
                [attr]: '0'
            };
        }else{
            var json = {
                [attr]: '1'
            };
        }
        let updateResult=await DB.update(db,{"_id":DB.getObjectId(id)},json);
        if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }
    }else{
        ctx.body={"message":'更新失败,参数错误',"success":false};
    }
});
/**
 * 序号请求
 * sort         :序号
 * collection   :集合
 * id           :数据id
 */
router.get('/changeSort', async (ctx) => {
    let sort = ctx.query.sort;
    let collection = ctx.query.collection;
    let id = ctx.query.id;
    var result = await DB.find(collection, {"_id": DB.getObjectId(id)});
    if (result){
        var json = {
            sort
        };
        var updateResult = await DB.update(collection, {"_id": DB.getObjectId(id)}, json);
        if (updateResult.result.ok){
            ctx.body={"message":"更新成功","success":true}
        } else {
            ctx.body={"message":"更新失败","success":false}
        }
    } else {
        ctx.body={"message":"更新失败,参数错误","success":false}
    }
});

/**
 * 删除封装
 * /admin/remove
 */
router.get('/remove', async (ctx) => {
    try {
        var collection = ctx.query.collection;
        var id = ctx.query.aid;
        let deleteResult = await DB.remove(collection, {"_id": DB.getObjectId(id)});
        if (deleteResult.result.ok) {
            ctx.redirect(ctx.state._global.referer);
        } else {
            await ctx.render('admin/error', {
                message: '删除失败',
                redirect:ctx.state._global.referer
            })
        }
    } catch (err) {
        await ctx.render('admin/error', {
            message: err,
            redirect:ctx.state._global.referer
        })
    }
});
module.exports = router.routes();