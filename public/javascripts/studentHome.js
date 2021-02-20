var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',  //滑动类型
    grabCursor: true,   //设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。（根据浏览器形状有所不同）
    centeredSlides: true, //设定为true时，active slide会居中，而不是默认状态下的居左。
    slidesPerView: '3',   //设置slider容器能够同时显示的slides数量(carousel模式)
    coverflowEffect: {
      rotate: 45,    //slide做3d旋转时Y轴的旋转角度
      stretch: -400,    //每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
      depth: 300,    //slide的位置深度。值越大z轴距离越远，看起来越小。
      modifier: 1,   //depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
      slideShadows : false,  //是否开启slide阴影
    }
});

// 注销按钮
var tip1;
$(".logout").hover(()=>{
    tip1 = layer.tips("注销", ".logout", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".logout").click(()=>{
  $.ajax({
    type: "GET",
    url: "/student/logout",
    success: function(result) {
      console.log(result.msg);
        layer.msg(result.msg,{ time: 1000 }, function() {
            if (result.status == 4) {
                window.location.href = "/student";
            }
        });
    },
    error: function(error) {
        console.log(error);
    }
  });
});

// 消息按钮
$(".message").hover(()=>{
  tip1 = layer.tips("通知", ".message", {tips: 3, time: 0} );
}, ()=>{
  layer.close(tip1);
});
$(".message").click(()=>{
  
});