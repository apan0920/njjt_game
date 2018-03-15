/*
* @Author: pz
* @Date:   2018-01-16 09:52:25
* @Last Modified by:   pz
* @Last Modified time: 2018-03-09 11:54:13
*/

$(function () {
	// 播放视频--start
	var myVideo = document.getElementById('scene1');
	$('.p2_video_bg , .p2_video_bg_refresh').click(function(){
		$(this).hide();

		var showFlag = "none";
		for (var i = 1; i < 6; i++) {
			var showFlag = $("#scene"+i).css("display");
			if (showFlag == "block") {
				$('#scene'+i).show();
				myVideo = document.getElementById('scene'+i);
				break;
			}
		}

		myVideo.play();
		myVideo.setAttribute('controls','controls');

		// 播放结束
		myVideo.addEventListener('ended',function(){
			myVideo.removeAttribute('controls');

			$(".p2_video_bg_refresh").show();
			/*// 循环子集设置隐藏
			$(".googleMap_video").children().css("display", "none");*/
		});
	});

	

	// 播放视频--end
	
	/*单选按钮选择效果*/
	$(".p2_radio").click(function () {
		$(".p2_answer span").removeClass("p2_radio_sel");
		$(this).addClass("p2_radio_sel");
	});

	/*1.物流标准化与相关产业现有的标准体系之间的矛盾得不到协调解决。(场景1、2)
	2.物流标准化各相关产业之间的不协调。(场景3、4)
	3.物流标准化的市场基础比较薄弱。(场景5)*/
	var standerArr = ["A","A","B","B","C"];
	/*下一关--答对才能进入下一关*/
	$(".next_btn").click(function () {
		var currAnswer = $(".p2_radio_sel").attr("option");
		if (typeof(currAnswer) == "undefined") {
			showAlert('请先选择答案!','end');
		} else {
			var questionNo = 1;
			for (var i = 0; i < standerArr.length; i++) {
				var showFlag = $("#scene"+(i+1)).css("display");
				if (showFlag == "block") {
					questionNo = i;
					
				} 
			}
			//更改题目编号
			if (questionNo<4) {
				$("#questionNo").html("第"+ (questionNo+2) +"题、");
			}
			//最后一题显示为[完成]按钮
			if (questionNo == 3) {
				$(".next_btn").addClass("finish_btn");
			}
			
			console.log("questionNo=="+questionNo);
			if (currAnswer == standerArr[questionNo]) {
				/*进入下一关:显示下一关视频-隐藏其他视频*/
				if (questionNo == 4) {
					showAlert('游戏完成，返回主界面!','end',function(){
						window.location.href = "index.html";
					},"false");
				}else{
					for (var i = 1; i < 6; i++) {
						$("#scene"+i).css({"display":"none"});
					}
					$("#scene"+(questionNo+2)).css({"display":"block"});
					/*移除所有按钮选择效果*/
					$(".p2_answer span").removeClass("p2_radio_sel");
					/*隐藏重播按钮*/
					$(".p2_video_bg_refresh").hide();
					/*显示开始按钮*/
					$(".p2_video_bg").show();
				}
			} else {
				showAlert('选择错误，请重新选择!','end');
			}

		}
		
	});

});


