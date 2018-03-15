/*
* @Author: pz
* @Date:   2018-02-27 16:34:24
* @Last Modified by:   pz
* @Last Modified time: 2018-03-12 11:40:22
*/

(function () {
	addOrderNo = 5;//动态添加的订单的起始编号
	countdownFlag = 0;//是否开始计时
	initMoney = 1000;//定义初始资金
	targetAmount = 2000;//定义游戏目标金额(从界面获取)
	
	tempPurchaseNum = [0, 0, 0, 0];//定义临时对象购买设备数量集合["carColdNum", "carNum", "gpsNum", "humitureNum"]
	goodsPriceArr = [2000, 1000, 500, 800];//定义设备价格集合["carColdNum", "carNum", "gpsNum", "humitureNum"]
	getPriceArr();//获取设备价格集合

	show_num(initMoney);//初始资金总数
	totalGoodNum = 0;//车辆总数
	carportData = new Array();//车库内车辆及车辆装载设备数据

	waittingArr = [];//需要弹出事故框框的排队订单
	storyListen();

})();
/*//禁用各种刷新 
$(document).ready(function() {
    //禁用右键 
    $(document).bind("contextmenu",function(e) {               
        return false; 
    });         
    $(document).bind("keydown", function(e) {
        e = window.event || e;
        if (e.keyCode == 116){ //禁用F5
            return false;                           
        }
        if(e.ctrlKey&&e.keyCode==82){// 禁用ctrl+R刷新 
            return false;
        }
    });
});
//禁用刷新结束 */ 

// 计算变化后资金
function countMoney(operator, num) {
	if (operator == "+") {
		initMoney = initMoney + num;
	} else {
		initMoney = initMoney - num;
	}

	show_num(initMoney);
	if (initMoney > targetAmount || initMoney ==targetAmount ) {
		gameOver("完成目标金额");
	}
	if (initMoney < 0) {
		gameOver("资金为负数");
	}
}
// 显示/更新总资金	
function show_num(n){
	$(".t_num i").empty();
	var it = $(".t_num i");
	var len = String(n).length;

	if(len < it.length){//数值位数减少：移除多余的位数
		var distNum = it.length - len;//移除元素个数
		for (var i = 0; i < distNum; i++) {
			$(".t_num i:first").remove();
		}
	}

	for(var i=0;i<len;i++){
		if(it.length<=i){
			$(".t_num").append("<i></i>");
		}
		var num=String(n).charAt(i);
		var y = -parseInt(num)*30; //y轴位置
		var obj = $(".t_num i").eq(i);
		obj.animate({ //滚动动画
			/*backgroundPosition :'(0 '+String(y)+'px)' */
			backgroundPosition :'(-5px '+String(y)+'px)' 
			}, 'slow','swing',function(){}
		);
	}
}
/*任务相关*/
// 关闭-任务提示
$(".p8-mission-intro-confirm, .p8-mission-intro-close").click(function () {
	if (countdownFlag == 0) {//保证只计时一次
		// 1.获取输入的目标金额
		targetAmount = $("#targetAmount").val();
		if(!isInteger(targetAmount)){
			showAlert("目标金额请输入整数","end");
			return;
		}
		if (targetAmount<5000 || targetAmount>100000) {
			showAlert("目标金额范围5000~100000","end");
			return;
		} 
		// 2.获取输入的游戏时长
		gameTime = $("#gameTime").val();
		if(!isInteger(gameTime)){
			showAlert("游戏时长请输入整数","end");
			return;
		}
		if (gameTime<3 || gameTime>30) {
			showAlert("游戏时长范围3~30","end");
			return;
		}
		countdown(gameTime);//调用倒计时
		countdownFlag = 1;
	}

	$(".p8-mission-intro").removeClass("bounceInLeft").addClass("bounceOutRight");
	setTimeout(function () {
		$(".p8-msg-box").fadeOut();
	},200);
	
});
// 打开-任务提示
$(".mission-btn").click(function () {
	//打开任务时-只读
	$("#targetAmount").val(targetAmount);
	$("#targetAmount").attr("readonly","readonly");
	$("#gameTime").val(gameTime);
	$("#gameTime").attr("readonly","readonly");
	
	$(".p8-mission-intro").removeClass("bounceOutRight");
	setTimeout(function () {
		$(".p8-msg-box").show();
		$(".p8-mission-intro").addClass("bounceInLeft");
	},300);
});

