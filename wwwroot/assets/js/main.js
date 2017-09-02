var answerQues=[];//id,answer
var config={
	totalAmount:30,
	timeState:false,
	questionArray:[],
	resultHTML:'<section class="panel color4-alt"><div class="inner columns"><div class="span-3-25"><h3 class="major">您的分数是：<span id="score"></span>分</h3><div class="table-wrapper" id="result-table"><table class="alt"><tbody id="table-content"></tbody><tfoot>提示：鼠标移到题号上可以查看原题哦！</tfoot></table></div></div><div  id="review-container" class="span-4" style="display:none"></div></div></section>',
	resultJSON:{}
}

var questionsIteratorIndex;
var	answersIteratorIndex;

//生成题目
function setQUESTION(QUESTIONS){
	var content = '';
	var	contentFooter='';
	for (questionsIteratorIndex = 0; questionsIteratorIndex < QUESTIONS.length; questionsIteratorIndex++) {
		content += '<section class="panel"><div class="inner columns" id="q'+(questionsIteratorIndex + 1)+'">'//题目id，实现按钮跳转到下一题
		+'<div class="intro joined"><h1>'+(questionsIteratorIndex + 1)+'</h1></div>'//网页上显示的题目序号
		+'<div class="span-3-25"><h3 class="major">'+ QUESTIONS[questionsIteratorIndex].question+'</h3>';//问题内容
		if(QUESTIONS[questionsIteratorIndex].type==0){//选择题
			var ansInit={};
			ansInit.id=QUESTIONS[questionsIteratorIndex].id;
			ansInit.answer=-1;
			answerQues.push(ansInit);
			for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {//四个选项
				content += '<div class="field quarter"><input type="radio"'
				+' id="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)//选项id，在HTML中唯一
				+'" value="'+answersIteratorIndex //提交的答案值
				+'" onclick="saveAns(this)"'
				+'" name="'+QUESTIONS[questionsIteratorIndex].id+'" class="color2" />'//hash code，同样要提交
				+'<label for="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)+'">'
				+QUESTIONS[questionsIteratorIndex].choices[answersIteratorIndex] +'</label></div><br>';
			}//选项内容
			content += '</div>';           
		}
		else{//判断题			
			var ansInit={};
			ansInit.id=QUESTIONS[questionsIteratorIndex].id;
			ansInit.answer=-1;
			answerQues.push(ansInit);
			for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {//两个选项
				
				content += '<div class="field quarter"><input type="radio" id="choice'+(questionsIteratorIndex + 1)+(answersIteratorIndex+1)
				+'" value="'+answersIteratorIndex
				+'" onclick="saveAns(this)"'
				+'" name="'+QUESTIONS[questionsIteratorIndex].id+'" class="color2" />'
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
	$("#answerCard").html(contentFooter);//生成分页
	$('#quiz-container').append(content);//生成问题


}
//生成结果

function setRESULT(RESULT){
	var tableContent="";
    for(var resultsIteratorIndex=0;resultsIteratorIndex<config.totalAmount;resultsIteratorIndex++){
        if(resultsIteratorIndex%5==0)
            tableContent+="<tr>";
        tableContent+='<td><span class="num">'+(resultsIteratorIndex+1)+' </span>'
        if(RESULT.details[resultsIteratorIndex].correct==RESULT.details[resultsIteratorIndex].submit){
            tableContent+=' <span class="fa fa-check" style="color:#3caa00"></span></td>'
        }
        else{
            tableContent+='  <span class="fa fa-close" style="color:rgb(240,130,0)"></span></td>'
        }
                        
        if(resultsIteratorIndex%5==4)
            tableContent+="</tr>";
    }
    $('#table-content').html(tableContent);
    $("#score").text(RESULT.score);
}

function saveAns(clickID){
	var ans = clickID.value;
	var ID=clickID.name;
	var activeNum=parseInt(($(clickID).parents(".inner.columns").prop("id")).substr(1));
	var testing;
    for(var i=0;i<answerQues.length;i++){//这个循环用来覆盖保存答案
    	if( answerQues[i].id==ID&&answerQues[i].answer!=ans){
			if(answerQues[i].answer==-1){
				$("#question"+activeNum).addClass("answered");
				
				setTimeout(function(){			
					$("#question"+(activeNum+1)).click();		
				},300);
			}
		   answerQues[i].answer =ans;
		   testing=JSON.stringify(answerQues);
		   console.log(testing);

		  
	   
	    }
		else if(answerQues[i].id==ID&&answerQues[i].answer==ans)
	   		return;         
    	}
	/*	var check ={};
       	check.ID=ID;
		check.answer=ans;
		answerQues.push(check);//用push方法传入数组		
		testing=JSON.stringify(answerQues);
		console.log(testing);*/

}

function resetToShowResult(){
	$.ajax({
		url: '/api/Result', //请求的url地址
		type: "GET", //请求方式
		dataType: "json", //返回格式为json
		async: true,
		data: JSON.stringify(answerQues),
		contentType: "application/json",
		success: function (res) {
			console.log(res);
			$("#welcome-container").remove();
			$("#quiz-container").remove();
			$("#submit-container").remove();
			$('.header_2').remove();
			$("#footer").remove();
			//SHOW RESULTS
			$("#result-container").html(config.resultHTML);
			config.timeState=false;
			config.resultJSON=res;
			setRESULT(config.resultJSON);
			//CHECK QUESTION ARRAY
			if(config.questionArray.length==0){
				for(var i=0;i<config.totalAmount;i++){
					var URLID=config.resultJSON.details[i].id;
					$.ajax({
						url: '/api/Question/'+URLID, //请求的url地址
						type: "GET", //请求方式
						dataType: "json", //返回格式为json
						async: true,
						contentType: "application/json",
						success:function(res){
							
							config.questionArray.push(res);
						}
					});
					
				}
			}
			//ADD FUNCTIONS
			$("td").hover(function(event) {
				var reviewContent="";	
				var $tgt=$(event.target);
				var questionNum=$tgt.find(".num").text();
				var rightAns=config.resultJSON.details[questionNum-1].correct;
				var submittedAns=config.resultJSON.details[questionNum-1].submit;
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
						}
						else{
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
						}
						else{
						  reviewContent += '<div class="field quarter">'
						  +(answersIteratorIndex==0?'正确':'错误')  +'</div><br>';//选项内容
						}
					}
		  
				}
				$("#review-container").html(reviewContent);
				
				
				$("#review-container").show();//hover后显示题目
			},function() {
				$("#review-container").hide();//hover后显示题目
			});
	
		},
		complete: function () {
		},
		error: function (request) {
			alert("error:" + JSON.stringify(request));
		}
	});
	

}
function fetchQuestions(){
	$.ajax({
		url: "/api/Question", //请求的url地址
		contentType:"application/json",
		dataType: "json", //返回格式为json
		async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		type: "GET", //请求方式		
		success: function (req) {
			config.questionArray=req;
			config.totalAmount=config.questionArray.length;
			setQUESTION(config.questionArray);
			
			console.log(config.totalAmount);
		},	
		error: function (req) {
			console.log(req);
			alert("请检查网络");
			
		}
	});
}
function submit(){
	console.log(answerQues.length);
	for(var j=0;j<answerQues.length;j++){
		if(answerQues[j].answer==-1&&config.timeState){
			alert("您还有未作答题目哦！");
			return;
		}
	}
	
		$.ajax({
			url: "/api/Result", //请求的url地址
			contentType:"application/json",
			dataType: "json", //返回格式为json
			async: true, //请求是否异步，默认为异步，这也是ajax重要特性
			//data			
			data: JSON.stringify(answerQues),
			type: "POST", //请求方式
			beforeSend: function () {
			  //请求前的处理
  
			},
			success: function (res) {
			  //RESET WEBPAGE
			  console.log(res);
			  resetToShowResult();
			},
			
			error: function () {
			  //请求出错处理
			  alert("提交失败，请检查网络");
			}
		  });
	}


