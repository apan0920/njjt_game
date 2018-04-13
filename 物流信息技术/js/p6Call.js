/*
* @Author: pz
* @Date:   2018-02-02 09:34:20
* @Last Modified by:   pz
* @Last Modified time: 2018-04-13 14:50:35
*/
$(function () {
	fadeInTime = 1500;
	selType = "售后类型";
	/*Left-1.浏览商品 */
	// 随机显示商品：衣服、电子产品、生鲜
	var goosArr = {
		clothes:{
			no:'clothes',
			name:'连衣裙',
			num:'月售2745件',
			price:'￥1359',
			color:'颜色分类：米色，尺码：M',
			sendTime:'发货时间：72小时内',
			question:'您好，请问这件衣服的质量好不好？',
			answer:'亲，你放心，我们店里的衣服质量那是相当的好，杠杠的。'
		},
		seafood:{
			no:'seafood',
			name:'大闸蟹',
			num:'月售3650盒',
			price:'￥218',
			color:'公3.5两母2.5两4对8只',
			sendTime:'发货时间：72小时内',
			question:'您好，请问这大闸蟹是新鲜吗？',
			answer:'亲，你放心，我们只卖鲜活大闸蟹，死蟹理赔、残蟹理赔、空壳理赔。'
		},
		pc:{
			no:'pc',
			name:'电脑',
			num:'月售5000台',
			price:'￥6399',
			color:'i5荣誉勋章版 GTX1050Ti',
			sendTime:'发货时间：72小时内',
			question:'您好，请问这电脑散热好吗？',
			answer:'亲，你放心，我们这电脑散热超级好，而且屏幕超级清晰。'
		}
	};
	var goosNameArr = [goosArr.clothes, goosArr.seafood, goosArr.pc];
	var currentGoods = goosNameArr[Math.floor(Math.random() * goosNameArr.length)];
	currentGoodsName = currentGoods.name;//全局变量商品名称
	$(".clothes, .seafood, .pc").hide();
	$("."+currentGoods.no).show();
	$(".goods-name").text(currentGoods.name);
	$(".goods-sale-num").text(currentGoods.num);
	$(".goods-price").text(currentGoods.price);
	$(".goods-color").text(currentGoods.color);
	$(".goods-send-time").text(currentGoods.sendTime);
	$(".p6-talk-text-Q").text(currentGoods.question);
	$(".p6-talk-text-A").text(currentGoods.answer);

	/*流程调试--处理订单界面*/
	/*$(".p6-talk-bg-r").hide();//隐藏聊天窗口*/
	/*$(".p6-embrace-part").show();//选择配送方式*/
	/*$(".p6-track").show();
	$(".p6-track ul li").show();
	$(".last").show(); */

	/*$(".p6-sel-style").show();//选择配送方式*/
	
});
/*任务说明--关闭/确认按钮*/
$(".p6-mission-intro-confirm, .p6-mission-intro-close").click(function () {
	$(".p6-mission-intro").removeClass("bounceInLeft").addClass("bounceOutRight");
	setTimeout(function () {
		$(".p6-msg-box").fadeOut();
	},200);
	/*头像不停闪动效果*/
	twinkle = setInterval(function(){
		$(".p6-browse-icon").fadeOut(300).fadeIn(300); 
	},200);
});
/*Left-1.浏览商品 */
/*蓝色水滴--客服聊天*/
$(".p6-browse-icon").click(function () {
	clearInterval(twinkle);//停止闪烁
	$(".p6-talk-bg-l").show();
	
	$(".p6-talk").show();
	$(".p6-talk-1").show();
	setTimeout(function () {
		$(".p6-talk-3").show();
	},1000);
	setTimeout(function () {
		$(".p6-talk-4").show();
	},2000);
	setTimeout(function () {
		$(".p6-talk-2").show();
	},3000);
	setTimeout(function () {
		$(".p6-talk-bg-l").hide();
	},4000);

});
/*购买按钮*/
$(".p6-browse-pur").click(function () {
	$(".p6-browse").hide();
	$(".p6-con-order").show();

});

/*确认订单*/
$(".btn-pur").click(function () {
	$(".p6-con-order").hide();
	$(".p6-track").show();
	track();
	// 客服接单
	$(".p6-receive-order").show();
});