//滚动条
$(".order-content, .shop-mall-detail, .shop-carport-bottom-left").mCustomScrollbar();


/*商城按钮--右下角*/
myFadeToggle("#shopMall", ".shop-mall");
/*商城弹窗---start*/
//1.关闭按钮
myFadeToggle("#shopMallCloseBtn", ".shop-mall");

//获取设备价格集合
function getPriceArr() {
	for (var i = 0; i < tempPurchaseNum.length; i++) {
		var price =  $('[goodsType="'+ i +'"]').parent().find(".price-value").html();
		goodsPriceArr[i] = price;
	}
}
// 加/减运算
$(".operator").click(function () {
	var currentNum = $(this).parent().parent().find(".bg-number").html();
	var goodsType = $(this).parent().attr("goodsType");
	var countType = $(this).attr("countType");
	if (countType == "plus") {//暂不限制购买数量上限
		currentNum++;
	} else {
		if (currentNum > 0) {
			currentNum--;
		}else{
			return;
		}
	}
	$(this).parent().parent().find(".bg-number").html(currentNum);//更当前设备购买数量

	tempPurchaseNum[goodsType] = currentNum;//更新对应设备购买数量--用于计算购买设备总资金
	var totalPrice = 0;
	for (var i = 0; i < tempPurchaseNum.length; i++) {
		totalPrice += tempPurchaseNum[i] * goodsPriceArr[i];
	}
	$(".total-price").html(totalPrice);//更新购买设备总资金
});

/*购买按钮*/
$(".pur-btn").click(function () {
	var totalPrice = $(".total-price").html()*1;//购买设备所需总资金
	if (totalPrice == 0) {
		showAlert("请先输入购买数量","end");
	} else {
		if (totalPrice > initMoney) {
			showAlert("您的资金余额不足，请修改购买数量","end");
		} else {
			updateCarportData(tempPurchaseNum);
			clearPurchaseNum();
			countMoney("-",totalPrice);//计算资金变化
		}
	}
});

/*更改车辆数据*/
function updateCarportData(tempPurchaseNum) {
	// var msg = "您已成功购买：冷藏车n辆，普通运输车n辆，GPS设备n台，温湿度n台";//购买设备提示
	var cold = "";//冷藏车
	var coldNo = "";//冷藏车【数量】
	var normal = "";//普通运输车
	var normalNo = "";//普通运输车【数量】
	var gps = "";//GPS
	var gpsNo = "";//GPS设备【数量】
	var humiture = "";//温湿度
	var humitureNo = "";//温湿度【数量】

	for (var i = 0; i < tempPurchaseNum.length; i++) {
		var type = "cold";//normal
		if (i < 2) {
			for (var j = 0; j < tempPurchaseNum[i]; j++) {//循环添加车辆
				// 随机数（0-1）
				var currentCar = new Object();//当前车辆
				if (i == 0) {//车辆类型判断
					currentCar.name = "冷藏车";
					currentCar.type = "cold";
					currentCar.carImg = "car-cold.png";
					currentCar.gps = 0;
					currentCar.humiture = 0;
					currentCar.state = "空闲中";
					currentCar.orderNo = "绑定被使用的订单编号";

					cold = "冷藏车";
					coldNo = tempPurchaseNum[i]+"辆；";
				} else {
					currentCar.name = "普通运输车";
					currentCar.type = "normal";
					currentCar.carImg = "car.png";
					currentCar.gps = 0;
					currentCar.state = "空闲中";
					currentCar.orderNo = "绑定被使用的订单编号";

					normal = "普通运输车";
					normalNo = tempPurchaseNum[i]+"辆；";
				}
				carportData.push(currentCar);
				totalGoodNum++;
			}
		}else if (i == 2) {
			carportData.gps = carportData.gps || 0;
			carportData.gps += tempPurchaseNum[2];
			if (tempPurchaseNum[2] > 0) {//提示信息
				gps = "GPS设备";
	 			gpsNo = tempPurchaseNum[2]+"台；";
			}
			
		} else if (i == 3) {
			carportData.humiture = carportData.humiture || 0;
			carportData.humiture += tempPurchaseNum[3];
			if (tempPurchaseNum[3] > 0) {//提示信息
				humiture = "温湿度";
	 			humitureNo = tempPurchaseNum[3]+"台；";
	 		}
		}
	}
	msg = cold + coldNo + normal + normalNo + gps + gpsNo + humiture + humitureNo;
	showAlert("您已成功购买：" + msg, "end");
	console.log(carportData);
}

