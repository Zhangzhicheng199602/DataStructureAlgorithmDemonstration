
// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    window.location.href="/student/home"
});

// create Button
$("#create").hover(()=>{
    tip1 = layer.tips("新建", "#create", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#create").click(()=>{
    var curPage = $("#curPage").val() || 1;
    window.location.href="/student/note/create?page="+curPage;
});

// submit Button
$('.submit').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("提交", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        let value = $("input[name='id_"+$(this).attr('id').split('_')[1]+"']").val();
        layer.open({
            type: 2,
            area: ['220px', '320px'],
            fixed: false, //不固定
            title: "选择教师",
            content: 'note/selectTeacher',
            success:function (layero,index) {
                var iframe = window['layui-layer-iframe' + index];
                iframe.child({noteId: value, index: index});
            }
        })
    });
});

function GetValue(result){
    layer.msg(result.msg,{time: 1000}, function() {
        var curPage = $("#curPage").val() || 1;
        window.location.href = "/student/note?page="+curPage;
    });
}

// desubmit Button
$('.desubmit').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("撤销", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        let value = $("input[name='id_"+$(this).attr('id').split('_')[1]+"']").val();
        $.ajax({
            type: "GET",
            url: "/student/note/desubmit",
            data: {noteId: value},
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    var curPage = $("#curPage").val() || 1;
                    window.location.href = "/student/note?page="+curPage;
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

// read Button
$('.read').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("查看", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        let value = $("input[name='id_"+$(this).attr('id').split('_')[1]+"']").val();
        var curPage = $("#curPage").val() || 1;
        window.location.href = "/student/note/read?noteId="+value+"&page="+curPage;
    });
});

// delete Button
$('.delete').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("删除", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        let value = $("input[name='id_"+$(this).attr('id').split('_')[1]+"']").val();
        $.ajax({
            type: "GET",
            url: "/student/note/delete",
            data: {noteId: value},
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    var curPage = $("#curPage").val() || 1;
                    window.location.href = "/student/note?page="+curPage;
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

