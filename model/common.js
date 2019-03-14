/**
 * Created by Administrator on 2019/1/6.
 */
exports.getData = function (ctx) {
    return new Promise(function (resolve, reject) {
        try{
            let str = '';
            ctx.req.on('data', function (chunk) {
                str+= chunk
            });
            ctx.req.on('end', function () {
                resolve(str)
            })
        }catch(err){
            reject(err)
        }
})
};