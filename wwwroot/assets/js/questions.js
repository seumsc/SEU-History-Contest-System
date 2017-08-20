/*var sample=[
    {
        "ID":0,
        "type":0,  
        "question":'南京高等师范学校继三所师范学校成为我国成立的最早的第四所国立高等师范学校，其中不是这三所学校之一的是：',
        "choices":[
            '武昌高师',
            '北京高师',
            '长沙高师',
            '广州高师'
        ]
    },
    {
        "ID":100,
        "type":1,
        "question":"三江师范时期的速成科学制是1年。"
    }
]



	
       
var content = '',
    init='',
    contentFooter='',
    questionsIteratorIndex,
    answersIteratorIndex;
    
    //生成网页
function set(QUESTIONS){
    //生成多选题html
    for (questionsIteratorIndex = 0; questionsIteratorIndex < QUESTIONS.length; questionsIteratorIndex++) {
        content += '<section class="panel"><div class="inner columns" id="q'+(questionsIteratorIndex + 1)+'">'//题目id，为网页内链接表示（实现按钮跳转到下一题）
        +'<div class="intro joined"><h1>'+(questionsIteratorIndex + 1)+'</h1></div>'//网页上显示的题目序号
        +'<div class="span-3-25"><h3 class="major">'+ QUESTIONS[questionsIteratorIndex].question+'</h3>';//问题内容
        if(QUESTIONS[questionsIteratorIndex].type==0){//选择题
          
            for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {//四个选项
                content += '<div class="field quarter"><input type="radio"'
                +' id="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)//选项id，在HTML中唯一
                +'" value="'+answersIteratorIndex
                +'" onclick="saveAns(this)"'
                +'" name="'+QUESTIONS[questionsIteratorIndex].ID+'" class="color2" />'//hash code
                +'<label for="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)+'">'
                +QUESTIONS[questionsIteratorIndex].choices[answersIteratorIndex] +'</label></div><br>';
            }//选项内容
            content += '</div>';           
        }
        else{//判断题
            
            for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {//两个选项
                content += '<div class="field quarter"><input type="radio" id="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)
                +'" value="'+answersIteratorIndex
                +'" onclick="saveAns(this)"'
                +'" name="'+QUESTIONS[questionsIteratorIndex].ID+'" class="color2" />'
                +'<label for="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)+'">'
                +(answersIteratorIndex==0?'正确':'错误') +'</label></div><br>';
            }//选项为正确或错误
            content += '</div>';
        }
        if(questionsIteratorIndex+1!= QUESTIONS.length){//下一页按钮及图片
            content += '<div class="intro  joined"><ul class="actions"><li><a href="#q'+(questionsIteratorIndex + 2)+'" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';        
            content+='<section class="panel spotlight large right" ><div class="image  tinted" data-position="top left"><img src="images/background'+(questionsIteratorIndex%9)+'.jpg" alt="" /></div></section>'
        }
        else{//如果是最后一题,链接指向提交页
            content += '<div class="intro  joined"><ul class="actions"><li><a href="#submission" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>'; 
        }
        
    }//end of for
    for(var i=0;i<QUESTIONS.length;i++){
        contentFooter +='<a href="#q'+(i+1)+'" id="question'+(i+1)+'" class="questionId">'+(i+1)+"</a>";
    }
    $("#answerCard").html(contentFooter);
    $('#quiz-container').append(content);//生成html


}


$(function(){
    
Mock.mock("http://mockjs","get",{"array|10":[
    {
    "ID":"@guid()",
    "type":0,
    "question":'@csentence(10,30)',
    "choices|4":[
        '@cword(3,10)',
    ]
    }
]

})
    $.ajax({
        url: "http://mockjs", //请求的url地址
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性

        type: "GET", //请求方式
        beforeSend: function () {
          //请求前的处理

        },
        success: function (req) {
          //请求成功时处理
          set(req.array);
          console.log(sample);
          
         
          console.log(req);
        },
        complete: function () {
          //请求完成的处理
        },
        error: function () {
          //请求出错处理
          
        }
      });
    //初始化
   //set(sample);
}
)*/