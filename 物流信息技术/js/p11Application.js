/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-04-13 14:22:46
*/

/*拖拽功能--start*/
var answer = new Array();//答案

$(function () {
	setQuestion();//随机出题
	$("#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #targetBox5 span, #sourceBox div").draggable({
		helper : "clone"
	});
	$("#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #targetBox5 span").droppable({
		accept : "#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #targetBox5 span, #sourceBox div",
		drop : function(event, ui) {
			//更换背景
			var dragNo = ui.draggable.attr("dragNo");//被拖动的元素的id

			/*1.修改接收区样式*/
			var oldText = $(this).text().trim();//原文字
			$(this).find(".replaceId").remove();
			$(this).text('');
			//不可以拖回右侧答案区
			$(this).text(ui.draggable.text()).addClass("replaceId");//接收区在左侧答题区

			if (ui.draggable.hasClass('p1_drag_btn')) {//拖动右侧按钮
				$(this).text(ui.draggable.text()).addClass("replaceId");
			}

			$(this).attr("dragNo",dragNo);
			//更换背景
			var bgArr = "drag-" + dragNo + ".png";
			$(this).css({"background":"url(../images/img1/dragBtns/"+bgArr+")","background-size":"100% 100%"}); 
			/*2.如被拖动按钮在接收区，且替换了其他答案--还原被替换的按钮在答案区域的样式*/
			if (oldText != '将正确系统拖至此处') {
				$("#sourceBox div").each(function(){
					var targetText = $(this).text().trim();
					if (targetText == oldText) {
						$(this).draggable({ disabled: false });
						var bgArrSource = "drag-" + dragNo + ".png";
						/*$(this).css({"background":"url(../images/img1/dragBtns/"+bgArrSource+")", "background-size":"100% 100%"});*/
						$(this).css({"background":""});
						$(this).find(".p1_sel_btn_title").css({"color":"#0097B9"}); 
					}
				});
				// 移除答案中的此项答案20180309
				// console.log("当前答案answerArr="+answer);
				var index = answer.indexOf(oldText.trim());
				if (index > -1) {
					answer.splice(index, 1);
				}
				console.log("当前答案answer="+answer);

			}
			/*2.修改被拖动后的样式*/
			if (ui.draggable.hasClass('p1_drag_btn')) {//拖动答案区域的按钮【禁止答案区域已拖动的按钮继续拖动,并置灰】
				ui.draggable.draggable({ disabled: true });//禁止拖动
				var bgArrSource = "drag-" + dragNo + "-grey.png";//背景置灰
				ui.draggable.css({"background":"url(../images/img1/dragBtns/"+bgArrSource+")", "background-size":"100% 100%"});
				$(".p1_addon" + dragNo +"> span").css({"color":"#7E7E7E"});//改变文字颜色
			} else {//拖动接收区的按钮【还原至初始状态】
				ui.draggable.removeAttr("style").removeAttr("dragNo");//将div还原到初始状态
				ui.draggable.empty();
				ui.draggable.html("将正确系统拖至此处");
				// 移除答案中的此项答案20180309
				var index = answer.indexOf($(this).text().trim());
				if (index > -1) {
					answer.splice(index, 1);
				}
				console.log("当前答案answer="+answer);
			}
		}
	}).sortable();
});
/*拖拽功能--end*/

/*下一关按钮--start*/
//标准答案 
var answerArr = ["条码技术", "EDI技术", "RFID技术", "GIS技术", "GPS技术"];
function nextBtn() {
	var standard_arr = new Array();//当前标准答案
	
	var currentNo = 0;
	for (var i = 1; i < (answerArr.length+1); i++) {
		if ($("#targetBox"+i).is(':visible')) {
			currentNo = i;
		}
	};
	
	standard_arr = answerArr[currentNo-1];

	$("#targetBox"+currentNo+" span").each(function(i) {
		var contentTJ = this.innerHTML.trim();//取值===拖拽后的值
		if (answer.indexOf(contentTJ) < 0 && contentTJ != "将正确系统拖至此处") {//不能重复20180309
			answer.push(contentTJ);
		}
	});
	if (standard_arr.toString() == answer.toString()) {
		controlShow();
		if (currentNo == (answerArr.length-1)) {
			$(".next_btn").addClass("finish_btn");
		}
		// 分关判断答案--清除之前的答案
		answer.splice(0, answerArr.length); 
	} else {
		showAlert('选择错误，请重新选择！','end');
		return;
	}
	
};
/*下一关按钮--end*/

