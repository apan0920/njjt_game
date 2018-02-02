/*
* @Author: pz
* @Date:   2018-02-01 09:27:20
* @Last Modified by:   pz
* @Last Modified time: 2018-02-02 18:31:13
*/
$(function () {
	/*任务提示*/
	


	
});
var msg1 = '1.小明使用电脑将制作完成的订购单证发送给小王，应用系统形成数据文件后，需要转化为平面软件，请选择其中一种软件进行转化。';
var msg2 = '2.数据文件经过转换软件，转化为平面文件，平面文件需要转化为标准的EDI格式报文，请选择其中一种软件进行转化。';
var msg3 = '3.EDI标准报文需要发送至EDI系统交换中，那么对于EDI的传输，请选择其中一种软件进行传输。';
var msg4 = '4.通信软件将EDI系统交换中心内邮箱接收到的文件取出，请选择一种软件将EDI报文转化为平面文件。';
var msg5 = '5.翻译软件将报文转化为平面文件后，请选择一种软件将平面文件转化为小明应用系统可读懂的数据文件。';
var msg6 = '6.小明通过应用系统读取到对应的数据文件。';
var fadeInTime = 1500;//单证显示耗时
var rotateTime = 1000;//转换及灯泡闪动时长
/*任务说明--关闭/确认按钮*/
$(".p4-mission-intro-confirm, .p4-mission-intro-close").click(function () {
	$(".p4-mission-intro").removeClass("bounceInLeft").addClass("bounceOutRight");
	setTimeout(function () {
		$(".p4-msg-box").fadeOut();
	},200);

	setTimeout(function () {
		animateInit();
	},1000);
	/*显示提示信息*/
	showMsg(".p4-msg-boy", msg1, 5);
});


/*动画初始化*/
function animateInit() {
	setTimeout(function () {
		$(".p4-form-l").show().addClass("animated flash");
	},1000);
	setTimeout(function () {
		$(".p4-order-l").fadeIn(fadeInTime);
	},2000);
}


/*转换按钮*/
$(".p4-change-btn").click(function () {
	closeMsg();//关闭提示框
	if ($(".p4-order-l").css("display") == "block") {
		$(".p4-form-l").hide();//隐藏电脑表单
		$(".p4-order-l").fadeOut();//隐藏订购单

		var refreshObj = $(".p4-refresh-l");
		startRotate(refreshObj);//开始转换
		setTimeout(function () {
			stopRotate(refreshObj);
			$(".p4-file-l").fadeIn(fadeInTime);
		},rotateTime);
		/*显示提示信息*/
		showMsg(".p4-msg-boy", msg2, 3);
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
		/*显示提示信息*/
		showMsg(".p4-msg-girl",msg6, 3);
	} else{
		showAlert('选择错误，请重新选择！','end');
	}
});

/*翻译按钮*/
$(".p4-trans-btn").click(function () {
	closeMsg();//关闭提示框
	if ($(".p4-file-l").css("display") == "block") {
		$(".p4-file-l").fadeOut();

		var refreshObj = $(".p4-refresh-l");
		startRotate(refreshObj);
		setTimeout(function () {
			stopRotate(refreshObj);
			$(".p4-edi-l").fadeIn(fadeInTime);
		},rotateTime);
		/*显示提示信息*/
		showMsg(".p4-msg-boy", msg3, 3);
	} else if($(".p4-edi-r").css("display") == "block") {
		$(".p4-form-r").hide();//隐藏电脑表单
		$(".p4-edi-r").fadeOut();
		var refreshObj = $(".p4-refresh-r");
			startRotate(refreshObj);
			setTimeout(function () {
				stopRotate(refreshObj);
				$(".p4-file-r").fadeIn(fadeInTime);
		},rotateTime);
		/*显示提示信息*/
		showMsg(".p4-msg-girl", msg5, 3);
	} else{
		showAlert('选择错误，请重新选择！','end');
	}
	
});

/*通信按钮*/
$(".p4-corresp-btn").click(function () {
	closeMsg();//关闭提示框
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
		/*显示提示信息*/
		showMsg(".p4-msg-girl", msg4, 7);
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

/*显示提示信息*/
function showMsg(msgObj, msgContent, time) {
	setTimeout(function () {
			$(msgObj+"-text").text(msgContent);
			$(msgObj).fadeIn(fadeInTime-500);
		},rotateTime*time);
}

/*关闭提示信息*/
function closeMsg() {
	$(".p4-msg-boy").fadeOut();
	$(".p4-msg-girl").fadeOut();
}
/*关闭左侧提示框按钮*/
$(".p4-msg-boy-close").click(function () {
	$(".p4-msg-boy").fadeOut();
	
});
/*关闭右侧提示框按钮*/
$(".p4-msg-girl-close").click(function () {
	$(".p4-msg-girl").fadeOut();
});