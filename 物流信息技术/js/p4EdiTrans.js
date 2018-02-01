/*
* @Author: pz
* @Date:   2018-02-01 09:27:20
* @Last Modified by:   pz
* @Last Modified time: 2018-02-01 16:47:24
*/
$(function () {
	setTimeout(function () {
		$(".p4-form-l").show().addClass("animated flash");
	},1000);
	setTimeout(function () {
		$(".p4-order-l").fadeIn(1500);
	},2000);
});

var fadeInTime = 1500;//单证显示耗时
var rotateTime = 1000;//转换及灯泡闪动时长
/*转换按钮*/
$(".p4-change-btn").click(function () {
	if ($(".p4-order-l").css("display") == "block") {
		$(".p4-form-l").hide();//隐藏电脑表单
		$(".p4-order-l").fadeOut();//隐藏订购单

		var refreshObj = $(".p4-refresh-l");
		startRotate(refreshObj);//开始转换
		setTimeout(function () {
			stopRotate(refreshObj);
			$(".p4-file-l").fadeIn(fadeInTime);
		},rotateTime);
	} else if($(".p4-file-r").css("display") == "block") {
		$(".p4-file-r").fadeOut();//隐藏平面文件

		var refreshObj = $(".p4-refresh-r");
		startRotate(refreshObj);
		setTimeout(function () {
			stopRotate(refreshObj);
			$(".p4-order-r").fadeIn(fadeInTime);
		},rotateTime);
		
		setTimeout(function () {
			showAlert('游戏完成，返回主界面!','end',function(){
				window.location.href = "index.html";
			});
		},3000);
	} else{
		showAlert('选择错误，请重新选择！','end');
	}
});

/*翻译按钮*/
$(".p4-trans-btn").click(function () {
	if ($(".p4-file-l").css("display") == "block") {
		$(".p4-file-l").fadeOut();

		var refreshObj = $(".p4-refresh-l");
		startRotate(refreshObj);
		setTimeout(function () {
			stopRotate(refreshObj);
			$(".p4-edi-l").fadeIn(fadeInTime);
		},rotateTime);
	} else if($(".p4-edi-r").css("display") == "block") {
		$(".p4-form-r").hide();//隐藏电脑表单
		$(".p4-edi-r").fadeOut();
		var refreshObj = $(".p4-refresh-r");
			startRotate(refreshObj);
			setTimeout(function () {
				stopRotate(refreshObj);
				$(".p4-file-r").fadeIn(fadeInTime);
		},rotateTime);
	} else{
		showAlert('选择错误，请重新选择！','end');
	}
	
});

/*通信按钮*/
$(".p4-corresp-btn").click(function () {
	if ($(".p4-edi-l").css("display") == "block") {
		$(".p4-edi-l").fadeOut();//隐藏EDI标准文件（左）
		$(".p4-mail").show().addClass("p4-mail-move");//邮件传输动画
		setTimeout(function () {
			$(".p4-mail").hide();//邮件传输动画完成--隐藏
			$(".p4-bulb").show().addClass("animated flash");//灯泡闪动
			setTimeout(function () {
				$(".p4-bulb").hide();//灯泡隐藏
				$(".p4-form-r, .p4-edi-r").fadeIn(fadeInTime);//显示电脑表单和EDI标准文件（右）
			},rotateTime);
		},5000);
	} else {
		showAlert('选择错误，请重新选择！','end');
	}
});


/*转换--旋转动画*/
function startRotate(rotateObj) {
	rotateObj.show();
	var rotation = function (){
	   rotateObj.rotate({
	      angle:0, 
	      animateTo:360, 
	      callback: rotation,
	      easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	          return c*(t/d)+b;
	      }
	   });
	}
	rotation();//调用车轮旋转
}
/*停止旋转*/
function stopRotate(rotateObj) {
	rotateObj.hide();
	rotateObj.stopRotate();
}
