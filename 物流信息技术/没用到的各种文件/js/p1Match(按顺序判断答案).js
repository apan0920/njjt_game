/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-01-18 20:59:15
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
									$(this).text(ui.draggable.text()).appendTo(
											this).addClass("replaceId");
								}
							}).sortable();
			});
/*拖拽功能--end*/


/*下一关按钮--start*/
//标准答案 
/*1.按物流作业流程分类：进货管理系统、销售管理系统、库存管理系统
2.按物流环节分类：仓库管理系统、出库作业系统、配送管理系统、运输管理系统
3.按系统功能性质分类：操作型系统、决策型系统
4.按系统配置分类：单机系统、计算机网络系统*/
var standard_arr_1 = ["进货管理系统","销售管理系统","库存管理系统"];
var standard_arr_2 = ["仓库管理系统","出库作业系统","配送管理系统","运输管理系统"];
var standard_arr_3 = ["操作型系统","决策型系统"];
var standard_arr_4 = ["单机系统","计算机网络系统","计算机网络系统"];
var answerArr = [standard_arr_1,standard_arr_2,standard_arr_3,standard_arr_4];
function nextBtn() {
	var misCount = 0;//记录答错个数 
	var standard_arr = new Array();//当前标准答案
	var currentNo = 0;
	for (var i = 1; i < 5; i++) {
		if ($("#targetBox"+i).css("display") == "block") {
			currentNo = i;
		}
		
	};
	
	standard_arr = answerArr[currentNo-1];

	$("#targetBox"+currentNo+" span").each(function(i) {
		var contentTJ = this.innerHTML;//取值===拖拽后的值
		//取值===没有填--null 
		var liConFirst = contentTJ.substring(contentTJ.indexOf("<li>")+4,contentTJ.indexOf("</li>"));
		//取值===提示后 的值 
		var liConSecond = contentTJ.substring(contentTJ.lastIndexOf('<li class="replaceId ui-droppable">')+35,contentTJ.lastIndexOf("</li>"));
		console.log("contentTJ="+contentTJ);
		console.log("liConFirst="+liConFirst);
		console.log("liConSecond="+liConSecond);
		//如果都不相等==》misCount++
		if (liConFirst.trim() != standard_arr[i] &&　contentTJ.trim() != standard_arr[i] && liConSecond.trim() != standard_arr[i]) {
				misCount++;
				//this.innerHTML = '';//置空错误答案 
			};
	});
	if (misCount == 0) {
		controlShow();
	} else {
		alert("选择错误，请重新选择！");
		return;
	}
	
};

/*控制答题区显示*/
function controlShow(){
	var titleArr = ["按物流作业流程分类","按物流环节分类","按系统功能性质分类","按系统配置分类"];
	for (var i = 1; i < 5; i++) {
		var aa = $("#targetBox"+i).css("display");
		if ($("#targetBox"+i).css("display") == "block") {
			$("#targetBox"+i).hide();
			if (i == 4) {
				alert("第一关游戏完成，返回主界面");
			} else {
				$("#targetBox"+(i+1)).show();
				$(".p1_game_title").html(titleArr[i]);
				return;
			}
		}
	};

};

/*下一关按钮--end*/