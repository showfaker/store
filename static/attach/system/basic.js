/**
 * Created by Administrator on 2019/1/12.
 */
$(function(){
    app.delete();//删除封装调用
});
var app = {
    toggle: function (el,collectionName,attr,id) {
        //请求改变状态
        $.get(
            '/admin/changeStatus',
            {collectionName:collectionName,attr:attr,id:id},
            function(data) {
            if (data.success) {
                if (el.src.indexOf('yes') != -1) {
                    el.src = '/assets/images/no.gif';
                } else {
                    el.src = '/assets/images/yes.gif';
                }
            }
        })
    },
    delete: function () {
        $(".delete").click(function () {
            var flag = confirm("你确定删除吗？");
            return flag;
        })
    },
    changeSort: function (el,collectionName,id) {
        var sortValue = el.value;
        $.get(
            '/admin/changeSort',
            {sort:sortValue,collection:collectionName,id:id},
            function(data){
                console.log(data);
            }
        )
    }
};