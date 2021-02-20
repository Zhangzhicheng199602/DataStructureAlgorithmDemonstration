/**
 * 学生按钮事件
 * 跳转至学生登录注册页
 **/
$("#student-btn").on("click", () => {
    window.location.href="/student";
});

/**
 * 教师按钮事件
 * 跳转至教师登录注册页
 **/
$("#teacher-btn").on("click", () => {
    window.location.href="/teacher";
});

/**
 * 管理员按钮事件
 * 跳转至管理员登录注册页
 **/
$("#admin-btn").on("click", () => {
    window.location.href="/admin";
});