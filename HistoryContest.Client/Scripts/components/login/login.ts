import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import $ from 'jquery';
var verify = require("./verify.js").verify;

//validator malfunctioning at present.
require('../../../Images/background0.jpg');
require('../../../Images/background1.jpg');
require('../../../Images/background2.jpg');
require('../../../Images/background3.jpg');
require('../../../Images/background4.jpg');
require('../../../Images/background5.jpg');
require('../../../Images/background6.jpg');
require('../../../Images/background7.jpg');
require('../../../Images/background8.jpg');

//import boolstrap from 'boolstrap';
$(function () {

  var bgCounter = 0;
  var bgCounter2 = 0;
  var backgrounds = [
    "/dist/Images/background0.jpg",
    "/dist/Images/background1.jpg",
    "/dist/Images/background2.jpg",
    "/dist/Images/background3.jpg",
    "/dist/Images/background4.jpg",
    "/dist/Images/background5.jpg",
    "/dist/Images/background6.jpg",
    "/dist/Images/background7.jpg",
    "/dist/Images/background8.jpg"

  ];
  function changeBackground() {


    $('#bg1').fadeOut(500, function () { $(this).attr('src', backgrounds[bgCounter]) }).fadeIn(500);
    bgCounter = (bgCounter + 1) % backgrounds.length;
    setTimeout(changeBackground, 5000);
  }
  function changeBackground2() {


    $('#bg2').fadeOut(500, function () { $(this).attr('src', backgrounds[bgCounter2]) }).fadeIn(500);
    bgCounter2 = (bgCounter2 + 1) % backgrounds.length;
    setTimeout(changeBackground2, 5000);
  }
  setTimeout(changeBackground, 1500);
  setTimeout(changeBackground2, 1875);
  $("#go-to-sign-in").click(function () {
    $("#signin").css("display", "");
    $("#signup").css("display", "none");
  });
  $("#go-to-sign-up").click(function () {
    $("#signin").css("display", "none");
    $("#signup").css("display", "");
  });

});
var username = "";
var password = "";

export default {
  data() {
    return {
    }
  },

  methods: {
    isStu: function () {
      this.$router.replace({ path: '/ans/sheet' })
    },
    isAdmin: function () {
      this.$router.replace({ path: '/dashboard/statistics' })
    },
    signup: function () {
      // alert("click!");
        var info = {
          "UserName": "",
          "Password": "",
          "RealName": "",
          "Role":"Student"
        }
        info.UserName = $("#signup-username").val();
        info.Password = $("#signup-password").val();
        info.RealName = $("#signup-name").val();
        var _this = this;
        $.ajax({
          url: '/api/Account/Register', //请求的url地址
          type: "POST", //请求方式
          dataType: "json", //返回格式为json
          async: false, //一定要设置为同步orz
          data: JSON.stringify(info),
          contentType: "application/json-patch+json;charset=utf-8",
          beforeSend: function () {
            alert(this.data)
          },
          success: function (req) {
            alert(JSON.stringify(req))
            _this.isStu();            
          },
          complete: function () {
            alert("complete");
          },
          error: function (request) {
            alert("sign up error:" + JSON.stringify(request));
          }
        });
    },
    submit: function () {
      if (verify() == true) {
        username = $("#username").val();
        password = $("#password").val();
        var info = {
          "userName": "",
          "password": ""
        };
        info.userName = username;
        info.password = password;
        var _this = this;
        $.ajax({
          url: '/api/Account/Login', //请求的url地址
          type: "POST", //请求方式
          dataType: "json", //返回格式为json
          async: false, //一定要设置为同步orz
          data: JSON.stringify(info),
          contentType: "application/json-patch+json;charset=utf-8",
          beforeSend: function () {
          },
          success: function (req) {
            if (req.isSuccessful) {
              if (req.userViewModel.role == "Student") {
                (<any>window).user.isLoggedIn = true;
                (<any>window).user.id = JSON.stringify(info.userName);
                (<any>window).user.role = JSON.stringify(req.userViewModel.role);
                _this.isStu();
              }
              else {
                (<any>window).user.isLoggedIn = true;
                (<any>window).user.id = JSON.stringify(info.userName);
                (<any>window).user.role = JSON.stringify(req.userViewModel.role);
                _this.isAdmin();
              }
              // else alert("管理员页面尚未开放！请直接ctrl+L，手动输入网址，蟹蟹~")
            } else alert("登录失败,请检查用户名或密码是否正确")
          },
          complete: function () {
          },
          error: function (request) {
            alert("error:" + JSON.stringify(request));
            alert("登录失败,请检查网络是否通畅");
          }
        });

      }

    }

  }

  // }
}