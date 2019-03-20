//返回任意对象的任意属性
function getStyle(obj,arrt){
    if(obj.currentStyle){
        return obj.currentStyle[arrt];
    }else{
        return window.getComputedStyle(obj,null)[arrt];
    }
}

//返回网页可视区的大小（客户端大小）（兼容写法）
function client() {
    if (window.innerWidth != null) {
        return {
            "width": window.innerWidth,
            "height": window.innerHeight
        }
    } else if (document.compatMode == "CSS1Compat") {
        return {
            "width": document.documentElement.clientWidth,
            "height": document.documentElement.clientHeight
        }
    } else {
        return {
            "width": document.body.clientWidth,
            "height": document.body.clientHeight
        }
    }
}

//返回页面卷去的距离（兼容写法）
function scroll() {
    //判断该方法是否存在 window.pageyOffset 不可以直接判断true 如果存在 默认为0 返回依旧为false
    if (window.pageYOffset != null) {
        return {
            "top": window.pageYOffset,
            "left": window.pageXOffset
        };
    } else if (document.compatMode == "CSS1Compat") {
        return {
            "top": document.documentElement.scrollTop,
            "left": document.documentElement.scrollLeft
        };
    } else {
        return {
            "top": document.body.scrollTop,
            "left": document.body.scrollLeft
        };
    }
}

//缓动动画任意纵向任意位置(leader，target)               //声明当前位置 leader       //目标位置 target
function animateSlowlyT(obj, leader, target) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //leader = leader+step
        //step = (target-leader)/n
        var step = (target - leader) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        leader = leader + step;
        //移动页面      （Xpos,Ypos）--坐标
        window.scrollTo(0, leader);
        //判断当前位置与目标位置 决定是否继续移动 即改变top值
        if (leader == target) {
            clearInterval(obj.timer);
        }
        console.log(1)
    }, 25)
}

//需求：对象移动到任意位置
//封装 缓动
//任意对象的任意属性改变到任意目标
//任意对象的多个属性同时改变(原判断条件缺陷 数值不能精确移动到位)
//添加回调函数 实现多次动画效果
//添加透明度和层级属性
function animateSlowly(obj, json, fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true;        //标记为true 清理定时器
        for (var k in json) {
            if (k == "opacity") {
                var target = json[k] * 100;
                var leader = getStyle(obj, k) * 100;
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                obj.style[k] = (leader + step) / 100;
            } else if (k == "zIndex") {
                obj.style[k] = json[k];
            } else {
                var target = json[k];
                var leader = parseInt(getStyle(obj, k)) || 0;
                var step = (target - leader) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                obj.style[k] = leader + step + "px";
            }
            if (leader != target) {
                flag = false;
            }
        }
        if (flag) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
        console.log(1);
    }, 15)
}

/*
//缓动动画对象纵向移动                              //声明目标位置 target = 页面被卷去的距离 + 一点呼吸距离
function animateSlowlyY(obj, target) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //leader = leader+step
        //step = (target-leader)/n
        var leader = obj.offsetTop;
        var step = (target - leader) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        //判断当前位置与目标位置 决定是否继续移动 即改变top值
        if (target != leader) {         //说明没到
            obj.style.top = leader + step + "px";
        } else {                        //说明到了
            clearInterval(obj.timer);
        }
    }, 25)
}

//缓动动画横向移动
function animateSlowlyX(obj, target) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        //leader = leader+step
        //step = (target-leader)/n
        var leader = obj.offsetLeft;
        var step = (target - leader) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        //判断当前位置与目标位置 决定是否继续移动 即改变left值
        if (target != leader) {
            obj.style.left = leader + step + "px";
        } else {
            clearInterval(obj.timer);
        }
    }, 25)
}
*/

//匀速动画
function animate(obj, target) {
    //避免重复使用 首先清除定时器
    clearInterval(obj.timer);
    //声明定时器
    obj.timer = setInterval(function () {
        //声明当前位置
        var leader = obj.offsetLeft;
        //声明移动步伐
        var step = 30;
        //判断当前位置与目标位置的大小 实现向左向右
        //leader 大于 target  步伐为负数 向右走
        //leader 小于 target  步伐为正数 向左走
        step = leader < target ? step : -step;
        //判断终点 如果没有到终点就执行动画
        //比较当前位置与目标位置的距离 和 步伐的大小
        //如果距离大于步伐就可以继续移动 否则说明再迈一步就超出终点了
        if (Math.abs(leader - target) > Math.abs(step)) {
            //移动
            obj.style.left = leader + step + "px";
        } else {
            //移动结束 清除定时器
            clearInterval(obj.timer);
            //如果步伐与目标位置不能整除 最后直接赋值即可移动到目标位置
            obj.style.left = target + "px";
        }
    }, 25);
}


//返回标签(数组)
function $(aaa) {
    //2.根据传递参数的不同，选择获取标签的方法。
    var bbb = aaa.charAt(0);
    var ccc = aaa.slice(1);
    if (bbb == "#") {
        return document.getElementById(ccc);
    } else if (bbb == ".") {
        return getClassName(ccc);
    } else {
        return document.getElementsByTagName(aaa);
    }
}

//根据类名获取标签的兼容写法
function getClassName(str) {
    if (document.getElementsByClassName) {
        return document.getElementsByClassName(str);
    } else {
        var allNodes = document.getElementsByTagName("*");
        var arr = [];
        for (var i = 0; i < allNodes.length; i++) {
            var arrClassName = allNodes[i].className.split(" ");
            for (var j = 0; j < arrClassName.length; j++) {
                if (arrClassName[j] == str) {
                    arr.push(allNodes[i]);
                }
            }
        }
        return arr;
    }
}
