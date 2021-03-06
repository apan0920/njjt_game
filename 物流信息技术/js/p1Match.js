/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-04-13 14:52:47
*/

/*拖拽功能--start*/
var answer = new Array();//答案

$(function () {
	setQuestion();//随机出题
	$("#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #sourceBox div").draggable({
		helper : "clone"
	});
	/*$("#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #sourceBox div").droppable({
		accept : "#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #sourceBox div",*/
	$("#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span").droppable({
		accept : "#targetBox1 span, #targetBox2 span, #targetBox3 span, #targetBox4 span, #sourceBox div",
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
			// console.log(ui.draggable);
			
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
				// console.log("当前答案answerArr="+answer);
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
var standard_arr_1 = ["进货管理系统","销售管理系统","库存管理系统"];
var standard_arr_2 = ["仓库管理系统","出库作业系统","配送管理系统","运输管理系统"];
var standard_arr_3 = ["操作型系统","决策型系统"];
var standard_arr_4 = ["单机系统","计算机网络系统"];
var answerArr = [standard_arr_1, standard_arr_2, standard_arr_3, standard_arr_4];
function nextBtn() {
	var standard_arr = new Array();//当前标准答案
	
	var currentNo = 0;
	for (var i = 1; i < 5; i++) {
		if ($("#targetBox"+i).css("display") == "block") {
			currentNo = i;
		}
	};
	
	standard_arr = answerArr[currentNo-1];

	$("#targetBox"+currentNo+" span").each(function(i) {
		var contentTJ = this.innerHTML.trim();//取值===拖拽后的值
		if (answer.indexOf(contentTJ) < 0 && contentTJ != "将正确系统拖至此处") {//不能重复20180309
			answer.push(contentTJ);
		}
		// console.log("当前答案answerArr="+answer);
		// answer.push(contentTJ);
	});
	if (standard_arr.sort().toString() == answer.sort().toString()) {
		controlShow();
		if (currentNo == 3) {
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
	var titleArr = ["按物流作业流程分类","按物流环节分类","按系统功能性质分类","按系统配置分类"];
	for (var i = 1; i < 5; i++) {
		var aa = $("#targetBox"+i).css("display");
		if ($("#targetBox"+i).css("display") == "block") {
			$("#targetBox"+i).hide();
			if (i == 4) {
				showAlert('游戏完成，返回主界面!','end',function(){
						window.location.href = "index.html";
					},"false");
			} else {
				$("#targetBox"+(i+1)).show();
				$(".p1_game_title").html(titleArr[i]);
				return;
			}
		}
	};
};


//获取答题时间
// function getDate(){
// 	var bookingId = get_address('bookingId');
// 	var time;

// 	$.ajax({
// 		url: ajaxUrl + 'inter/delivery-game!getTime.action',
// 		type: 'get',
// 		dataType: 'json',
// 		data: { deliveryId:bookingId },
// 		async: false,
// 		success: function(data){
// 			// console.log(JSON.stringify(data));
// 			if(data.status == 0){ showAlert('aaa！'); return; }

// 			time = data.time;
// 		},
// 		error: function(){ console.log('加载失败') }
// 	});

// 	return time;
// };
//倒计时；
var time = 1;//暂定1分钟
var mytime = 1*1000*60;
var timeCell = 1000;//动画和文字变化时间间隔


setTimeout(function(){
	/*$('.p1_game_time').removeClass('bounceInDown delay_08');//.addClass('tada')*/
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
},timeCell);

// 出题-将右侧选项随机打乱
function setQuestion() {
	/*var answerArr = ["进货管理系统","销售管理系统","库存管理系统","仓库管理系统","出库作业系统","配送管理系统","运输管理系统","操作型系统","决策型系统","单机系统","计算机网络系统"];*/
	var answerArr = [
	{"name":"进货管理系统","no":"1"},
	{"name":"销售管理系统","no":"2"},
	{"name":"库存管理系统","no":"3"},
	{"name":"仓库管理系统","no":"4"},
	{"name":"出库作业系统","no":"5"},
	{"name":"配送管理系统","no":"6"},
	{"name":"运输管理系统","no":"7"},
	{"name":"操作型系统","no":"8"},
	{"name":"决策型系统","no":"9"},
	{"name":"单机系统","no":"10"},
	{"name":"计算机网络系统","no":"11"}];

	answerArr.sort(function() {
	     return (0.5-Math.random());
	});
	console.log(answerArr);
	for (var i = 0; i < answerArr.length; i++) {
		// var questNo = i+1;//题目编号
		var addHtml = 	'<div class="p1_drag_btn  p1_addon'+ answerArr[i].no +'" dragNo="'+ answerArr[i].no +'" >'+
						'<span class="p1_sel_btn_title" >'+ answerArr[i].name +'</span>'+
					'</div> ';
		$("#sourceBox").append(addHtml);
	}
}