//清空商城弹窗设备购买数量
function clearPurchaseNum() {
	tempPurchaseNum = [0, 0, 0, 0];
	$(".bg-number").html(0);
	$(".total-price").html(0);
}


/*商城弹窗---end*/


/*车库按钮--右下角*/
myFadeToggle("#carport", ".shop-carport");

/*车库弹窗---Start*/
// 弹窗-关闭按钮
myFadeToggle("#shopCarportCloseBtn", ".shop-carport");

// 初始化车库弹窗内容
function initCarportWin() {
	$(".shop-carport-bottom-left-content").empty();//清空车库弹窗
	//修改gps数量
	$("#gpsNum").html(carportData.gps);
	//修改温湿度数量
	$("#humitureNum").html(carportData.humiture);
	for (var i = 0; i < carportData.length; i++) {
			var deceiveHtml = "";
			var gpsPlusShow = "block";//加号（添加GPS）
			var gpsShow = "block";//已添加GPS
			var humiturePlusShow = "block";//加号（添加温湿度）
			var humitureShow = "block"//已添加温湿度
			
			var currentCar = carportData[i];
			if (currentCar.gps == 0) {
					gpsPlusShow = "inline-block";
					gpsShow = "none";
				} else {
					gpsPlusShow = "none";
					gpsShow = "inline-block";
				}
			if (currentCar.type == "cold") {
				if (currentCar.humiture == 0) {
					humiturePlusShow = "inline-block";
					humitureShow = "none";
				} else {
					humiturePlusShow = "none";
					humitureShow = "inline-block";
				}
				deceiveHtml =   '<div class="bg-symbol shop-carport-deceive-bg" deceiveType="gps" onclick="addCar(this);">'+
									'<img src="../images/img8/icon-plus.png" alt="加号" deceiveType="plus" style="display:'+ gpsPlusShow +'"> '+
									'<img src="../images/img8/deceive-gps.png" alt="gps" class="deceive" deceiveType="gps" style="display:'+ gpsShow +'">'+
								'</div>'+
								'<div class="bg-symbol shop-carport-deceive-bg" deceiveType="humiture" onclick="addCar(this);">'+
									'<img src="../images/img8/icon-plus.png" alt="加号" deceiveType="plus" style="display:'+ humiturePlusShow +'"> '+
									'<img src="../images/img8/deceive-humiture.png" alt="温湿度" class="deceive" deceiveType="humiture" style="display:'+ humitureShow +'">'+
								'</div>';
			} else if (currentCar.type == "normal"){
				deceiveHtml = '<div class="bg-symbol shop-carport-deceive-bg" deceiveType="gps" onclick="addCar(this);">'+
							  		'<img src="../images/img8/icon-plus.png" alt="加号" deceiveType="plus" style="display:'+ gpsPlusShow +'"> '+
									'<img src="../images/img8/deceive-gps.png" alt="gps" class="deceive" deceiveType="gps" style="display:'+ gpsShow +'">'+
							  '</div>';
			}

			var addHtml = '<div class="vehicle-bg" carportDataNum = '+ i +'>'+
						'<img src="../images/img8/'+ currentCar.carImg +'"  class="common-center sel-car" alt="'+ currentCar.name +'">'+
						'<div class="shop-carport-bg">'+
						 deceiveHtml +
						'</div>'+
					'</div>';

			$(".shop-carport-bottom-left-content").append(addHtml);
	}
}
// 给车辆配载设备
function addCar(obj) {
	var deceiveType = $(obj).attr('deceiveType');//获取要购买的设备的类型
	
	var plusFlag = $(obj).find('[deceiveType="plus"]').css("display");
	if (plusFlag != "inline-block") {
		console.log("已经选择了设备");
		return;
	} else {
		var currentDeceiveNum = $("#"+deceiveType+"Num").html()*1;//获取右侧设备数量
		
		if (currentDeceiveNum < 1) {
			var deceiveName = "温湿度";
			if (deceiveType == "gps") {
				deceiveName = "GPS";
			} else {
				deceiveName = "温湿度";
			}
			showAlert("【"+deceiveName + "】数量不足，请购买。","end");
			return; 
		} 
		//（一）界面样式需改
		$("#"+deceiveType+"Num").html(currentDeceiveNum-1);//1.更改右侧设备数量
		$(obj).find('[deceiveType="plus"]').css("display","none");//2.隐藏加号
		$(obj).find('[deceiveType="'+ deceiveType +'"]').css("display","inline-block");//3.显示设备图片
		
		//（二）车库内车辆及车辆装载设备数据更新--carportData
		var carportDataNum = $(obj).parent().parent().attr("carportDataNum");

		if (deceiveType == "gps") {
			carportData[carportDataNum].gps = 1;
			
			carportData.gps = carportData.gps-1;//修改gps数量
		} else {
			carportData[carportDataNum].humiture = 1;
			
			carportData.humiture = carportData.humiture-1;//修改温湿度数量
		}
		
	}
	console.log(carportData);
};

