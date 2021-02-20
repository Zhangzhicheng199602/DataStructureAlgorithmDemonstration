// xheditor配置
$('.xheditor').xheditor({
    tools: 'full',
    skin: 'default',
    upImgUrl: '/uploads',
    html5Upload: false,
    upMultiple: 1
});

// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    var curPage = $("#curPage").val() || 1;
    window.location.href="/student/note/read?noteId="+$("input=[name='id']").val()+"&page="+curPage;
});

// save Button
$("#save").hover(()=>{
    tip1 = layer.tips("保存", "#save", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#save").click(()=>{
    let title = $("input[name='title']").val();
    if (title == "")
    {
        alert("标题不能为空");
    }
    else
    {
        $.ajax({
            type: "POST",
            url: "/student/note/edit/save",
            data: $("#createNoteForm").serialize(),
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    window.location.href="/student/note/read?noteId="+$("input=[name='id']").val();
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});