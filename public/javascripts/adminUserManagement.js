var layid = $("#layid").val() || 0;
var curPage = $("#curPage").val() || 1;

//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use('element', function(){
    var element = layui.element;
    element.tabChange('userManagement', layid)
    //监听Tab切换，以改变地址hash值
    element.on('tab(userManagement)', function(_data){
        layid = _data.index;
        console.log(layid);
        window.location.href = "/admin/userManagement?layid="+layid+"&page=1";
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

// state Button
$('.setTeacherState').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("禁用", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        // alert("禁用");
        let value = +$(this).attr('id').split('_')[1];
        layid = $("#layid").val() || 0;
        console.log(value);
        $.ajax({
            type: "GET",
            url: "/admin/userManagement/disable",
            data: {id: value, layid: layid},
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/userManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
});

$('.changeTeacherState').each(function(){
    let tip;
    $($(this)).hover(()=>{
        tip = layer.tips("启用", $(this), {tips: 3, time: 0} );
    }, ()=>{
        layer.close(tip);
    });
    $($(this)).click(()=>{
        // alert("启用");
        let value = +$(this).attr('id').split('_')[1];
        layid = $("#layid").val() || 0;
        console.log(value);
        $.ajax({
            type: "GET",
            url: "/admin/userManagement/enable",
            data: {id: value, layid: layid},
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/userManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
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
        console.log("批量删除学生");
        idList = [];
        $.each($("input[name='studentSelect']:checked"),function(){
            idList.push($(this).val());
        });
        console.log(idList);
        var curPage = $("#curPage").val() || 1;
        $.ajax({
            type: "GET",
            url: "/admin/userManagement/deleteMany",
            data: {
                layid: layid,
                list: idList,
                page: curPage
            },
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/userManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }else if(layid == 1){
        console.log("批量删除教师");
        idList = [];
        $.each($("input[name='teacherSelect']:checked"),function(){
            idList.push($(this).val());
        });
        console.log(idList);
        var curPage = $("#curPage").val() || 1;
        $.ajax({
            type: "GET",
            url: "/admin/userManagement/deleteMany",
            data: {
                layid: layid,
                list: idList,
                page: curPage
            },
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/userManagement?layid="+result.layid+"&page="+curPage;
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }else if(layid == 2){
        console.log("批量删除管理员");
        idList = [];
        $.each($("input[name='adminSelect']:checked"),function(){
            idList.push($(this).val());
        });
        console.log(idList);
        var curPage = $("#curPage").val() || 1;
        $.ajax({
            type: "GET",
            url: "/admin/userManagement/deleteMany",
            data: {
                layid: layid,
                list: idList,
                page: curPage
            },
            success: function(result) {
                layer.msg(result.msg,{time: 1000}, function() {
                    if (result.status == 1){
                        var curPage = $("#curPage").val() || 1;
                        window.location.href = "/admin/userManagement?layid="+result.layid+"&page="+curPage;
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
$("input[name='allStudent']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='studentSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='studentSelect']:checkbox").prop("checked", false);
    }
});

$("input[name='allTeacher']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='teacherSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='teacherSelect']:checkbox").prop("checked", false);
    }
});

$("input[name='allAdmin']:checkbox").click(function () {
    if (this.checked) {
        $("input[name='adminSelect']:checkbox").prop("checked", true);
    } else {
        $("input[name='adminSelect']:checkbox").prop("checked", false);
    }
});

function studentBoxCheck() {
    if (this.checked == false) {
        $("input[name='allStudent']:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='studentSelect']:checkbox").length;
        if (count == $("input[name='studentSelect']:checkbox:checked").length) {
            $("input[name='allStudent']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allStudent']:checkbox").prop("checked", false);
        }
    }
}

function teacherBoxCheck() {
    if (this.checked == false) {
        $("input[name=allTeacher]:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='teacherSelect']:checkbox").length;
        if (count == $("input[name='teacherSelect']:checkbox:checked").length) {
            $("input[name='allTeacher']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allTeacher']:checkbox").prop("checked", false);
        }
    }
}

function adminBoxCheck() {
    if (this.checked == false) {
        $("input[name=allAdmin]:checkbox").prop('checked', false);
    }
    else {
        var count = $("input[name='adminSelect']:checkbox").length;
        if (count == $("input[name='adminSelect']:checkbox:checked").length) {
            $("input[name='allAdmin']:checkbox").prop("checked", true);
        }
        else{
            $("input[name='allAdmin']:checkbox").prop("checked", false);
        }
    }
}

