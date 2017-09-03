import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
var fetchData = require('../dashboard.js').fetchData;
var fetchSummary = require('../dashboard.js').fetchSummary;
var fetchAllScores = require('../dashboard.js').fetchAllScores;
var downloadDepartmentExcel = require('../dashboard.js').downloadDepartmentExcel;
// var downloadExcelOfAllDepartments = require('../dashboard.js').downloadExcelOfAllDepartments;
var sortScore=require('../dashboard.js').sortScore;


export default {
    data() {
        return {
        }
    },
    mounted:  function(){
        this.loadData()
        },
    methods: {
        downloadDepartmentExcel: function () {
            downloadDepartmentExcel();
        },
        loadData: function () {
            fetchData();
            // fetchSummary();
            // fetchAllScores();
        }
    }
}