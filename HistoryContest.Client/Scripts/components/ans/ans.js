var $ = require("../../../node_modules/jquery/dist/jquery.min.js");
var jQuery = require("../../../node_modules/jquery/dist/jquery.min.js");
var inTime = require('./ans.ts').inTime;
var answerQues = [{ "id": 1, "answer": null },
{ "id": 2, "answer": null },
{ "id": 3, "answer": null },
{ "id": 4, "answer": null },
{ "id": 5, "answer": null },
{ "id": 6, "answer": null },
{ "id": 7, "answer": null },
{ "id": 8, "answer": null },
{ "id": 9, "answer": null },
{ "id": 10, "answer": null },
{ "id": 11, "answer": null },
{ "id": 12, "answer": null },
{ "id": 13, "answer": null },
{ "id": 14, "answer": null },
{ "id": 15, "answer": null },
{ "id": 16, "answer": null },
{ "id": 17, "answer": null },
{ "id": 18, "answer": null },
{ "id": 19, "answer": null },
{ "id": 20, "answer": null },
{ "id": 21, "answer": null },
{ "id": 22, "answer": null },
{ "id": 23, "answer": null },
{ "id": 24, "answer": null },
{ "id": 25, "answer": null },
{ "id": 26, "answer": null },
{ "id": 27, "answer": null },
{ "id": 28, "answer": null },
{ "id": 29, "answer": null },
{ "id": 30, "answer": null }
]
var $ = jQuery.noConflict();
var globalQ = {};



// answerQues[0] = "curAns"
var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/)[1];
$.ajaxSetup({
    headers: {
        "X-XSRF-TOKEN": match
    }
});



var content = '',
    questionsIteratorIndex,
    answersIteratorIndex;
var config = {
    totalAmount: 0,
    timeState: false,
    questionArray: [],
    resultHTML: '<section class="panel color4-alt" style = "width:95rem"><div class="inner columns"><div class="span-3-25"><h3 id = "head3" class="major">您的分数是：<span id="score"></span>分</h3><div class="table-wrapper" id="result-table"><table class="alt"><tbody id="table-content"></tbody><tfoot>提示：鼠标移到题号上可以查看原题哦！</tfoot></table></div></div><div  id="review-container" class="span-4" style = "visibility:hidden"></div></div></section>',
    resultJSON: {}
}
var currentPage = 0;