/*车库弹窗---end*/




/*为订单添加车辆---start*/
// 添加车辆按钮

// 初始化可用车辆界面
function add_car(obj) {
	$(".shop-carport ,.shop-mall").fadeOut();// 关闭其他窗口(商城和车库弹窗)
	var selectCarFlag = $(obj).attr("addcar");
	if (selectCarFlag=="true") {
		showAlert("选择失败，不可重复选择车辆","end");
		return ;
	}
	$("#matchVehicle").fadeIn();
	initUsableCar($(obj));
}

$("#matchVehicleCloseBtn").click(function () {
	$("#matchVehicle").fadeOut();
});
function initUsableCar(obj) {
	$(".match-vehicle-content").mCustomScrollbar();//添加滚动条
	// $(".match-vehicle-content").empty();//清空车库弹窗
	$(".car-list").empty();//清空车库弹窗
	
	var addHtml = '';
	if (carportData.length == 0) {
			addHtml = '<div style="width:100%; text-align:center;">暂无车辆，请购买</div>';
			/*$(".match-vehicle-content").append(addHtml);*/
			$(".car-list").append(addHtml);
			return ;
		} 
	for (var i = 0; i < carportData.length; i++) {
		var deceiveHtml = "";
		var currentCar = carportData[i];
		if (currentCar.gps == 1) {
				deceiveHtml = '<img src="../images/img8/deceive-gps-icon.png" alt="gps">';
			}
		if (currentCar.type == "cold") {
			if (currentCar.humiture == 1) {
				deceiveHtml += '<img src="../images/img8/deceive-humiture-icon.png" alt="温湿度传感器">';
			}
		} 
		addHtml = '<div class="vehicle-bg" carportDataNum = '+ i +'  carType = '+ currentCar.type +' gps = '+ currentCar.gps +' humiture = '+ currentCar.humiture +'  carportDataState = '+ currentCar.state +'  onclick="chooseCar(this);" onmouseover="addHover(this);" onmouseout="removeClass(this);" >'+
					'<span id="stateShow" style="color:red;">'+ currentCar.state +'</span>'+
					'<img src="../images/img8/'+ currentCar.carImg +'"  class="common-center sel-car" alt="'+ currentCar.name +'">'+
					'<div class="deceive-bg">'+
					 deceiveHtml +
					'</div>'+
				  '</div>';
		
		/*$(".match-vehicle-content").append(addHtml);*/
		$(".car-list").append(addHtml);

	}
	
	// 修改弹窗所属订单
	var orderNo = $(obj).parent().parent().parent().parent().attr("orderNo");
	var cargoType = $(obj).parent().parent().parent().parent().attr("cargoType");
	$("#matchVehicle").attr("belongOrder", orderNo);//所属订单编号
	$("#matchVehicle").attr("cargoType", cargoType);//所属订单的货物类型
}
/*绑定hover事件*/
function addHover(obj) {
	$(obj).addClass("vehicle-bg-hover");
}
function removeClass(obj) {
	$(obj).removeClass("vehicle-bg-hover");
}

