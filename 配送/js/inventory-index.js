/*
* @Author: pz
* @Date:   2018-03-12 17:09:27
* @intro:  存货分配游戏
* @Last Modified by:   pz
* @Last Modified time: 2018-03-15 20:09:39
*/

$(function () {
	
	$("#ticker").ticker({
 		rate:        10,//打印信息的速度,1/25秒是40
 		delay:       4000,//阅读信息停顿的时间，2000指的是4秒
 		cursorList:  "_",//显示字的后边跟的符号
			// cursor://鼠标移上去显示的样式
	}).trigger("play").trigger("stop");

    $('#ticker').on('click','.mission-intro-confirm',function(){
    	$("#ticker").trigger({type: "play"}).trigger({type: "stop"});
        return false;
    });

    $('#ticker').on('click','#viewOrderBtn',function(){
    	$('.msg-box').fadeOut();
    	setTimeout(function () {
    		$('.game-select-bg').fadeIn();
    	},500);
    	
    });

});

// 查看订单--制作订单
// $('.game_select_bg').html("46546");
// $('.game_select_bg').load("../html/inventory.html");
// 库存查询
function searchStorage() {
	$('.game-select-bg').hide();
	$('#searchStorageDiv').show();
	$("#tickerStorage").ticker({
 		rate:        10,//打印信息的速度,1/25秒是40
 		delay:       4000,//阅读信息停顿的时间，2000指的是4秒
 		cursorList:  "_",//显示字的后边跟的符号
 		// cursor://鼠标移上去显示的样式
	}).trigger("play").trigger("stop");
	$('#tickerStorage').on('click','#searchStorage',function(){
    	childframe.window.showInventory();  
    });
}
// 库存查询-结果显示
function searchStorageRes() {
	$('#searchStorageDiv').hide();
	$('.game-select-bg').show();
}
// 5、信息人员：根据订单分配库存，有两种分配方式
function step5() {
	$('.game-select-bg').hide();
	$('#stepDiv5').show();
	$("#stepTalk5").ticker({
 		rate:        10,//打印信息的速度,1/25秒是40
 		delay:       4000,//阅读信息停顿的时间，2000指的是4秒
 		cursorList:  "_",//显示字的后边跟的符号
 		// cursor://鼠标移上去显示的样式
	}).trigger("play").trigger("stop");
	// 单一订单分配
	$('#stepTalk5').on('click','#singleOrderDist',function(){
    	childframe.window.singleDistribute();  
    });
    // 批量订单分配
    $('#stepTalk5').on('click','#batchOrderDist',function(){
    	childframe.window.batchDistribute();  
    });
}
function step5Res() {
	$('#stepDiv5').hide();
	$('.game-select-bg').show();
}

function inventoryGameOver() {
	showAlert('游戏完成，返回主界面!','end',function(){
					// 返回主界面
					set_address("orderMake","1");
					window.location.href = "index.html";//orderMake=1 释放拣货单制作按钮
				},"false");
}
