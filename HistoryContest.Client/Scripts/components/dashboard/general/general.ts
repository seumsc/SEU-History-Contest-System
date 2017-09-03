import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
var downloadExcelOfAllDepartments = require('../dashboard.js').downloadExcelOfAllDepartments;
var setScoreData=require('../dashboard.js').setScoreData;
var setGeneralData=require('../dashboard.js').setGeneralData;
var sort=require('../dashboard.js').sort;
var logOut=require('../dashboard.js').logOut;

export default {
    data() {
        return {
        }
    },
    mounted: function () {
        this.loadGeneralData();
    },
    methods:{
        downloadExcelOfAllDepartments:function(){
            downloadExcelOfAllDepartments()
        },
        loadGeneralData:function(){
            setScoreData();
            setTimeout(setGeneralData(), 1000);
            sort();
        },
        logOut:function(){
            logOut();
            this.$router.push('/login');
        }

    }
}