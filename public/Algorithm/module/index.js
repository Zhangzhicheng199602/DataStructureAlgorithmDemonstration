var tip1;
$(".back").hover(()=>{
    tip1 = layer.tips("返回", ".back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".back").click(()=>{
    window.location.href = document.referrer;;
});
