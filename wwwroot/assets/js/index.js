profile();

// var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
// // var match2 = window.document.cookie.match(/(?:^|\s|;).AspNetCore.Antiforgery.r4zOSoBPHfI\s*=\s*([^;]+)(?:;|$)/);
// $.ajaxSetup({
// 	headers: {
// 		"X-XSRF-TOKEN": match[1]
// 	}
// })
//console.log(match);
// //console.log(match2);
/********************Webpage Common Configurations********************/
var answerQues = [];//id,answer
var config = {
	totalAmount: 30,
	timeState: false,
	questionArray: [],
	resultJSON: {},
	currentQuestion: 0
}
/********************Webpage Setting********************/
var questionsIteratorIndex;
var answersIteratorIndex;
//生成题目
function setQUESTION(QUESTIONS) {
	var content = '';
	var contentFooter = '';
	for (questionsIteratorIndex = 0; questionsIteratorIndex < QUESTIONS.length; questionsIteratorIndex++) {
		content += '<section class="panel"><div class="inner columns" id="q' + (questionsIteratorIndex + 1) + '">'//题目id
			+ '<div class="intro joined"><h1>' + (questionsIteratorIndex + 1) + '</h1></div>'//题目序号
			+ '<div class="span-3-25"><h3 class="major">' + QUESTIONS[questionsIteratorIndex].question + '</h3>';//问题内容
		if (QUESTIONS[questionsIteratorIndex].type == 0) {//选择题
			var ansInit = {};
			ansInit.id = QUESTIONS[questionsIteratorIndex].id;
			ansInit.answer = -1;
			answerQues.push(ansInit);
			for (answersIteratorIndex = 0; answersIteratorIndex < 4; answersIteratorIndex++) {//四个选项
				content += '<div class="field quarter"><input type="radio"'
					+ ' id="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1)//选项id
					+ '" value="' + answersIteratorIndex //提交的答案值
					+ '" onclick="saveAns(this)"'
					+ '" name="' + QUESTIONS[questionsIteratorIndex].id + '" class="color2" />'
					+ '<label for="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1) + '">'
					+ QUESTIONS[questionsIteratorIndex].choices[answersIteratorIndex] + '</label></div><br>';
			}//选项内容
			content += '</div>';
		}
		else {//判断题			
			var ansInit = {};
			ansInit.id = QUESTIONS[questionsIteratorIndex].id;
			ansInit.answer = -1;
			answerQues.push(ansInit);
			for (answersIteratorIndex = 0; answersIteratorIndex < 2; answersIteratorIndex++) {//两个选项

				content += '<div class="field quarter"><input type="radio" id="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1)
					+ '" value="' + answersIteratorIndex
					+ '" onclick="saveAns(this)"'
					+ '" name="' + QUESTIONS[questionsIteratorIndex].id + '" class="color2" />'
					+ '<label for="choice' + (questionsIteratorIndex + 1) + (answersIteratorIndex + 1) + '">'
					+ (answersIteratorIndex == 0 ? '正确' : '错误') + '</label></div><br>';
			}//选项为正确或错误
			content += '</div>';
		}
		if (questionsIteratorIndex + 1 != QUESTIONS.length) {//下一页按钮及图片
			content += '<div class="intro  joined"><ul class="actions"><li><a href="#q' + (questionsIteratorIndex + 2) + '" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';
			content += '<section class="panel spotlight large right" ><div class="image  tinted" data-position="top left"><img src="Images/background' + (questionsIteratorIndex % 9) + '.jpg" alt="" /></div></section>'
		}
		else {//如果是最后一题,链接指向提交页
			content += '<div class="intro  joined"><ul class="actions"><li><a href="#submission" class="button  color1 circle icon fa-angle-right">Next</a></li></ul></div></div></section>';
		}

	}//end of for
	for (var i = 0; i < QUESTIONS.length; i++) {
		contentFooter += '<a href="#q' + (i + 1) + '" id="question' + (i + 1) + '" class="questionId">' + (i + 1) + "</a>";
	}
	$("#answerCard").html(contentFooter);//生成分页
	$('#quiz-container').append(content);//生成问题


}
//生成结果
function setRESULT(RESULT) {
	var tableContent = "";
	for (var resultsIteratorIndex = 0; resultsIteratorIndex < config.totalAmount; resultsIteratorIndex++) {
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
}
function resetToShowResult() {
	//Common Set & SHOW RESULTS
	$("#wrapper").removeClass("testing");
	$("#welcome-container").remove();
	$("#quiz-container").remove();
	$("#submit-container").remove();
	$('.header_2').remove();
	$("#footer").remove();
	config.timeState = false;
	//SHOW RESULTS
	$("#result-container").show();
	setRESULT(config.resultJSON);
	//CHECK QUESTION ARRAY
	if (config.questionArray.length == 0) {
		for (var i = 0; i < config.totalAmount; i++) {
			var URLID = config.resultJSON.details[i].id;
			fetchOneQues(URLID);
		}
	}
	//ADD FUNCTIONS
	$("td").hover(function (event) {
		var reviewContent = "";
		var $tgt = $(event.target);
		var questionNum = $tgt.find(".num").text();
		var rightAns = config.resultJSON.details[questionNum - 1].correct;
		var submittedAns = config.resultJSON.details[questionNum - 1].submit;
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
				}
				else {
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
				}
				else {
					reviewContent += '<div class="field quarter">'
						+ (answersIteratorIndex == 0 ? '正确' : '错误') + '</div><br>';//选项内容
				}
			}

		}
		$("#review-container").html(reviewContent);


		$("#review-container").show();//hover后显示题目
	}, function () {
		$("#review-container").hide();//hover后显示题目
	});
	var seconds = 30;

	setInterval(function () {
		if (seconds >= 0) {
			$("#seconds-left").text(seconds);
			seconds--;
		}
		else {
			logout();
			$("#result-message").hide();
			window.location.href = "login.html";
		}
	}, 1000)


}

