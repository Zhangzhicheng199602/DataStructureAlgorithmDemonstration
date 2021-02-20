var layid = $("#layid").val() || 0;
var curPage = $("#curPage").val() || 1;

//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use('element', function(){
    var element = layui.element;
    element.tabChange('noteManagement', layid)
    //监听Tab切换，以改变地址hash值
    element.on('tab(noteManagement)', function(_data){
        layid = _data.index;
        console.log(layid);
        window.location.href = "/admin/noteManagement?layid="+layid+"&page=1";
    });
});

// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    window.location.href="/admin/home"
});

// delete Button
$("#deleteMany").hover(()=>{
    tip1 = layer.tips("批量删除", "#deleteMany", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#deleteMany").click(()=>{
    layid = $("#layid").val() | 0;
    var idList = [];
    if(layid == 0){
        console.log("批量删除学生笔记");
        idList = [];
        $.each($("input[name='noteSelect']:checked"),function(){
            idList.push($(this).val());
        });
        console.log(idList);
        var curPage = $("#curPage").val() || 1;
        $.ajax({
            type: "GET",
            url: "/admin/noteManagement/deleteMany",
            data: {
                layid: layid,
                list: idList,
                page: curPage
            },
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/noteManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }else if(layid == 1){
        console.log("批量删除学生上交笔记");
        idList = [];
        $.each($("input[name='submittedSelect']:checked"),function(){
            idList.push($(this).val());
        });
        console.log(idList);
        var curPage = $("#curPage").val() || 1;
        $.ajax({
            type: "GET",
            url: "/admin/noteManagement/deleteMany",
            data: {
                layid: layid,
                list: idList,
                page: curPage
            },
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/noteManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});


//checkbox
$("input[name='allNote']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='noteSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='noteSelect']:checkbox").prop("checked", false);
    }
});

$("input[name='allSubmitted']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='submittedSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='submittedSelect']:checkbox").prop("checked", false);
    }
});

function noteBoxCheck() {
    if (this.checked == false) {
        $("input[name='allNote']:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='noteSelect']:checkbox").length;
        if (count == $("input[name='noteSelect']:checkbox:checked").length) {
            $("input[name='allNote']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allNote']:checkbox").prop("checked", false);
        }
    }
}

function submittedBoxCheck() {
    if (this.checked == false) {
        $("input[name=allSubmitted]:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='submittedSelect']:checkbox").length;
        if (count == $("input[name='submittedSelect']:checkbox:checked").length) {
            $("input[name='allSubmitted']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allSubmitted']:checkbox").prop("checked", false);
        }
    }
}

