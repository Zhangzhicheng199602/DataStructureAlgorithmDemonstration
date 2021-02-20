var tip1;
$(".back").hover(()=>{
    tip1 = layer.tips("返回", ".back", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".back").click(()=>{
    window.location.href="/teacher/algorithm";
});

var zn_nameState = false
var en_nameState = false

$("#zn_name").focus(() => {
    $("#znname-tip").html('');
    zn_nameState = false;
});
$("#zn_name").blur(() => {
    checkZnname();
});
function checkZnname() {
    let znname = $("#zn_name").val();
    if(znname == '')
    {
        $("#znname-tip").html("算法名不能为空");
        zn_nameState = false;
    }
    else
    {
        zn_nameState = true;
    }
}

$("#en_name").focus(() => {
    $("#enname-tip").html('');
    en_nameState = true;
});
$("#en_name").blur(() => {
    checkEnname();
});
function checkEnname(){
    var chekCharacter = /^[a-zA-Z]+$/;
    let flag1 = chekCharacter.test($("#en_name").val())
    let flag2 = $("#en_name").val() == "" ? true : false;
    if (flag1 || flag2) {
        en_nameState = true;
    }else{
        en_nameState = false;
        $("#enname-tip").html("必须为英文");
    };
}

$(".submitBtn").click(()=>{
    var formData = new FormData($("#algorithmForm")[0]);
    checkZnname();
    checkEnname();
    if (zn_nameState && en_nameState) {
        $.ajax({
            type: "POST",
            url: "/teacher/algorithm/upload/save",
            processData: false,
            contentType: false,
            data: formData,
            success: function(result) {
                layer.msg(result.msg, {time: 1000}, function() {
                    if (result.status == 1) {
                        window.location.href="/teacher/algorithm";
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});