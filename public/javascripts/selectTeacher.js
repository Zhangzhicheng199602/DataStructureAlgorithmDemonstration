var parentData;
//获取父界面的传值
function child(data){ 
    parentData = data;
}

layui.use(['form'], function () {
    var form = layui.form;
    form.on('select(test)', function(data){
        if(data.value){
            $.ajax({
                type: "GET",
                url: "/student/note/submit",
                data: {
                        noteId: parentData.noteId,
                        tno: data.value
                      },
                success: function(result) {
                    parent.GetValue(result); //GetValue是父界面的Js 方法
                    parent.layer.close(parentData.index);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    });
});

