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
    checkUsername();
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
            url: "/teacher/login",
            data: $("#loginForm").serialize(),
            success: function(result) {
                layer.msg(result.msg,{offset: ['45%','30%'], time: 1000}, function() {
                    if (result.status == 2) {
                        window.location.href="/teacher/home"
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
var tnoState = false;
var tnameState = false;
var password1State = false;
var password2State = false;

//学号
$("#tno").focus(() => {
    $("#tno-tip").html('');
    tnoState = false;
});
$("#tno").blur(() => {
    let tno = $("#tno").val();
    if(tno == '')
    {
        $("#tno-tip").html("职工号不能为空");
        tnoState = false;
    }
    else
    {
        tnoState = true;
    }
});

//姓名
$("#tname").focus(() => {
    $("#tname-tip").html('');
    tnameState = false;
});
$("#tname").blur(() => {
    let tname = $("#tname").val();
    if(tname == '')
    {
        $("#tname-tip").html("姓名不能为空");
        tnameState = false;
    }
    else
    {
        tnameState = true;
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
    if (!tnoState) {
        $("#tno-tip").html("职工号不能为空");
    }
    if (!tnameState) {
        $("#tname-tip").html("姓名不能为空");
    }
    if (!password1State) {
        $("#password1-tip").html("密码不能为空");
    }
    if (!password2State) {
        $("#password2-tip").html("确认密码不能为空");
    }
    if (tnoState && tnameState && password1State && password2State)
    {
        let password1 = $("#password1").val();
        let password2 = $("#password2").val();
        if (password1 === password2)
        {
            $.ajax({
                type: "POST",
                url: "/teacher/regist",
                data: $("#registForm").serialize(),
                success: function(result) {
                    layer.msg(result.msg,{offset: ['45%','60%'], time: 1000}, function() {
                        if (result.status == 1) {
                            $("#container").removeClass("right-panel-active");
                            $("#tno").val('');
                            $("#tname").val('');
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


