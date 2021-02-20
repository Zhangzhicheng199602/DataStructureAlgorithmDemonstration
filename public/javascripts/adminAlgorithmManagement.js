var curPage = $("#curPage").val() || 1;

//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
// layui.use('element', function(){
//     var element = layui.element;
//     element.tabChange('userManagement', layid)
//     //监听Tab切换，以改变地址hash值
//     element.on('tab(userManagement)', function(_data){
//         layid = _data.index;
//         console.log(layid);
//         window.location.href = "/admin/userManagement?layid="+layid+"&page=1";
//     });
// });

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
    var idList = [];
    console.log("批量删除算法");
    $.each($("input[name='algorithmSelect']:checked"),function(){
        idList.push(parseInt($(this).val()));
    });
    console.log(idList);
    var curPage = $("#curPage").val() || 1;
    $.ajax({
        type: "GET",
        url: "/admin/algorithmManagement/deleteMany",
        data: {
            list: idList,
            page: curPage
        },
        success: function(result) {
            layer.msg(result.msg,{time: 1000}, function() {
                if (result.status == 1){
                    var curPage = $("#curPage").val() || 1;
                    window.location.href = "/admin/algorithmManagement?page="+curPage;
                }
            });
        },
        error: function(error) {
            console.log(error);
        }
    });
});

//checkbox
$("input[name='allAlgorithm']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='algorithmSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='algorithmSelect']:checkbox").prop("checked", false);
    }
});

function algorithmBoxCheck() {
    if (this.checked == false) {
        $("input[name='allAlgorithm']:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='algorithmSelect']:checkbox").length;
        if (count == $("input[name='algorithmSelect']:checkbox:checked").length) {
            $("input[name='allAlgorithm']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allAlgorithm']:checkbox").prop("checked", false);
        }
    }
}

