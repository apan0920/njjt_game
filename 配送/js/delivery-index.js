/*
* @Author: pz
* @Date:   2018-03-12 17:09:27
* @intro:  存货分配游戏
* @Last Modified by:   pz
* @Last Modified time: 2018-03-14 10:47:35
*/

$(function () {
	
	$("#ticker").ticker({
 		rate:        10,//打印信息的速度,1/25秒是40
 		delay:       4000,//阅读信息停顿的时间，2000指的是4秒
 		cursorList:  "_",//显示字的后边跟的符号
			// cursor://鼠标移上去显示的样式
	}).trigger("play").trigger("stop");

    $('#ticker').on('click','.mission-intro-confirm',function(){
    	$('.msg-box').fadeOut();
    	setTimeout(function () {
    		$('.game-select-bg-delivery').fadeIn();
    	},500);
    	
    });

});

function deliveryGameOver() {
    // showAlert('游戏完成，返回主界面!','end',function(){
                    // 返回主界面
                    window.location.href = "index.html";//orderMake=1 释放拣货单制作按钮
                // },"false");
}