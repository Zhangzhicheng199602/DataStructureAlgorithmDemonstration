// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    var curPage = $("#curPage").val() || 1;
    window.location.href="/teacher/note?page="+curPage;
});

$("#print").hover(()=>{
    tip1 = layer.tips("打印", "#print", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#print").click(()=>{
    var title = document.getElementById("title");
    var desc = document.getElementById("desc");
    var content = document.getElementById("content");
    //询问框
    layer.confirm('选择文件格式：', {
        btn: ['pdf', 'doc'] //按钮
    }, function(){
        var iframe = document.createElement('IFRAME');
        var doc = null;
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
        document.body.appendChild(iframe);
        doc = iframe.contentWindow.document;
        doc.write("<div id='content'>"+"<h3 style='text-align: center;'>"+title.innerHTML+'</h3>'+"<div style='text-align: center;'>"+desc.innerHTML+"</div>"+content.innerHTML+'</div>');
        doc.close();
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (navigator.userAgent.indexOf("MSIE") > 0)
        {
            document.body.removeChild(iframe);
        }
    }, function(){
        $("<div id='content'>"+"<h3 style='text-align: center;'>"+title.innerHTML+'</h3>'+"<div style='text-align: center;'>"+desc.innerHTML+"</div>"+content.innerHTML+'</div>').wordExport(title.innerHTML);
    });
});