/*选择车辆*/
function chooseCar(obj) {
	var carportdatanum = $(obj).attr("carportdatanum")*1;//车辆数据编号

	var carState = $(obj).attr("carportdatastate");//车辆当前状态
	var cargoType = $("#matchVehicle").attr("cargoType");//货物订单货物类型

	// 控制（生鲜：冷藏车，普通货物：冷藏车or普通运输车）
	if (cargoType == "cold" && (carportData[carportdatanum].type != "cold") ) {
		showAlert("选择失败，请选择正确车辆","end");
		return ;
	}

	var stateUsing = "使用中";
	if (carState == stateUsing) {
		showAlert("选择失败，请选择空闲车辆","end");
	} else {
		var belongorder = $(obj).parent().parent().parent().parent().parent().attr("belongorder");//获取所属订单编号（包含滚动条插件增加的层级**）
		var orderObj = $("[orderNo="+ belongorder +"]");//获取所属订单对象
		
		orderObj.find('[cartype="plus"]').remove();//1.移除加号
		
		var cartype = $(obj).attr("cartype");//2.显示车辆图片
		var addImg = '';
		if (cartype == 'cold') {
			addImg = "legend-car-cold.png";
		} else {
			addImg = "legend-car.png";
		}
		var addHtml = '<img src="../images/img8/'+ addImg +'" class="common-center sel-car" cartype="'+ cartype +'" alt="车">';
		orderObj.find('.add-car').empty().append(addHtml);

		orderObj.find(".add-car").attr("addcar",true);//3.更改是否选择车辆标记

		$(obj).attr("carportdatastate",stateUsing)//4.1修改车辆状态为使用中

		carportData[carportdatanum].state = stateUsing;//4.2修改车库数据：状态
		carportData[carportdatanum].orderNo = orderObj.attr("orderNo");//4.2修改车库数据：订单编号
		$(obj).find('#stateShow').empty().html(stateUsing);//4.3修改车辆状态文字显示
		/*4.4修改订单下方车辆图标--待优化*/

		/*5.修改订单所选车辆的设备*/
		orderObj.attr("cartype", carportData[carportdatanum].type);//车辆类型
		var carHtml = '';
		if (carportData[carportdatanum].type == 'cold') {
			carHtml = '<img src="../images/img8/legend-car-cold.png" class="move-car" alt="冷藏车-图标" >';
		} else {
			carHtml = '<img src="../images/img8/legend-car.png" class="move-car" alt="普通运输车-图标" >';
		}
		orderObj.find(".order-detail-bottom").empty().append(carHtml);//更改订单下部车辆图标
		orderObj.attr("useGps", carportData[carportdatanum].gps);//GPS
		orderObj.attr("useHumiture", carportData[carportdatanum].humiture);//温湿度
		/*关闭弹窗--避免更换车辆*/
		$("#matchVehicle").fadeOut();
	}
	
}
/*为订单添加车辆---end*/



/*1.鼠标滑过车辆效果*/
$(".vehicle-bg").hover(function () {
	$(this).addClass("vehicle-bg-hover");
},function () {
	$(this).removeClass("vehicle-bg-hover");
});

/*公共函数*/
/*1.淡入和淡出的切换*/
function myFadeToggle(clickObj, openObj) {
	$(clickObj).click(function (e) {
		if (clickObj == "#carport") {
			$(".shop-mall, .match-vehicle").fadeOut();// 关闭其他窗口
		} else if (clickObj == "#shopMall") {
			$(".shop-carport , .match-vehicle").fadeOut();// 关闭其他窗口
		}
		var orderObj = e;
		$(openObj).fadeToggle(function () {
			flag = $(this).css("display");
			if (flag == "none") {
				if (clickObj == "#shopMallCloseBtn" || clickObj == "#shopMall") {//关闭商城弹窗时--清空购买数据
					clearPurchaseNum();
				}
			}else{
				if (clickObj == "#carport") {//车库按钮--打开车库弹窗时，根据已拥有的设备刷新界面
					initCarportWin();
				}
			}
		});
		
	});
}

/*倒计时--参数：分钟数值*/
function countdown(Fen) {
	var miao=60;
	timer=setInterval(
		function(){
			if(Fen==0&&miao==1){//分钟数=0的时候
				clearInterval(timer);
				gameOver("游戏计时结束");
			}
			if(Fen>=0&&Fen<=10){//分钟数0~10
				miao--;
				if(miao==0){//秒数等于0的时候
					miao=60;
					$(".time-min").html("0"+Fen);
					$(".time-sec").html("00");
				}
				if(miao>0&&miao<10){//秒数0~10的时候
					miao="0"+miao;
					$(".time-min").html("0"+Fen);
					$(".time-sec").html(miao);
				}
				if(miao>=10&&miao!=60){//秒数大于等于10的时候
					if(miao==59){
						Fen--
					}
					$(".time-min").html("0"+Fen);
					$(".time-sec").html(miao);
				}
			}
			if(Fen>10){//分钟数大于10的时候
					miao--;
					if(miao==0){//秒数等于0的时候
						miao=60;
						$(".time-min").html(Fen);
						$(".time-sec").html("00");
					}
					if(miao>0&&miao<10){//秒数0~10的时候
						miao="0"+miao;
						$(".time-min").html(Fen);
						$(".time-sec").html(miao);
					}
					if(miao>=10&&miao!=60){//秒数大于等于10的时候
						if(miao==59){
							Fen--
						}
						$(".time-min").html(Fen);
						$(".time-sec").html(miao);
					}
				}
			
		},
		1000
		)
}

