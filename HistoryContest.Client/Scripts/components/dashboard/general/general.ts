import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import { Component } from 'vue-property-decorator';//不能被注释掉！
import $ from 'jquery';
import Chartist from 'chartist';
var download = require('../download.js').download;

var schoolInfo = {
    "DepartmentID": 711,
    "CounselorName": "郭佳",
    "MaxScore": 91,
    "AverageScore": 75.21,
    "ScoreBandCount": {
        "HigherThan90": 5,
        "HigherThan75": 36,
        "HigherThan60": 100,
        "Failed": 20
    }
}
var DepartmentNameMap = {
    "010": "建筑学院",
    "020": "机械工程学院",
    "030": "能源与环境学院",
    "040": "信息科学与工程学院",
    "050": "土木工程学院",
    "060": "电子科学与工程学院",
    "070": "数学学院",
    "080": "自动化学院",
    "090": "计算机科学与工程学院、软件学院",
    "711": "计算机科学与工程学院、软件学院"
}
var general= [];
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
        // alert("return:"+JSON.stringify(res));
        for (var i = 0; i < res.length; i++) {
            if (res[i].isCompleted) {
                general.push(res[i]);
            }
            else general.push(res[i]);

        }
    },
    complete: function () {
    },
    error: function (request) {
        alert("get scores/all/{id}error:" + JSON.stringify(request));
    }
});

var config = {
    generalInfo: schoolInfo,
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
    // alert(DONE.students.length);
    for (var doneIteratorIndex = 0; doneIteratorIndex < DONE.students.length; doneIteratorIndex++) {
        doneContent += '<tr><td>' + DONE.students[doneIteratorIndex].studentID
            + '</td><td>' + DONE.students[doneIteratorIndex].name
            + '</td><td>' + DONE.students[doneIteratorIndex].score
            + '</td><td>' + DONE.students[doneIteratorIndex].cardID + '</td></tr>'
    }
    $("#table-done").find("tbody").html(doneContent);
    // $("#tabledone").append("<tbody>" + doneContent + "</tbody>");
    // alert(doneContent);
}
function initChartist() {
    // alert("initChart");        
    var labelForDone = Math.round(100 * (config.doneNumber / config.total)) + "%";
    var labelForUndo = Math.round(100 * (config.undoNumber / config.total)) + "%";
    //以下总人数还没有和上面的数据统一
    var labelA = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan90 / 161)) + "%";
    var labelB = Math.round(100 * (config.generalInfo.ScoreBandCount.Failed / 161)) + "%";
    var labelC = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan75 / 161)) + "%";
    var labelD = Math.round(100 * (config.generalInfo.ScoreBandCount.HigherThan60 / 161)) + "%";

    new Chartist.Pie('#completion-chart-general', {

        labels: [labelForDone,
            (config.undoNumber == 0 ? '' : labelForUndo)],
        series: [config.doneNumber, config.undoNumber]
    });
    new Chartist.Pie('#overall-chart-general', {
        labels: [labelA, labelB, labelC, labelD],
        series: [config.generalInfo.ScoreBandCount.HigherThan90,
        config.generalInfo.ScoreBandCount.Failed,
        config.generalInfo.ScoreBandCount.HigherThan75,
        config.generalInfo.ScoreBandCount.HigherThan60
        ]
    });
}

function commonSet() {
    $("#school-name").html(DepartmentNameMap[config.generalInfo.DepartmentID]);
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
    $("#average-score").html(config.generalInfo.AverageScore);

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
        allDepartments: function () {
            $.ajax({
                url: '/api/Counselor/ExportExcelofAllDepartments', //请求的url地址
                type: "POST", //请求方式
                // dataType: "json", //返回格式为json
                async: true,
                crossDomain: true,
                contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                beforeSend: function () {
                    alert('start download');
                },
                success: function (req) {
                    download(req);
                },
                complete: function () {
                },
                error: function (request) {
                    alert("error:" + JSON.stringify(request));
                }
            });

        },

        refresh: function () {
            // alert("click!");
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