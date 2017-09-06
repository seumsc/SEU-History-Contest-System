import Vue from 'vue';
import { Component } from 'vue-property-decorator';//不能被注释掉！
import jQuery from 'jquery';
var $ = jQuery.noConflict();

var goToNextPage=require('../ans.js').goToNextPage;
// var ajaxSetup = require('./ans.js').ajaxSetup;
// var ajaxMatchSetup = require('./ans.js').ajaxMatchSetup;
// var cookieBeforeSend = require('./ans.js').cookieBeforeSend;



export default {
	data() {
		return {
		}
	},
	mounted() {

	},
	methods: {
		goToNextPage:function(){
			alert("this");
			goToNextPage();
			}
        }
    }