//生成网页
function set(init) {
    //生成多选题html
    config.questionArray = init;
    console.log(JSON.stringify(config.questionArray));
    var multipleChoice = 0;
    for (questionsIteratorIndex = 0; questionsIteratorIndex < init.length; questionsIteratorIndex++) {
        // alert(init.length)
        if (init[questionsIteratorIndex].type == "0") {
            multipleChoice++;
            content += '<section class="panel"><div class="inner columns" id="q' + (questionsIteratorIndex + 1) + '">'//题目id，为网页内链接表示（实现按钮跳转到下一题）
                + '<div class="intro joined"><h1 class = "major">' + (questionsIteratorIndex + 1) + '</h1></div>'//网页上显示的题目序号
                + '<div class="span-3-25"><h3 class="major">' + init[questionsIteratorIndex].question + '</h3>';//问题内容
            for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {//四个选项
                content += '<div class="field quarter selection"><input type="radio"'
                    + ' id="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1)//选项id，该id名称应与后端协商确定，与提交表单有关
                    + '" value="' + answersIteratorIndex
                    //          +'" onclick="saveAns(this)"'
                    + '" name="question' + (questionsIteratorIndex + 1) + '" class="color2" />'//单选radio的name，同上
                    + '<label for="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1) + '">'//同上 关于for属性可以参见参考文档
                    + init[questionsIteratorIndex].choices[answersIteratorIndex] + '</label></div><br>';//选项内容
            }
            content += '</div>';
            content += '<div class="intro  joined"><ul class="actions"><li><a id="#toQ' + (questionsIteratorIndex + 2) + '" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';
            content += '<section class="panel spotlight large right" ><div class="image  tinted" data-position="top left"><img src="/dist/Images/background' + (questionsIteratorIndex % 9) + '.jpg" alt="" /></div></section>';
        }
        else {
            content += '<section class="panel"><div class="inner columns" id="q' + (questionsIteratorIndex + 1) + '">'
                + '<div class="intro joined"><h1 class = "major">' + (questionsIteratorIndex + 1) + '</h1></div>'
                + '<div class="span-3-25"><h3 class="major">' + init[questionsIteratorIndex].question + '</h3>';
            for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {//两个选项
                content += '<div class="field quarter"><input type="radio" id="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1)
                    + '" value="' + answersIteratorIndex
                    //           +'" onclick="saveAns(this)"'
                    + '" name="question' + (questionsIteratorIndex + 1) + '" class="color2" />'
                    + '<label for="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1) + '">'
                    + (answersIteratorIndex == 0 ? '正确' : '错误') + '</label></div><br>';//判断题，选项为正确或错误
            }
            content += '</div>';
            if (questionsIteratorIndex + 1 != init.length) {//如果是最后一题，那么不需要有下一页按钮
                content += '<div class="intro  joined"><ul class="actions"><li><a id="#toQ' + (questionsIteratorIndex + 2) + '" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';

                content += '<section class="panel spotlight large right" ><div class="image  tinted" data-position="top left"><img src="/dist/Images/background' + (questionsIteratorIndex % 9) + '.jpg" alt="" /></div></section>'
            }
            else {
                content += '<div class="intro  joined"><ul class="actions"><li><a class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';
            }
        }
    }
    //生成判断题html
    $('#quiz-container').append(content);//生成html
    $('#multiple-sum').text(multipleChoice); //欢迎页显示选择题数量
    $('#TF-sum').text(init.length - multipleChoice);     //判断题数量
}
var contentFooter = '';
function answerCard(init) {
    for (var i = 0; i < init.length; i++) {
        contentFooter += '<a id="question' + (i + 1) + '" class="questionId">' + (i + 1) + "</a>";
    }
    $("#answerCard").html(contentFooter);
}

function setRESULT(RESULT) {
    if (config.questionArray.length == 0) {
        for (var i = 0; i < RESULT.details.length; i++) {
            var URLID = RESULT.details[i].id;
            $.ajax({
                url: '/api/Question/' + URLID, //请求的url地址
                type: "GET", //请求方式
                dataType: "json", //返回格式为json
                async: true,
                contentType: "application/json",
                success: function (res) {
                    config.questionArray.push(res);
                }
            });
        }
    }
    console.log(JSON.stringify(RESULT));

    // $("#sec1").remove();
    $("#sec1").remove();
    $("#sec2").remove();
    $("#quiz-container").remove();
    $("#banner").remove();
    $("#submission").remove();
    $(".header_2").remove();
    $("#footer").remove();
    $(".panel").css("width", "95rem");
    //SHOW RESULTS
    $("#result-container").html(config.resultHTML);
    config.resultJSON = RESULT;
    var tableContent = "";
    for (var resultsIteratorIndex = 0; resultsIteratorIndex < RESULT.details.length; resultsIteratorIndex++) {
        if (resultsIteratorIndex % 5 == 0)
            tableContent += "<tr>";
        tableContent += '<td><span class="num">' + (resultsIteratorIndex + 1) + ' </span>'
        if (RESULT.details[resultsIteratorIndex].correct == RESULT.details[resultsIteratorIndex].submit) {
            tableContent += ' <span class="fa fa-check" style="color:#3caa00"></span></td>'
        }
        else {
            tableContent += '  <span class="fa fa-close" style="color:rgb(240,130,0)"></span></td>'
        }

        if (resultsIteratorIndex % 5 == 4)
            tableContent += "</tr>";
    }
    $('#table-content').html(tableContent);
    $("#score").text(RESULT.score);
    $('#wrapper').css('left', '0px');
    $("td").hover(function (event) {
        var reviewContent = "";
        var $tgt = $(event.target);
        var questionNum = $tgt.find(".num").text();
        console.log(questionNum);
        var rightAns = RESULT.details[questionNum - 1].correct;
        var submittedAns = RESULT.details[questionNum - 1].submit;
        var isCorrect = (rightAns == submittedAns ? 1 : 0);
        if (questionNum <= 20) {//选择题
            reviewContent += '<h3 class="major">' + questionNum + '. ' + config.questionArray[questionNum - 1].question + '</h3>';
            for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {
                if (answersIteratorIndex == rightAns) {
                    reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'

                        + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + '</div><br>';//选项内容
                }
                else if (answersIteratorIndex == submittedAns && !isCorrect) {
                    reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'

                        + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + ' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                } else {
                    reviewContent += '<div class="field quarter">'

                        + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + '</div><br>';//选项内容
                }
            }

        }
        else {//判断题
            reviewContent += '<h3 class="major">' + questionNum + '. ' + config.questionArray[questionNum - 1].question + '</h3>';
            for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {
                if (answersIteratorIndex == rightAns) {
                    reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'

                        + (answersIteratorIndex == 0 ? '正确' : '错误') + '</div><br>';//选项内容
                }
                else if (answersIteratorIndex == submittedAns && !isCorrect) {
                    reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'

                        + (answersIteratorIndex == 0 ? '正确' : '错误') + ' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                } else {
                    reviewContent += '<div class="field quarter">'

                        + (answersIteratorIndex == 0 ? '正确' : '错误') + '</div><br>';//选项内容
                }
            }

        }
        $("#review-container").html(reviewContent);
        $("#review-container").css("visibility", "");//hover后显示题目
    }, function () {
        $("#review-container").css("visibility", "hidden");//hover后显示题目
    });

}

