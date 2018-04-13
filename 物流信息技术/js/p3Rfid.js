/*
* @Author: pz
* @Date:   2018-01-23 15:40:35
* @Last Modified by:   pz
* @Last Modified time: 2018-04-13 14:52:58
*/
$(function () {
	// 播放视频--start
	myVideo = document.getElementById('rfid');
	$('.p2_video_bg , .p2_video_bg_refresh').click(function(){
		$(this).hide();

		myVideo.play();
		myVideo.setAttribute('controls','controls');

		// 播放结束
		myVideo.addEventListener('ended',function(){
			myVideo.removeAttribute('controls');

			$(".p2_video_bg_refresh").show();
		});
	});

	/*隐藏信息流动画*/
	$(".p3-reader, .p3-antenna-left, .p3-antenna-right, .p3-rfid, .p3-application, .p3-wave, .p3-wave-text, .p3-reader-text, .p3-time, .p3-energy, .p3-data ").hide();
	$(".p3-line1, .p3-line2").width(0);
	$(".p3-line3").height(0);
	

	/*隐藏场景动画*/
	$(".p3-single-red, .p3-single-blue").hide();//隐藏红蓝信号
	//隐藏黄色信号线
	$(".p3-scene-line > .a1, .a3, .a5").width(0);
	$(".p3-scene-line > .a2, .a4, .a6").height(0);
	
});


/*二、信息流动画控制*/
function infoAnimate() {
	var lineWidth = '97px';//横线宽度
	var lineHeight = '84px';//竖线高度
	var lineSpeed = 1000;//线条展开时长
	var arrowInit = 5;//箭头初始化宽度
	var arrowWidth = '106px';//单向箭头宽度
	var arrowWidthD = '69px';//双向箭头宽度
	var arrowSpeed = 800;//箭头展开时长


	setTimeout(function () {
		$(".p3-reader").fadeIn().addClass(" pulse animated");
	},1000);
	setTimeout(function () {
		$(".p3-line1").animate({width:lineWidth},lineSpeed);
	},2000);
	setTimeout(function () {
		$(".p3-antenna-left").fadeIn().addClass(" pulse animated");
	},3000);


	setTimeout(function () {
		$(".p3-antenna-right").fadeIn().addClass(" pulse animated");
	},4000);
	setTimeout(function () {
		$(".p3-line2").animate({width:lineWidth},lineSpeed);
	},5000);
	setTimeout(function () {
		$(".p3-rfid").fadeIn().addClass(" pulse animated");
	},6000);


	setTimeout(function () {
		$(".p3-line3").animate({height:lineHeight},lineSpeed);
	},7000);
	setTimeout(function () {
		$(".p3-application").fadeIn().addClass(" pulse animated");
	},8000);


	setTimeout(function () {
		$(".p3-wave").fadeIn();
	},9000);
	setTimeout(function () {
		$(".p3-wave-text").fadeIn().addClass(" pulse animated");
	},10000);

	setTimeout(function () {
		$(".p3-reader-text").fadeIn().addClass(" pulse animated");
	},11000);

	setTimeout(function () {
		$(".p3-time").width(arrowInit);
		$(".p3-time").fadeIn().animate({width:arrowWidth},arrowSpeed);
	},13000);

	setTimeout(function () {
		$(".p3-energy").width(arrowInit);
		$(".p3-energy").fadeIn().animate({width:arrowWidth},arrowSpeed);
	},14000);

	setTimeout(function () {
		$(".p3-data-left, .p3-data-right").width(arrowInit);
		$(".p3-data").fadeIn();
		$(".p3-data-left, .p3-data-right").animate({width: arrowWidthD}, arrowSpeed);
	},15000);
}

/*三、场景动画--start*/
function sceneAnimate() {
	/*0.开场动画---小车驶入--左移10%*/
	dirve("10%",2000);
	// 【开启按钮】天线发出信号
	$(".p3-scene-btn1").addClass("p3-scene-btn-active").attr("able","true");
	/*调试*/
	/*$(".p3-scene-right div").each(function () {
		$(this).attr("able","true");
	});*/
}

/*1.射频信号闪动（红）*/
$(".p3-scene-btn1").click(function(){
	if ($(this).attr("able")) {
		$(".p3-single-red").show();	
		// 【开启按钮】电子标签激活
		controlBtn(1);	
	}
});

/*2.电子标签点亮*/
$(".p3-scene-btn2").click(function(){
	if ($(this).attr("able")) {
		$(".p3-car-rfid").fadeIn();
		$(".p3-car-rfid-out").addClass('animated delay_02 flash');
		// 【开启按钮】标签发出信号
		controlBtn(2);	
	}
});

