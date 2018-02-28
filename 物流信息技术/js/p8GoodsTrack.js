/*
* @Author: pz
* @Date:   2018-02-27 16:34:24
* @Last Modified by:   pz
* @Last Modified time: 2018-02-28 18:03:51
*/
/*任务说明--关闭/确认按钮*/
$(".p8-mission-intro-confirm, .p8-mission-intro-close").click(function () {
	$(".p8-mission-intro").removeClass("bounceInLeft").addClass("bounceOutRight");
	setTimeout(function () {
		$(".p8-msg-box").fadeOut();
	},200);
});

//滚动条
$(".order, .match-vehicle").mCustomScrollbar();

/*为订单匹配车辆*/
/*1.鼠标滑过车辆效果*/
$(".vehicle-bg").hover(function () {
	$(this).addClass("vehicle-bg-hover");
},function () {
	$(this).removeClass("vehicle-bg-hover");
});