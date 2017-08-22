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
var username = "";
var password = "";
$(function () {

  var bgCounter = 0;
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
    bgCounter = (bgCounter + 1) % backgrounds.length;

    $('.bg').fadeOut(1000, function () { $(this).attr('src', backgrounds[bgCounter]) }).fadeIn(1000);
    setTimeout(changeBackground, 10000);
  }
  changeBackground();

});


export default {
  data() {
    return {
    }
  },

  methods: {
    isStu: function () {
      this.$router.push({ path: '/ans/sheet' })
    },
    isAdmin: function () {
      this.$router.push({ path: '/dashboard/statistics' })
    },
    submit: function () {
      if(verify()==true){
        alert(verify());
        $.ajax({
          url: 'http://hostname/api/Account/Login', //请求的url地址
          dataType: "xml", //返回格式为json
          async: true, //请求是否异步，默认为异步，这也是ajax重要特性
          //data
          data: {
            "userName": $("#username").val(),
            "password": $("#password").val()
          }, //参数值
          type: "POST", //请求方式
          beforeSend: function () {
            //请求前的处理
            alert(JSON.stringify(this.data)+" (beforesend)");
            
          },
          success: function (req) {
            alert(req);
            //请求成功时处理
            // if (req.isSuccessful) {
            //   if (req.user.role == "Student") {
            //     // window.location.href = "index.html";
            //     this.$router.push({ path: '/ans/sheet' })
            //   } else {
            //     // window.location.href = "dashboard.html";
            //     this.$router.push({ path: '/dashboard/statistics' })              
            //   }
            // } else alert("登录失败,请检查用户名或密码是否正确")
          },
          complete: function () {
            alert("complete");
            //请求完成的处理
          },
          error: function () {
            alert("error");
            //请求出错处理
            alert("登录失败,请检查网络是否通畅");
          }
        });
  
      }

    }

  }
}