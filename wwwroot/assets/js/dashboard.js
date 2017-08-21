var schoolInfo={
    "DepartmentID":711,
    "CounselorName":"郭佳",
    "MaxScore":91,
    "AverageScore":75.21,
    "ScoreBandCount":{
        "HigherThan90":1,
        "HigherThan75":0,
        "HigherThan60":1,
        "Failed":1
    }
}//传入的院系分数概况sample
var scoreList=[
    {
        "studentID":"09016435",
        "cardID":"213161269",
        "name":"杨航源",
        "isCompleted":true,
        "score":60
    },
    {
        "studentID":"09016423",
        "cardID":"213161299",
        "name":"陈启宣",
        "isCompleted":true,
        "score":100
        
    },
    {
        "studentID":"09016414",
        "cardID":"213163210",
        "name":"罗崟洪",
        "isCompleted":false,
        "score":0
        
    }
]//传入的全院分数sample
var DepartmentNameMap={
    "010":"建筑学院",
    "020":"机械工程学院",
    "030":"能源与环境学院",
    "040":"信息科学与工程学院",
    "050":"土木工程学院",
    "060":"电子科学与工程学院",
    "070":"数学学院",
    "080":"自动化学院",
    "090":"计算机科学与工程学院、软件学院",
    "711":"计算机科学与工程学院、软件学院"
}