/*接单--按钮*/
function receive_order(obj) {
	// disAnimate($(this));//动画调试
	
	$('#matchVehicle').fadeOut();// 关闭选择车辆弹框
	
	if ($(obj).parent().find(".add-car").attr("addCar") == "false") {
		showAlert("接单失败，请先选择车辆","end");
	}else{
		$(obj).html("运输中");
		$(obj).addClass("btn-bg-remove");
		showAlert("接单成功，开始运输","end",function () {
			disAnimate($(obj));
		});
	}
}

// 运输动画
function disAnimate(obj) {
	/*1.订单下方车辆动画*/
	var orderObj = obj.parent().parent().parent();
	obj.parent().parent().find(".move-car").animate({left:"73%"},5000);
	/*2.地图上动画*/
	/*var start = obj.parent().find(".start").html();//运输起点*/
	var end = obj.parent().find(".end").html().toLowerCase();//运输终点
	
	var className = "car-move-b" + end;
	/*判断哪种车在地图上走*/
	var orderCarNoId = "orderCarNo" + orderObj.attr("orderNo"); 
	var legendColdHtml ='<img id="'+ orderCarNoId +'" src="../images/img8/legend-car-cold.png" alt="冷藏车-图标" class="legend legend-car-cold">';
	var legendNormalHtml = '<img id="'+ orderCarNoId +'" src="../images/img8/legend-car.png" alt="车-图标" class="legend legend-car">';
	if (orderObj.attr("cartype") == 'cold') {
		$(".legend-div").append(legendColdHtml);
	} else {
		$(".legend-div").append(legendNormalHtml);
	}
	$("#"+orderCarNoId).show().addClass(className);//小车在地图上移动【动画】
    document.getElementById(orderCarNoId).addEventListener("webkitAnimationEnd", function(){ //动画结束时事件-移除添加的车辆 
    	$("#"+orderCarNoId).remove();
    });
	/*判断事件发生机率【事故20%、偷窃35%、货物损坏50%】*/
	var useGps = orderObj.attr("useGps");
	var useHumiture = orderObj.attr("useHumiture");
	var type = orderObj.attr("cartype");
	var storyNo = [0, 1, 2];
	var story = ['途中货物损坏', '途中发生事故', '途中货物遭偷窃'];
	var storyLose = [0.2, 0.35, 0.5];
	
	var storyImg = ['accident-bad.png', 'accident-crash.png', 'accident-stolen.png'];
	var resText = "货物送达";
	var cargoType = orderObj.attr("cargoType");//订单货物类型
	var ownMoney = 0;//订单总金额( 普通运输：￥600 冷藏￥800)
	var cost = 0;//车辆成本（普通运输：￥100 冷藏￥200）
	// 根据订单货物类型计算订单金额
	if (cargoType== "cold") {
		ownMoney = 800;
	} else {
		ownMoney = 600;
	}
	//计算车辆成本（普通运输车：￥100 冷藏车￥200）
	if (type== "cold") {
		cost = 200;
	} else {
		cost = 100;
	}
	// 扣除事故损失
	var loseMoney = 0;
	// 计算发生事故概率（<50发生事故）
	var chance =getRand(100, 1);//(0-100的随机整数)
	if (chance > 50) {
		if (useGps == "0") {
			chance = chance*0.8;//降低20%概率
		}
		if (type== "cold" && useHumiture == "0") {
			chance = chance*0.8;//降低20%概率
		} 
	}
	chance = 40;//调试用
	console.log("发生事故概率chance=="+chance);
	var storyHappen = false;
	if (chance < 50) {
		currentStoryNo = storyNo[Math.floor(Math.random() * storyNo.length)];
		// console.log("随机事故currentStoryNo" + currentStoryNo);
		loseMoney = storyLose[currentStoryNo]*1*ownMoney;//按比率计算损失金额
		var imgHtml = '<img src="../images/img8/'+ storyImg[currentStoryNo] +'" alt="'+ story[currentStoryNo] +'">';
		$("#storyImgDiv").empty().append(imgHtml);
		resText = resText + '，' +story[currentStoryNo];
		$(".story-text").html(resText);
		$(".lose-money").html("-"+loseMoney);
		// setTimeout(function () {
			// 判断是否需要排队（多个订单同时运输的时候）
			// var showFlag = $(".p8-story-box").css("display");
			var orderNo = orderObj.attr("orderNo");
			/*if (showFlag == "none") {
				//标记出弹框属于哪个订单（Bug）
				$(".p8-story-box").attr("belongorder", orderNo).show();//p8-story-box 连续两单发生事故编号会覆盖？？
			} else {*/
				var waitOrder = new Object();
				waitOrder.orderNo = orderNo;
				waittingArr.push(waitOrder);
				console.log(waittingArr);
			/*}*/
			
		// },6000);

		storyHappen = true;
	} 
	/*修改资金数量*/
	orderObj.find(".order-finish-text").empty().html(resText);//文字提示
	var finishMoney = ownMoney-loseMoney-cost;
	if (finishMoney > 0) {
		orderObj.find(".own-money").html("+" + finishMoney);//订单赚取金额（订单总金额-事故损失-车辆成本）
	} else {
		orderObj.find(".own-money").html("-" + finishMoney);//订单赚取金额（订单总金额-事故损失-车辆成本）
	}
	orderObj.attr("finishMoney", finishMoney);//订单最终赚取金额
	
	setTimeout(function () {
		orderObj.find(".order-content-detail").hide();//关闭订单明细
		orderObj.find(".order-finish").show();//显示订单完成界面
		// 没有发生事故
		if (!storyHappen) {
			orderFinish(orderObj.attr("orderNo"), finishMoney*1);//加金钱
			setTimeout(function () {//订单消失
				orderObj.hide();
			},1000);
		}
	},6000);

}
// 指定范围随机整数
function getRand(x, y) {//x上限，y下限
    /*var x = 100;     
    var y = 1;  */   
    var rand = parseInt(Math.random() * (x - y + 1) + y); 
    return rand;
}