/*3.射频信号闪动（蓝）*/
$(".p3-scene-btn3").click(function(){
	if ($(this).attr("able")) {
		$(".p3-single-blue").show();
		// 【开启按钮】天线接收信号
		controlBtn(3);	
	}
});

/*4.天线闪动*/
$(".p3-scene-btn4").click(function(){
	if ($(this).attr("able")) {
		$(".p3-scene-antenna").addClass('animated delay_02 flash');
		
		// 【开启按钮】读写器解码
		controlBtn(4);		
	}
});

/*5.读写器闪动*/
$(".p3-scene-btn5").click(function(){
	if ($(this).attr("able")) {
		var lineSpeed = 1000;//线条展开时长
		//显示黄色信号线a1-a4
		$(".p3-scene-line > .a1").animate({width:"4%"},lineSpeed);
		setTimeout(function () {
			$(".p3-scene-line > .a2").animate({height:"2.5%"},lineSpeed);
		},500);
		setTimeout(function () {
			$(".p3-scene-line > .a3").animate({width:"7.5%"},lineSpeed);
		},1500);
		setTimeout(function () {
			$(".p3-scene-line > .a4").animate({height:"20%"},lineSpeed);
		},2000);
		setTimeout(function () {
			$(".p3-scene-rf").addClass('animated delay_02 flash');//读写器闪动
		},2500);

		// 【开启按钮】读写器解码
		controlBtn(5);	
		
	}
});
/*6.系统点亮，发出YES指令*/
$(".p3-scene-btn6").click(function(){
	if ($(this).attr("able")) {
		var lineSpeed = 1000;//线条展开时长
		$(".p3-scene-line > .a5").animate({width:"15%"},lineSpeed);
		setTimeout(function () {
			$(".p3-scene-line > .a6").animate({height:"38%"},lineSpeed);
		},1000);
		setTimeout(function () {
			$(".p3-scene-pc").show().addClass('animated pulse');//显示电脑
		},2000);
		setTimeout(function () {
			$(".p3-scene-yes").show().addClass('animated delay_02 flash');//yes
		},3000);

		// 【开启按钮】系统判断发出指令
		controlBtn(6);	
	}
});
/*7.闸机打开*/
$(".p3-scene-btn7").click(function(){
	if ($(this).attr("able")) {
		$(".p3-scene-gate-close, .p3-scene-rf").fadeOut();
		setTimeout(function () {
			$(".p3-scene-gate-open").fadeIn();	
		},500);

		setTimeout(function () {
			$(".p3-scene-gate-open").fadeIn();	
		},1000);

		setTimeout(function () {
			$(".p3-scene-yes, .p3-scene-pc, .a5, .a6, .p3-car-rfid, .p3-single-blue, .p3-single-red ").fadeOut();	
		},1500);

		setTimeout(function () {
			// 小车驶出
			dirve("100%",5000);	
		},1500);

		// 【开启按钮】执行系统指令
		controlBtn(7);	
	}
});


/*小车行驶动画*/
function dirve(moveDist,moveSpeed) {
	var rotation = function (){
	   $(".p3-car-tyre-left , .p3-car-tyre-right").rotate({
	      angle:0, 
	      animateTo:360, 
	      callback: rotation,
	      easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	          return c*(t/d)+b;
	      }
	   });
	}

	$(".p3-car").animate({left:moveDist}, moveSpeed, function () {
		$(".p3-car-tyre-left , .p3-car-tyre-right").stopRotate();
	});

	rotation();//调用车轮旋转
}

/*控制按钮*/
function controlBtn(btnNo) {
	$(".p3-scene-btn"+btnNo).removeClass("p3-scene-btn-active").attr("able","false");
	if (btnNo != 7) {
		$(".p3-scene-btn"+(btnNo+1)).addClass("p3-scene-btn-active").attr("able","true");	
	}
}

/*三、场景动画--end*/

function nextBtn() {
	if ($(".p3-box-item").css("display") == "block") {
		myVideo.pause();//停止播放音频
		$(".p3-box-item").hide();
		$(".p3-info-box").show();

		/*显示信息流动画*/
		setTimeout(infoAnimate(),500);
	} else if ($(".p3-info-box").css("display") == "block") {
		$(".p3-info-box").hide();
		$(".p3-scene-box").show();
		//最后一步显示为[完成]按钮
		$(".next_btn").addClass("finish_btn");
		/*显示场景动画*/
		setTimeout(sceneAnimate(),500);
	} else if ($(".p3-scene-box").css("display") == "block"){
		showAlert('游戏完成，返回主界面!','end',function(){
			window.location.href = "index.html";
		},"false");
	}
}