/*控制答题区显示*/
function controlShow(){
	var titleArr = [
		"该技术是在计算机的应用实践中产生和发展起来的一种自动识别技术。为我们提供了一种对物流中的货物进行标识和描述的方法。 是实现POS系统、EDI、电子商务、供应链管理的技术基础，是物流管理现代化、提高企业管理水平和竞争能力的重要技术手段。",
		"该技术是指通过电子方式，采用标准化的格式，利用计算机网络进行结构化数据的传输和交换。 构成EDI系统的三个要素是EDI软硬件、通信网络以及数据标准化。",
		"该技术是一种非接触式的自动识别技术，它通过射频信号自动识别目标对象来获取相关数据。识别工作无须人工干预，可工作于各种恶劣环境。 短距离射频产品不怕油渍、灰尘污染等恶劣的环境，可以替代条码，例如用在工厂的流水线上跟踪物体。长距射频产品多用于交通上，识别距离可达几十米，如自动收费或识别车辆身份等。",
		"该技术是多种学科交叉的产物，它以地理空间数据为基础，采用地理模型分析方法，适时地提供多种空间的和动态的地理信息，是一种为地理研究和地理决策服务的计算机技术系统。其基本功能是将表格型数据（无论它来自数据库、电子表格文件或直接在程序中输入）转换为地理图形显示，然后对显示结果浏览、操作和分析。其显示范围可以从洲际地图到非常详细的街区地图，显示对象包括人口、销售情况、运输线路和其它内容。",
		"该技术具有在海、陆、空进行全方位实时三维导航与定位能力，且在物流领域可以应用于汽车自定位、跟踪调度，用于铁路运输管理，用于军事物流。"
	];
	for (var i = 1; i < (answerArr.length+1); i++) {
		var aa = $("#targetBox"+i).css("display");
		if ($("#targetBox"+i).is(':visible')) {
			$("#targetBox"+i).hide();
			if (i == answerArr.length) {
				showAlert('游戏完成，返回主界面!','end',function(){
						window.location.href = "index.html";
					},"false");
			} else {
				$("#targetBox"+(i+1)).show();
				$(".p11_game_intro").html(titleArr[i]);
				return;
			}
		}
	};
};


/*//倒计时；
var time = 1;//暂定1分钟
var mytime = 1*1000*60;
var timeCell = 1000;//动画和文字变化时间间隔


setTimeout(function(){
	// $('.p1_game_time').removeClass('bounceInDown delay_08');//.addClass('tada')
	startTime = new Date();
	// $('.booking_submit a').attr('isSubmit','true');
	var changeTimeInterval = setInterval(function () {
		mytime = mytime-timeCell;
		// console.log(mytime);
		$(".p1_game_time").html(mytime/1000+":00");
	},timeCell);

	$('.p1_game_time_speed').animate({'left':'0%'},mytime,function(){
		window.clearInterval(changeTimeInterval);//清空计时器
		showAlert('游戏计时结束，游戏结束!','end',function(){
			window.location.href = "index.html";
		}, "false");
	});

	$(".p1_game_time").html(mytime/1000+":00");
},timeCell);*/

// 出题-将右侧选项随机打乱
function setQuestion() {
	var answerArr = [
		{"name":"条码技术","no":"1"},
		{"name":"EDI技术","no":"2"},
		{"name":"RFID技术","no":"3"},
		{"name":"GIS技术","no":"4"},
		{"name":"GPS技术","no":"5"}
	];

	answerArr.sort(function() {
	     return (0.5-Math.random());
	});
	console.log(answerArr);
	for (var i = 0; i < answerArr.length; i++) {
		var addHtml = 	'<div class="p1_drag_btn  p1_addon'+ answerArr[i].no +'" dragNo="'+ answerArr[i].no +'" >'+
						'<span class="p1_sel_btn_title" >'+ answerArr[i].name +'</span>'+
					'</div> ';
		$("#sourceBox").append(addHtml);
	}
}