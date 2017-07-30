

var cnt = 0;//已经完成的题目数量
function getLast(){
	var progress = $(".show_progress").css('width');
	if(cnt>1){
		$(".show_progress").css('width','-=5%');
		$("#cnt").html(--cnt);
	}else if(cnt ==1){
		$(".show_progress").css('width','-=5%');
		--cnt;
	}

};
function getNext(){
	var progress = $(".show_progress").css('width');
	if(cnt<20){
		$(".show_progress").css('width','+=5%');
		$("#cnt").html(++cnt);
	}
	else{
		$(".show_progress").css('width','+=5%');
		alert('答题完成！是否确认提交?');
	}

};
var choice = 0;
function choose(i){
	//将所有options改为默认样式
	$(".options").css({"background-color":"transparent","border":"1px solid","border-color":"transparent"});
	$(i).css({"background-color":"rgba(250,250,250,0.8)","border":"2px solid","border-color":"rgba(0,162,232,0.6)"});
	console.log($(i).css('border'));
	choice = $(i).text();
	console.log(choice);
};

var intDiff=parseInt(10);
function timer(intDiff){
    window.setInterval(function(){
    var minute=0;
	var second=0;      
	if(intDiff==0){
		alert('时间到！');
	}
    if(intDiff > 0){
        minute = Math.floor(intDiff / 60);
        second = Math.floor(intDiff)- (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    $('#minute').html('<s></s>'+minute+'分');
    $('#second').html('<s></s>'+second+'秒');
    intDiff--;
    }, 1000);

} 


$(function(){
//计时器
	timer(intDiff);
//实现左右按键动画变化

$(".last").mouseover(function(){
	if(cnt!=0)
		$(".last").css('background-position','-210px -84px');
} );
$(".last").mouseleave(function(){
		$(".last").css('background-position','0px -84px');
} );
$(".next").mouseover(function(){
	if(cnt!=20)
		$(".next").css('background-position','-210px -126px');
} );
$(".next").mouseleave(function(){
		$(".next").css('background-position','0px -126px');
} );
//鼠标移动到div区域  选项变色
$("#optionA").mouseover(function(){
	$("#optionA").css({"background-color":"rgba(250,250,250,0.8)","border-color":"rgba(0,162,232,0.6)"});
});
$("#optionA").mouseleave(function(){
	if(choice!='A')
	$("#optionA").css({"background-color":"transparent","border-color":"transparent"});
});

$("#optionB").mouseover(function(){
	$("#optionB").css({"background-color":"rgba(250,250,250,0.8)","border-color":"rgba(0,162,232,0.6)"});
});
$("#optionB").mouseleave(function(){
	if(choice!='B')
	$("#optionB").css({"background-color":"transparent","border-color":"transparent"});
});

$("#optionC").mouseover(function(){
	$("#optionC").css({"background-color":"rgba(250,250,250,0.8)","border-color":"rgba(0,162,232,0.6)"});
});
$("#optionC").mouseleave(function(){
	if(choice!='C')
	$("#optionC").css({"background-color":"transparent","border-color":"transparent"});
});

$("#optionD").mouseover(function(){
	$("#optionD").css({"background-color":"rgba(250,250,250,0.8)","border-color":"rgba(0,162,232,0.6)"});
});
$("#optionD").mouseleave(function(){
	if(choice!='D')
	$("#optionD").css({"background-color":"transparent","border-color":"transparent"});
});
})


