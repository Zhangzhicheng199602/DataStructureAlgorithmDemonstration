var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',  //滑动类型
    grabCursor: true,   //设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
    centeredSlides: true, //设定为true时，active slide会居中，而不是默认状态下的居左。
    slidesPerView: '4',   //设置slider容器能够同时显示的slides数量(carousel模式)
    coverflowEffect: {
      rotate: 45,    //slide做3d旋转时Y轴的旋转角度
      stretch: -200,    //每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
      depth: 300,    //slide的位置深度。值越大z轴距离越远，看起来越小。
      modifier: 1,   //depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
      slideShadows : false,  //是否开启slide阴影
    }
});

// 注销按钮
var tip1;
$(".back").hover(()=>{
    tip1 = layer.tips("返回", ".back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".back").click(()=>{
    window.location.href="/teacher/home";
});

$(".upload").hover(()=>{
    tip1 = layer.tips("上传", ".upload", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".upload").click(()=>{
    window.location.href="/teacher/algorithm/upload";
});

$(".create").hover(()=>{
    tip1 = layer.tips("新建", ".create", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".create").click(()=>{
    //prompt层

    layer.prompt({title: '请输入算法名称', formType: 0},function(znname, index){
        layer.close(index);
        layer.prompt({title: '请输入算法英文名称', formType: 0},function(enname, index){
            var chekCharacter = /^[a-zA-Z]+$/;
            let flag = chekCharacter.test(enname)
            if(!flag){
                layer.msg("算法英文名必须为纯英文",{time: 1000});
            }else{
                layer.close(index);
                layer.prompt({title: '请输入算法描述信息', formType: 2, maxlength: 120}, function(describe, index){
                    layer.close(index);
                    $.ajax({
                        type: "get",
                        url: "/teacher/algorithm/create",
                        data: {
                            znname: znname,
                            enname: enname,
                            describe: describe
                        },
                        success: function(result) {
                            layer.msg(result.msg, {time: 1000}, function() {
                                if (result.status == 1) {
                                    window.location.href = "/teacher/teacherCreateAlgorithm?znname="+znname+"&enname="+enname+"&describe="+describe;
                                }
                            });
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                });
            }
        });
    });
});

function public(id) {
    $.ajax({
        type: "get",
        url: "/teacher/algorithm/public",
        data: {id: id},
        success: function(result) {
            layer.msg(result.msg, {time: 1000}, function() {
                if (result.status == 1) {
                    window.location.href = "/teacher/algorithm"
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function depublic(id) {
    $.ajax({
        type: "get",
        url: "/teacher/algorithm/depublic",
        data: {id: id},
        success: function(result) {
            layer.msg(result.msg, {time: 1000}, function() {
                if (result.status == 1) {
                    window.location.href = "/teacher/algorithm"
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function shanchu(id) {
    $.ajax({
        type: "get",
        url: "/teacher/algorithm/delete",
        data: {id: id},
        success: function(result) {
            layer.msg(result.msg, {time: 1000}, function() {
                if (result.status == 1) {
                    window.location.href = "/teacher/algorithm"
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
}