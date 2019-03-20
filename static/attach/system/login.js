/**
 * Created by Administrator on 2019/1/11.
 */
/**
 *  登录操作判断输入框是否为空
 */
$(function () {
    $(".input-name").hide();
    $(".input-pwd").hide();
    $(".input-code").hide();
    $("#loginForm").submit(function (){
        //用户名正则判断4-12位(字母、数字、下划线、减号)
        var uPattern = $("#username").val().length;
        //var uPwd = /^[a-zA-Z0-9]{6,14}$/;
        $(".input-name").hide();
        $(".input-pwd").hide();
        $(".input-code").hide();
        if (uPattern < 4 || uPattern > 12 || $("#username").val() == '') {
            $(".input-name").show(500);
            return false;
        }
        if($("#password").val() == ''){
            $(".input-pwd").show(500);
            return false;
        }
        if($("#code").val() == ''){
            $(".input-code").show(500);
            return false;
        }
        return true;
    })
});

