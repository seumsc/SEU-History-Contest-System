import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
// var fetchSummary = require('../dashboard.js').fetchSummary;
// var fetchAllScores = require('../dashboard.js').fetchAllScores;
var downloadDepartmentExcel = require('../dashboard.js').downloadDepartmentExcel;
// var downloadExcelOfAllDepartments = require('../dashboard.js').downloadExcelOfAllDepartments;
var setScoreData=require('../dashboard.js').setScoreData;
var setGeneralData=require('../dashboard.js').setGeneralData;
var sort=require('../dashboard.js').sort;
var logOut=require('../dashboard.js').logOut;

export default {
    data() {
        return {
        }
    },
    mounted:  function(){
        this.loadData();
        sort();
        },
    methods: {
        downloadDepartmentExcel: function () {
            downloadDepartmentExcel();
        },
        loadData: function () {
            setScoreData();
            setTimeout(setGeneralData(), 1000);
        },
        logOut:function(){
            logOut();
            this.$router.push('/login');
        }
    }
}