(function($) {

	var mm = 30;//分
	var ss = 0;//秒
	//var timeState = false;//时间状态 默认为true 开启时间


	/*实现计时器*/
	
	var time= setInterval(function () {
		if (config.timeState) {
			if(mm==0&&ss==1){
				ss--;
				alert("时间到！");
				$(".time").hide();
				config.timeState=false;
				submit();
			}
			else{
				str = "";
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




$(function(){
	
	//Initialize State
	$.ajax({
		url: "/api/Student/State/Initialize", //请求的url地址
		async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		type: "POST", //请求方式
		success: function (req) {
			//请求成功时处理
			console.log(req);
			//GET Questions	
			if(req.testState==0){
				if(req.isSeedSet==false){
					$.ajax({
						url: "/api/Student/Seed", //请求的url地址
						
						async: true, //请求是否异步，默认为异步，这也是ajax重要特性
		
						type: "POST", //请求方式
						
						success: function (req) {
							//请求成功时处理
							//config.questionArray=req.array1.concat(req.array2);
							console.log(req);
							
						},
						
						error: function () {
							//请求出错处理
							alert("请检查网络");
							
						}
					});	
				}
				fetchQuestions();
			}
			else if(req.testState==2){
				resetToShowResult();

			}
			
			
				
		},
		complete: function () {
			//请求完成的处理
		},
		error: function () {
			//请求出错处理
			
			
		}
		});
	


    $("#start").click(function () {
		 $("#footer").show();
        config.timeState = true;

		 
	});
	$(document).mousemove(function(e){ //当用户直接拖拽而不是点击开始按钮时，到达题目位置也会开始计时
		if(e.pageX>window.innerWidth){
			config.timeState=true; 
			 $("#footer").show();
		}
  });

  

  
});
		
		// Settings.
		var settings = {

			// Keyboard shortcuts.
				keyboardShortcuts: {

					// If true, enables scrolling via keyboard shortcuts.
						enabled: false,

					// Sets the distance to scroll when using the left/right arrow keys.
						distance: 50

				},

			// Scroll wheel.
				scrollWheel: {

					// If true, enables scrolling via the scroll wheel.
						enabled: true,

					// Sets the scroll wheel factor. (Ideally) a value between 0 and 1 (lower = slower scroll, higher = faster scroll).
						factor: 1

				},

			// Scroll zones.
				scrollZones: {

					// If true, enables scrolling via scroll zones on the left/right edges of the scren.
						enabled: false,

					// Sets the speed at which the page scrolls when a scroll zone is active (higher = faster scroll, lower = slower scroll).
						speed: 15

				},

			// Dragging.
				dragging: {

					// If true, enables scrolling by dragging the main wrapper with the mouse.
						enabled: false,

					// Sets the momentum factor. Must be a value between 0 and 1 (lower = less momentum, higher = more momentum, 0 = disable momentum scrolling).
						momentum: 0.875,

					// Sets the drag threshold (in pixels).
						threshold: 10

				},

			// If set to a valid selector , prevents key/mouse events from bubbling from these elements.
				excludeSelector: 'input:focus, select:focus, textarea:focus, audio, video, iframe',

			// Link scroll speed.
				linkScrollSpeed: 1000

		};

	// Skel.
		skel.breakpoints({
			xlarge: '(max-width: 1680px)',
			large: '(max-width: 1280px)',
			medium: '(max-width: 980px)',
			small: '(max-width: 736px)',
			xsmall: '(max-width: 480px)',
			xxsmall: '(max-width: 360px)',
			short: '(min-aspect-ratio: 16/7)',
			xshort: '(min-aspect-ratio: 16/6)'
		});

	// Ready event.
		$(function() {

			// Vars.
				var	$window = $(window),
					$document = $(document),
					$body = $('body'),
					$html = $('html'),
					$bodyHtml = $('body,html'),
					$wrapper = $('#wrapper'),
					$footer=$('#footer');

			// Disable animations/transitions until the page has loaded.
				$body.addClass('is-loading');

				$window.on('load', function() {
					window.setTimeout(function() {
						$body.removeClass('is-loading');
					}, 100);
				});

			// Tweaks/fixes.

				// Mobile: Revert to native scrolling.
					if (skel.vars.mobile) {

						// Disable all scroll-assist features.
							settings.keyboardShortcuts.enabled = false;
							settings.scrollWheel.enabled = false;
							settings.scrollZones.enabled = false;
							settings.dragging.enabled = false;

						// Re-enable overflow on body.
							$body.css('overflow-x', 'auto');

					}

				// IE: Various fixes.
					if (skel.vars.browser == 'ie') {

						// Enable IE mode.
							$body.addClass('is-ie');

						// Page widths.
							$window
								.on('load resize', function() {

									// Calculate wrapper width.
										var w = 0;

										$wrapper.children().each(function() {
											w += $(this).width();
										});

									// Apply to page.
										$html.css('width', w + 'px');

								});

					}

				// Polyfill: Object fit.
					if (!skel.canUse('object-fit')) {

						$('.image[data-position]').each(function() {

							var $this = $(this),
								$img = $this.children('img');

							// Apply img as background.
								$this
									.css('background-image', 'url("' + $img.attr('src') + '")')
									.css('background-position', $this.data('position'))
									.css('background-size', 'cover')
									.css('background-repeat', 'no-repeat');

							// Hide img.
								$img
									.css('opacity', '0');

						});

					}

			// Keyboard shortcuts.
				if (settings.keyboardShortcuts.enabled)
					(function() {

						$wrapper

							// Prevent keystrokes inside excluded elements from bubbling.
								.on('keypress keyup keydown', settings.excludeSelector, function(event) {

									// Stop propagation.
										event.stopPropagation();

								});

						$window

							// Keypress event.
								.on('keydown', function(event) {

									var scrolled = false;

									switch (event.keyCode) {

										// Left arrow.
											case 37:
												$document.scrollLeft($document.scrollLeft() - settings.keyboardShortcuts.distance);
												scrolled = true;
												break;

										// Right arrow.
											case 39:
												$document.scrollLeft($document.scrollLeft() + settings.keyboardShortcuts.distance);
												scrolled = true;
												break;

										// Page Up.
											case 33:
												$document.scrollLeft($document.scrollLeft() - $window.width() + 100);
												scrolled = true;
												break;

										// Page Down, Space.
											case 34:
											case 32:
												$document.scrollLeft($document.scrollLeft() + $window.width() - 100);
												scrolled = true;
												break;

										// Home.
											case 36:
												$document.scrollLeft(0);
												scrolled = true;
												break;

										// End.
											case 35:
												$document.scrollLeft($document.width());
												scrolled = true;
												break;

									}

									// Scrolled?
										if (scrolled) {

											// Prevent default.
												event.preventDefault();
												event.stopPropagation();

											// Stop link scroll.
												$bodyHtml.stop();

										}

								});

					})();

			// Scroll wheel.
				if (settings.scrollWheel.enabled)
					(function() {

						// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
						// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
							var normalizeWheel = function(event) {

								var	pixelStep = 10,
									lineHeight = 40,
									pageHeight = 800,
									sX = 0,
									sY = 0,
									pX = 0,
									pY = 0;

								// Legacy.
									if ('detail' in event)
										sY = event.detail;
									else if ('wheelDelta' in event)
										sY = event.wheelDelta / -120;
									else if ('wheelDeltaY' in event)
										sY = event.wheelDeltaY / -120;

									if ('wheelDeltaX' in event)
										sX = event.wheelDeltaX / -120;

								// Side scrolling on FF with DOMMouseScroll.
									if ('axis' in event
									&&	event.axis === event.HORIZONTAL_AXIS) {
										sX = sY;
										sY = 0;
									}

								// Calculate.
									pX = sX * pixelStep;
									pY = sY * pixelStep;

									if ('deltaY' in event)
										pY = event.deltaY;

									if ('deltaX' in event)
										pX = event.deltaX;

									if ((pX || pY)
									&&	event.deltaMode) {

										if (event.deltaMode == 1) {
											pX *= lineHeight;
											pY *= lineHeight;
										}
										else {
											pX *= pageHeight;
											pY *= pageHeight;
										}

									}

								// Fallback if spin cannot be determined.
									if (pX && !sX)
										sX = (pX < 1) ? -1 : 1;

									if (pY && !sY)
										sY = (pY < 1) ? -1 : 1;

								// Return.
									return {
										spinX: sX,
										spinY: sY,
										pixelX: pX,
										pixelY: pY
									};

							};

						// Wheel event.
							$body.on('wheel', function(event) {

								// Disable on <=small.
									if (skel.breakpoint('small').active)
										return;

								// Prevent default.
									event.preventDefault();
									event.stopPropagation();

								// Stop link scroll.
									$bodyHtml.stop();

								// Calculate delta, direction.
									var	n = normalizeWheel(event.originalEvent),
										x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
										delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
										direction = x > 0 ? 1 : -1;

								// Scroll page.
									$document.scrollLeft($document.scrollLeft() + (delta * direction));

							});

					})();

			// Scroll zones.
				if (settings.scrollZones.enabled)
					(function() {

						var	$left = $('<div class="scrollZone left"></div>'),
							$right = $('<div class="scrollZone right"></div>'),
							$zones = $left.add($right),
							paused = false,
							intervalId = null,
							direction,
							activate = function(d) {

								// Disable on <=small.
									if (skel.breakpoint('small').active)
										return;

								// Paused? Bail.
									if (paused)
										return;

								// Stop link scroll.
									$bodyHtml.stop();

								// Set direction.
									direction = d;

								// Initialize interval.
									clearInterval(intervalId);

									intervalId = setInterval(function() {
										$document.scrollLeft($document.scrollLeft() + (settings.scrollZones.speed * direction));
									}, 25);

							},
							deactivate = function() {

								// Unpause.
									paused = false;

								// Clear interval.
									clearInterval(intervalId);

							};

						$zones
							.appendTo($wrapper)
							.on('mouseleave mousedown', function(event) {
								deactivate();
							});

						$left
							.css('left', '0')
							.on('mouseenter', function(event) {
								activate(-1);
							});

						$right
							.css('right', '0')
							.on('mouseenter', function(event) {
								activate(1);
							});

						$wrapper
							.on('---pauseScrollZone', function(event) {

								// Pause.
									paused = true;

								// Unpause after delay.
									setTimeout(function() {
										paused = false;
									}, 500);

							});

					})();

			// Dragging.
				if (settings.dragging.enabled)
					(function() {

						var dragging = false,
							dragged = false,
							distance = 0,
							startScroll,
							momentumIntervalId, velocityIntervalId,
							startX, currentX, previousX,
							velocity, direction;

						$wrapper

							// Prevent image drag and drop.
								.on('mouseup mousemove mousedown', '.image, img', function(event) {
									event.preventDefault();
								})

							// Prevent mouse events inside excluded elements from bubbling.
								.on('mouseup mousemove mousedown', settings.excludeSelector, function(event) {

									// Prevent event from bubbling.
										event.stopPropagation();

									// End drag.
										dragging = false;
										$wrapper.removeClass('is-dragging');
										clearInterval(velocityIntervalId);
										clearInterval(momentumIntervalId);

									// Pause scroll zone.
										$wrapper.triggerHandler('---pauseScrollZone');

								})

							// Mousedown event.
								.on('mousedown', function(event) {

									// Disable on <=small.
										if (skel.breakpoint('small').active)
											return;

									// Clear momentum interval.
										clearInterval(momentumIntervalId);

									// Stop link scroll.
										$bodyHtml.stop();

									// Start drag.
										dragging = true;
										$wrapper.addClass('is-dragging');

									// Initialize and reset vars.
										startScroll = $document.scrollLeft();
										startX = event.clientX;
										previousX = startX;
										currentX = startX;
										distance = 0;
										direction = 0;

									// Initialize velocity interval.
										clearInterval(velocityIntervalId);

										velocityIntervalId = setInterval(function() {

											// Calculate velocity, direction.
												velocity = Math.abs(currentX - previousX);
												direction = (currentX > previousX ? -1 : 1);

											// Update previous X.
												previousX = currentX;

										}, 50);

								})

							// Mousemove event.
								.on('mousemove', function(event) {

									// Not dragging? Bail.
										if (!dragging)
											return;

									// Velocity.
										currentX = event.clientX;

									// Scroll page.
										$document.scrollLeft(startScroll + (startX - currentX));

									// Update distance.
										distance = Math.abs(startScroll - $document.scrollLeft());

									// Distance exceeds threshold? Disable pointer events on all descendents.
										if (!dragged
										&&	distance > settings.dragging.threshold) {

											$wrapper.addClass('is-dragged');

											dragged = true;

										}

								})

							// Mouseup/mouseleave event.
								.on('mouseup mouseleave', function(event) {

									var m;

									// Not dragging? Bail.
										if (!dragging)
											return;

									// Dragged? Re-enable pointer events on all descendents.
										if (dragged) {

											setTimeout(function() {
												$wrapper.removeClass('is-dragged');
											}, 100);

											dragged = false;

										}

									// Distance exceeds threshold? Prevent default.
										if (distance > settings.dragging.threshold)
											event.preventDefault();

									// End drag.
										dragging = false;
										$wrapper.removeClass('is-dragging');
										clearInterval(velocityIntervalId);
										clearInterval(momentumIntervalId);

									// Pause scroll zone.
										$wrapper.triggerHandler('---pauseScrollZone');

									// Initialize momentum interval.
										if (settings.dragging.momentum > 0) {

											m = velocity;

											momentumIntervalId = setInterval(function() {

												// Scroll page.
													$document.scrollLeft($document.scrollLeft() + (m * direction));

												// Decrease momentum.
													m = m * settings.dragging.momentum;

												// Negligible momentum? Clear interval and end.
													if (Math.abs(m) < 1)
														clearInterval(momentumIntervalId);

											}, 15);

										}

								});

					})();

			// Link scroll.
				$wrapper
					.on('mouseup mousemove mousedown', '.image, img', function(event) {
									event.preventDefault();
								})
					.on('mousedown mouseup', 'a[href^="#"]', function(event) {

						// Stop propagation.
							event.stopPropagation();

					})
					.on('click', 'a[href^="#"]', function(event) {

						var	$this = $(this),
							href = $this.attr('href'),
							$target, x, y;

						// Get target.
							if (href == '#'
							||	($target = $(href)).length == 0)
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Calculate x, y.
							if (skel.breakpoint('small').active) {

								x = $target.offset().top - (Math.max(0, $window.height() - $target.outerHeight()) / 2);
								y = { scrollTop: x };

							}
							else {

								x = $target.offset().left - (Math.max(0, $window.width() - $target.outerWidth()) / 2);
								y = { scrollLeft: x };

							}

						// Scroll.
							$bodyHtml
								.stop()
								.animate(
									y,
									settings.linkScrollSpeed,
									'swing'
								);

					});

				$footer
					.on('mousedown mouseup', 'a[href^="#"]', function(event) {

						// Stop propagation.
							event.stopPropagation();

					})
					.on('click', 'a[href^="#"]', function(event) {

						var	$this = $(this),
							href = $this.attr('href'),
							$target, x, y;

						// Get target.
							if (href == '#'
							||	($target = $(href)).length == 0)
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Calculate x, y.
							if (skel.breakpoint('small').active) {

								x = $target.offset().top - (Math.max(0, $window.height() - $target.outerHeight()) / 2);
								y = { scrollTop: x };

							}
							else {

								x = $target.offset().left - (Math.max(0, $window.width() - $target.outerWidth()) / 2);
								y = { scrollLeft: x };

							}

						// Scroll.
							$bodyHtml
								.stop()
								.animate(
									y,
									settings.linkScrollSpeed,
									'swing'
								);

					});

			// Gallery.
				$('.gallery')
					.on('click', 'a', function(event) {

						var $a = $(this),
							$gallery = $a.parents('.gallery'),
							$modal = $gallery.children('.modal'),
							$modalImg = $modal.find('img'),
							href = $a.attr('href');

						// Not an image? Bail.
							if (!href.match(/\.(jpg|gif|png|mp4)$/))
								return;

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Locked? Bail.
							if ($modal[0]._locked)
								return;

						// Lock.
							$modal[0]._locked = true;

						// Set src.
							$modalImg.attr('src', href);

						// Set visible.
							$modal.addClass('visible');

						// Focus.
							$modal.focus();

						// Delay.
							setTimeout(function() {

								// Unlock.
									$modal[0]._locked = false;

							}, 600);

					})
					.on('click', '.modal', function(event) {

						var $modal = $(this),
							$modalImg = $modal.find('img');

						// Locked? Bail.
							if ($modal[0]._locked)
								return;

						// Already hidden? Bail.
							if (!$modal.hasClass('visible'))
								return;

						// Stop propagation.
							event.stopPropagation();

						// Lock.
							$modal[0]._locked = true;

						// Clear visible, loaded.
							$modal
								.removeClass('loaded')

						// Delay.
							setTimeout(function() {

								$modal
									.removeClass('visible')

								// Pause scroll zone.
									$wrapper.triggerHandler('---pauseScrollZone');

								setTimeout(function() {

									// Clear src.
										$modalImg.attr('src', '');

									// Unlock.
										$modal[0]._locked = false;

									// Focus.
										$body.focus();

								}, 475);

							}, 125);

					})
					.on('keypress', '.modal', function(event) {

						var $modal = $(this);

						// Escape? Hide modal.
							if (event.keyCode == 27)
								$modal.trigger('click');

					})
					.on('mouseup mousedown mousemove', '.modal', function(event) {

						// Stop propagation.
							event.stopPropagation();

					})
					.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
						.find('img')
							.on('load', function(event) {

								var $modalImg = $(this),
									$modal = $modalImg.parents('.modal');

								setTimeout(function() {

									// No longer visible? Bail.
										if (!$modal.hasClass('visible'))
											return;

									// Set loaded.
										$modal.addClass('loaded');

								}, 275);

							});

		});

})(jQuery);