/********************Core Functions********************/
function saveAns(clickID) {
	var ans = clickID.value;
	var ID = clickID.name;
	var activeNum = parseInt(($(clickID).parents(".inner.columns").prop("id")).substr(1));
	var testing;
	for (var i = 0; i < answerQues.length; i++) {
		if (answerQues[i].id == ID && answerQues[i].answer != ans) {
			if (answerQues[i].answer == -1) {
				$("#question" + activeNum).removeClass("active").addClass("answered");
				setTimeout(function () {
					$("#question" + (activeNum + 1)).click();
				}, 500);
			}
			answerQues[i].answer = ans;
			testing = JSON.stringify(answerQues);
			////////console.log(testing);
		}
		else if (answerQues[i].id == ID && answerQues[i].answer == ans)
			return;
	}
}

function checkCompletion() {
	////////console.log(answerQues.length);
	////////console.log(config.timeState);
	if (config.timeState) {
		//5分钟以内提交
		if(mm>=22){
			alert("答题时间过短，请认真作答哦！");
			return false;			
		}
		else{
		//5分钟以上提交
		var tot = 0;
			for (var j = 0; j < answerQues.length; j++) {
				if (answerQues[j].answer == -1) {
					tot++;
				}
			}
			if (tot) {
				alert("您还有" + tot + "题未作答题目哦！");
				return false;
			}	
		}
	}
	return true;
	
}


