import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
var download = require('../download.js').download;

var departmentInfo = {
    "maxScore": 0,
    "averageScore": 0,
    "scoreBandCount":
    {
        "higherThan90": 0,
        "higherThan75": 0,
        "higherThan60": 0,
        "failed": 0,
        "notTested": 3
    },
    "updateTime": "2017-09-01T18:46:26.2034528+08:00"
}
var undo = {
    'students': [
    ]
};
var done = {
    'students': [
    ]
};
$.ajax({
    url: '/api/Counselor/Scores/All', //请求的url地址
    type: "GET", //请求方式
    dataType: "json", //返回格式为json
    async: false,
    contentType: "application/json",
    beforeSend: function () {
    },
    success: function (res) {
        // console.log("return:"+JSON.stringify(res));
        for (var i = 0; i < res.length; i++) {
            if (res[i].isCompleted) {
                done.students.push(res[i]);
            }
            else undo.students.push(res[i]);
        }
    },
    complete: function () {
    },
    error: function (request) {
        console.log("get scores/all/{id}error:" + JSON.stringify(request));
    }
});
$.ajax({
    url: '/api/Counselor/Scores/Summary', //请求的url地址
    type: "GET", //请求方式
    dataType: "json", //返回格式为json
    async: false,
    contentType: "application/json",
    beforeSend: function () {
    },
    success: function (res) {
        departmentInfo = res;
        console.log(JSON.stringify(departmentInfo));
    },
    complete: function () {
    },
    error: function (request) {
        console.log("get scores/summary/{id} error:" + JSON.stringify(request));
    }
});

var config = {
    generalInfo: departmentInfo,
    doneNumber: done.students.length,
    undoNumber: undo.students.length,
    total: done.students.length + undo.students.length,
    comments: {
        dones: {
            perfect: "大家都很听话，全部完成作答了哦！",
            common: done.students.length + "人已完成答题,"
        },
        undos: {
            worst: "偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
            common: "仍有" + undo.students.length + "人未完成。"
        }
    }

}
var by = function (name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? 1 : -1;
            }
            return typeof a < typeof b ? 1 : -1;
        }
        else {
            throw ("error");
        }
    }
}

function setUndo(UNDO) {
    var undoContent = ""
    for (var undoIteratorIndex = 0; undoIteratorIndex < UNDO.students.length; undoIteratorIndex++) {
        undoContent += '<tr><td>' + UNDO.students[undoIteratorIndex].studentID
            + '</td><td>' + UNDO.students[undoIteratorIndex].name
            + '</td><td>' + UNDO.students[undoIteratorIndex].cardID + '</td></tr>'
    }
    // $("#tableundo").append("<tbody>" + undoContent + "</tbody>");
    $("#table-undo").find("tbody").html(undoContent);

}
function setDone(DONE) {
    // var DONE = JSON.stringify(done);
    var doneContent = "";
    // console.log(DONE.students.length);
    for (var doneIteratorIndex = 0; doneIteratorIndex < DONE.students.length; doneIteratorIndex++) {
        doneContent += '<tr><td>' + DONE.students[doneIteratorIndex].studentID
            + '</td><td>' + DONE.students[doneIteratorIndex].name
            + '</td><td>' + DONE.students[doneIteratorIndex].score
            + '</td><td>' + DONE.students[doneIteratorIndex].cardID + '</td></tr>'
    }
    $("#table-done").find("tbody").html(doneContent);
    // $("#tabledone").append("<tbody>" + doneContent + "</tbody>");
    // console.log(doneContent);
}
function initChartist() {
    // console.log("initChart");        
    var labelForDone = Math.round(100 * (config.doneNumber / config.total)) + "%";
    var labelForUndo = Math.round(100 * (config.undoNumber / config.total)) + "%";
    //以下总人数还没有和上面的数据统一
    var labelA = Math.round(100 * (config.generalInfo.scoreBandCount.higherThan90 / config.doneNumber)) + "%";
    var labelB = Math.round(100 * (config.generalInfo.scoreBandCount.failed / config.doneNumber)) + "%";
    var labelC = Math.round(100 * (config.generalInfo.scoreBandCount.higherThan75 / config.doneNumber)) + "%";
    var labelD = Math.round(100 * (config.generalInfo.scoreBandCount.higherThan60 / config.doneNumber)) + "%";

    new Chartist.Pie('#completion-chart', {

        labels: [labelForDone,
            (config.undoNumber == 0 ? '' : labelForUndo)],
        series: [config.doneNumber, config.undoNumber]
    });
    new Chartist.Pie('#overall-chart', {
        labels: [labelA, labelB, labelC, labelD],
        series: [config.generalInfo.scoreBandCount.higherThan90,
        config.generalInfo.scoreBandCount.failed,
        config.generalInfo.scoreBandCount.higherThan75,
        config.generalInfo.scoreBandCount.higherThan60
        ]
    });
}

function commonSet() {
    // $("#school-name").html(DepartmentNameMap[config.generalInfo.DepartmentID]);
    if (config.undoNumber == 0) {
        $("#done-info").html(config.comments.dones.perfect);
        $("#undo-info").hide();
        $("#empty-comment").show();
    }
    else if (config.doneNumber == 0) {
        $("#done-info").hide();
        $("#undo-info").html(config.comments.undos.worst);
        $("#empty-comment").hide();
    }
    else {
        $("#done-info").html(config.comments.dones.common);
        $("#undo-info").html(config.comments.undos.common);
        $("#empty-comment").hide();
    }
    $("#average-score").html(config.generalInfo.averageScore);
    $("#max-score").html(config.generalInfo.maxScore);    
}
var temp = $.extend(true, done);//深拷贝 !important
var cnt = 0;

export default {
    data() {
        return {
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            this.refresh()
        })
    },
    methods: {
        department: function () {
            $.ajax({
                url: '/api/Counselor/ExportExcelofDepartment', //请求的url地址
                type: "POST", //请求方式
                // dataType: "json", //返回格式为json
                async: true,
                crossDomain: true,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                beforeSend: function () {
                    console.log('start download');
                },
                success: function (req) {
                    download(req);
                },
                complete: function () {
                },
                error: function (request) {
                    console.log("error:" + JSON.stringify(request));
                }
            });

        },
        refresh: function () {
            // console.log("click!");
            initChartist();
            setUndo(undo);
            setDone(done);
            commonSet();
            console.log(done);
            $("#table-done").find("th.score").click((function () {
                if (cnt % 3 == 0) {
                    $("#sort").hide();
                    $("#triangle-bottom").show();
                    $("#triangle-top").hide();
                    if (cnt == 0) {
                        temp.students.sort(by("Score"));
                        setDone(temp);
                        cnt++;
                        return;
                    }
                    temp.students.reverse();
                    cnt++;
                    setDone(temp);

                }
                else if (cnt % 3 == 1) {
                    $("#sort").hide();
                    $("#triangle-bottom").hide();
                    $("#triangle-top").show();
                    temp.students.reverse();
                    cnt++;
                    setDone(temp);

                }
                else if (cnt % 3 == 2) {
                    $("#sort").show();
                    $("#triangle-bottom").hide();
                    $("#triangle-top").hide();
                    cnt++;
                    setDone(done);

                }
            }))
            //先隐藏再筛选
            $("#search-undo-text").keyup(function () {
                var $key = $('#search-undo-text').val();
                $('#table-undo table tbody tr').hide().filter(":contains('" + $key + "')").show();
            });
            $("#search-done-text").keyup(function () {
                var $key = $('#search-done-text').val();
                $('#table-done table tbody tr').hide().filter(":contains('" + $key + "')").show();
            });

        }
    }
}