/*追踪效果调试*/
function track() {
	$(".last").show(); 
	/*changeTrackState("last", "state-send", 1 );
	changeTrackState("state-send", "state-package", 2 );
	changeTrackState("state-package", "state-arrival", 3 );
	changeTrackState("state-arrival", "state-dis", 4 );
	changeTrackState("state-dis", "first", 5 );*/
}

/*修改追踪状态*/
function changeTrackState(objPre, objCurrent, timeNum) {
	setTimeout(function () {
		$("."+objPre).removeClass("text-orange").addClass("text-grey"); 
		$("."+objPre+" > i").addClass("node-icon");
		$("."+objCurrent).show();
	},1000*timeNum);
}
/*确认收货  or 申请售后*/
function conReceive() {
	$(".p6-track").show();
	$(".p6-con-receive").show();
}
/*确认收货-->右侧订单完成*/
$(".btn-con-receive").click(function () {
	/*客户--交易成功*/
	$(".after-sale-state").hide();
	$(".p6-receive-apply").fadeIn(fadeInTime);
	/*客服--交易完成*/
	$(".btn-deal").hide();
	$(".p6-sign").fadeOut();
	finish();
});

//申请售后
$(".btn-apply-cuntomer-receive").click(function () {
	$(".after-sale-state").hide();
	$(".btns").show();
	$(".p6-receive-apply").show();
});
/*仅退货/退货退款/换货*/
$(".btn-only-return, .btn-all-return, .btn-exchange-goods").click(function () {
	$(".btns").hide();
	$(".after-sale-state").show();
	selType = $(this).text();
	cusService();//客服收到售后请求
});

/*右侧功能----------------------------------右侧功能---------------------------右侧功能-----------------*/
/*Right-2.接到订单 */
$(".btn-view").click(function () {
	$(".p6-talk-bg-r").hide();//隐藏聊天窗口
	//查看新订单
	$(".p6-receive-order").hide();
	if ($("#bulb").css("display") == "block") {
		$(".p6-deal-order").show();
	}else if ($("#cusService").css("display") == "block") {//接到售后请求
		$(".type-name").text(selType);//设定售后请求类型
		$(".p6-after-sale").show();
	}
});
/*Right-3.查看及处理订单*/
$(".btn-deal").click(function () {
	$(".p6-deal-order").hide();
	$(".p6-sel-style").show();//选择配送方式
});

/*Right-4.选择配送方式*/
$(".dis-bg").click(function () {
	if (currentGoodsName.trim() == "大闸蟹") {//生鲜类：只能选择顺丰次日达
		if(!$(this).hasClass("dis-bg1")){
			showAlert('【商品名称：' + currentGoodsName + '】选择错误，请重新选择！','end');
			$(".msg_content").css({"left":"6%"});
			return;
		}
	} else if (currentGoodsName.trim() == "电脑") {//电子产品：不能选择次日达
		if($(this).hasClass("dis-bg1")){
			showAlert('【商品名称：' + currentGoodsName + '】选择错误，请重新选择！','end');
			$(".msg_content").css({"left":"6%"});
			return;
		}
	}
	
	/*else if (currentGoodsName.trim() == "连衣裙") {//衣服类：都可以选

	}*/
	package();
});

/*Right-5.打包*/
function package() {
	$(".p6-sel-style").hide();//隐藏选择配送方式
	$(".p6-package").show();
	setTimeout(function () {
		$(".box-open").fadeOut();
		$(".box-close").fadeIn(fadeInTime);
		changeTrackState("last", "state-package", 1 );//已打包
	},1000);
	setTimeout(function () {
		embrace();
	},2000);
}

