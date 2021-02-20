// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    window.location.href="/teacher/home"
});

//checkbox
$("input[name=all]").click(function () {
    if (this.checked) {
        $(".container :checkbox").prop("checked", true);
    } else {
        $(".container :checkbox").prop("checked", false);
    }
});

function boxCheck() {
    if (this.checked == false) {
        $("input[name=all]:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='noteSelect']:checkbox").length;
        if (count == $("input[name='noteSelect']:checkbox:checked").length) {
            $("input[name=all]:checkbox").prop("checked", true);
        }
        else{
            $("input[name=all]:checkbox").prop("checked", false);
        }
    }
}

// delete Button
$("#deleteMany").hover(()=>{
    tip1 = layer.tips("批量删除", "#deleteMany", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#deleteMany").click(()=>{
    var idList = [];
    $.each($("input[name='noteSelect']:checked"),function(){
        idList.push($(this).val());
    });
    var curPage = $("#curPage").val() || 1;
    $.ajax({
        type: "GET",
        url: "/teacher/note/deleteMany",
        data: {
            idList: idList,
            page: curPage
        },
        success: function(result) {
            layer.msg(result.msg,{time: 1000}, function() {
                window.location.href = "/teacher/note?page="+result.curPage;
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});


//read Button
$('.read').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("查看", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        let value = $(this).attr('id').split('_')[1];
        var curPage = $("#curPage").val() || 1;
        window.location.href = "/teacher/note/read?noteId="+value+"&page="+curPage;
    });
});


