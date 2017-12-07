/*
* @Author: pz
* @Date:   2017-12-06 20:25:13
* @Last Modified by:   pz
* @Last Modified time: 2017-12-07 09:25:51
*/

/*界面生成---start********************************************************************************************/
var randomX = getRandom(1, 6);//列
        var randomY = getRandom(1, 5); //层
        var businessList = ["提箱","放箱"];
		var	business = businessList[Math.floor(Math.random() * businessList.length)];//提箱or放箱
		/*调试pz--随机生成列(1-6)+层(1-5)+业务类型*/
		console.log("randomX=="+randomX+"&&randomY=="+randomY+"&&business=="+business);
		
		$(function(){
			randomAddBg();
		});
         
        /*调试pz--获取范围内随机数*/
        function getRandom(min, max) {
        	var r = Math.random() * (max - min);
           	var re = Math.round(r + min);
           	re = Math.max(Math.min(re, max), min)
           	return re;
        }
		/*给箱子随机添加背景图*/
		function randomAddBg() {
			var bg = ["boxBgImgBlue","boxBgImgGreen","boxBgImgGrey","boxBgImgLightBlue","boxBgImgOrange"];
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var randomBg = bg[Math.floor(Math.random() * bg.length)];
					$("#box"+i+j).addClass(randomBg);
				}
			}
		}
		
		/*根据业务类型、任务中列+层，随机隐藏箱子==>生成最终的界面效果*/
		if (business == "提箱") {
			/*隐藏右上角4个箱子
				注：后台控制提箱时不能提右上角的4个
			*/
			for (var i = 5; i < 7; i++) {
				for (var j = 4; j < 6; j++) {
					$("#box"+i+j).hide();
				}
			}
		} else if (business == "放箱") {
			for (var i = randomY; i < 6; i++) {
					$("#box"+randomX+i).hide();
			}
			console.log("44444=="+business);
		}
/*界面生成---end********************************************************************************************/

/*抓取箱子效果--start***********************************************************************************/

var holdOnFlag = false;//是否已抓取货物
		/*键盘监听*/
		$(document).keyup(function(e){
			var keyCode = e.keyCode;//按键
			var moveDist = 20;//每次移动距离
			var $lineObj = $("#line");//钢丝绳
			var $cabObj = $("#cab");//驾驶室
			var $cargoObj = $("#box11");//要抓取的物体
			moveBox(keyCode,$lineObj,$cabObj,$cargoObj,moveDist);
			console.log("当前keyCode=="+keyCode);
		});

		/*根据方向移动钢丝绳(及货物)*/
		function moveBox(keyCode,lineObj,cabObj,cargoObj,moveDist) {
			console.log("holdOnFlag=="+holdOnFlag);
			if (keyCode == 37) {
				lineObj.animate({'left':"-="+ moveDist +"px"},'slow');//钢丝绳移动
				cabObj.animate({'left':"-="+ moveDist +"px"},'slow');//左右移动式驾驶室跟随移动
				if (holdOnFlag) {
					cargoObj.animate({'left':"-="+ moveDist +"px"},'slow');//货物跟随钢丝绳移动
				}
			} else if (keyCode == 38) {
				lineObj.animate({'top':"-="+ moveDist +"px"},'slow');
				if (holdOnFlag) {
					cargoObj.animate({'top':"-="+ moveDist +"px"},'slow');
				} 
			} else if (keyCode == 39) {
				lineObj.animate({'left':"+="+ moveDist +"px"},'slow');
				cabObj.animate({'left':"+="+ moveDist +"px"},'slow');
				if (holdOnFlag) {
					cargoObj.animate({'left':"+="+ moveDist +"px"},'slow');
				}
			} else if (keyCode == 40) {
				lineObj.animate({'top':"+="+ moveDist +"px"},'slow');
				if (holdOnFlag) {
					cargoObj.animate({'top':"+="+ moveDist +"px"},'slow');
				}
			} else if (keyCode == 13) {
					flowLineObj(lineObj,cargoObj);
			}
		}
		/*抓取货物效果*/
		function flowLineObj(lineObj,cargoObj){
			if (holdOnFlag) {//释放货物条件判断
				holdOnFlag = false;//释放货物
			} else {//if货物与绳子的距离top、left＜20px,按Enter键可以抓取货物。---后续距离判断ing
				/*var boxTop = lineObj.position().top+50;
				var boxLeft = lineObj.position().left;
				cargoObj.css({top:boxTop,left:boxLeft});
				holdOnFlag = true;*/
				var boxTop;
				var aaa = lineObj.height()*1 + lineObj.position().top*1;
				if(aaa<280){
					boxTop = aaa - 280;
				}else if(aaa>280){
					boxTop = 280 - aaa;
				}else{
					boxTop = 280;
				}

				var boxLeft = lineObj.position().left -85;

				cargoObj.css({top:boxTop-5,left:boxLeft+7});
				holdOnFlag = true;
			console.log("货物位置boxTop="+boxTop+"&&&&"+"boxLeft="+boxLeft);
			}
			/*console.log("货物位置boxTop="+boxTop+"&&&&"+"boxLeft="+boxLeft);*/
		};
/*抓取箱子效果--end***********************************************************************************/


		/*提交判断车上的货物编号是否与任务中相同*/
		function subJudgment(argument) {
			// body...
		}