/*Right-6.揽件*/
function embrace() {
	$(".p6-package").hide();//隐藏打包
	$(".p6-embrace-part").show();
	setTimeout(function () {
		$(".p6-men").animate({
			"left":"28%",
			"top":"45%",
			"width":"0",
			"height":"0"
		},200);
	},1000);
	
	setTimeout(function () {
		dirve("-46%",2000);
		changeTrackState("state-package", "state-out", 1 );//已出库
	},3000);

	setTimeout(function () {
		disCenter();
	},6000);
	
}
/*小车行驶动画*/
function dirve(moveDist,moveSpeed) {
	var rotation = function (){
	   $(".p6-car-tyre-left , .p6-car-tyre-right").rotate({
	      angle:0, 
	      animateTo:-360, 
	      callback: rotation,
	      easing: function (x,t,b,c,d){        // t: current time, b: begInnIng value, c: change In value, d: duration
	          return c*(t/d)+b;
	      }
	   });
	}

	$(".p6-car").animate({left:moveDist}, moveSpeed, function () {
		$(".p6-car-tyre-left , .p6-car-tyre-right").stopRotate();
	});

	rotation();//调用车轮旋转
}
/*Right-7.配送中心*/
function disCenter() {
	$(".p6-embrace-part").hide();
	$(".p6-dis-center").show();
	disCenterControl("left1", "bounceOutLeft", 2);
	disCenterControl("left2", "bounceOutLeft", 3);
	disCenterControl("left3", "bounceOutLeft", 4);
	disCenterControl("right1", "bounceOutRight", 5);
	disCenterControl("right2", "bounceOutRight", 6);
	disCenterControl("right3", "bounceOutRight", 7);
	setTimeout(function () {
		disLand();
	},8000);
	changeTrackState("state-out", "state-arrival", 1 );//到达集散中心
}
/*控制配送动画*/
function disCenterControl(obj, animateName, time) {
	setTimeout(function () {
		$("."+obj).addClass("animated").addClass(animateName);
	},1000*time);
}

/*Right-8.抵达配送地*/
function disLand() {
	$(".p6-dis-center").hide();
	$(".p6-dis-land").show();
	/*for (var i = 1; i < 5; i++) {
		$(".box-"+i).fadeIn(1500*i);
	}*/
	setTimeout(function () {
		$(".box-"+1).fadeIn(fadeInTime);
	},1000*1);
	setTimeout(function () {
		$(".box-"+2).fadeIn(fadeInTime);
	},1000*2);
	setTimeout(function () {
		$(".box-"+3).fadeIn(fadeInTime);
	},1000*3);
	setTimeout(function () {
		$(".box-"+4).fadeIn(fadeInTime);
	},1000*4);
	setTimeout(function () {
		disStart();
	},1000*5);
	changeTrackState("state-arrival", "state-dis-land", 1 );//到达配送地
}

/*Right-9.派送员派送*/
function disStart() {
	$(".p6-dis-land").hide();
	$(".p6-dis-start").show();
	$(".l-1, .l-2, .l-3, .m-1, .m-2, .r-1, .r-2, .r-3, .r-4, .tree ").animate({"left":"-80%"},3000);
	$(".l-11, .l-21, .l-31, .m-11, .m-21, .r-11, .r-21, .r-31, .r-41 ").animate({"left":"20%"},3000);
	setTimeout(function () {
		sign();
	},4000);
	changeTrackState("state-dis-land", "state-dis-start", 1 );//已开始配送
}
/*Right-10.快递签收*/
function sign() {
	$(".p6-dis-start").fadeOut();
	$(".p6-sign").fadeIn(fadeInTime);
	setTimeout(function () {
		changeTrackState("state-dis-start", "first", 1 );//已签收
		setTimeout(function () {
			conReceive();//客户确认收货
		},2000);
	},2500);
}
/*Right-11.售后请求*/
function cusService() {
	$(".p6-sign").fadeOut();
	$("#bulb").hide();
	$("#cusService").show();
	$(".p6-receive-order .text").text("接到售后请求！");
	$(".p6-receive-order").fadeIn(fadeInTime);
}
/*Right-12.售后信息--同意请求*/
$(".btn-agree").click(function () {
	$(".p6-after-sale").fadeOut();
	$(".btn-deal").hide();
	/*左侧订单-售后处理完成*/
	$(".p6-receive-apply").show();
	$(".state").text("订单完成");
	finish();
});

/*交易完成*/
function finish() {
	$(".btn-order-finish").show();
	$(".p6-deal-order").fadeIn(fadeInTime);
	setTimeout(function (argument) {
		showAlert('游戏完成，返回主界面!','end',function(){
			window.location.href = "index.html";
		}, "false");
	},2500);
}