function submit() {
	if (checkCompletion()){
		postResult();
		
	}
}
/********************API Interface********************/
function logout() {
	$.ajax({
		url: '/api/Account/Logout',
		contentType: "application/json",
		dataType: "json",
		async: false,
		type: "POST",
		success: function (req) {
			////////console.log(req);
		},
		error: function (xhr) {
			////////console.log(xhr);

		}
	});
}
function profile() {
	$.ajax({
		url: '/api/Account/profile',
		contentType: "application/json",
		dataType: "json",
		async: false,
		type: "GET",
		success: function (data,status,xhr) {
			console.log(xhr.getResponseHeader("Set-Cookie"));
			var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/);
			// var match2 = window.document.cookie.match(/(?:^|\s|;).AspNetCore.Antiforgery.r4zOSoBPHfI\s*=\s*([^;]+)(?:;|$)/);
			$.ajaxSetup({
				headers: {
					"X-XSRF-TOKEN": match[1]
				}
			})
		},
		error: function (xhr) {
			////////console.log(xhr);

		}
	});
}
function initialize() {
	$.ajax({
		url: "/api/Student/State/Initialize",
		async: true,
		type: "POST",
		beforeSend: function (xhr) {
            var match = window.document.cookie.match(/(?:^|\s|;)XSRF-TOKEN\s*=\s*([^;]+)(?:;|$)/)[1];
			xhr.setRequestHeader("X-XSRF-TOKEN", match);
			//alert("match"+match);
		},
		success: function (req) {
			////////console.log(req);
			getStateNShowWebpage();


		},
		error: function (req) {
			alert("初始化失败，请检查网络是否通畅");
			//logout
			logout();
			//alert(JSON.stringify(req));
			window.location.href = "login.html";
			// alert(req);
		}
	});
}
function getStateNShowWebpage() {
	////////console.log("Setting Webpage...");
	$.ajax({
		url: "/api/Student/State",
		async: true,
		type: "GET",
		success: function (req) {
			//Show Questions	
			////////console.log(req);
			if (req.testState == 0) {
				alert("登录失败");
				window.location.href = "login.html";
			}
			if (req.testState == 1) {
				//setSeed
				if (req.isSeedSet == false) {
					setSeed();
				}
				fetchQuestions();
				$("#wrapper").addClass("testing");
			}
			//Show Result
			else if (req.testState == 2) {
				////////console.log("inState2");
				getResult();
				$("#wrapper").addClass("tested");
			}
		},
		error: function (req) {
			////////console.log(req);
			alert("请检查网络");
		}
	})
}
function setSeed() {
	$.ajax({
		url: "/api/Student/Seed",
		async: true,
		type: "POST",
		success: function (req) {
			////////console.log(req);
		},
		error: function (req) {
			////////console.log(req);
			alert("请检查网络");
		}
	});
}
function fetchOneQues(URLID) {
	$.ajax({
		url: '/api/Question/' + URLID, 
		type: "GET", 
		dataType: "json", 
		async: true,
		contentType: "application/json",
		success: function (res) {
			config.questionArray.push(res);
		}
	});
}
function fetchQuestions() {
	$.ajax({
		url: "/api/Question",
		contentType: "application/json",
		dataType: "json",
		async: true,
		type: "GET",
		success: function (req) {
			config.questionArray = req;
			config.totalAmount = config.questionArray.length;
			setQUESTION(config.questionArray);
			////////console.log(config.totalAmount);
		},
		error: function (req) {
			////////console.log(req);
			alert("请检查网络");

		}
	});
}
function postResult() {
	$.ajax({
		url: "/api/Result",
		contentType: "application/json",
		dataType: "json",
		async: true,
		data: JSON.stringify(answerQues),
		type: "POST",
		success: function (res) {
			//RESET WEBPAGE
			////////console.log(res);
			config.resultJSON = res;
			resetToShowResult();
		},
		error: function () {
			alert("提交失败，请检查网络");
		}
	});
}
function getResult() {
	$.ajax({
		url: '/api/Result',
		type: "GET",
		dataType: "json",
		async: true,
		contentType: "application/json",
		success: function (res) {
			////////console.log("inGetResult");
			////////console.log(res);
			config.resultJSON = res;
			resetToShowResult();
		},
		error: function (request) {
			// alert("error:" + JSON.stringify(request));
		}
	});
}
var mm = 25;
var ss = 0;