function setUndoNDo(SCORES){
    var undo=[];
    var done=[];
    for(var scoresIteratorIndex=0;scoresIteratorIndex<SCORES.length;scoresIteratorIndex++){
        if(SCORES[scoresIteratorIndex].isCompleted){
            done.push(SCORES[scoresIteratorIndex]);
        }
        else{
            undo.push(SCORES[scoresIteratorIndex]);
        }
    }
    config.scoreList=SCORES;
    config.undoList=undo;
    config.undoNumber=undo.length;
    config.doneList=done;
    config.doneNumber=done.length;
    config.total=undo.length+done.length;
    config.comments.dones.common=done.length+"人已完成答题,";
    config.comments.undos.common="仍有"+config.undoNumber+"人未完成。"
    console.log( config.undoList);
    
    console.log(config.undoNumber=undo.length);
    console.log( config.doneList);
    console.log(config.doneNumber);
    console.log(config.comments.dones.common);
    console.log(config.comments.undos.common);

}
/*以下数据不再是JSON格式，已经退化为数组了
var undo={
    'students':[
        {"ID":"09016435","Name":"杨航源","Score":60,"CardID":"213161269"},
        {"ID":"09016423","Name":"陈启宣","Score":100,"CardID":"213161299"},
        {"ID":"09016414","Name":"罗崟洪","Score":0,"CardID":"213163210"}
       
    ]
};
var done={
    'students':[
        {"ID":"09016435","Name":"杨航源","Score":60,"CardID":"213161269"},
        {"ID":"09016423","Name":"陈启宣","Score":100,"CardID":"213161299"},
        {"ID":"09016414","Name":"罗崟洪","Score":0,"CardID":"213163210"}
        ]
};*/
var config={
    departmentName:null,
    generalInfo:null,
    scoreList:null,
    undoList:[],
    undoNumber:null,
    doneList:[],
    doneNumber:null,
    total:null,
    comments:{
        dones:{
            perfect:"大家都很听话，全部完成作答了哦！",
            common:""         
        },
        undos:{
            worst:"偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
            common:""
        }
    }

}
var by = function(name){
    return function(o, p){
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
   
function setUndo(UNDO){
    var undoContent=""       
    for(var undoIteratorIndex=0;undoIteratorIndex<UNDO.length;undoIteratorIndex++){
        undoContent+='<tr><td>'+UNDO[undoIteratorIndex].studentID
        +'</td><td>'+UNDO[undoIteratorIndex].name
        +'</td><td>'+UNDO[undoIteratorIndex].cardID+'</td></tr>'
    }
   
    $("#table-undo").find("tbody").html(undoContent);
   
}
function setDone(DONE){
    var  doneContent="";
    for(var doneIteratorIndex=0;doneIteratorIndex<DONE.length;doneIteratorIndex++){
        doneContent+='<tr><td>'+DONE[doneIteratorIndex].studentID
        +'</td><td>'+DONE[doneIteratorIndex].name
        +'</td><td>'+DONE[doneIteratorIndex].score
        +'</td><td>'+DONE[doneIteratorIndex].cardID+'</td></tr>'
    }
    $("#table-done").find("tbody").html(doneContent);
}
function initChartist(){ 
    var labelForDone=Math.round(100*(config.doneNumber/config.total))+"%";
        labelForUndo=Math.round(100*(config.undoNumber/config.total))+"%";
        //以下总人数还没有和上面的数据统一
        labelA=Math.round(100*(config.generalInfo.ScoreBandCount.HigherThan90/config.total))+"%";
        labelB=Math.round(100*(config.generalInfo.ScoreBandCount.Failed/config.total))+"%";
        labelC=Math.round(100*(config.generalInfo.ScoreBandCount.HigherThan75/config.total))+"%";
        labelD=Math.round(100*(config.generalInfo.ScoreBandCount.HigherThan60/config.total))+"%";
    
    Chartist.Pie('#completion-chart', {
       
    labels: [(config.undoNumber==0?'':labelForDone),
            (config.undoNumber==0?'':labelForUndo)],
    series: [config.doneNumber, config.undoNumber]
    });   
    Chartist.Pie('#overall-chart', {
        labels: [
            (config.generalInfo.ScoreBandCount.HigherThan90==0?'':labelA),
            (config.generalInfo.ScoreBandCount.Failed==0?'':labelB),
            (config.generalInfo.ScoreBandCount.HigherThan75==0?'':labelC),
            (config.generalInfo.ScoreBandCount.HigherThan60==0?'':labelD)
        ],
        series: [
            config.generalInfo.ScoreBandCount.HigherThan90,
            config.generalInfo.ScoreBandCount.Failed,
            config.generalInfo.ScoreBandCount.HigherThan75,
            config.generalInfo.ScoreBandCount.HigherThan60
        ]
    });   
}

function commonSet(){
    console.log(config.departmentName);
    $("#school-name").html(config.departmentName);
    if(config.undoNumber==0){
        $("#done-info").html(config.comments.dones.perfect);
        $("#undo-info").hide();
        $("#empty-comment").show();
    }
    else if(config.doneNumber==0){
        $("#done-info").hide();
        $("#undo-info").html(config.comments.undos.worst);
        $("#empty-comment").hide();
    }
    else{
        $("#done-info").html(config.comments.dones.common);
        $("#undo-info").html(config.comments.undos.common);
        $("#empty-comment").hide();
    }
    $("#average-score").html(config.generalInfo.AverageScore);

}
var temp=new Array();
var cnt=0;
$(function () {
    //Mock server for score list
    Mock.mock(
        'http://hostname/api/Counselor/scores/all/{id}', 'get',{
          
          "array|100-400": [{
            "studentID": '@string("0123456789",8)', 
            "cardID": '@string("0123456789",9)',
            "name": "@cname()",
            "isCompleted":"@boolean()",
            "score":"@natural(0,100)"

          }]
        }
      );
      //Mock server for summary
      Mock.mock(
        'http://hostname/api/Counselor/scores/summary{id}', 'get',{
          
          "object": {
                "departmentID": "711",
                "CounselorName": "郭佳",
                "MaxScore": "@natural(85,100)",
                "AverageScore": "@natural(60,80)",
                "ScoreBandCount":
                {
                    "HigherThan90": "@natural(10,30)",
                    "HigherThan75": "@natural(30,60)",
                    "HigherThan60": "@natural(30,60)",
                    "Failed": "@natural(10,30)"
                }
        }
        }
      );
    //请求有先后顺序，先获取院系总体情况，再获取得分情况，故为嵌套结构
      $.ajax({
        url:  'http://hostname/api/Counselor/scores/summary{id}', //请求的url地址
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        
        
        type: "GET", //请求方式
        beforeSend: function () {
          //请求前的处理

        },
        success: function (req) {
          //请求成功时处理
          console.log(req);
          config.generalInfo=req.object;
          console.log(config.generalInfo);
          config.departmentName=DepartmentNameMap[config.generalInfo.departmentID];
          console.log(config.generalInfo.DepartmentID);
        },
        complete: function () {

          //请求完成的处理
          $.notify({
            icon: 'glyphicon glyphicon-heart-empty',
            message: "您好，"+config.generalInfo.CounselorName+"，欢迎来到校史校情知识竞赛管理系统"
       
        }, {
            type: 'info',
            timer: 3000
        });
          $.ajax({
            url:  'http://hostname/api/Counselor/scores/all/{id}', //请求的url地址
            dataType: "json", //返回格式为json
            async: true, //请求是否异步，默认为异步，这也是ajax重要特性
            
            
            type: "GET", //请求方式
            beforeSend: function () {
              //请求前的处理
  
            },
            success: function (req) {
              //请求成功时处理
              setUndoNDo(req.array);
              setUndo(config.undoList);
              setDone(config.doneList);
              initChartist();
              commonSet();
            },
            complete: function () {
              //请求完成的处理
            },
            error: function () {
              //请求出错处理
              alert("数据获取失败，请检查网络！");
            }
          });
        },
        error: function () {
          //请求出错处理
          alert("数据获取失败，请检查网络！");
        }
      });
       
     


    /*setUndoNDo(scoreList);
    setUndo(config.undoList);
    setDone(config.doneList);
    initChartist();
    commonSet();*/
    
    
    $("#table-done").find("th.score").click((function(){
       if(cnt%3==0){
        $("#sort").hide();
        $("#triangle-bottom").show();
        $("#triangle-top").hide();
           if(cnt==0){
            temp=config.doneList.slice(0);//深拷贝 !important
            temp.sort(by("score"));
            setDone(temp);
            cnt++;
            return;
           }
           temp.reverse();
           cnt++;
           setDone(temp);
   
       }
       else if(cnt%3==1){
        $("#sort").hide();
        $("#triangle-bottom").hide();
        $("#triangle-top").show();
        temp.reverse();
        cnt++;
        setDone(temp);

       }
       else if(cnt%3==2){
        $("#sort").show();
        $("#triangle-bottom").hide();
        $("#triangle-top").hide();
        cnt++;
        setDone(config.doneList);

       }
       
       
      
    }))
    //先隐藏再筛选
     $("#search-undo-text").keyup(function () {
         var $key=$('#search-undo-text').val();
         $('#table-undo table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });
     $("#search-done-text").keyup(function () {
         var $key=$('#search-done-text').val();        
         $('#table-done table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });

     

 



});



