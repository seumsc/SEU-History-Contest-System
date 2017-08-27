var jQuery = require("../../../node_modules/jquery/dist/jquery.min.js");
var $ = jQuery.noConflict();

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

//生成网页
exports.set = function (init) {
    //生成多选题html
    config.questionArray=init;
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
                content += '<div class="field quarter"><input type="radio"'
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
exports.answerCard = function (init) {
    for (var i = 0; i < init.length; i++) {
        contentFooter += '<a id="question' + (i + 1) + '" class="questionId">' + (i + 1) + "</a>";
    }
    $("#answerCard").html(contentFooter);
}

exports.setRESULT = function (RESULT) {
    console.log(JSON.stringify(RESULT));    
    $("#sec1").remove();
    $("#sec1").remove();
    $("#sec2").remove();
    $("#quiz-container").remove();
    $("#banner").remove();
    $("#submission").remove();
    $(".header_2").remove();
    $("#footer").remove();
    $(".panel").css("width","95rem");
//SHOW RESULTS
    $("#result-container").html(config.resultHTML);
    config.resultJSON=RESULT;
    var tableContent = "";  
    for (var resultsIteratorIndex = 0; resultsIteratorIndex < 30; resultsIteratorIndex++) {
        if (resultsIteratorIndex % 5 == 0)
            tableContent += "<tr>";
        tableContent += '<td><span class="num">' + (resultsIteratorIndex + 1) + ' </span>'
        if (RESULT.details[resultsIteratorIndex].rightAnswer == RESULT.details[resultsIteratorIndex].submittedAnswer) {
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
    $('#wrapper').css('left','0px');    
    $("td").hover(function(event) {
        var reviewContent="";	
        var $tgt=$(event.target);
        var questionNum=$tgt.find(".num").text();
        console.log(questionNum);
        var rightAns=RESULT.details[questionNum-1].rightAnswer;
        var submittedAns=RESULT.details[questionNum-1].submittedAnswer;
        var isCorrect=(rightAns==submittedAns?1:0);
        if (questionNum<=20){//选择题
            reviewContent+='<h3 class="major">' +questionNum+'. '+config.questionArray[questionNum-1].question+'</h3>';
            for(answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++ ){
                if(answersIteratorIndex==rightAns){
                    reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'
                    
                    +config.questionArray[questionNum-1].choices[answersIteratorIndex] +'</div><br>';//选项内容
                }
                else if(answersIteratorIndex==submittedAns && !isCorrect){
                    reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'
                    
                    +config.questionArray[questionNum-1].choices[answersIteratorIndex] +' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                }else{
                reviewContent += '<div class="field quarter">'
                
                +config.questionArray[questionNum-1].choices[answersIteratorIndex] +'</div><br>';//选项内容
                }
            }
  
        }
        else{//判断题
            reviewContent+='<h3 class="major">' +questionNum+'. '+config.questionArray[questionNum-1].question+'</h3>';
            for(answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++ ){
                if(answersIteratorIndex==rightAns){
                    reviewContent += '<div class="field quarter" style="color:#3caa00">答案：'
                    
                    +(answersIteratorIndex==0?'正确':'错误')  +'</div><br>';//选项内容
                }
                else if(answersIteratorIndex==submittedAns && !isCorrect){
                    reviewContent += '<div class="field quarter" style="color:rgb(240,130,0)">'
                    
                    +(answersIteratorIndex==0?'正确':'错误')  +' <span class="fa fa-close" style="color:rgb(240,130,0)"></span></div><br>';//选项内容
                }else{
                reviewContent += '<div class="field quarter">'
                
                +(answersIteratorIndex==0?'正确':'错误')  +'</div><br>';//选项内容
                }
            }
  
        }
        $("#review-container").html(reviewContent);           
        $("#review-container").css("visibility","");//hover后显示题目
    },function() {
        $("#review-container").css("visibility","hidden");//hover后显示题目
    });
  
}
