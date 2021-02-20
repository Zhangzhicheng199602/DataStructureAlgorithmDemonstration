var swiper = new Swiper('.swiper-container', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: '3',
    coverflowEffect: {
      rotate: 45,
      stretch: -400,
      depth: 300,
      modifier: 1,
      slideShadows : false,
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
    url: "/teacher/logout",
    success: function(result) {
      console.log(result.msg);
        layer.msg(result.msg,{ time: 1000 }, function() {
            if (result.status == 4) {
                window.location.href = "/teacher";
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