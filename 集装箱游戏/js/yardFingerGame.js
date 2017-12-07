/*
* @Author: pz
* @Date:   2017-12-06 20:25:13
* @Last Modified by:   pz
* @Last Modified time: 2017-12-07 15:43:55
*/

/*界面生成---start********************************************************************************************/
var randomX = getRandom(1, 6);//列
        var randomY = getRandom(1, 5); //层
        var businessList = ["提箱","放箱"];
		var	business = businessList[Math.floor(Math.random() * businessList.length)];//提箱or放箱
		/*调试pz--随机生成列(1-6)+层(1-5)+业务类型*/
		/*console.log("randomX=="+randomX+"&&randomY=="+randomY+"&&business=="+business);*/
		
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
		});

		/*根据方向移动钢丝绳(及货物)
			lineObj：
			      top：（最高-最低）-162px至135px（一层箱子的高度）-箱子高度？？？？
			      left：（最左-最右）630px至78px
		*/
		function moveBox(keyCode,lineObj,cabObj,cargoObj,moveDist) {
			if (keyCode == 37) {//方向键：左←
				lineObj.animate({'left':"-="+ moveDist +"px"},'slow');//钢丝绳移动
				cabObj.animate({'left':"-="+ moveDist +"px"},'slow');//左右移动式驾驶室跟随移动
				if (holdOnFlag) {
					cargoObj.animate({'left':"-="+ moveDist +"px"},'slow');//货物跟随钢丝绳移动
				}
				
				getMinHeight(lineObj);//可下降高度
			} else if (keyCode == 38) {//方向键：上↑
				var afterMove = lineObj.position().top-moveDist;//下一次移动后top值
				if (afterMove < -162) {
					alert("你要上天吗？");
				} else {
					lineObj.animate({'top':"-="+ moveDist +"px"},'slow');
				}
				
				if (holdOnFlag) {
					cargoObj.animate({'top':"-="+ moveDist +"px"},'slow');
				} 
			} else if (keyCode == 39) {//方向键：右→
				lineObj.animate({'left':"+="+ moveDist +"px"},'slow');
				cabObj.animate({'left':"+="+ moveDist +"px"},'slow');
				if (holdOnFlag) {
					cargoObj.animate({'left':"+="+ moveDist +"px"},'slow');
				}
			} else if (keyCode == 40) {//方向键：下↓
				lineObj.animate({'top':"+="+ moveDist +"px"},'slow');
				if (holdOnFlag) {
					cargoObj.animate({'top':"+="+ moveDist +"px"},'slow');
				}
			} else if (keyCode == 13) {//Enter键
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
			}
		};

		/*根据line（left）获取当前可以下降的高度【 top：（最高-最低）-162px至135px（一层箱子的高度）】
			left临界点：
			1）箱子区：80/150/220/290/360/430[minHeight=135-(可见层数-1)]
			2）箱子右侧区（包括车）:[90]
			//2）箱子与车的空白区：500-520[minHeight=135]
			//3）车子：>520[minHeight=135-车子高度-二分之一的箱子高度]
		*/
		//没有计算偏移误差！！！！！！！！！！！！！！！
		function getMinHeight(lineObj) {
			var minHeight = 90;//默认箱子右侧区
			var lineLeft = lineObj.position().left-20;//计算移动后的距离
			var boxNum = 0;//箱子个数
			if (lineLeft<501) {//箱子区
				/*var oneCloumn = Math.abs(lineLeft-);*/
				if (lineLeft == 80) {
					boxNum = getBoxNum(0,0,0);
				} else if (lineLeft>80 && lineLeft<150) {
					boxNum = getBoxNum(-1,70,-1);//-1作为标识
				} else if (lineLeft == 150) {
					boxNum = getBoxNum(0,0,70);
				} else if (lineLeft>150 && lineLeft<220) {
					boxNum = getBoxNum(69,140,-1);
				} else if (lineLeft == 220) {
					boxNum = getBoxNum(0,0,140);
				}else if (lineLeft>220 && lineLeft<290) {
					boxNum = getBoxNum(139,210,-1);
				} else if (lineLeft == 290) {
					boxNum = getBoxNum(0,0,210);
				} else if (lineLeft>290 && lineLeft<360) {
					boxNum = getBoxNum(209,280,-1);
				} else if (lineLeft == 360) {
					boxNum = getBoxNum(0,0,280);
				} else if (lineLeft>360 && lineLeft<430) {
					boxNum = getBoxNum(279,350,-1);					
				} else if (lineLeft>429 && lineLeft<501) {
					boxNum = getBoxNum(349,417,-1);					
				} 

				minHeight = 135-(boxNum-1)*49;
				
			}
			console.log("lineLeft=="+lineLeft+"箱子个数="+boxNum+";可下降的高度=="+minHeight);
			return minHeight;
		}

		function getBoxNum(minLeft,maxLeft,left){
			/*循环获取位置内display：block的元素的数量*/
			var boxNum = 0;
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					console.log("displayFlag==" + displayFlag);
					var currentBoxLeft = $currentBox.position().left;
					if (left > -1) {
						if (currentBoxLeft == left && displayFlag == 'block') {
							boxNum++;
						}
					}else {
						if (currentBoxLeft>minLeft && currentBoxLeft<maxLeft && displayFlag == 'block') {
							boxNum++;
						}
					}
					
				}
			}
			return boxNum;
		}

		/*根据绳子的位置获取可以左右移动的位置*/
		function getMinLeft(lineObj) {
			var minLeft = 80;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left-20;//计算移动后的距离
			if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
				minLeft = 80;
			} else {//箱子区域（top：135px至-66px）
				if (lineLeft>521) {//箱子右侧（left：521px至630px）
					还要考虑车上集装箱的高度，
					限制车上只能放一个集装箱
					if (lineTop>135px) {
						判断对应高度第6列是否有障碍物！！
					} else {}
				} else if(lineLeft>79 && lineLeft<521){//箱子区域（根据左右侧箱子的高度获取可移动距离）

				} else if(lineLeft<80){
					minLeft = 80;
				}
			}
			return minLeft;
		}
		/*function getMinLeft(lineObj) {
			var minLeft = 80;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left-20;//计算移动后的距离
			if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
				minLeft = 80;
			} else {//箱子区域（top：135px至-66px）
				if (lineLeft>521) {//箱子右侧（left：521px至630px）
					还要考虑车上集装箱的高度，
					限制车上只能放一个集装箱
				} else if(lineLeft>79 && lineLeft<521){//箱子区域（根据左右侧箱子的高度获取可移动距离）

				} else if(lineLeft<80){
					minLeft = 80;
				}
			}
			return minLeft;
		}*/

		function getMaxLeft(lineObj) {
			/*var maxLeft = 630;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left-20;//计算移动后的距离
			if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
				maxLeft = 630;
			} else {//箱子区域（top：135px至-66px）
				if (lineLeft>521) {//箱子右侧（left：521px至630px）
					还要考虑车上集装箱的高度，
					限制车上只能放一个集装箱
				} else if(lineLeft>79 && lineLeft<521){//箱子区域（根据左右侧箱子的高度获取可移动距离）

				} else if(lineLeft<80){
					maxLeft = 80;
				}
			}
			return maxLeft;*/
		}
/*抓取箱子效果--end***********************************************************************************/


		/*提交判断车上的货物编号是否与任务中相同*/
		function subJudgment(argument) {
			// body...
		}
