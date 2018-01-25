/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-01-25 14:59:51
*/
/*拖拽功能--start*/
$(function () {
				$("#sourceBox div").draggable({
					helper : "clone"
				});
				$("#targetBox1 span,#targetBox2 span,#targetBox3 span,#targetBox4 span").droppable({
								accept : "#sourceBox div",
								drop : function(event, ui) {
									// replaceId拖动后替换原来的文字
									$(this).find(".replaceId").remove();
									$(this).text(ui.draggable.text()).appendTo(this).addClass("replaceId");
									//更换背景
									var bgArr = "drag_btn_" + ui.draggable.attr("dragNo") + ".png";
									console.log("bgArr"+bgArr);
									$(this).css({"background":"url(../images/img1/dragBtns/"+bgArr+")","background-size":"100% 100%"}); 
									var icon_html = '<span class="p1_btn_icons p1_addon1"></span>';
									/*$(this).addClass("p1_btn_icons").addClass("p1_addon1");*/
									var obj = $(icon_html);
									obj.find('.p1_target_font').append(icon_html);
									/*$(this).append(icon_html);*/
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
var answerArr = [standard_arr_1,standard_arr_2,standard_arr_3,standard_arr_4];
function nextBtn() {
	var standard_arr = new Array();//当前标准答案
	var answer = new Array();//答案
	var currentNo = 0;
	for (var i = 1; i < 5; i++) {
		if ($("#targetBox"+i).css("display") == "block") {
			currentNo = i;
		}
	};
	
	standard_arr = answerArr[currentNo-1];

	$("#targetBox"+currentNo+" span").each(function(i) {
		var contentTJ = this.innerHTML.trim();//取值===拖拽后的值
		answer.push(contentTJ);
	});
	if (standard_arr.sort().toString() == answer.sort().toString()) {
		controlShow();
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
					});
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
	});

	$(".p1_game_time").html(mytime/1000+":00");

},timeCell);

/*$(".back_btn").click(
		function function_name(argument) {
			window.location.href = "index.html";
		}
	);
*/