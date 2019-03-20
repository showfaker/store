$(function(){
    $(".dropdown-toggle").click(function(){//用户按钮
        // if ($(".user-menu").css)
        $(".user-menu").toggle();
    })
    $("#menu-toggler").click(function(){//导航栏按钮
        $(".sidebar").toggle();
    })
});
var customer = {//客户管理组件
    login: function(){//登录方法
        var cusName = $(".customer-name").val();
        var cusPwd = $(".customer-pwd").val();
        var cusCode = $(".customer-code").val();
        if (cusName == ""){
            $(".result").hide();
            $(".red").show(500);
            $(".red").text("请输入账户！");
            return;
        }
        if (cusPwd == ""){
            $(".result").hide();
            $(".red").show(500);
            $(".red").text("请输入密码！");
            return;
        }
        if (cusCode == ""){
            $(".result").hide();
            $(".red").show(500);
            $(".red").text("请输入验证码！");
            return;
        }
        /**
         * 登录请求
         */
        $.post(
            '/tologin',
            {cusName: cusName, cusPwd: cusPwd, cusCode: cusCode},
            function(data){
                if (data.success){
                    $(".red").hide();
                    $(".result").show(500);
                    $(".result").text("登录成功！");
                    setTimeout(function(){
                        window.location.href = '/';
                    }, 1000)
                } else {
                    $(".result").hide();
                    $(".red").show(500);
                    $(".red").text(data.message);
                }
            }
        )
    },
    register : {//注册组件
        focus:function(value){
            if (value == 'name') {
                $(".error-name").hide();
                $(".tips-name").show();
            }
            if (value == 'phone') {
                $(".error-phone").hide();
                $(".tips-phone").show();
            }
            if (value == 'nickname') {
                $(".error-nickname").hide();
                $(".tips-nickname").show();
            }
            if (value == 'pwd') {
                $(".error-pwd").hide();
                $(".tips-pwd").show();
            }
            if (value == 'pwd2') {
                $(".error-pwd2").hide();
                $(".tips-pwd2").show();
            }
        },
        blur:function(value2){
            //当输入了信息进行判断
            var name =  /^[\u4e00-\u9fa5]{2,4}$/;
            var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
            var pwd = /^\w{6,16}$/;
            var nickname = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/;
            //获取用户输入的密码
            var cuspwd = $(".cuspwd").val();
            var cuspwd2 = $(".cuspwd2").val();
            if (value2 == 'name'){
                $(".tips-name").hide();
                var cusname = $(".cusname").val();
                if (cusname.length > 0) {//检验用户输入的格式
                    if (name.test(cusname) != true){
                        $(".error-name").show();
                    }
                }
            }
            if (value2 == 'phone'){
                $(".tips-phone").hide();
                var cusphone = $(".cusphone").val();
                if (cusphone.length > 0) {//检验用户输入的格式
                    if (phone.test(cusphone) != true){
                        $(".error-phone").show();
                    }
                }
            }
            if (value2 == 'nickname') {
                $(".tips-nickname").hide();
                var cusnickname = $(".cusnickname").val();
                if (cusnickname.length > 0) {//检验用户输入的格式
                    if (nickname.test(cusnickname) != true){
                        $(".error-nickname").show();
                    }
                }
            }
            if (value2 == 'pwd') {
                $(".tips-pwd").hide();
                if (cuspwd.length > 0) {//检验用户输入的格式
                    if (pwd.test(cuspwd) != true){
                        $(".error-pwd").show();
                    }
                }
            }
            if (value2 == 'pwd2') {
                $(".tips-pwd2").hide();
                if (cuspwd2.length > 0) {//检验用户输入的格式
                    if (cuspwd2 != cuspwd){
                        $(".error-pwd2").show();
                    }
                }
            }
        },
        submit: function(){
            //当输入了信息进行判断
            var name =  /^[\u4e00-\u9fa5]{2,4}$/;
            var phone = /^[1][3,4,5,7,8][0-9]{9}$/;
            var pwd = /^\w{6,16}$/;
            var nickname = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,6}$/;
            //获取用户输入的信息
            var cusname = $(".cusname").val();
            var cusphone = $(".cusphone").val();
            var cusnickname = $(".cusnickname").val();
            var cuspwd = $(".cuspwd").val();
            var cuspwd2 = $(".cuspwd2").val();
            if (!cusname || name.test(cusname) != true){
                $(".error-name").show();
                return;
            }
            if (!cusphone || phone.test(cusphone) != true){
                $(".error-phone").show();
                return;
            }
            if (!cusnickname || nickname.test(cusnickname) != true){
                $(".error-nickname").show();
                return;
            }
            if (!cuspwd || pwd.test(cuspwd) != true){
                $(".error-pwd").show();
                return;
            }
            if (!cuspwd2 || cuspwd != cuspwd2){
                $(".error-pwd2").show();
                return;
            }
            /**
             * 注册请求
             */
            $.post(
                '/toregister',
                {cusname: cusname, cusphone: cusphone, cusnickname: cusnickname, cuspwd: cuspwd},
                function(data){
                    if (data.success){
                        $(".red").hide();
                        $(".result").show(500);
                        $(".result").text("注册成功！");
                    } else {
                        $(".result").hide();
                        $(".red").show(500);
                        $(".red").text(data.message);
                    }
                }
            )

        }
    },
    commit:{//评论组件
        publish:function(){//点击发布
            var comment = $("#comment-input").val();
            if (!comment) {
                $(".shadow").show();
                $(".shadow-text").text("评论不得为空");
                return;
            }
            $.post(
                '/service/comment',
                {comment: comment},
                function(data){
                    if (data.success) {
                        window.location.href = '/service';
                    } else {
                        $(".shadow").show();
                        if (data.message == '用户未登录'){
                            $(".shadow-text").text("您还没有登录，请登录后评论");
                        } else {
                            $(".shadow-text").text("评论失败，请检查网络"); 
                        }
                    }
                }
            )
        },
        close:function(){//关闭遮罩层
            $(".shadow").hide();
        }
    }
}
