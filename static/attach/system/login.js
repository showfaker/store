/**
 * Created by Administrator on 2019/1/11.
 */
/**
 *  ��¼�����ж�������Ƿ�Ϊ��
 */
$(function () {
    $(".input-name").hide();
    $(".input-pwd").hide();
    $(".input-code").hide();
    $("#loginForm").submit(function (){
        //�û��������ж�4-12λ(��ĸ�����֡��»��ߡ�����)
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