(function ($) {
	var time = setInterval(function () {
		if (config.timeState) {
			if (mm == 0 && ss == 1) {
				ss--;
				alert("时间到！");
				$(".time").hide();
				config.timeState = false;
				submit();
			}
			else {
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




	$(function () {
		//Initialize State
		initialize();
		$("#start").click(function () {
			$("#footer").show();
			$("#quiz-container").show();
			$("#submit-container").show();
			config.timeState = true;
		});
		$(document).bind("mouseover mouseenter mousemove mouseup mousedown", function (e) { 
			var questionPos = [];
			var currentQues = 0;
			for (var it = 1; it <= 30; it++) {

				var fix = $("section .panel.large").width();
				questionPos[it] = ($("#q" + it).offset()).left - fix / 2;

			}
			for (var it = 1; it <= 30; it++) {
				if ((e.pageX) < questionPos[it]) {
					currentQues = it - 1;
					break;
				}
			}
			if (currentQues != config.currentQuestion) {

				$("#question" + (config.currentQuestion)).removeClass("activate");
				config.currentQuestion = currentQues;

				$("#question" + (currentQues)).addClass("activate");
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
	$(function () {

		// Vars.
		var $window = $(window),
			$document = $(document),
			$body = $('body'),
			$html = $('html'),
			$bodyHtml = $('body,html'),
			$wrapper = $('#wrapper'),
			$footer = $('#footer');

		// Disable animations/transitions until the page has loaded.
		$body.addClass('is-loading');

		$window.on('load', function () {
			window.setTimeout(function () {
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
				.on('load resize', function () {

					// Calculate wrapper width.
					var w = 0;

					$wrapper.children().each(function () {
						w += $(this).width();
					});

					// Apply to page.
					$html.css('width', w + 'px');

				});

		}

		// Polyfill: Object fit.
		if (!skel.canUse('object-fit')) {

			$('.image[data-position]').each(function () {

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
			(function () {

				$wrapper

					// Prevent keystrokes inside excluded elements from bubbling.
					.on('keypress keyup keydown', settings.excludeSelector, function (event) {

						// Stop propagation.
						event.stopPropagation();

					});

				$window

					// Keypress event.
					.on('keydown', function (event) {

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
			(function () {

				// Based on code by @miorel + @pieterv of Facebook (thanks guys :)
				// github.com/facebook/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
				var normalizeWheel = function (event) {

					var pixelStep = 10,
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
						&& event.axis === event.HORIZONTAL_AXIS) {
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
						&& event.deltaMode) {

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
				$body.on('wheel', function (event) {

					// Disable on <=small.
					if (skel.breakpoint('small').active)
						return;

					// Prevent default.
					event.preventDefault();
					event.stopPropagation();

					// Stop link scroll.
					$bodyHtml.stop();

					// Calculate delta, direction.
					var n = normalizeWheel(event.originalEvent),
						x = (n.pixelX != 0 ? n.pixelX : n.pixelY),
						delta = Math.min(Math.abs(x), 150) * settings.scrollWheel.factor,
						direction = x > 0 ? 1 : -1;

					// Scroll page.
					$document.scrollLeft($document.scrollLeft() + (delta * direction));

				});

			})();

		// Link scroll.
		$wrapper
			.on('mouseup mousemove mousedown', '.image, img', function (event) {
				event.preventDefault();
			})
			.on('mousedown mouseup', 'a[href^="#"]', function (event) {

				// Stop propagation.
				event.stopPropagation();

			})
			.on('click', 'a[href^="#"]', function (event) {

				var $this = $(this),
					href = $this.attr('href'),
					$target, x, y;

				// Get target.
				if (href == '#'
					|| ($target = $(href)).length == 0)
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
			.on('mousedown mouseup', 'a[href^="#"]', function (event) {

				// Stop propagation.
				event.stopPropagation();

			})
			.on('click', 'a[href^="#"]', function (event) {

				var $this = $(this),
					href = $this.attr('href'),
					$target, x, y;

				// Get target.
				if (href == '#'
					|| ($target = $(href)).length == 0)
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
			.on('click', 'a', function (event) {

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
				setTimeout(function () {

					// Unlock.
					$modal[0]._locked = false;

				}, 600);

			})
			.on('click', '.modal', function (event) {

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
				setTimeout(function () {

					$modal
						.removeClass('visible')

					// Pause scroll zone.
					$wrapper.triggerHandler('---pauseScrollZone');

					setTimeout(function () {

						// Clear src.
						$modalImg.attr('src', '');

						// Unlock.
						$modal[0]._locked = false;

						// Focus.
						$body.focus();

					}, 475);

				}, 125);

			})
			.on('keypress', '.modal', function (event) {

				var $modal = $(this);

				// Escape? Hide modal.
				if (event.keyCode == 27)
					$modal.trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function (event) {

				// Stop propagation.
				event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
			.find('img')
			.on('load', function (event) {

				var $modalImg = $(this),
					$modal = $modalImg.parents('.modal');

				setTimeout(function () {

					// No longer visible? Bail.
					if (!$modal.hasClass('visible'))
						return;

					// Set loaded.
					$modal.addClass('loaded');

				}, 275);

			});

	});

})(jQuery);