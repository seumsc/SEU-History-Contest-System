/********************Webpage Common Configurations********************/
var DepartmentNameMap={
    "010":"建筑学院",
    "020":"机械工程学院",
    "030":"能源与环境学院",
    "040":"信息科学与工程学院",
    "050":"土木工程学院",
    "060":"电子科学与工程学院",
    "070":"数学学院",
    "080":"自动化学院",
    "144":"计算机科学与工程学院、软件学院",
    "711":"计算机科学与工程学院、软件学院"
}
var config={
    department:null,
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
/********************Webpage Setting********************/
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
    var labelForUndo=Math.round(100*(config.undoNumber/config.total))+"%";
    var labelA=Math.round(100*(config.generalInfo.scoreBandCount.higherThan90/config.total))+"%";
    var labelB=Math.round(100*(config.generalInfo.scoreBandCount.failed/config.total))+"%";
    var labelC=Math.round(100*(config.generalInfo.scoreBandCount.higherThan75/config.total))+"%";
    var labelD=Math.round(100*(config.generalInfo.scoreBandCount.higherThan60/config.total))+"%";
    
    Chartist.Pie('#completion-chart', {   
        labels: [(config.doneNumber==0?'':labelForDone),
                (config.undoNumber==0?'':labelForUndo)],
        series: [config.doneNumber, config.undoNumber]
    });   
    //若无人作答，显示相应提示信息
    if(config.doneNumber==0){
        Chartist.Pie('#overall-chart', {
            
            labels: [
               "尚未有学生作答"
            ],
            series: [
                100
            ]
        });  
    }
    else{
        Chartist.Pie('#overall-chart', {
            
            labels: [
                (config.generalInfo.scoreBandCount.higherThan90==0?'':labelA),
                (config.generalInfo.scoreBandCount.failed==0?'':labelB),
                (config.generalInfo.scoreBandCount.higherThan75==0?'':labelC),
                (config.generalInfo.scoreBandCount.higherThan60==0?'':labelD)
            ],
            series: [
                config.generalInfo.scoreBandCount.higherThan90,
                config.generalInfo.scoreBandCount.failed,
                config.generalInfo.scoreBandCount.higherThan75,
                config.generalInfo.scoreBandCount.higherThan60
            ]
        });   
    }
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
    $("#average-score").html(config.generalInfo.averageScore.toFixed(2));
    $("#max-score").html(config.generalInfo.maxScore);

}