// 事故确认/关闭按钮
$("#storyBoxCloseBtn, .story-box-btn").click(function () {
	$(".p8-story-box").fadeOut();//关闭事故按钮
	var belongorder = $(".p8-story-box").attr("belongorder");//所属订单编号
	orderFinish(belongorder, $('[orderNo="'+ belongorder +'"]').attr("finishMoney")*1);//加金钱
	setTimeout(function () {//订单消失
		$('[orderNo="'+ belongorder +'"]').hide();
	},1000);

	// //判断是否有订单在排队（多个订单同时运输的时候）
	// if (waittingArr.length > 0) {
	// 	//标记出弹框属于哪个订单（Bug）
	// 	console.log(waittingArr);
	// 	$(".p8-story-box").attr("belongorder", waittingArr[0]).show();
	// 	// waittingArr.splice(0,1);//删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
	// 	console.log(waittingArr);
	// }
});

/*计时器--不停刷新判断是否需要弹出事故按钮*/
function storyListen() {
	setInterval(function () {
		//判断是否有订单在排队（多个订单同时运输的时候）
		if (waittingArr.length > 0) {
			//标记出弹框属于哪个订单（Bug）
			console.log(waittingArr);
			$(".p8-story-box").attr("belongorder", waittingArr[0].orderNo).show();
			waittingArr.splice(0,1);//删除起始下标为1，长度为1的一个值(len设置1，如果为0，则数组不变)
			console.log(waittingArr);
		}
	},6000);
}

/*订单完成按钮--确定*/
function orderFinish(orderObjNo, finishMoney) {
	// 1.增加资金
	if (finishMoney > 0) {
		countMoney("+",finishMoney);//计算资金变化
	} else {//负数
		countMoney("-",finishMoney);//计算资金变化
	}
	//2.释放车辆
	for (var i = 0; i < carportData.length; i++) {
		if(carportData[i].orderNo == orderObjNo){
			carportData[i].orderNo = "无绑定订单编号";
			carportData[i].state = "空闲中";
		}
	}
	//3.追加新的订单
	addOrder();
}


// 游戏结束（1.时间到 or 2.达到目标金额 or 3.资金为负数）
function gameOver(overType) {
	setTimeout(function () {
		showAlert(overType + '，游戏结束!','end',function(){
			window.location.href = "index.html";
		}, "false");
	},2500);
}

