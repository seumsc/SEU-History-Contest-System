// import Vue from 'vue';
// import VueRouter from 'vue-router';
// Vue.use(VueRouter);
// import { Component } from 'vue-property-decorator';//不能被注释掉！
// import $ from 'jquery';
// import Chartist from 'chartist';
// var download = require('../download.js').download;

// var general = {
//     "maxScore": 0,
//     "averageScore": 0,
//     "scoreBandCount":
//     {
//         "higherThan90": 0,
//         "higherThan75": 0,
//         "higherThan60": 0,
//         "failed": 0,
//         "notTested": 3
//     },
//     "updateTime": "2017-09-01T19:12:16.9073331+08:00"
// }

// var tot = general.scoreBandCount.higherThan60 + general.scoreBandCount.higherThan75 + general.scoreBandCount.higherThan90 + general.scoreBandCount.failed+general.scoreBandCount.notTested;
// var undone = general.scoreBandCount.notTested;
// var done = tot - undone;
// // }
// var by = function (name) {
//     return function (o, p) {
//         var a, b;
//         if (typeof o === "object" && typeof p === "object" && o && p) {
//             a = o[name];
//             b = p[name];
//             if (a === b) {
//                 return 0;
//             }
//             if (typeof a === typeof b) {
//                 return a < b ? 1 : -1;
//             }
//             return typeof a < typeof b ? 1 : -1;
//         }
//         else {
//             throw ("error");
//         }
//     }
// }

// function initChartist() {
//     // console.log("initChart");        
//     var labelForDone = Math.round(100 * (1 - general.scoreBandCount.notTested / tot)) + "%";
//     var labelForUndo = Math.round(100 * (general.scoreBandCount.notTested / tot)) + "%";
//     //以下总人数还没有和上面的数据统一
//     var labelA = Math.round(100 * (general.scoreBandCount.higherThan60 / tot)) + "%";
//     var labelB = Math.round(100 * (general.scoreBandCount.higherThan75 / tot)) + "%";
//     var labelC = Math.round(100 * (general.scoreBandCount.higherThan90 / tot)) + "%";
//     var labelD = Math.round(100 * (general.scoreBandCount.failed / tot)) + "%";

//     new Chartist.Pie('#completion-chart-general', {

//         labels: [labelForDone,
//             (undone == 0 ? '' : labelForUndo)],
//         series: [done, undone]
//     });
//     new Chartist.Pie('#overall-chart-general', {
//         labels: [labelA, labelB, labelC, labelD],
//         series: [
//             general.scoreBandCount.higherThan90,
//             general.scoreBandCount.failed,  
//             general.scoreBandCount.higherThan75,
//             general.scoreBandCount.higherThan60
//         ]
//     });
// }

// function commonSet() {
//     // $("#school-name").html(DepartmentNameMap[config.generalInfo.DepartmentID]);
//     if (undone == 0) {
//         $("#done-info-general").html( "大家都很听话，全部完成作答了哦！");
//         $("#undo-info-general").hide();
//         $("#empty-comment").show();
//     }
//     else if (done == 0) {
//         $("#done-info-general").hide();
//         $("#undo-info-general").html("到现在还没有一人完成，大家都去哪儿浪了呢？");
//         $("#empty-comment").hide();
//     }
//     else {
//         $("#done-info-general").html(done + "人已完成答题,");
//         $("#undo-info-general").html("仍有" + undone + "人未完成。");
//         $("#empty-comment").hide();
//     }
//     $("#average-score-general").html(JSON.stringify(general.averageScore));
// }

// var temp = $.extend(true, done);//深拷贝 !important
// var cnt = 0;

// export default {
//     data() {
//         return {
//         }
//     },
//     mounted: function () {
//         this.$nextTick(function () {
//             this.refresh()
//         })
//     },
//     methods: {
//         getAllDepartmentsInfo:function(){
//             $.ajax({
//                 url: '/api/Counselor/Scores/Summary', //请求的url地址
//                 type: "GET", //请求方式
//                 dataType: "json", //返回格式为json
//                 async: false,
//                 contentType: "application/json",
//                 beforeSend: function () {
//                 },
//                 success: function (res) {
//                     console.log("return:" + JSON.stringify(res));
//                     general = res;
//                 },
//                 complete: function () {
//                     console.log("general" + JSON.stringify(general));
//                 },
//                 error: function (request) {
//                     console.log("get scores/all/{id}error:" + JSON.stringify(request));
//                 }
//             }); 
//         },        
//         allDepartments: function () {
//             $.ajax({
//                 url: '/api/Counselor/ExportExcelofAllDepartments', //请求的url地址
//                 type: "POST", //请求方式
//                 // dataType: "json", //返回格式为json
//                 async: true,
//                 crossDomain: true,
//                 contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//                 beforeSend: function () {
//                     console.log('start download');
//                 },
//                 success: function (req) {
//                     download(req);
//                 },
//                 complete: function () {
//                 },
//                 error: function (request) {
//                     console.log("error:" + JSON.stringify(request));
//                 }
//             });

//         },

//         refresh: function () {
//             this.getAllDepartmentsCode();
//             this.getAllDepartmentsInfo();
//             this.getAllDepartmentsScores();
//             // console.log("click!");
//             initChartist();
//             // setUndo(undo);
//             // setDone(done);
//             commonSet();
//             console.log(done);
//             $("#table-done").find("th.score").click((function () {
//                 if (cnt % 3 == 0) {
//                     $("#sort").hide();
//                     $("#triangle-bottom").show();
//                     $("#triangle-top").hide();
//                     if (cnt == 0) {
//                         temp.students.sort(by("Score"));
//                         // setDone(temp);
//                         cnt++;
//                         return;
//                     }
//                     temp.students.reverse();
//                     cnt++;
//                     // setDone(temp);

//                 }
//                 else if (cnt % 3 == 1) {
//                     $("#sort").hide();
//                     $("#triangle-bottom").hide();
//                     $("#triangle-top").show();
//                     temp.students.reverse();
//                     cnt++;
//                     // setDone(temp);

//                 }
//                 else if (cnt % 3 == 2) {
//                     $("#sort").show();
//                     $("#triangle-bottom").hide();
//                     $("#triangle-top").hide();
//                     cnt++;
//                     // setDone(done);

//                 }
//             }))
//             //先隐藏再筛选
//             $("#search-undo-text").keyup(function () {
//                 var $key = $('#search-undo-text').val();
//                 $('#table-undo table tbody tr').hide().filter(":contains('" + $key + "')").show();
//             });
//             $("#search-done-text").keyup(function () {
//                 var $key = $('#search-done-text').val();
//                 $('#table-done table tbody tr').hide().filter(":contains('" + $key + "')").show();
//             });

//         }
//     }
// }