/********************API Interfaces********************/
function fetchData(){
    $.ajax({
        url:  '/api/Counselor/Department', //请求的url地址 
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性      
        type: "GET", //请求方式
        contentType:"application/json",
        dataType: "json", //返回格式为json
        success: function (req) {
          //请求成功时处理
         console.log(req);
         config.department=req;
         console.log(config.department);
         fetchSummary();
         
        },
        error: function () {
          //请求出错处理
          alert("数据获取失败，请检查网络！");
        }
    });
}
function fetchSummary(){
    $.ajax({
        url:  '/api/Counselor/Scores/Summary/'+config.department, //请求的url地址
        contentType:"application/json",
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性 
        type: "GET", //请求方式
        success: function (req) {
          //请求成功时处理
          console.log(req);
          config.generalInfo=req;
          console.log(config.generalInfo);
          config.departmentName=DepartmentNameMap[config.generalInfo.departmentID];
          console.log(config.generalInfo.departmentID);
          fetchAllScores();
        },
        error: function () {
          //请求出错处理
          alert("数据获取失败，请检查网络！");
        }
      });
       
}
function fetchAllScores(){
    $.ajax({
        url:  '/api/Counselor/Scores/All/'+config.department, //请求的url地址
        contentType:"application/json",
        dataType: "json", //返回格式为json
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        type: "GET", //请求方式
        success: function (req) {
          //请求成功时处理
          console.log(req);
          setUndoNDo(req);
          setUndo(config.undoList);
          setDone(config.doneList);
          initChartist();
          commonSet();
        },
        error: function () {
          //请求出错处理
          alert("数据获取失败，请检查网络！");
        }
      });
}
function downloadDepartmentExcel(){
    $.ajax({
    url:  '/api/Counselor/ExportExcelofDepartment', //请求的url地址
    
    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
    
    crossDomain:true,
    
    type: "POST", //请求方式
    
    contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    
    success: function (req) {
      //请求成功时处理
      window.location = '/excel/'+req;
    },
    
    error: function (xhr) {
      //请求出错处理
      alert("数据获取失败，请检查网络！");
      console.log(xhr);
    }
  });

}
function downloadExcelOfAllDepartments(){
    $.ajax({
        url:  '/api/Counselor/ExportExcelOfAllDepartments', //请求的url地址
        
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        
        crossDomain:true,
        
        type: "POST", //请求方式
        
        contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        
        success: function (req) {
        //请求成功时处理
        console.log(req);
        window.location = '/excel/'+req;
        },
        
        error: function (xhr) {
        //请求出错处理
        alert("数据获取失败，请检查网络！");
        console.log(xhr);
        }
  });
}
/********************Variable Needed for Search********************/
var temp=new Array();
var cnt=0;
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
/********************Document Ready Function********************/
$(function () {
    
   fetchData();


    //Refresh
    $("#refresh-button").click(function(){
       fetchData();
    })
    //Download
    $(".department-excel").click(function(){
        downloadDepartmentExcel();
    })
    $(".all-departments").click(function(){
        downloadExcelOfAllDepartments();
    })
    //Sort
    $("#table-done").find("th.score").click(function(){
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
       
       
      
    })
    //Search 先隐藏再筛选
     $("#search-undo-text").keyup(function () {
         var $key=$('#search-undo-text').val();
         $('#table-undo table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });
     $("#search-done-text").keyup(function () {
         var $key=$('#search-done-text').val();        
         $('#table-done table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });

     
     var searchVisible = 0;
     var transparent = true;
     
     var transparentDemo = true;
     var fixedTop = false;
     
     var navbar_initialized = false;
     
     $(document).ready(function(){
         window_width = $(window).width();
         
         // check if there is an image set for the sidebar's background
         lbd.checkSidebarImage();
         
         // Init navigation toggle for small screens   
         if(window_width <= 991){
             lbd.initRightMenu();   
         }
          
         //  Activate the tooltips   
         $('[rel="tooltip"]').tooltip();
     
         //      Activate the switches with icons 
         if($('.switch').length != 0){
             $('.switch')['bootstrapSwitch']();
         }  
         //      Activate regular switches
         if($("[data-toggle='switch']").length != 0){
              $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();     
         }
          
         $('.form-control').on("focus", function(){
             $(this).parent('.input-group').addClass("input-group-focus");
         }).on("blur", function(){
             $(this).parent(".input-group").removeClass("input-group-focus");
         });
           
     });
     
     // activate collapse right menu when the windows is resized 
     $(window).resize(function(){
         if($(window).width() <= 991){
             lbd.initRightMenu();   
         }
     });
         
     lbd = {
         misc:{
             navbar_menu_visible: 0
         },
         
         checkSidebarImage: function(){
             $sidebar = $('.sidebar');
             image_src = $sidebar.data('image');
             
             if(image_src !== undefined){
                 sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
                 $sidebar.append(sidebar_container);
             }  
         },
         initRightMenu: function(){  
              if(!navbar_initialized){
                 $navbar = $('nav').find('.navbar-collapse').first().clone(true);
                 
                 $sidebar = $('.sidebar');
                 sidebar_color = $sidebar.data('color');
                 
                 $logo = $sidebar.find('.logo').first();
                 logo_content = $logo[0].outerHTML;
                         
                 ul_content = '';
                  
                 $navbar.attr('data-color',sidebar_color);
                  
                 // add the content from the sidebar to the right menu
                 content_buff = $sidebar.find('.nav').html();
                 ul_content = ul_content + content_buff;
                 
                 //add the content from the regular header to the right menu
                 $navbar.children('ul').each(function(){
                     content_buff = $(this).html();
                     ul_content = ul_content + content_buff;   
                 });
                  
                 ul_content = '<ul class="nav navbar-nav">' + ul_content + '</ul>';
                 
                 navbar_content = logo_content + ul_content;
                 
                 $navbar.html(navbar_content);
                  
                 $('body').append($navbar);
                  
                 background_image = $sidebar.data('image');
                 if(background_image != undefined){
                     $navbar.css('background',"url('" + background_image + "')")
                            .removeAttr('data-nav-image')
                            .addClass('has-image');                
                 }
                  
                  
                  $toggle = $('.navbar-toggle');
                  
                  $navbar.find('a').removeClass('btn btn-round btn-default');
                  $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
                  $navbar.find('button').addClass('btn-simple btn-block');
                 
                  $toggle.click(function (){    
                     if(lbd.misc.navbar_menu_visible == 1) {
                         $('html').removeClass('nav-open'); 
                         lbd.misc.navbar_menu_visible = 0;
                         $('#bodyClick').remove();
                          setTimeout(function(){
                             $toggle.removeClass('toggled');
                          }, 400);
                     
                     } else {
                         setTimeout(function(){
                             $toggle.addClass('toggled');
                         }, 430);
                         
                         div = '<div id="bodyClick"></div>';
                         $(div).appendTo("body").click(function() {
                             $('html').removeClass('nav-open');
                             lbd.misc.navbar_menu_visible = 0;
                             $('#bodyClick').remove();
                              setTimeout(function(){
                                 $toggle.removeClass('toggled');
                              }, 400);
                         });
                        
                         $('html').addClass('nav-open');
                         lbd.misc.navbar_menu_visible = 1;
                         
                     }
                 });
                 navbar_initialized = true;
             }
        
         }
     }
     
     
     // Returns a function, that, as long as it continues to be invoked, will not
     // be triggered. The function will be called after it stops being called for
     // N milliseconds. If `immediate` is passed, trigger the function on the
     // leading edge, instead of the trailing.
     
     function debounce(func, wait, immediate) {
         var timeout;
         return function() {
             var context = this, args = arguments;
             clearTimeout(timeout);
             timeout = setTimeout(function() {
                 timeout = null;
                 if (!immediate) func.apply(context, args);
             }, wait);
             if (immediate && !timeout) func.apply(context, args);
         };
     };
     
 



});