//动态添加订单
function addOrder() {
	/*var cargoTypeArr =['cold', 'ordinary'];//货物种类
	var ordinaryGoodsNameArr =['衣服', '裤子', '裙子', '帽子', '背包'];//普通货物
	var coldGoodsNameArr =['大虾', '螃蟹', "鲶鱼"];//生鲜货物
	var destArr = ['A', 'C', 'D'];//目的地*/
	/*订单金额 800 600 */
	
	// 普通订单
	var orderNormalArr = [
		{cargoType:"ordinary", goodsName: "衣服", dest: "A", money: "600"},
		{cargoType:"ordinary", goodsName: "裤子", dest: "C", money: "600"},
		{cargoType:"ordinary", goodsName: "裙子", dest: "D", money: "600"},
		{cargoType:"ordinary", goodsName: "帽子", dest: "A", money: "600"},
		{cargoType:"ordinary", goodsName: "裤子", dest: "D", money: "600"},
		{cargoType:"ordinary", goodsName: "背包", dest: "D", money: "600"},
	];
	// 综合订单
	var orderArr = [
		{cargoType:"ordinary", goodsName: "衣服", dest: "A", money: "600"},
		{cargoType:"ordinary", goodsName: "裤子", dest: "C", money: "600"},
		{cargoType:"ordinary", goodsName: "裙子", dest: "D", money: "600"},
		{cargoType:"ordinary", goodsName: "帽子", dest: "A", money: "600"},
		{cargoType:"ordinary", goodsName: "裤子", dest: "D", money: "600"},
		{cargoType:"ordinary", goodsName: "背包", dest: "D", money: "600"},

		{cargoType:"cold", goodsName: "大虾", dest: "A", money: "800"},
		{cargoType:"cold", goodsName: "螃蟹", dest: "C", money: "800"},
		{cargoType:"cold", goodsName: "鲶鱼", dest: "D", money: "800"},
		{cargoType:"cold", goodsName: "鲶鱼", dest: "A", money: "800"},
		{cargoType:"cold", goodsName: "大虾", dest: "D", money: "800"},
		{cargoType:"cold", goodsName: "螃蟹", dest: "D", money: "800"},
	];
	var currentOrder = '';//新增的订单
	/*前20单都是普通订单
	因：订单随机生成，初始资金1000只能买普通车辆，为了避免随机生成的订单到后来都是生鲜单，又没钱买车导致无法接单
	所以：要保证赚到足够的资金买冷藏车，再生成生鲜单*/

	if (addOrderNo>20) {
		currentOrder = orderArr[Math.floor(Math.random() * orderArr.length)];
	} else {
		currentOrder = orderNormalArr[Math.floor(Math.random() * orderNormalArr.length)];
	}
	console.log(currentOrder);
	var addOrderHtml =  '<div class="order-bg order-detail" orderNo="'+ addOrderNo +'" cargoType="'+ currentOrder.cargoType +'" useGps="0" useHumiture="0" cartype="订单选择的车辆类型" finishMoney="订单最终赚取金额">'+
							'<div class="order-finish">'+
								'<div class="order-finish-text">货物送达，途中货物遭偷窃</div>'+
								'<img src="../images/img8/icon-gold.png" alt="金钱图标">'+
								'<span class="own-money">+20</span>'+ 
							'</div>'+
							'<div class="order-content-detail" >'+
								'<div class="order-detail-top">'+
									'<img src="../images/img8/goods.png" alt="货物" class="order-detail-goods">'+
									'<div class="order-detail-text">'+
										'<span class="text-good">'+ currentOrder.goodsName +'</span>'+
										'<br>'+
										'<span class="text-address">'+
											'<span class="start">B</span>区-'+
											'<span class="end">'+ currentOrder.dest +'</span>区'+
										'</span>'+
									'</div>'+
									'<div class="btn-bg-red order-btn receive-order" onclick="receive_order(this);">接单</div>'+
									'<div class="order-detail-right">'+
										'<div class="btn-bg-car add-car" addCar="false" onclick="add_car(this);">'+
											'<img src="../images/img8/icon-plus-white.png" class="common-center" cartype="plus" alt="添加">'+
										'</div>'+
										'<img src="../images/img8/icon-gold.png" alt="金钱图标">'+
										'<span >'+ currentOrder.money +'</span> '+
									'</div> '+
								'</div>'+
								'<div class="order-detail-bottom">'+
								'</div>'+
							'</div>'+
						'</div>';
		/*$(".order-content").append(addOrderHtml);*/
		$("#orderAdd").append(addOrderHtml);
		
		addOrderNo++;
}