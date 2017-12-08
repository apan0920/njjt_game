/*
* @Author: pz
* @Date:   2017-12-08 14:40:07
* @Last Modified by:   pz
* @Last Modified time: 2017-12-08 21:02:29
*/
	//当页面加载完后
	window.onload = function(){
		//获取Div元素
		var $lineObj = $("#line");//钢丝绳
		var $cabObj = $("#cab");//驾驶室
		var $cargoObj = $("#box11");//要抓取的物体

		var moveDist = 1;//每次移动距离
		//创建各个方向条件判断初始变量
	    var leftKey = false;
	    var rightKey = false;
	    var topKey = false;
	    var bottomKey = false;
	    var enterKey = false;

	    var holdOnFlag = false;//是否已抓取货物
	    
		var timing = 2;//ms
		var perError = 3;//允许距离误差
		var returnArr = new Array();

		//当按下对应方向键时，对应变量为true
	    document.onkeydown = function(ev){
	    	var oEvent = ev || event;
	    	var keyCode = oEvent.keyCode;
	    	switch(keyCode){
	    		case 37:
	    		leftKey=true;
	    		break;
	    		case 38:
	    		topKey=true;
	    		break;
	    		case 39:
	    		rightKey=true;
	    		break;
	    		case 40:
	    		bottomKey=true;
	    		break;
	    		case 13:
	    		returnArr = flowLineObj($lineObj, $cargoObj, moveDist, holdOnFlag, perError);//抓取物体并获取抓取状态返回值
	    		$cargoObj = returnArr[0];
	    		holdOnFlag = returnArr[1];
	    		break;
	    	}
	    };

	    //设置一个定时，时间为50左右，不要太高也不要太低,控制速度用
	    setInterval(function(){
	        //当其中一个条件为true时，则执行当前函数（移动对应方向）
	        moveBox($lineObj,$cabObj,$cargoObj,moveDist,leftKey,rightKey,topKey,bottomKey,enterKey,holdOnFlag, perError);
	    },timing);

	     //执行完后，所有对应变量恢复为false，保持静止不动
	    document.onkeyup = function(ev){
	    	var oEvent = ev || event;
	    	var keyCode = oEvent.keyCode;

	    	switch(keyCode){
	    		case 37:
	    		leftKey=false;
	    		break;
	    		case 38:
	    		topKey=false;
	    		break;
	    		case 39:
	    		rightKey=false;
	    		break;
	    		case 40:
	    		bottomKey=false;
	    		break;
	    	}
	    }
	}
	/*左右移动没有计算带箱子的情况！！！！！！！！！！！！！！！！！！！！！*/
	function moveBox(lineObj, cabObj, cargoObj, moveDist, leftKey, rightKey, topKey, bottomKey, enterKey, holdOnFlag, perError) {
		if (leftKey) {//方向键：左←
			if (getIfLeft(lineObj,moveDist)) {
				lineObj.css({left:lineObj.position().left-moveDist+"px"});//钢丝绳移动
				cabObj.css({left:cabObj.position().left-moveDist+"px"});//左右移动式驾驶室跟随移动
				if (holdOnFlag) {
					cargoObj.css({left:cargoObj.position().left-moveDist+"px"});//货物跟随钢丝绳移动
				}
			}
		} else if (topKey) {//方向键：上↑
			if (getIfUp(lineObj,moveDist)) {
				lineObj.css({top:lineObj.position().top-moveDist+"px"});
				if (holdOnFlag) {
					cargoObj.css({top:cargoObj.position().top-moveDist+"px"});
				} 
			}
		} else if (rightKey) {//方向键：右→
			if (getIfRight(lineObj,moveDist)) {
				lineObj.css({left:lineObj.position().left+moveDist+"px"});//钢丝绳移动
				cabObj.css({left:cabObj.position().left+moveDist+"px"});//左右移动式驾驶室跟随移动
				if (holdOnFlag) {
					cargoObj.css({left:cargoObj.position().left+moveDist+"px"});//货物跟随钢丝绳移动
				}
			}
		} else if (bottomKey) {//方向键：下↓
			if (getIfDown(lineObj,moveDist, holdOnFlag, perError)) {
				lineObj.css({top:lineObj.position().top+moveDist+"px"});
				if (holdOnFlag) {
					cargoObj.css({top:cargoObj.position().top+moveDist+"px"});
				} 
			}
		} 
		/*else if (enterKey) {//Enter键
			flowLineObj(lineObj,cargoObj,holdOnFlag);
		}*/
	}

	