import Vue from 'vue';
import { Component } from 'vue-property-decorator';//不能被注释掉！
import jQuery from 'jquery';
var $ = jQuery.noConflict();
// import '../../../node_modules/font-awesome/css/font-awesome.css';
// var set = require('./ans.js').set;
// var answerCard = require('./ans.js').answerCard;
// var saveAnsID = require('./ans.js').saveAnsID;
// var saveAns = require('./ans.js').saveAns;
// var submit = require('./ans.js').submit;
// var setRESULT = require('./ans.js').setRESULT;
// var ajaxSetupFunction=require('./ans.js').ajaxSetupFunction;
var getState=require('./ans.js').getState;
var load=require('./ans.js').load;
// var goToNextPage=require('./ans.js').goToNextPage;
// var ajaxSetup = require('./ans.js').ajaxSetup;
// var ajaxMatchSetup = require('./ans.js').ajaxMatchSetup;
// var cookieBeforeSend = require('./ans.js').cookieBeforeSend;
require('../../../Images/banner.jpg');
require('../../../Images/bg.jpg');
require('../../../Images/overlay.png');
require('../../../Images/pic01.jpg');





export default {
	data() {
		return {
		}
	},
	mounted() {
		// ajaxSetup();
		// ajaxMatchSetup();
		// ajaxSetupFunction();
		getState(),
		load(),
		this.loadcss()
	},
	methods: {
		// goToNextPage:function(){
		// 	alert("this");
		// 	goToNextPage();
		// 	},
		loadcss: function () {
			$("body").css("display", "flex");
			$("body").css("background-image", "url(/dist/Images/overlay.png), url(/dist/Images/bg.jpg)");
		}
	}
}