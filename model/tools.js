/**
 * Created by Administrator on 2019/1/11.
 */
var md5 = require('md5');
const multer = require('koa-multer');   //图片上传模块
var file = require('file');

var tools = {
    multer() {
        //配置
        var storage = multer.diskStorage({
            //文件保存路径
            destination: function (req, file, cb) {
                cb(null, 'static/upload'); //注意路径必须存在
            },
            //修改文件名称
            filename: function (req, file, cb) {
                //console.log(file);
                var fileFormat = (file.originalname).split(".");
                cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        });
        //加载配置
        var upload = multer({ storage: storage });
        return upload;
    },
    md5(msg) {
        return md5(msg);
    },
    cateToList(data) {
        var firstArr = [];//一级分类
        for (var i = 0; i < data.length; i++) {
            if (data[i].pid == '0') {
                firstArr.push(data[i]);
            }
        }
        for (var i = 0; i < firstArr.length; i++) {
            firstArr[i].list = [];//二级分类
            for (var j = 0; j < data.length; j++) {
                if (firstArr[i]._id == data[j].pid) {
                    firstArr[i].list.push(data[j]);
                }
            }
        }
        return firstArr;
    },
    getAddTime() {
        var timer = new Date();
        return timer;
    }
};

module.exports = tools;