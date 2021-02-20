/**
 * 返回按钮事件
 **/
$(".back-btn").on("click", () => {
    window.location.href="/"
});

/**
 * 注册登录页转换
 **/
$("#signUp").on("click", () => {
    $("#container").addClass("right-panel-active");
});
$("#signIn").on("click", () => {
    $("#container").removeClass("right-panel-active");
});

/**
 * 登录信息检验
 **/
var usernameState = false;
var passwordState = false;

//用户名
$("#username").focus(() => {
    $("#username-tip").html('');
    usernameState = false;
});
$("#username").blur(() => {
    checkUsername()
});
function checkUsername() {
    let username = $("#username").val();
    if(username == '')
    {
        $("#username-tip").html("用户名不能为空");
        usernameState = false;
    }
    else
    {
        usernameState = true;
    }
}

//密码
$("#password").focus(() => {
    $("#password-tip").html('');
    passwordState = false;
});
$("#password").blur(() => {
    checkPassword();
});

function checkPassword() {
    let password = $("#password").val();
    if(password == '')
    {
        $("#password-tip").html("密码不能为空");
        passwordState = false;
    }
    else
    {
        passwordState = true;
    }
}

/**
 * 点击登录按钮事件
 **/
$("#loginBtn").on("click", () => {
    checkUsername();
    checkPassword();
    if(!usernameState){
        $("#username-tip").html("用户名不能为空");
    }
    if(!passwordState){
        $("#password-tip").html("密码不能为空");
    }
    if (usernameState && passwordState)
    {
        $.ajax({
            type: "POST",
            url: "/student/login",
            data: $("#loginForm").serialize(),
            success: function(result) {
                layer.msg(result.msg,{offset: ['45%','30%'], time: 1000}, function() {
                    if (result.status == 2) {
                        window.location.href="/student/home";
                    }
                });
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});


/**
 * 注册信息检验
 **/
var snoState = false;
var snameState = false;
var sclassState = false;
var password1State = false;
var password2State = false;

//学号
$("#sno").focus(() => {
    $("#sno-tip").html('');
    snoState = false;
});
$("#sno").blur(() => {
    let sno = $("#sno").val();
    if(sno == '')
    {
        $("#sno-tip").html("学号不能为空");
        snoState = false;
    }
    else
    {
        snoState = true;
    }
});

//姓名
$("#sname").focus(() => {
    $("#sname-tip").html('');
    snameState = false;
});
$("#sname").blur(() => {
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
});

//班级
$("#sclass").focus(() => {
    $("#sclass-tip").html('');
    sclassState = false;
});
$("#sclass").blur(() => {
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
});

//密码
$("#password1").focus(() => {
    $("#password1-tip").html('');
    password1State = false;
});
$("#password1").blur(() => {
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
});

//确认密码
$("#password2").focus(() => {
    $("#password2-tip").html('');
    password2State = false;
});
$("#password2").blur(() => {
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
});

/**
 * 点击注册按钮事件
 **/
$("#registBtn").on("click", () => {
    if (!snoState) {
        $("#sno-tip").html("学号不能为空");
    }
    if (!snameState) {
        $("#sname-tip").html("姓名不能为空");
    }
    if (!sclassState) {
        $("#sclass-tip").html("班级不能为空");
    }
    if (!password1State) {
        $("#password1-tip").html("密码不能为空");
    }
    if (!password2State) {
        $("#password2-tip").html("确认密码不能为空");
    }
    if (snoState && snameState && sclassState && password1State && password2State)
    {
        let password1 = $("#password1").val();
        let password2 = $("#password2").val();
        if (password1 === password2)
        {
            $.ajax({
                type: "POST",
                url: "/student/regist",
                data: $("#registForm").serialize(),
                success: function(result) {
                    layer.msg(result.msg,{offset: ['45%','60%'], time: 1000}, function() {
                        if (result.status == 1) {
                            $("#container").removeClass("right-panel-active");
                            $("#sno").val('');
                            $("#sname").val('');
                            $("#sclass").val('');
                            $("#password1").val('');
                            $("#password2").val('');
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


