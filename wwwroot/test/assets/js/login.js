function logout(){
    $.ajax({
        url: '/api/Account/Logout',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "POST",
        success: function (req) {
            console.log(req);
           
        },
        error: function (xhr) {
            console.log(xhr);
            
        }
    });
}
function foreach()  
{  
  var strCookie=document.cookie;  
  var arrCookie=strCookie.split("; ");  
  for(var i=0;i<arrCookie.length;i++)  
 {  
    var arr=arrCookie[i].split("=");  
    if(arr.length>0)  
    DelCookie(arr[0]);  
 }  
}  
function GetCookieVal(offset)  
{  
var endstr = document.cookie.indexOf (";", offset);  
if (endstr == -1)  
endstr = document.cookie.length;  
return decodeURIComponent(document.cookie.substring(offset, endstr));  
}  
function DelCookie(name)  
{  
  var exp = new Date();  
  exp.setTime (exp.getTime() - 1);  
  var cval = GetCookie (name);  
  document.cookie = name + "=" + cval + "; expires="+ exp.toGMTString();  
}  
  function GetCookie(name)  
{  
  var arg = name + "=";  
  var alen = arg.length;  
  var clen = document.cookie.length;  
  var i = 0;  
  while (i < clen)  {  
    var j = i + alen;  
    if (document.cookie.substring(i, j) == arg)  
      return GetCookieVal (j);  
    i = document.cookie.indexOf(" ", i) + 1;  
    if (i == 0) break;  
  }  
  return null;  
}  
function clearCookie(){  
  console.log("Clearing...")
    var date=new Date();  
    date.setTime(date.getTime()-10000);  
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);  
    if (keys) {  
        for (var i =  keys.length; i--;)  
          document.cookie=keys[i]+"=0; expire="+date.toGMTString()+"; path=/";  
    }  
    console.log("Completed...");
    console.log(document.cookie);
}  
  $(function(){
   
   console.log( window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/));
   
    /*$.ajaxSetup({
         beforeSend: function (xhr) {
         var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
         xhr.setRequestHeader("X-XSRF-TOKEN", match && match[1]);
         }
         });*/
        
  })
  $(window).load(function() {
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
                        ///////logout     !!!delete before dist !danger
                       logout();
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
        var rdt = {
            "userName": usn,
            "password": pwd,
            "realName":rnm,
            "role":"Student"
        };
        console.log(rdt);
        $.ajax({
            url: "/api/Account/Register",
            type: "POST", 
            async: true, 
            contentType: "application/json-patch+json",
            //data
            data: JSON.stringify(rdt), 
            dataType: "json", //返回格式为json
            success: function (req) {
                console.log(req);
                if(req.isSuccessful){
                    $("#register-message").removeClass().addClass("text-success")
                    $("#register-message").text("注册成功，即将进入竞赛系统...").fadeIn(); 
                    
                    setTimeout(function(){
                        var usn = rdt.userName;
                        var pwd =rdt.password;
                        var dt = {
                            "userName": usn,
                            "password": pwd
                        };
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
                                        ///////logout     !!!delete before dist !danger
                                       logout();
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
                    },1000);       
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