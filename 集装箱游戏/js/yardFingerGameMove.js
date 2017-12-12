/*
* @Author: pz
* @Date:   2017-12-08 14:40:07
* @Last Modified by:   pz
* @Last Modified time: 2017-12-12 14:07:37
*/
	//当页面加载完后
	window.onload = function(){

		/*调试pz--随机生成列(1-6)+层(1-5)+业务类型*/
		/*var yfColumn = getRandom(1, 6);//列
        var yfFloor = getRandom(1, 5); //层
        var businessList = ["提箱","放箱"];
		var	business = businessList[Math.floor(Math.random() * businessList.length)];//提箱or放箱
		console.log("yfColumn=="+yfColumn+"&&yfFloor=="+yfFloor+"&&business=="+business);
		 //试pz--获取范围内随机数
        function getRandom(min, max) {
        	var r = Math.random() * (max - min);
           	var re = Math.round(r + min);
           	re = Math.max(Math.min(re, max), min)
           	return re;
        }*/

		/*初始化游戏界面*/
		var taskTitle = getUrlParam("taskTitle"),
			taskDate = getUrlParam("taskDate"),
			content = getUrlParam("content"),
			business = getUrlParam("business"),
			containerType = getUrlParam("containerType"),
			cyNo = getUrlParam("cyNo"),
			yfColumn = getUrlParam("yfColumn"),
			yfFloor = getUrlParam("yfFloor");
			/*console.log("taskTitle,taskDate, cyNo, business, containerType, content, yfColumn, yfFloor=="+taskTitle,taskDate, cyNo, business, containerType, content, yfColumn, yfFloor);*/
		initGame(taskTitle,taskDate, cyNo, business, containerType, content, yfColumn, yfFloor);
		
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
	    
		var timingInit = 10;//ms
		var timer = null;
		/*var timingShift = false;//是否已加速*/

		var perError = 3;//允许距离误差
		var returnArr = new Array();
		

		//当按下对应方向键时，对应变量为true
	    document.onkeydown = function(ev){
	    	var oEvent = ev || event;
	    	var keyCode = oEvent.keyCode;
	    	/*console.log("键盘值keyCode=="+keyCode);*/
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
	    		case 32://空格键
	    			returnArr = flowLineObj($lineObj, $cargoObj, holdOnFlag, moveDist, perError);//抓取物体并获取抓取状态返回值
	    			$cargoObj = returnArr[0];
	    			holdOnFlag = returnArr[1];
	    			break;
	    		/*case 16://shift 键
	    			returnArr = timingControl(timingShift, timingInit);//通过shift键来控制速度
	    			break;*/
	    	}
	    };

	    //设置一个定时，时间为50左右，不要太高也不要太低,控制速度用
	    timer = setInterval(function(){
	        //当其中一个条件为true时，则执行当前函数（移动对应方向）
	       moveBox($lineObj,$cabObj,$cargoObj,moveDist,leftKey,rightKey,topKey,bottomKey,enterKey,holdOnFlag, perError);
	    },timingInit);

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


	    /*提交按钮绑定时间*/
		$("#gameSubBtn").bind("click",function(){
			gameSubBtn(business, holdOnFlag);
		});
	}

	/*通过shift键来控制速度*/
/*	function timingControl(timingShift, timingInit) {
		var returnArr = new Array();
		if(!timingShift){	
		    timingShift = true;
		    timingInit = timingInit * 10;
		}else{
		    timingShift = false;
		}
		alert("改变速度timingInit="+timingInit);
		returnArr[0] = timingShift;
		returnArr[1] = timingInit;
		return returnArr;
		
		// timer = setInterval(function(){
		//         moveBox($lineObj,$cabObj,$cargoObj,moveDist,leftKey,rightKey,topKey,bottomKey,enterKey,holdOnFlag, perError);
		//     }, timingInit);
	}*/
	/*左右移动没有计算带箱子的情况！！！！！！！！！！！！！！！！！！！！！*/
	function moveBox(lineObj, cabObj, cargoObj, moveDist, leftKey, rightKey, topKey, bottomKey, enterKey, holdOnFlag, perError) {
		if ($("#task_alert").css("display") == "block") {//弹出提示框时，禁止操作
				return;
			}
			
		if (leftKey) {//方向键：左←
			if (getIfLeft(lineObj, moveDist, holdOnFlag, perError)) {
				lineObj.css({left:lineObj.position().left-moveDist+"px"});//钢丝绳移动
				cabObj.css({left:cabObj.position().left-moveDist+"px"});//左右移动式驾驶室跟随移动
				if (holdOnFlag && cargoObj!==null) {
					cargoObj.css({left:cargoObj.position().left-moveDist+"px"});//货物跟随钢丝绳移动
				}
			}
		} else if (topKey) {//方向键：上↑
			if (getIfUp(lineObj,moveDist)) {
				lineObj.css({top:lineObj.position().top-moveDist+"px"});
				if (holdOnFlag && cargoObj!==null) {
					cargoObj.css({top:cargoObj.position().top-moveDist+"px"});
				} 
			}
		} else if (rightKey) {//方向键：右→
			if (getIfRight(lineObj, moveDist, holdOnFlag, perError)) {
				lineObj.css({left:lineObj.position().left+moveDist+"px"});//钢丝绳移动
				cabObj.css({left:cabObj.position().left+moveDist+"px"});//左右移动式驾驶室跟随移动
				if (holdOnFlag && cargoObj!==null) {
					cargoObj.css({left:cargoObj.position().left+moveDist+"px"});//货物跟随钢丝绳移动
				}
			}
		} else if (bottomKey) {//方向键：下↓
			if (getIfDown(lineObj,moveDist, holdOnFlag, perError)) {
				lineObj.css({top:lineObj.position().top+moveDist+"px"});
				if (holdOnFlag && cargoObj!==null) {
					cargoObj.css({top:cargoObj.position().top+moveDist+"px"});
				} 
			}
		} 
	}

	//获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null){
			return decodeURI(r[2]); 
        }else {
        	return null; //返回参数值
        } 
    }