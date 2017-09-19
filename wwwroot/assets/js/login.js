function logout() {
    $.ajax({
        url: '/api/Account/Logout',
        contentType: "application/json",
        dataType: "json",
        async: false,
        type: "POST",
        beforeSend: function (xhr) {
            var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
            xhr.setRequestHeader("X-XSRF-TOKEN", match == null ? "" : match[1]);
        },
        success: function (req) {
            ////console..log(req);

        },
        error: function (xhr) {
            ////console..log(xhr);

        }
    });
}

function foreach() {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr.length > 0)
            DelCookie(arr[0]);
    }
}

function GetCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1)
        endstr = document.cookie.length;
    return decodeURIComponent(document.cookie.substring(offset, endstr));
}

function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = GetCookie(name);
    document.cookie = name + "=" + cval + "; expires=" + exp.toGMTString();
}

function GetCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg)
            return GetCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

function clearCookie() {
    ////console..log("Clearing...")
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
    }
    ////console..log("Completed...");
    ////console..log(document.cookie);
}
$(function () {

    ////console..log(window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/));

    /*$.ajaxSetup({
         beforeSend: function (xhr) {
         var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
         xhr.setRequestHeader("X-XSRF-TOKEN", match && match[1]);
         }
         });*/

})
$(window).load(function () {
    logout();
    clearCookie();
});
$(function () {
    // var match=window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/)[1];
    // $.ajaxSetup({
    //     headers:{
    //         "X-XSRF-TOKEN": match
    //     }
    // })
    //提交帐号密码
    $("#login-form").submit(function (event) {
        event.preventDefault();
        var usn = $(this.userName).val();
        var pwd = $(this.password).val();
        var dt = {
            "userName": usn,
            "password": pwd
        };
        ////console..log(dt);
        $.ajax({
            url: '/api/Account/Login', 
            type: "POST", 
            async: false,
            contentType: "application/json-patch+json",
            data: JSON.stringify(dt), 
            dataType: "json", 
            success: function (req, status, xhr) {
                if (req.isSuccessful) {
                    if (req.userViewModel.role == "Student") {
                        window.location.href = "index.html";
                    } else if (req.userViewModel.role == "Administrator" ||
                        req.userViewModel.role == "Counselor") {
                        window.location.href = "dashboard.html";
                    } else {
                        ////console..log(req.role);
                    }
                } else {
                    if (req.message == "User already logged in") {
                        $("#common-error").text("当前用户已登录")
                            .fadeIn(setTimeout(function () {
                                $("#common-error").fadeOut();
                            }, 2000));
                        logout();
                    } else {
                        $("#common-error").text("用户名或密码错误，或数据库中尚未录入账号")
                            .fadeIn(setTimeout(function () {
                                $("#common-error").fadeOut();
                            }, 2000));
                    }
                }
            },
            error: function () {
                $("#common-error").text("登录失败,请检查网络是否通畅")
                    .fadeIn(setTimeout(function () {
                        $("#common-error").fadeOut();
                    }, 2000));
            }
        });
    })
    $("#register-form").submit(function (event) {
        event.preventDefault();

        var usn = $(this.userName).val();
        var pwd = $(this.password).val();
        var rnm = $(this.realName).val();
        var rdt = {
            "userName": usn,
            "password": pwd,
            "realName": rnm,
            "role": "Student"
        };
        ////console..log(rdt);
        $.ajax({
            url: "/api/Account/Register",
            type: "POST",
            async: false,
            contentType: "application/json-patch+json",
            //data
            data: JSON.stringify(rdt),
            dataType: "json", //返回格式为json
            success: function (req) {
                // //console..log(req);
                if (req.isSuccessful) {
                    $("#register-message").removeClass().addClass("text-success")
                    $("#register-message").text("注册成功，即将进入竞赛系统...").fadeIn();

                    setTimeout(function () {
                        var usn = rdt.userName;
                        var pwd = rdt.password;
                        var dt = {
                            "userName": usn,
                            "password": pwd
                        };
                        $.ajax({
                            url: '/api/Account/Login', 
                            type: "POST", 
                            async: false, 
                            contentType: "application/json-patch+json",

                            data: JSON.stringify(dt), 
                            dataType: "json", 
                            success: function (req, status, xhr) {
                                if (req.isSuccessful) {
                                    if (req.userViewModel.role == "Student") {
                                        window.location.href = "index.html";
                                    } else if (req.userViewModel.role == "Administrator" ||
                                        req.userViewModel.role == "Counselor") {
                                        window.location.href = "dashboard.html";
                                    } else {
                                        ////console..log(req.role);
                                    }
                                } else {
                                    if (req.message == "User already logged in") {
                                        $("#common-error").text("当前用户已登录")
                                            .fadeIn(setTimeout(function () {
                                                $("#common-error").fadeOut();
                                            }, 2000));
                                        logout();
                                    } else {
                                        $("#common-error").text("用户名或密码错误，或尚未注册账号")
                                            .fadeIn(setTimeout(function () {
                                                $("#common-error").fadeOut();
                                            }, 2000));
                                    }
                                }
                            },
                            error: function () {
                                $("#common-error").text("登录失败,请检查网络是否通畅")
                                    .fadeIn(setTimeout(function () {
                                        $("#common-error").fadeOut();
                                    }, 2000));
                            }
                        });
                    }, 1000);
                }
                else {
                    var msg = JSON.stringify(req.message)
                    // console.log(msg);
                    ///////////////registration failure/////////////////
                    // if (msg.indexOf("Infalid account format")) {
                    //     // onsole.log("invalid"+msg);
                    //     $("#register-message").removeClass().addClass("text-danger");
                    //     $("#register-message").text("注册账户应为八位学号,密码应为九位一卡通号！").fadeIn();
                    // }
                    // else if (msg.indexOf(""))
                    // else
                    //     console.log(msg);
                    // console.log(msg.indexOf("UserName"));
                    if (req.message == "Invalid account format.") {
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("注册账户应为八位学号,密码应为九位一卡通号！").fadeIn();
                    }
                    else if (msg.indexOf("UserName")!= -1 ) {
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("该账户已注册！").fadeIn();
                    }
                    else if (req.message == "Problem in connecting validation network. Please try again.") {
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("验证网络连接失败，请重试！").fadeIn();
                    }
                    else if (msg.indexOf("Student data not found.")!= -1) {
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("未查询到该学生信息！").fadeIn();
                    }
                    else if (msg.indexOf("Internal server failure.") != -1) {
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("内部服务器错误，请检查联系计软科协赛事部！").fadeIn();
                    }
                    else if (msg.indexOf("Registration validation failed")!= -1){
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("注册未通过审核！请确认信息是否正确！").fadeIn();
                    }
                    else{  //if (req.message == ""){
                        $("#register-message").removeClass().addClass("text-danger");
                        $("#register-message").text("注册失败").fadeIn();
    
                    }
                }

            },
            error: function (req) {
                var msg = JSON.stringify(req.message);
                if(msg.indexOf("Body JSON") != -1){
                    $("#register-message").removeClass().addClass("text-danger");
                    $("#register-message").text("注册信息提交格式错误！").fadeIn();                
                }
                else if(msg.indexOf("registration only") != -1){
                    $("#register-message").removeClass().addClass("text-danger");
                    $("#register-message").text("只允许学生注册！").fadeIn();                
                }
                //请求出错处理
                ////console..log(req);
                // //console..log(req);
                else{
                    $("#register-message").removeClass().addClass("text-danger");
                    $("#register-message").text("注册失败，请检查网络").fadeIn();
    
                }
            }
        });
    })
    //实现动态背景
    $.backstretch([
        'Images/background1.jpg',
        'Images/background2.jpg',
        'Images/background3.jpg',
        'Images/background4.jpg',
        'Images/background5.jpg',
        'Images/background6.jpg',
        'Images/background7.jpg',

    ], {
            fade: 1000, // 动画时长
            duration: 2000 // 切换延时
        });
})
