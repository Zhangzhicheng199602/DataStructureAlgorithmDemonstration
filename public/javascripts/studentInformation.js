// 个人信息与密码页转换
$("#signUp").on("click", () => {
    $("#container").addClass("right-panel-active");
});
$("#signIn").on("click", () => {
    $("#container").removeClass("right-panel-active");
});

// 返回按钮事件
var tip1;
$(".home").hover(()=>{
    tip1 = layer.tips("返回", ".home", {tips: 3, time: 0} );
}, ()=>{
    layer.close(tip1);
});
$(".home").click(()=>{
    window.location.href = "/student/home"
});

//修改个人信息
var snameState = false;
var sclassState = false;
//姓名
$("#sname").focus(() => {
    $("#sname-tip").html('');
    snameState = false;
});
$("#sname").blur(() => {
    checkSname()
});
function checkSname() {
    let sname = $("#sname").val();
    if(sname == '')
    {
        $("#sname-tip").html("姓名不能为空");
        snameState = false;
    }
    else
    {
        snameState = true;
    }
}
//班级
$("#sclass").focus(() => {
    $("#sclass-tip").html('');
    sclassState = false;
});
$("#sclass").blur(() => {
    checkSclass()
});
function checkSclass() {
    let sclass = $("#sclass").val();
    if(sclass == '')
    {
        $("#sclass-tip").html("班级不能为空");
        sclassState = false;
    }
    else
    {
        sclassState = true;
    }
}

//点击信息修改按钮事件
$("#informationBtn").on("click", () => {
    checkSname();
    checkSclass();
    if(!snameState){
        $("#sname-tip").html("姓名不能为空");
    }
    if(!sclassState){
        $("#sclass-tip").html("班级不能为空");
    }
    if (snameState && sclassState)
    {
        $.ajax({
            type: "POST",
            url: "/student/information/saveInformation",
            data: $("#informationForm").serialize(),
            success: function(result) {
                layer.msg(result.msg,{offset: ['45%','30%'], time: 1000}, function() {
                    if (result.status == 1) {
                        window.location.href="/student/information";
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});


//密码信息检验
var password1State = false;
var password2State = false;
//密码
$("#password1").focus(() => {
    $("#password1-tip").html('');
    password1State = false;
});
$("#password1").blur(() => {
    checkPassword1();
});
function checkPassword1() {
    let password1 = $("#password1").val();
    if(password1 == '')
    {
        $("#password1-tip").html("密码不能为空");
        password1State = false;
    }
    else
    {
        password1State = true;
    }
}
//确认密码
$("#password2").focus(() => {
    $("#password2-tip").html('');
    password2State = false;
});
$("#password2").blur(() => {
    checkPassword2();
});

function checkPassword2() {
    let password2 = $("#password2").val();
    if(password2 == '')
    {
        $("#password2-tip").html("确认密码不能为空");
        password2State = false;
    }
    else
    {
        password2State = true;
    }
}


//点击密码修改按钮事件
$("#passwordBtn").on("click", () => {
    checkPassword1();
    checkPassword2();
    if (!password1State) {
        $("#password1-tip").html("密码不能为空");
    }
    if (!password2State) {
        $("#password2-tip").html("确认密码不能为空");
    }
    if (password1State && password2State)
    {
        let password1 = $("#password1").val();
        let password2 = $("#password2").val();
        if (password1 === password2)
        {
            $.ajax({
                type: "POST",
                url: "/student/information/savePassword",
                data: $("#passwordForm").serialize(),
                success: function(result) {
                    layer.msg(result.msg,{offset: ['45%','60%'], time: 1000}, function() {
                        if (result.status == 1) {
                            window.location.href = "/student/information";
                        }
                    });
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
        else
        {
            $("#password2-tip").html("确认密码与密码不一致");
        }
    }
});


