var $ = require("../../../node_modules/jquery/dist/jquery.min.js");
var jQuery = require("../../../node_modules/jquery/dist/jquery.min.js");
var $ = jQuery.noConflict();
var Chartist = require("../../../node_modules/chartist/dist/chartist.js");
/********************Webpage Common Configurations********************/
var DepartmentNameMap = {
    1: "建筑学院",
    2: "机械工程学院",
    3: "能源与环境学院",
    4: "信息科学与工程学院",
    5: "土木工程学院",
    6: "电子科学与工程学院",
    7: "数学学院",
    8: "自动化学院",
    9: "计算机科学与工程学院、软件学院",
    71: "计算机科学与工程学院、软件学院"
}
var config = {
    department: null,
    departmentName: null,
    departmentInfo: {}, //summuray of current department
    generalInfo: {
        allDepartments: [], //all departments enum
        summary: {}, //general
        statistics: [] //summary of all departments
    },
    scoreList: null,
    undoList: [],
    undoNumber: null,
    doneList: [],
    doneNumber: null,
    total: null,
    comments: {
        dones: {
            perfect: "大家都很听话，全部完成作答了哦！",
            common: ""
        },
        undos: {
            worst: "偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
            common: ""
        }
    }

}
/********************Webpage Setting********************/
function setUndoNDo(SCORES) {
    var undo = [];
    var done = [];
    for (var scoresIteratorIndex = 0; scoresIteratorIndex < SCORES.length; scoresIteratorIndex++) {
        if (SCORES[scoresIteratorIndex].isCompleted) {
            done.push(SCORES[scoresIteratorIndex]);
        }
        else {
            undo.push(SCORES[scoresIteratorIndex]);
        }
    }
    config.scoreList = SCORES;
    config.undoList = undo;
    config.undoNumber = undo.length;
    config.doneList = done;
    config.doneNumber = done.length;
    config.total = undo.length + done.length;
    config.comments.dones.common = done.length + "人已完成答题,";
    config.comments.undos.common = "仍有" + config.undoNumber + "人未完成。"
    console.log(config.undoList);

    console.log(config.undoNumber = undo.length);
    console.log(config.doneList);
    console.log(config.doneNumber);
    console.log(config.comments.dones.common);
    console.log(config.comments.undos.common);

}
function setUndo(UNDO) {
    var undoContent = ""
    for (var undoIteratorIndex = 0; undoIteratorIndex < UNDO.length; undoIteratorIndex++) {
        undoContent += '<tr><td>' + UNDO[undoIteratorIndex].studentID
            + '</td><td>' + UNDO[undoIteratorIndex].name
            + '</td><td>' + UNDO[undoIteratorIndex].cardID + '</td></tr>'
    }

    $("#table-undo").find("tbody").html(undoContent);

}
function setDone(DONE) {
    var doneContent = "";
    for (var doneIteratorIndex = 0; doneIteratorIndex < DONE.length; doneIteratorIndex++) {
        doneContent += '<tr><td>' + DONE[doneIteratorIndex].studentID
            + '</td><td>' + DONE[doneIteratorIndex].name
            + '</td><td>' + DONE[doneIteratorIndex].score
            + '</td><td>' + DONE[doneIteratorIndex].cardID + '</td></tr>'
    }
    $("#table-done").find("tbody").html(doneContent);
}
function setChartist() {
    var labelForDone = Math.round(100 * (config.doneNumber / config.total)) + "%";
    var labelForUndo = Math.round(100 * (config.undoNumber / config.total)) + "%";
    var labelA = Math.round(100 * (config.departmentInfo.scoreBandCount.higherThan90 / config.doneNumber)) + "%";
    var labelB = Math.round(100 * (config.departmentInfo.scoreBandCount.failed / config.doneNumber)) + "%";
    var labelC = Math.round(100 * (config.departmentInfo.scoreBandCount.higherThan75 / config.doneNumber)) + "%";
    var labelD = Math.round(100 * (config.departmentInfo.scoreBandCount.higherThan60 / config.doneNumber)) + "%";

    Chartist.Pie('#completion-chart', {
        labels: [(config.doneNumber == 0 ? " " : labelForDone),
        (config.undoNumber == 0 ? " " : labelForUndo)],
        series: [config.doneNumber, config.undoNumber]
    });
    //若无人作答，显示相应提示信息
    if (config.doneNumber == 0) {
        Chartist.Pie('#overall-chart', {

            labels: [
                "尚未有学生作答"
            ],
            series: [
                100
            ]
        });
    }
    else {
        Chartist.Pie('#overall-chart', {

            labels: [
                (config.departmentInfo.scoreBandCount.higherThan90 == 0 ? '' : labelA),
                (config.departmentInfo.scoreBandCount.failed == 0 ? '' : labelB),
                (config.departmentInfo.scoreBandCount.higherThan75 == 0 ? '' : labelC),
                (config.departmentInfo.scoreBandCount.higherThan60 == 0 ? '' : labelD)
            ],
            series: [
                config.departmentInfo.scoreBandCount.higherThan90,
                config.departmentInfo.scoreBandCount.failed,
                config.departmentInfo.scoreBandCount.higherThan75,
                config.departmentInfo.scoreBandCount.higherThan60
            ]
        });
    }
}
function setGeneralChartist() {
    $("#average-score-general").html(config.generalInfo.summary.averageScore.toFixed(2));
    $("#max-score-general").html(config.generalInfo.summary.maxScore);
    var gDoneNum = config.generalInfo.summary.scoreBandCount.failed
        + config.generalInfo.summary.scoreBandCount.higherThan60
        + config.generalInfo.summary.scoreBandCount.higherThan75
        + config.generalInfo.summary.scoreBandCount.higherThan90;
    var gUndoNum = config.generalInfo.summary.scoreBandCount.notTested;
    var gTot = gDoneNum + gUndoNum;
    var labelForDone = Math.round(100 * (gDoneNum / gTot)) + "%";
    var labelForUndo = Math.round(100 * (gUndoNum / gTot)) + "%";
    var labelA = Math.round(100 * (config.generalInfo.summary.scoreBandCount.higherThan90 / gDoneNum)) + "%";
    var labelB = Math.round(100 * (config.generalInfo.summary.scoreBandCount.failed / gDoneNum)) + "%";
    var labelC = Math.round(100 * (config.generalInfo.summary.scoreBandCount.higherThan75 / gDoneNum)) + "%";
    var labelD = Math.round(100 * (config.generalInfo.summary.scoreBandCount.higherThan60 / gDoneNum)) + "%";

    Chartist.Pie('#completion-chart-general', {
        labels: [(gDoneNum == 0 ? ' ' : labelForDone),
        (gUndoNum == 0 ? ' ' : labelForUndo)],
        series: [gDoneNum, gUndoNum]
    });
    //若无人作答，显示相应提示信息
    if (gDoneNum == 0) {
        Chartist.Pie('#overall-chart-general', {

            labels: [
                "尚未有学生作答"
            ],
            series: [
                100
            ]
        });
    }
    else {
        Chartist.Pie('#overall-chart-general', {

            labels: [
                (config.generalInfo.summary.scoreBandCount.higherThan90 == 0 ? '' : labelA),
                (config.generalInfo.summary.scoreBandCount.failed == 0 ? '' : labelB),
                (config.generalInfo.summary.scoreBandCount.higherThan75 == 0 ? '' : labelC),
                (config.generalInfo.summary.scoreBandCount.higherThan60 == 0 ? '' : labelD)
            ],
            series: [
                config.generalInfo.summary.scoreBandCount.higherThan90,
                config.generalInfo.summary.scoreBandCount.failed,
                config.generalInfo.summary.scoreBandCount.higherThan75,
                config.generalInfo.summary.scoreBandCount.higherThan60
            ]
        });
    }
}
function setGENERAL() {
    var generalContent = "";
    var STAT = config.generalInfo.statistics;

    console.log(STAT);
    for (var statIteratorIndex = 0; statIteratorIndex < STAT.length; statIteratorIndex++) {
        var donenum = STAT[statIteratorIndex].donenum;
        var average = STAT[statIteratorIndex].average;
        var completion = STAT[statIteratorIndex].completion;
        var proportionA = STAT[statIteratorIndex].proportionA;
        var proportionB = STAT[statIteratorIndex].proportionB;
        var proportionC = STAT[statIteratorIndex].proportionC;
        var proportionD = STAT[statIteratorIndex].proportionD;
        generalContent += '<tr><td>' + STAT[statIteratorIndex].departmentID
            + '</td><td>' + average
            + '</td><td>' + completion
            + '</td><td>' + proportionA
            + '</td><td>' + proportionB
            + '</td><td>' + proportionC
            + '</td><td>' + proportionD + '</td></tr>'
    }
    $("#table-general").find("tbody").html(generalContent);
}
function commonSet() {
    console.log(config.departmentName);
    $("#school-name").html(config.departmentName);
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
    $("#average-score").html(config.departmentInfo.averageScore.toFixed(2));
    $("#max-score").html(config.departmentInfo.maxScore);

}
/********************Variable Needed for Search********************/
var temp = new Array();
var cnt = 0;
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
/********************API Interfaces********************/
//Initialize the Score Tab, call this function only once.
function fetchSummary(department, callback) {
    if (department == undefined) {
        department = "";
    }
    else {
        department = '/' + department;
    }
    $.ajax({
        url: '/api/Counselor/Scores/Summary' + department,
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (req) {
            //Department Info
            if (req.departmentID != undefined) {
                //counselor department
                if (req.departmentID == config.department) {
                    console.log(req);
                    config.departmentInfo = req;
                    console.log(config.departmentInfo);
                    config.departmentName = DepartmentNameMap[config.departmentInfo.departmentID];
                    console.log(config.departmentInfo.departmentID);
                    var stat = req;
                    stat.donenum = stat.studentCount - stat.scoreBandCount.notTested;
                    stat.average = stat.averageScore.toFixed(2);
                    stat.completion = 100 * (1 - stat.scoreBandCount.notTested / stat.studentCount);
                    stat.proportionA = Math.round(100 * (stat.scoreBandCount.higherThan90 / stat.donenum));
                    stat.proportionB = Math.round(100 * (stat.scoreBandCount.higherThan75 / stat.donenum));
                    stat.proportionC = Math.round(100 * (stat.scoreBandCount.higherThan60 / stat.donenum));
                    stat.proportionD = Math.round(100 * (stat.scoreBandCount.failed / stat.donenum));
                    config.generalInfo.statistics.push(stat);// !!!danger
                    if (callback != undefined) {
                        callback();
                    }

                }
                //other
                else {
                    console.log(req);
                    var stat = req;
                    stat.donenum = stat.studentCount - stat.scoreBandCount.notTested;
                    stat.average = stat.averageScore.toFixed(2);
                    stat.completion = 100 * (1 - stat.scoreBandCount.notTested / stat.studentCount);
                    stat.proportionA = Math.round(100 * (stat.scoreBandCount.higherThan90 / stat.donenum));
                    stat.proportionB = Math.round(100 * (stat.scoreBandCount.higherThan75 / stat.donenum));
                    stat.proportionC = Math.round(100 * (stat.scoreBandCount.higherThan60 / stat.donenum));
                    stat.proportionD = Math.round(100 * (stat.scoreBandCount.failed / stat.donenum));
                    config.generalInfo.statistics.push(stat);
                    if (callback != undefined) {
                        config.generalInfo.statistics.sort(by("departmentID"));
                        config.generalInfo.statistics.reverse();
                        callback();//setGENERAL
                    }
                }

            }
            //General Info
            else {
                console.log(req);
                config.generalInfo.summary = req;
                console.log(config.generalInfo.summary);
                //set chartist
                if (callback != undefined) {
                    callback();
                }

            }
        },
        error: function () {
            alert("数据获取失败，请检查网络！");
        }
    });

}
function fetchAllScores() {

    $.ajax({
        url: '/api/Counselor/Scores/All',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (req) {
            console.log(req);
            setUndoNDo(req);
            setUndo(config.undoList);
            setDone(config.doneList);
            setChartist();
            commonSet();
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
    });
}

exports.setScoreData = function () {
    config = {
        department: null,
        departmentName: null,
        departmentInfo: {}, //summuray of current department
        generalInfo: {
            allDepartments: [], //all departments enum
            summary: {}, //general
            statistics: [] //summary of all departments
        },
        scoreList: null,
        undoList: [],
        undoNumber: null,
        doneList: [],
        doneNumber: null,
        total: null,
        comments: {
            dones: {
                perfect: "大家都很听话，全部完成作答了哦！",
                common: ""
            },
            undos: {
                worst: "偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
                common: ""
            }
        }
    
    }
    
    $.ajax({
        url: '/api/Counselor/Department',
        async: true,
        type: "GET",
        contentType: "application/json",
        dataType: "json",
        success: function (req) {
            console.log(req);
            config.department = req;
            console.log(config.department);
            fetchSummary(config.department, fetchAllScores);
        },
        error: function (xhr) {
            alert("数据获取失败，请检查网络！");
            console.log(xhr);
        }
    });
}
exports.setGeneralData = function () {
    fetchSummary("", setGeneralChartist);
    fetchAllDepartments();
}

//When department summary is fetched, a callback may be needed to fetch all scores of current department.
//However, Counselor CANNOT get scores of other departments.
//To fetch general summary of all departments, no params are needed.

//Ensure Counselor CANNOT get scores of other departments.
//Set tab1 tables
function fetchAllStudents() {
    $.ajax({
        url: '/api/Counselor/AllStudents',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (req) {
            console.log(req);

        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
    });
}
//fetch department id enum & statistics
function fetchAllDepartments() {
    $.ajax({
        url: '/api/Counselor/AllDepartments',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "GET",
        success: function (req) {
            console.log(req);
            config.generalInfo.allDepartments = req;

            for (var i = 0; i < config.generalInfo.allDepartments.length; i++) {
                if (config.generalInfo.allDepartments[i] == config.department) {
                    continue;
                }
                if (i + 1 < config.generalInfo.allDepartments.length) {
                    fetchSummary(config.generalInfo.allDepartments[i]);
                }
                else {
                    fetchSummary(config.generalInfo.allDepartments[i], setGENERAL);
                }
            }


        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
    });
}
function resetIcon() {
    $("#dpt i").removeClass();
    $("#avg i").removeClass();
    $("#cpl i").removeClass();
    $("#pta i").removeClass();
    $("#ptb i").removeClass();
    $("#ptc i").removeClass();
    $("#ptd i").removeClass();
}

exports.downloadDepartmentExcel = function () {
    $.ajax({
        url: '/api/Counselor/ExportExcelofDepartment',
        async: true,
        type: "POST",
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        success: function (req) {
            window.location = '/excel/' + req;
        },
        error: function (xhr) {
            alert("数据获取失败，请检查网络！");
            console.log(xhr);
        }
    });
}
exports.downloadExcelOfAllDepartments = function () {
    $.ajax({
        url: '/api/Counselor/ExportExcelOfAllDepartments', //请求的url地址
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        crossDomain: true,
        type: "POST", //请求方式
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        success: function (req) {
            console.log(req);
            window.location = '/excel/' + req;
        },
        error: function (xhr) {
            alert("数据获取失败，请检查网络！");
            console.log(xhr);
        }
    });
}


/********************Document Ready Function********************/
exports.sort = function () {
    $("#table-done").find("th.score").click(function () {
        if (cnt % 3 == 0) {
            $("#sort").hide();
            $("#triangle-bottom").show();
            $("#triangle-top").hide();
            if (cnt == 0) {
                temp = config.doneList.slice(0);//深拷贝 !important
                temp.sort(by("score"));
                setDone(temp);
                cnt++;
                return;
            }
            temp.reverse();
            cnt++;
            setDone(temp);

        }
        else if (cnt % 3 == 1) {
            $("#sort").hide();
            $("#triangle-bottom").hide();
            $("#triangle-top").show();
            temp.reverse();
            cnt++;
            setDone(temp);

        }
        else if (cnt % 3 == 2) {
            $("#sort").show();
            $("#triangle-bottom").hide();
            $("#triangle-top").hide();
            cnt++;
            setDone(config.doneList);

        }



    })

    var dpt = 0;
    var avg = 0;
    var cpl = 0;
    var pta = 0;
    var ptb = 0;
    var ptc = 0;
    var ptd = 0;
    $("#dpt").click(
        function () {
            resetIcon();
            if (dpt == 0) {
                $("#dpt i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("departmentID"));
                dpt = 1;
            }
            else {
                $("#dpt i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("departmentID"));
                config.generalInfo.statistics.reverse();
                dpt = 0;
            }
            setGENERAL();
        }
    )
    $("#avg").click(
        function () {
            resetIcon();
            if (avg == 0) {
                $("#avg i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("average"));
                avg = 1;
            }
            else {
                $("#avg i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("average"));
                config.generalInfo.statistics.reverse();
                avg = 0;
            }
            setGENERAL();
        }
    )
    $("#cpl").click(
        function () {
            resetIcon();
            if (cpl == 0) {
                $("#cpl i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("completion"));
                cpl = 1;
            }
            else {
                $("#cpl i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("completion"));
                config.generalInfo.statistics.reverse();
                cpl = 0;
            }
            setGENERAL();
        }
    )
    $("#pta").click(
        function () {
            resetIcon();
            if (pta == 0) {
                $("#pta i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("proportionA"));
                pta = 1;
            }
            else {
                $("#pta i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("proportionA"));
                config.generalInfo.statistics.reverse();
                pta = 0;
            }
            setGENERAL();
        }
    )
    $("#ptb").click(
        function () {
            resetIcon();
            if (ptb == 0) {
                $("#ptb i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("proportionB"));
                ptb = 1;
            }
            else {
                $("#ptb i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("proportionB"));
                config.generalInfo.statistics.reverse();
                ptb = 0;
            }
            setGENERAL();
        }
    )
    $("#ptc").click(
        function () {
            resetIcon();
            if (ptc == 0) {
                $("#ptc i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("proportionC"));
                ptc = 1;
            }
            else {
                $("#ptc i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("proportionC"));
                config.generalInfo.statistics.reverse();
                ptc = 0;
            }
            setGENERAL();
        }
    )
    $("#ptd").click(
        function () {
            resetIcon();
            if (ptd == 0) {
                $("#ptd i").addClass("glyphicon glyphicon-triangle-top");
                config.generalInfo.statistics.sort(by("proportionD"));
                ptd = 1;
            }
            else {
                $("#ptd i").addClass("glyphicon glyphicon-triangle-bottom");
                config.generalInfo.statistics.sort(by("proportionD"));
                config.generalInfo.statistics.reverse();
                ptd = 0;
            }
            setGENERAL();
        }
    )
    //Search 先隐藏再筛选
    $("#search-undo-text").keyup(function () {
        var $key = $('#search-undo-text').val();
        $('#table-undo table tbody tr').hide().filter(":contains('" + $key + "')").show();
    });
    $("#search-done-text").keyup(function () {
        var $key = $('#search-done-text').val();
        $('#table-done table tbody tr').hide().filter(":contains('" + $key + "')").show();
    });
}

exports.logOut=function(){
    $.ajax({
        url: '/api/Account/Logout',
        contentType: "application/json",
        dataType: "json",
        async: true,
        type: "POST",
        success: function (req) {
            console.log(req);
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
    });
   
}