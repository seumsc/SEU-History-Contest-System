$(function () {

    //提交帐号密码
    $("#login-form").submit(function (event) {
        event.preventDefault();
        var usn = $(this.userName).val();
        var pwd = $(this.password).val();
        var dt = {
            "userName": usn,
            "password": pwd
        };
        console.log(dt);
        $.ajax({
            url: '/api/Account/Login', //请求的url地址
            type: "POST", //请求方式
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            crossDomain: true,
            contentType: "application/json-patch+json",
            //data
            data: JSON.stringify(dt), //参数值
            dataType: "json", //返回格式为json
            success: function (req,status,xhr) {
                console.log(req);
                console.log(xhr.getResponseHeader("Set-Cookie"));
                if (req.isSuccessful) {
                    if (req.userViewModel.role == "Student") {
                        window.location.href = "index.html";
                    } else if (req.userViewModel.role == "Administrator" ||
                        req.userViewModel.role == "Counselor") {
                       window.location.href = "dashboard.html";
                    } else {
                        console.log(req.role);
                    }
                } 
                else {
                    if (req.message == "User already logged in") {
                        $("#common-error").text("当前用户已登录")
                            .fadeIn(setTimeout(function () {
                                $("#common-error").fadeOut();
                            }, 2000));
                        ///////logout     !!!delete before dist
                        $.ajax({
                            
                            url: '/api/Account/Logout',
                            type: "POST",
                            async: true,
                            contentType: "application/json-patch+json",
                            dataType: "json",

                            success: function (req) {}
                        })
                    } 
                    else {
                        $("#common-error").text("用户名或密码错误，或尚未注册账号")
                            .fadeIn(setTimeout(function () {
                                $("#common-error").fadeOut();
                            }, 2000));
                    }
                }
            },
            error: function () {
                //请求出错处理
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
        var dt = {
            "userName": usn,
            "password": pwd,
            "realName":rnm,
            "role":"Student"
        };
        console.log(dt);
        $.ajax({
            url: "/api/Account/Register",
            type: "POST", 
            async: true, 
            contentType: "application/json-patch+json",
            //data
            data: JSON.stringify(dt), 
            dataType: "json", //返回格式为json
            success: function (req) {
                console.log(req);
                if(req.isSuccessful){
                    $("#register-message").removeClass().addClass("text-success")
                    $("#register-message").text("注册成功，即将进入竞赛系统...").fadeIn(); 
                    setTimeout(window.location.href="index.html",1000);       
                }
                else{
                    $("#register-message").removeClass().addClass("text-danger");
                    $("#register-message").text("注册失败，用户已存在").fadeIn(); 
                }
               
            },
            error: function (req) {
                //请求出错处理
              console.log(req);  
              $("#register-message").removeClass().addClass("text-danger");
              $("#register-message").text("注册失败，请检查网络").fadeIn(); 
            }
        });
    })
//实现动态背景
    $.backstretch([
        'images/background1.jpg',
        'images/background2.jpg',
        'images/background3.jpg',
        'images/background4.jpg',
        'images/background5.jpg',
        'images/background6.jpg',
        'images/background7.jpg',

    ], {
        fade: 1000, // 动画时长
        duration: 2000 // 切换延时
    });
})