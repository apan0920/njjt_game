/*
* @Author: pz
* @Date:   2017-12-06 20:25:13
* @Last Modified by:   pz
* @Last Modified time: 2017-12-08 14:29:58
*/

/*1、界面生成---start********************************************************************************************/
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
/*1、界面生成---end********************************************************************************************/


/*2、移动钢丝绳--start***********************************************************************************/

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
				if (getIfLeft(lineObj,moveDist)) {
					lineObj.animate({'left':"-="+ moveDist +"px"},'slow');//钢丝绳移动
					cabObj.animate({'left':"-="+ moveDist +"px"},'slow');//左右移动式驾驶室跟随移动
					if (holdOnFlag) {
						cargoObj.animate({'left':"-="+ moveDist +"px"},'slow');//货物跟随钢丝绳移动
					}
				}
			} else if (keyCode == 38) {//方向键：上↑
				if (getIfUp(lineObj,moveDist)) {
					lineObj.animate({'top':"-="+ moveDist +"px"},'slow');
					if (holdOnFlag) {
						cargoObj.animate({'top':"-="+ moveDist +"px"},'slow');
					} 
				}
			} else if (keyCode == 39) {//方向键：右→
				if (getIfRight(lineObj,moveDist)) {
					lineObj.animate({'left':"+="+ moveDist +"px"},'slow');
					cabObj.animate({'left':"+="+ moveDist +"px"},'slow');
					if (holdOnFlag) {
						cargoObj.animate({'left':"+="+ moveDist +"px"},'slow');
					}
				}
			} else if (keyCode == 40) {//方向键：下↓
				if (getIfDown(lineObj,moveDist)) {
					lineObj.animate({'top':"+="+ moveDist +"px"},'slow');
					if (holdOnFlag) {
						cargoObj.animate({'top':"+="+ moveDist +"px"},'slow');
					}
				}
			} else if (keyCode == 13) {//Enter键
				flowLineObj(lineObj,cargoObj);
			}
		}

		/*是否可以向上移动*/
		function getIfUp(lineObj,moveDist) {
			var ifUp = false;
			var afterMoveTop = lineObj.position().top-moveDist;//下一次移动后top值
			if (afterMoveTop > -162) {
				ifUp = true;
			} else {
				alert("你要上天吗？");
				ifUp = false;
			}
			/*console.log("是否可以向上移动=="+ifUp);*/
			return ifUp;
		}

		function getIfDown(lineObj,moveDist) {
			var ifDown = false;
			var minHeight = getMinHeight(lineObj,moveDist);
			var afterMoveTop = lineObj.position().top+moveDist;//计算移动后的距离
			/*问题：待解决。
				1、两侧箱子高度不同时，有问题。
				2、最左侧有问题。
			*/
			if (afterMoveTop>minHeight) {
				ifDown = false;
			}else{
				ifDown = true;
			}
			console.log("是否可以向下移动=="+ifDown);
			return ifDown;
		}

		/*根据line（left）获取当前可以下降的高度【 top：（最高-最低）-162px至135px（一层箱子的高度）】
			left临界点：
			1）箱子区：80/150/220/290/360/430[minHeight=135-(可见层数-1)]
			2）箱子右侧区（包括车）:[90]
			//2）箱子与车的空白区：500-520[minHeight=135]
			//3）车子：>520[minHeight=135-车子高度-二分之一的箱子高度]
		*/
		//没有计算偏移误差！！！！！！！！！！！！！！！
		function getMinHeight(lineObj,moveDist) {
			var minHeight = 90;//默认箱子右侧区
			var lineLeft = lineObj.position().left-moveDist;//计算移动后的距离
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
					/*console.log("displayFlag==" + displayFlag);*/
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

		/*根据绳子的位置判断------是否可以向左移动*/
		function getIfLeft(lineObj) {
			var ifLeft = false;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left-20;//计算移动后的距离
			if (lineLeft<80) {
				ifLeft = false;
			} else {
				if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
					ifLeft = true;
				} else {//箱子区域（top：135px至-66px）
					if (lineLeft>500) {//箱子右侧（left：521px至630px）
						ifLeft = true;
						/*还要考虑车上集装箱的高度，
						限制车上只能放一个集装箱
						if (lineTop>135px) {
							判断对应高度第6列是否有障碍物！！
						} else {}*/
					} else if(lineLeft>430 && lineLeft<500){//判断第6列对应高度是否有障碍物（在每次移动 1px 时，只需在临界值计算是否可以移动！！！！！）
						/*判断对应高度第6列是否有障碍物！！*/
						ifLeft = haveBox(lineObj,6);
					} else if(lineLeft>360 && lineLeft<430){//5
						ifLeft = haveBox(lineObj,5);
					} else if(lineLeft>290 && lineLeft<360){//4
						ifLeft = haveBox(lineObj,4);
					} else if(lineLeft>220 && lineLeft<290){//3
						ifLeft = haveBox(lineObj,3);
					} else if(lineLeft>150 && lineLeft<220){//2
						ifLeft = haveBox(lineObj,2);
					} else if(lineLeft>80 && lineLeft<150){//1
						ifLeft = true;
					} 
				}
			}
			console.log("是否可以向左移动=="+ifLeft);
			return ifLeft;
		}

		/*根据绳子的位置判断------是否可以向右移动*/
		function getIfRight(lineObj) {
			var ifRight = true;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left+20;//计算移动后的距离(+绳子的宽度??????)
			if (lineLeft > 630) {
				ifRight = false;
			} else {
				if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
					ifRight = true;
				} else {//箱子区域（top：135px至-66px）
					if (lineLeft>500) {//箱子右侧（left：521px至630px）
						ifRight = true;
						/*还要考虑车上集装箱的高度，
						限制车上只能放一个集装箱
						if (lineTop>135px) {
							判断对应高度第6列是否有障碍物！！
						} else {}*/
					} else if(lineLeft>430 && lineLeft<500){
						ifRight = true;
					} else if(lineLeft>360 && lineLeft<430){//6//判断第6列对应高度是否有障碍物（在每次移动 1px 时，只需在临界值计算是否可以移动！！！！！）
						ifRight = haveBox(lineObj,6);
					} else if(lineLeft>290 && lineLeft<360){//5
						ifRight = haveBox(lineObj,5);
					} else if(lineLeft>220 && lineLeft<290){//4
						ifRight = haveBox(lineObj,4);
					} else if(lineLeft>150 && lineLeft<220){//3
						ifRight = haveBox(lineObj,3);
					} else if(lineLeft>80 && lineLeft<150){//2
						ifRight = haveBox(lineObj,2);
					} 
				}
			}
			console.log("是否可以向右移动=="+ifRight);
			return ifRight;
		}

		//判断对应高度是否有箱子==》是否可以移动
		function haveBox(lineObj,columnNo){
			/*循环获取位置内display：block的元素的数量*/
			var ifMove = false;//是否可以移动
			var haveBoxFlag = false;
			var boxNum = 0;
			var boxTop = lineObj.height()*1 + lineObj.position().top*1-280;//计算绳子对应的箱子top
			var columnMinLeft = 0;//当前列左边界
			var columnMaxLeft = 0;//当前列右边界
			if (columnNo == 6) {
				columnMinLeft = 349;
				columnMaxLeft = 430;
			} else if (columnNo == 5) {
				columnMinLeft = 279;
				columnMaxLeft = 350;
			} else if (columnNo == 4) {
				columnMinLeft = 209;
				columnMaxLeft = 280;				
			} else if (columnNo == 3) {
				columnMinLeft = 139;
				columnMaxLeft = 210;				
			} else if (columnNo == 2) {
				columnMinLeft = 69;	
				columnMaxLeft = 140;			
			} else if (columnNo == 1) {
				columnMinLeft = 0;
				columnMaxLeft = 70;
			}

			/*根据boxTop判断属于的层数的的top范围*/
			var minTop = 0;
			var maxTop = 0;
			var layerNum = 0;
			if (boxTop>-1 && boxTop<49) {
				minTop = -1;
				maxTop = 49;
			} else if (boxTop>48 && boxTop<98) {
				minTop = 48;
				maxTop = 98;
			} else if (boxTop>97 && boxTop<147) {
				minTop = 97;
				maxTop = 147;				
			} else if (boxTop>146 && boxTop<196) {
				minTop = 146;
				maxTop = 196;				
			} else if (boxTop>196) {
				minTop = 196;
				maxTop = 245;//箱子区域底部边缘
			} 

			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					var currentBoxLeft = $currentBox.position().left;
					var currentBoxTop = $currentBox.position().top;
					if (displayFlag == 'block') {
						if (currentBoxLeft > columnMinLeft && currentBoxLeft < columnMaxLeft && currentBoxTop>minTop && currentBoxTop<maxTop) {//计算左侧有没有箱子
							boxNum++;
						}
					}
				}
			}
			console.log("左侧箱子个数boxNum=="+boxNum);
			if (boxNum>0) {
				haveBoxFlag = true;
			} else {
				haveBoxFlag = false;
			}

			if (!haveBoxFlag) {
				ifMove = true;
			} else {
				ifMove = false;
			}
			return ifMove;
		}

		
/*2、移动钢丝绳--end***************************************************************************************/



/*3、抓取箱子效果--start***********************************************************************************/
		
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
				boxTop = aaa-280;
				/*if(aaa<280){
					boxTop = aaa - 280;
				}else if(aaa>280){
					boxTop = 280 - aaa;
				}else{
					boxTop = 280;
				}*/

				var boxLeft = lineObj.position().left -85;

				cargoObj.css({top:boxTop-5,left:boxLeft+7});
				holdOnFlag = true;
			}
		};

		/*是否可以抓取箱子*/
		function ifGetBox(argument) {
			// body...
		}
/*3、抓取箱子效果--end***********************************************************************************/





/*4、提交按钮--start***********************************************************************************/
		/*提交判断车上的货物编号是否与任务中相同*/
		function subJudgment(argument) {
			// body...
		}
/*4、提交按钮--end***********************************************************************************/