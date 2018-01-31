/*
* @Author: pz
* @Date:   2018-01-23 16:47:46
* @Last Modified by:   pz
* @Last Modified time: 2018-01-26 10:55:28
*/
/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-01-22 18:01:24
*/
/*拖拽功能--start*/
$(function () {
				$("#targetBox div,#sourceBox div").draggable({
					helper : "clone"
				});
				$("#targetBox div,#sourceBox div").droppable({
					accept : "#targetBox div,#sourceBox div",
					drop : function(event, ui) {
						//更换背景
						var dragNo = ui.draggable.attr("dragNo");//被拖动的元素的id

						/*1.修改接收区样式*/
						var oldText = $(this).text().trim();//原文字
						$(this).find(".replaceId").remove();
						$(this).text('');
						var icon_html = '<span class="p5_sourceBox_text">' + ui.draggable.text() + '</span>';
						var obj = $(icon_html);
						obj.appendTo(this).addClass("replaceId");
						$(this).attr("dragNo",dragNo);
						//更换背景
						var bgArr = "drag_" + dragNo + ".png";
						$(this).css({"background":"url(../images/img5/"+bgArr+")","background-size":"100% 100%"}); 
						/*2.如被拖动按钮在接收区，且替换了其他答案--还原被替换的按钮在答案区域的样式*/
						if (oldText != '将正确标准拖至此处') {
							$("#sourceBox div").each(function(){
								var targetText = $(this).text();
								if (targetText == oldText) {
									$(this).draggable({ disabled: false });
									var bgArrSource = "drag_" + dragNo + ".png";
									$(this).css({"background":"url(../images/img5/"+bgArrSource+")", "background-size":"100% 100%"});
									$(this).find(".p5_sourceBox_text").css({"color":"#0097B9"}); 
								}
							});
						}
						// console.log(ui.draggable);
						
						/*2.修改被拖动后的样式*/
						if (ui.draggable.hasClass('p5_drag_btn')) {//拖动答案区域的按钮【禁止答案区域已拖动的按钮继续拖动,并置灰】
							ui.draggable.draggable({ disabled: true });//禁止拖动
							var bgArrSource = "drag_" + dragNo + "_grey.png";//背景置灰
							ui.draggable.css({"background":"url(../images/img5/"+bgArrSource+")", "background-size":"100% 100%"});
							$(".p5_drag_" + dragNo +"> span").css({"color":"#7E7E7E"});//改变文字颜色
						} else {//拖动接收区的按钮【还原至初始状态】
							ui.draggable.removeAttr("style").removeAttr("dragNo");//将div还原到初始状态
							ui.draggable.empty();
							var icon_html = '<span class="p5_targetBox_text ui-sortable-handle">将正确标准拖至此处</span>';
							var obj = $(icon_html);
							ui.draggable.append(obj)
						}
					}
				}).sortable();
			});
/*拖拽功能--end*/


/*下一关按钮--start*/
//标准答案 
var standard_arr = ["基础标准","代码标准","报文标准","单证标准","管理标准","应用标准","通信标准","安全保密标准"];
var answerArr = new Array();//答案
function nextBtn() {
	$("#targetBox span").each(function(i) {
		var contentTJ = this.innerHTML.trim();//取值===拖拽后的值
		answerArr.push(contentTJ);
	});
	/*console.log("answerArr="+answerArr);*/
	if (standard_arr.sort().toString() == answerArr.sort().toString()) {
		showAlert('游戏完成，返回主界面!','end',function(){
				window.location.href = "index.html";
			});
	} else {
		showAlert('选择错误，请重新选择！','end');
		return;
	}
	
};
/*下一关按钮--end*/


//倒计时；
var time = 1;//暂定1分钟
var mytime = 1*1000*60;
var timeCell = 1000;//动画和文字变化时间间隔


setTimeout(function(){
	startTime = new Date();
	var changeTimeInterval = setInterval(function () {
		mytime = mytime-timeCell;
		$(".p1_game_time").html(mytime/1000+":00");
	},timeCell);

	$('.p1_game_time_speed').animate({'left':'0%'},mytime,function(){
		window.clearInterval(changeTimeInterval);//清空计时器
	});

	$(".p1_game_time").html(mytime/1000+":00");

},timeCell);

