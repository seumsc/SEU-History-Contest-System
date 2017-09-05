import Vue from 'vue';
import { Component } from 'vue-property-decorator';//不能被注释掉！
import jQuery from 'jquery';
var $ = jQuery.noConflict();
// import '../../../node_modules/font-awesome/css/font-awesome.css';
var set = require('./ans.js').set;
// var answerCard = require('./ans.js').answerCard;
// var saveAnsID = require('./ans.js').saveAnsID;
// var saveAns = require('./ans.js').saveAns;
// var submit = require('./ans.js').submit;
// var setRESULT = require('./ans.js').setRESULT;
// var ajaxSetupFunction=require('./ans.js').ajaxSetupFunction;
var getState=require('./ans.js').getState;
var load=require('./ans.js').load;
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
		// ajaxSetup: function () {
		// 	$.ajaxSetup({
		// 		beforeSend: function (xhr) {
		// 			var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
		// 			xhr.setRequestHeader("X-XSRF-TOKEN", match && match[1]);
		// 		}
		// 	});
		// },
		// ajaxMatchSetup: function () {
		// 	var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/)[1];
		// 	$.ajaxSetup({
		// 		headers: {
		// 			"X-XSRF-TOKEN": match
		// 		}
		// 	})
		// },
		// getState: function () {
		// 	getState();
		// },
		loadcss: function () {
			$("body").css("display", "flex");
			$("body").css("background-image", "url(/dist/Images/overlay.png), url(/dist/Images/bg.jpg)");

		}
	}
}