function saveAns(clickID) {
    // var ans = 0;
    var ans = clickID.value;
    var id = clickID;
    var ID = (id.length == 8 ? parseInt(id[6]) : parseInt(id[6]) * 10 + parseInt(id[7]));
    var testing;
    var ans = parseInt(id[id.length - 1]) - 1;
    answerQues[ID - 1].answer = ans;
    testing = JSON.stringify(answerQues);
    console.log(testing);
    $("#question" + ID).addClass("answered");
    setTimeout(function () {
        $("#question" + ID).click();
    }, 300);

}
function saveAnsID(questions) {
    for (var i = 0; i < 30; i++) {
        answerQues[i].id = questions[i].id;
    }
}
function submit(inTime) {
    var tot = 0;
    for (var i = 0; i < 30; i++)
        if (answerQues[i] == null) tot++;
    /////////////////////////////////
    if (tot == 0 && inTime == false) {
        alert("请认真作答哦~");
    }
    else if (tot != 0 || inTime == true)
        alert("您还有" + tot + "题未作答题目哦!");
    else {
        console.log(JSON.stringify(answerQues));

        // alert(JSON.stringify(answerQues));
        $.ajax({
            url: '/api/Result', //请求的url地址
            type: "POST", //请求方式
            dataType: "json", //返回格式为json
            async: false,
            data: JSON.stringify(answerQues),
            contentType: "application/json",
            beforeSend: function () {

            },
            success: function (res) {
                console.log(res);
                var RESULT = res;
                //////////////////////////////////////////////////////////
                if (config.questionArray.length == 0) {
                    for (var i = 0; i < RESULT.details.length; i++) {
                        var URLID = RESULT.details[i].id;
                        $.ajax({
                            url: '/api/Question/' + URLID, //请求的url地址
                            type: "GET", //请求方式
                            dataType: "json", //返回格式为json
                            async: true,
                            contentType: "application/json",
                            success: function (res) {
                                config.questionArray.push(res);
                            }
                        });
                    }
                }
                console.log(JSON.stringify(RESULT));

                // $("#sec1").remove();
                $("#sec1").remove();
                $("#sec2").remove();
                $("#quiz-container").remove();
                $("#banner").remove();
                $("#submission").remove();
                $(".header_2").remove();
                $("#footer").remove();
                $(".panel").css("width", "95rem");
                //SHOW RESULTS
                $("#result-container").html(config.resultHTML);
                config.resultJSON = RESULT;
                var tableContent = "";
                for (var resultsIteratorIndex = 0; resultsIteratorIndex < RESULT.details.length; resultsIteratorIndex++) {
                    if (resultsIteratorIndex % 5 == 0)
                        tableContent += "<tr>";
                    tableContent += '<td><span class="num">' + (resultsIteratorIndex + 1) + ' </span>'
                    if (RESULT.details[resultsIteratorIndex].correct == RESULT.details[resultsIteratorIndex].submit) {
                        tableContent += ' <span class="fa fa-check" style="color:#3caa00"></span></td>'
                    }
                    else {
                        tableContent += '  <span class="fa fa-close" style="color:rgb(240,130,0)"></span></td>'
                    }

                    if (resultsIteratorIndex % 5 == 4)
                        tableContent += "</tr>";
                }
                $('#table-content').html(tableContent);
                $("#score").text(RESULT.score);
                $('#wrapper').css('left', '0px');
                $("td").hover(function (event) {
                    var reviewContent = "";
                    var $tgt = $(event.target);
                    var questionNum = $tgt.find(".num").text();
                    console.log(questionNum);
                    var rightAns = RESULT.details[questionNum - 1].correct;
                    var submittedAns = RESULT.details[questionNum - 1].submit;
                    var isCorrect = (rightAns == submittedAns ? 1 : 0);
                    if (questionNum <= 20) {//选择题
                        reviewContent += '<h3 class="major">' + questionNum + '. ' + config.questionArray[questionNum - 1].question + '</h3>';
                        for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {
                            if (answersIteratorIndex == rightAns) {
                                reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'

                                    + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + '</div><br>';//选项内容
                            }
                            else if (answersIteratorIndex == submittedAns && !isCorrect) {
                                reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'

                                    + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + ' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                            } else {
                                reviewContent += '<div class="field quarter">'

                                    + config.questionArray[questionNum - 1].choices[answersIteratorIndex] + '</div><br>';//选项内容
                            }
                        }

                    }
                    else {//判断题
                        reviewContent += '<h3 class="major">' + questionNum + '. ' + config.questionArray[questionNum - 1].question + '</h3>';
                        for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {
                            if (answersIteratorIndex == rightAns) {
                                reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'

                                    + (answersIteratorIndex == 0 ? '正确' : '错误') + '</div><br>';//选项内容
                            }
                            else if (answersIteratorIndex == submittedAns && !isCorrect) {
                                reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'

                                    + (answersIteratorIndex == 0 ? '正确' : '错误') + ' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                            } else {
                                reviewContent += '<div class="field quarter">'

                                    + (answersIteratorIndex == 0 ? '正确' : '错误') + '</div><br>';//选项内容
                            }
                        }

                    }
                    $("#review-container").html(reviewContent);
                    $("#review-container").css("visibility", "");//hover后显示题目
                }, function () {
                    $("#review-container").css("visibility", "hidden");//hover后显示题目
                });
                /////////////////////////////////////////////////////////

            },
            complete: function () {
            },
            error: function (request) {
                alert("error:" + JSON.stringify(request));
            }
        });
    }
}
exports.getState = function () {
    var _this = this;
    var settings = {
        "async": true,
        // "crossDomain": true,
        "url": "/api/Student/State",
        "method": "GET",
        "headers": {
            "content-type": "application/json",
            "cache-control": "no-cache",
        }
    }
    $.ajax(settings).done(function (response) {
        console.log("get state response" + JSON.stringify(response));
        if (response.testState == 0) {
            /////////////initialize///////////////
            var settings = {
                "async": true,
                // "crossDomain": true,
                "url": "/api/Student/State/Initialize",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                }
            }
            $.ajax(settings).done(function (response) {

                if (response.isSeedSet != true) {
                    ////alert("Seed unset! Just hold on a second...")
                    var reset = {
                        "async": true,
                        // "crossDomain": true,
                        "url": "/api/Student/Seed",
                        "method": "POST",
                        "headers": {
                            "content-type": "application/json",
                            "cache-control": "no-cache",
                        }
                    }
                    $.ajax(reset).done(function (res) {
                        var setQuestions = {
                            "async": false,
                            "url": "/api/Question",
                            "method": "GET",
                            "contentType": "application/json",
                        }
                        $.ajax(setQuestions).done(function (questions) {
                            ////alert(JSON.stringify(questions)),
                            globalQ = questions,
                                set(questions),
                                answerCard(questions)
                        });
                        ////alert(JSON.stringify(res))
                    })
                }
                else {
                    console.log("start testing!");
                    var setQuestions = {
                        "async": false,
                        "url": "/api/Question",
                        "method": "GET",
                        "contentType": "application/json",
                    }
                    $.ajax(setQuestions).done(function (questions) {
                        ////alert(JSON.stringify(questions)),
                        globalQ = questions,
                            set(questions),
                            answerCard(questions)


                    });
                    ////alert("Boom! Bug exterminated(emmm....maybe not)!")

                }
                ///////////

            });
            ////alert(JSON.stringify(response.testState));
        }
        if (response.testState == 1) {
            /////////////testing/////////////
            // 	////alert("testing!We'll reset your seed for you...");
            var reset = {
                "async": true,
                // "crossDomain": true,
                "url": "/api/Student/State/Reset",
                "method": "POST",
                "headers": {
                    "content-type": "application/json",
                    "cache-control": "no-cache",
                }
            }
            $.ajax(reset).done(function (reset) {
                console.log("when teststate = 1, reset state" + reset);
                var setQuestions = {
                    "async": false,
                    "url": "/api/Question",
                    "method": "GET",
                    "contentType": "application/json",
                }
                $.ajax(setQuestions).done(function (questions) {
                    globalQ = questions,
                        set(questions),
                        answerCard(questions)
                })

                // ////alert(JSON.stringify(reset))
            })
            ////alert("Boom! Bug exterminated(emmm...possibly not yet...)!")

            /////////////////////////////////
            ////alert(JSON.stringify(response.testState));
        }
        else if (response.testState == 2) {
            $.ajax({
                url: '/api/Result', //请求的url地址
                type: "GET", //请求方式
                dataType: "json", //返回格式为json
                async: false,
                contentType: "application/json",
                beforeSend: function () {
                    // ////alert(this.url);
                },
                success: function (res) {
                    ////alert("tested!" + res);
                    setRESULT(res);
                },
                complete: function () {
                },
                error: function (request) {
                    ////alert("error:" + JSON.stringify(request));
                }
            });


        }
    });
}
function initialize() {
    var _this = this;
    // var settings = {
    // 	"async": true,
    // 	// "crossDomain": true,
    // 	"url": "/api/Student/State/Initialize",
    // 	"method": "POST",
    // 	"headers": {
    // 		"content-type": "application/json",
    // 		"cache-control": "no-cache",
    // 	}
    // }
    // $.ajax(settings).done(function (response) {

    // });

    $.ajax({
        url: "/api/Student/State/Initialize",
        async: true,
        type: "POST",
        beforeSend: function () {
            console.log("initialize");
            // cookieBeforeSend(xhr)
        },
        success: function (response) {
            console.log("initialize response" + response);
            if (response.isSeedSet == true) {
                var setQuestions = {
                    "async": false,
                    "url": "/api/Question",
                    "method": "GET",
                    "contentType": "application/json",
                }
                $.ajax(setQuestions).done(function (questions) {
                    globalQ = questions,
                        set(questions),
                        answerCard(questions)
                });
            }
            else {
                ////alert("Seed unset! Just hold on a second...")
                var reset = {
                    "async": true,
                    // "crossDomain": true,
                    "url": "/api/Student/Seed",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "cache-control": "no-cache",
                    }
                }
                $.ajax(reset).done(function (reset) {
                    console.log(JSON.stringify("RESET:" + reset))
                })
                ////alert("Boom! Bug exterminated(emmm....maybe not)!")
            }


        },
        error: function (req) {
            alert("初始化失败，请检查网络是否通畅")
            console.log(req);
        }
    });
}
exports.load = function () {

    var mm = 30;//分
    var ss = 0;//秒
    var timeState = false;//时间状态 默认为true 开启时间

    var inTime = false;
    
    $(document).on("click", "#wrapper input", function (id) {
        var ID = $(id.target).attr('id');
        if (ID != "submit") {
            alert("this");
            saveAns(ID);
            $('#wrapper').animate({
                left: "-=120rem"
            }, 300,"swing");
            currentPage++;

        } else {
            console.log(JSON.stringify(globalQ));
            submit(inTime);
        }
    });
    //page-scroll for icon fa-angle-right
    $(document).on("click", "#wrapper a.fa-angle-right", function (e) {
        var v_id = $(e.target).attr('id');
        if (v_id == "start") {
            saveAnsID(globalQ);
            var clientWidth = document.body.clientWidth;
            var fixWidth = (clientWidth - 16 * 55) / (2 * 16);
            var distance = "-=" + (129 - fixWidth) + "rem";
            $('#wrapper').animate({
                left: distance
            }, 300, "swing");
            currentPage = 1;
        } else {
            $('#wrapper').animate({
                left: "-=120rem"
            }, 300, "swing");
            currentPage++;
        }
    });

    //page-scroll for footer
    $(document).on("click", "#answerCard a.questionId", function (c) {
        var tgt = $(c.target).attr('id');
        if (tgt.length == 9) {
            var tgtId = parseInt(tgt[8]);
        } else {
            var tgtId = parseInt(tgt[8]) * 10 + parseInt(tgt[9]);
        }
        if (tgtId < currentPage) {
            var M = currentPage - tgtId;
            var distance = "+=" + (120 * M) + "rem";
            //		for (var i = 0; i < M; i++) {
            $('#wrapper').animate({
                left: distance
            }, 500, "swing");
            //			}, 300 / (currentPage - tgtId));
            currentPage -= M;
            //		}
        } else if (tgtId > currentPage) {
            var M = tgtId - currentPage;
            var distance = "-=" + (120 * M) + "rem";
            //		for (var i = 0; i < M; i++) {
            $('#wrapper').animate({
                left: distance
            }, 500, "swing");
            //			}, 300 / (tgtId - currentPage));
            currentPage += M;
            //		}
        }
    });
    /*实现计时器*/

    var time = setInterval(function () {
        if (timeState) {
            if (mm == 0 && ss == 1) {
                ss--;
                inTime = false;
                submit(inTime);
                $(".time").hide();
            }
            // else if (mm <= 25) {
            //     inTime = true;
            // }
            else {
                if (mm < 25) {
                    inTime = true;
                }
                var str = "";
                if (ss-- == 0) {
                    --mm;
                    ss = 59;
                }
                str += mm < 10 ? "0" + mm : mm;
                str += ":";
                str += ss < 10 ? "0" + ss : ss;
                $(".time").text(str);
            }
        }
        else {
            $(".time").text(' ');
        }
    }, 1000);
    // var answerQues = [];//name,answer(id)
    // $(document).ready(function () {
    $("#start").click(function () {
        $("#footer").show();
        timeState = true;
    });
    // });
}


// exports.ajaxSetup = function () {
//     $.ajaxSetup({
//         beforeSend: function (xhr) {
//             var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
//             xhr.setRequestHeader("X-XSRF-TOKEN", match && match[1]);
//         }
//     });
// // }

// exports.ajaxMatchSetup = function () {
//     var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/)[1];
//     $.ajaxSetup({
//         headers: {
//             "X-XSRF-TOKEN": match
//         }
//     })
// }

// exports.cookieBeforeSend = function (xhr) {
//         var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
//         xhr.setRequestHeader("X-XSRF-TOKEN", match && match[1]);
//     }
// }