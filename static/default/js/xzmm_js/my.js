/**
 * Created by TXZ on 2016/2/19.
 */
window.onload = function () {

    var wrap = $("#wrap");
    var slide = $("#slide");
    var ul = slide.children[0];
    var lis = ul.children;
    var arrow = $("#arrow");
    var arrRight = $("#arrRight");
    var arrLeft = $("#arrLeft");
    var flag = true;//添加节流阀 标记

    var config = [//配置单(json数组)
        {
            width: 200,
            top: 10,
            left: 30,
            opacity: 0.1,
            zIndex: 1
        },
        {
            width: 400,
            top: 20,
            left: 50,
            opacity: 0.2,
            zIndex: 2
        },//0
        {
            width: 600,
            top: 70,
            left: -50,
            opacity: 0.8,
            zIndex: 3
        },//1
        {
            width: 800,
            top: 100,
            left: 200,
            opacity: 1,
            zIndex: 4
        },//2
        {
            width: 600,
            top: 70,
            left: 650,
            opacity: 0.8,
            zIndex: 3
        },//3
        {
            width: 400,
            top: 20,
            left: 750,
            opacity: 0.2,
            zIndex: 2
        },//4
        {
            width: 200,
            top: 10,
            left: 950,
            opacity: 0.1,
            zIndex: 1
        }
    ]//规定了每个图片的位置样式

    wrap.onmouseover = function () {
        animateSlowly(arrow, {"opacity": 1});
    }
    wrap.onmouseout = function () {
        animateSlowly(arrow, {"opacity": 0});
    }

    //根据每个配置单 对li进行分配
    function assign() {
        for (var i = 0; i < lis.length; i++) {
            //图片渐渐地到达指定位置
            animateSlowly(lis[i], config[i], function () {
                flag = true;
            });
        }
    }

    assign();

    //点击箭头 让木马旋转
    arrRight.onclick = function () {
        if (flag) {
            flag = false;
            //点击右箭头 配置单删除第一个 添加到最后一个 并重新分配
            config.push(config.shift());
            assign();
        }

    }
    arrLeft.onclick = function () {
        if (flag) {
            flag = false;
            //点击右箭头 配置单删除最后一个 添加到第一个 并重新分配
            config.unshift(config.pop());
            assign();
        }

    }

}