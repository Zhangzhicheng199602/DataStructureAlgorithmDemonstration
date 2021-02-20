// back Button
var tip1;
$("#back").hover(()=>{
    tip1 = layer.tips("返回", "#back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$("#back").click(()=>{
    window.location.href="/teacher/algorithm";
});

$("#save").hover(()=>{
    tip1 = layer.tips("保存", "#save", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});


var layid = $("#layid").val() || 0;
//注意：选项卡 依赖 element 模块，否则无法进行功能性操作
layui.use('element', function(){
    var element = layui.element;
  
    //监听Tab切换，以改变地址hash值
    element.on('tab(code)', function(data){
        if(data.index == 0) {
            $("#html_code_layui").show();
            $("#css_code_layui").hide();
            $("#js_code_layui").hide();
            $("#describe_layui").hide();
        }
        if(data.index == 1) {
            $("#css_code_layui").show();
            $("#html_code_layui").hide();
            $("#js_code_layui").hide();
            $("#describe_layui").hide();
        }
        if(data.index == 2) {
            $("#js_code_layui").show();
            $("#css_code_layui").hide();
            $("#html_code_layui").hide();
            $("#describe_layui").hide();
        }
        if(data.index == 3) {
            $("#js_code_layui").hide();
            $("#css_code_layui").hide();
            $("#html_code_layui").hide();
            $("#describe_layui").show();
        }
    });
});

html_editor = ace.edit("html_code");//绑定dom对象
html_editor.setTheme("ace/theme/chrome");//设置主题
html_editor.getSession().setMode("ace/mode/html");//设置程序语言
html_editor.setFontSize(15);	//字体大小
document.getElementById("html_code").style.lineHeight="25px";//设置行高;
html_editor.setReadOnly(false);//设置只读（true时只读，用于展示代码）
//自动换行,设置为off关闭,free启用
html_editor.setOption("wrap", "off");
//启用提示菜单
ace.require("ace/ext/language_tools");
//以下部分是设置输入代码提示的
html_editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
html_editor.setHighlightActiveLine(true); //代码高亮  
html_editor.setShowPrintMargin(false);  
html_editor.getSession().setUseWorker(false);  
html_editor.selection.getCursor(); //获取光标所在行或列
html_editor.session.getLength(); //获取总行数
html_editor.getSession().setUseSoftTabs(true);


css_editor = ace.edit("css_code");//绑定dom对象
css_editor.setTheme("ace/theme/chrome");//设置主题
css_editor.getSession().setMode("ace/mode/css");//设置程序语言
css_editor.setFontSize(15);	//字体大小
document.getElementById("css_code").style.lineHeight="25px";//设置行高;
css_editor.setReadOnly(false);//设置只读（true时只读，用于展示代码）
//自动换行,设置为off关闭,free启用
css_editor.setOption("wrap", "off");
//启用提示菜单
ace.require("ace/ext/language_tools");
//以下部分是设置输入代码提示的
css_editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
css_editor.setHighlightActiveLine(true); //代码高亮  
css_editor.setShowPrintMargin(false);  
css_editor.getSession().setUseWorker(false);  
css_editor.selection.getCursor(); //获取光标所在行或列
css_editor.session.getLength(); //获取总行数
css_editor.getSession().setUseSoftTabs(true);


js_editor = ace.edit("js_code");//绑定dom对象
js_editor.setTheme("ace/theme/chrome");//设置主题
js_editor.getSession().setMode("ace/mode/javascript");//设置程序语言
js_editor.setFontSize(15);	//字体大小
document.getElementById("js_code").style.lineHeight="25px";//设置行高;
js_editor.setReadOnly(false);//设置只读（true时只读，用于展示代码）
//自动换行,设置为off关闭,free启用
js_editor.setOption("wrap", "off");
//启用提示菜单
ace.require("ace/ext/language_tools");
//以下部分是设置输入代码提示的
js_editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
js_editor.setHighlightActiveLine(true); //代码高亮  
js_editor.setShowPrintMargin(false);  
js_editor.getSession().setUseWorker(false);  
js_editor.selection.getCursor(); //获取光标所在行或列
js_editor.session.getLength(); //获取总行数
js_editor.getSession().setUseSoftTabs(true);

$("#save").click(()=>{
    data = {
        id: $("#id").val(),
        name: $("#name").val(),
        html: html_editor.getValue(),
        css: css_editor.getValue(),
        js: js_editor.getValue(),
        describe: $("#describe").val()
    }
    $.ajax({
        type: "get",
        url: "/teacher/teacherEditorAlgorithm/save",
        data: data,
        success: function(result) {
            layer.msg(result.msg,{time: 1000});
            rerurn;
        },
        error: function(error) {
            console.log("失败");
        }
    });
});