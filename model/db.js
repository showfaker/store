/**
 * Created by Administrator on 2019/1/8.
 */
//DB库
var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;
var ObjectID = MongoDB.ObjectID;
var Config = require('./config.js');
class Db{
    static getinstance(){
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.dbClient = ''; //属性 放db对象
        this.connect(); //初始化连接数据库
    }
    connect(){
        let _that = this;
        return new Promise((resolve, reject)=>{
            if (!_that.dbClient){
                MongoClient.connect(Config.dbUrl, (err, client)=>{
                    if (err) {
                        reject(err);
                    } else {
                        _that.dbClient = client.db(Config.dbName);
                        resolve(_that.dbClient);
                    }
                })
            } else {
                resolve(_that.dbClient);
            }
        })
    }
    find(collectionName, json, json2, json3){       /*查找数据*/
        /**
         * 判断分页
         * 分页原理:
         * page:页数
         * pageSize:一页多少条数据量
         * db.表名.find({},{field: attr}).skip((page-1)*PageSize).limit(PageSize)
         * 实参和形参可以不一样,arguments对象能获取到实参的数量
         */
        //console.log(arguments);
        if (arguments.length == 2) {
            var attr = {};
            var skipNum = 0;
            var pageSize = 0;
        } else if (arguments.length == 3) {
            var attr = json2;
            var skipNum = 0;
            var pageSize = 0;
        } else if (arguments.length == 4) {
            var attr = json2;
            var page = json3.page || 1;
            var pageSize = json3.limit || 10;
            var skipNum = (page-1)*pageSize;
            if (json3.sortJson) {
                var sort = json3.sortJson;
            } else {
                var sort = {}
            }

        }
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).find(json,{field:attr}).skip(skipNum).limit(pageSize).sort(sort);
                result.toArray((err, docs)=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(docs);
                    }
                })
            })
        })
    }
    insert(collectionName, json){       /*增加数据*/
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(json, (err, result)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    remove(collectionName, json){       /*删除数据*/
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).removeOne(json, (err, result)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    update(collectionName, json1, json2){       /*修改数据*/
        return new Promise((resolve, reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(json1, {$set:json2}, (err, result)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                })
            })
        })
    }
    getObjectId(id){        /*查询_id来获取MongoDB里面的数据_id*/
        return new ObjectID(id);
    }
    count(collectionName, json1){
        return new Promise((resolve, reject) => {
            this.connect().then((db) =>  {
                let result = db.collection(collectionName).find(json1).count();
                //console.log(result);
                result.then((data)=>{
                    resolve(data);
                })
            })
        })
    }
}
module.exports = Db.getinstance();
//var myData = Db.getinstance();
//setTimeout(()=>{
//    console.time('run');
//    myData.find('user', {}).then((data)=>{
//        //console.log(data);
//        console.timeEnd('run');
//    });
//}, 100);
//setTimeout(()=>{
//    console.time('run1');
//    myData.find('user', {}).then((data)=>{
//        //console.log(data);
//        console.timeEnd('run1');
//    });
//}, 3000);
//var myData2 = Db.getinstance();
//setTimeout(()=>{
//    console.time('run2');
//    myData2.find('user', {}).then((data)=>{
//        //console.log(data);
//        console.timeEnd('run2');
//    });
//}, 5000);
//setTimeout(()=>{
//    console.time('run3');
//    myData2.find('user', {}).then((data)=>{
//        //console.log(data);
//        console.timeEnd('run3');
//    });
//}, 7000);