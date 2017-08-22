import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import $ from 'jquery';

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


// export default class AppComponent extends Vue {
export default {
  data() {
    return {
      username: username,
      password: password
    }
  },

  methods: {
    isStu: function () {
      this.$router.push({ path: '/ans/sheet' })
    },
    isAdmin: function () {
      this.$router.push({ path: '/dashboard/statistics' })
    },
    submit:function(usr,pwd){
      if(usr && pwd ){
        username = $("#username").val();
        password = $("#password").val();
        alert(username + " " + password);  
      }

    }

  }
}