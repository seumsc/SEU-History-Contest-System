var $ = require("../../../node_modules/jquery/dist/jquery.min.js");
var inTime = require('./ans.ts').inTime;
var setRESULT = require('./questions.js').setRESULT;
var answerQues = new Array(30);

// answerQues[0] = "curAns"
exports.saveAns = function (clickID) {
	// var ans = 0;
	var ans = clickID.value;
	var id = clickID;
	var ID = (id.length == 8 ? parseInt(id[6]) : parseInt(id[6]) * 10 + parseInt(id[7]));
	var testing;
	var ans = parseInt(id[id.length - 1]) - 1;
	var check = {};
	check.id = ID;
	check.answer = ans;
	answerQues[ID - 1] = check;
	testing = JSON.stringify(answerQues);
	$("#question" + ID).addClass("answered");
	setTimeout(function () {
		$("#question" + ID).click();
	}, 300);
}
exports.saveAnsID = function (questions) {
	for (var i = 0; i < 30; i++) {
		// answerQues[i]=check;
		answerQues[i].id = questions[i].id;
		// alert(JSON.stringify(questions[i]));
		// alert(JSON.stringify(answerQues[i]));
	}
}
exports.submit = function (inTime) {
	var tot = 0;
	for (var i = 0; i < 30; i++)
		if (answerQues[i] == null) tot++;
	/////////////////////////////////
	if (tot != 0 && inTime)
		alert("您还有" + tot + "题未作答题目哦!");
	else {
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
				setRESULT(res);
		
			},
			complete: function () {
			},
			error: function (request) {
				alert("error:" + JSON.stringify(request));
			}
		});
	}
}