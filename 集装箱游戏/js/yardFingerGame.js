/*
* @Author: pz
* @Date:   2017-12-06 20:25:13
* @Last Modified by:   pz
* @Last Modified time: 2017-12-08 21:08:42
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
			//隐藏位置及以上的箱子
			for (var i = randomY; i < 6; i++) {
					$("#box"+randomX+i).hide();
			}
			//将任务中箱子放在车上
			$("#box"+randomX+randomY).css({top:"147px",left:"527px"}).show();
		}
/*1、界面生成---end********************************************************************************************/


/*2、移动钢丝绳--start***********************************************************************************/



		/*是否可以向上移动*/
		function getIfUp(lineObj,moveDist) {
			var ifUp = false;
			var afterMoveTop = lineObj.position().top-moveDist;//下一次移动后top值
			if (afterMoveTop > -162) {
				ifUp = true;
			} else {
				/*alert("你要上天吗？");*///会不停弹出这句话。。！！！！！！！！什么原因？？？？
				ifUp = false;
			}
			return ifUp;
		}

		/*是否可以向下移动*/
		function getIfDown(lineObj,moveDist, holdOnFlag, perError) {
			var ifDown = false;
			var minHeight = getMinHeight(lineObj,moveDist, holdOnFlag, perError);
			var afterMoveTop = lineObj.position().top+moveDist;//计算移动后的距离
			if (holdOnFlag) {
				afterMoveTop = afterMoveTop + 49;//携带货物时加上货物的高度
			} 
			/*问题：待解决。
				1、两侧箱子高度不同时，有问题。
				2、最左侧有问题。
			*/
			if (afterMoveTop>minHeight) {
				ifDown = false;
			}else{
				ifDown = true;
			}
			/*console.log("是否可以向下移动=="+ifDown);*/
			return ifDown;
		}

		/*根据line（left）获取当前可以下降的高度【 top：（最高-最低）-162px至135px（一层箱子的高度）】
			left临界点：
			1）箱子区：80/150/220/290/360/430[minHeight=135-(可见层数-1)]
			2）箱子右侧区（包括车）:[90]
			//2）箱子与车的空白区：500-520[minHeight=135]
			//3）车子：>520[minHeight=135-车子高度-二分之一的箱子高度]
		*/
		//位置范围还需微调！！！微调！！！微调！！！微调！！！微调！！！后续优化！！！！！！
		function getMinHeight(lineObj, moveDist, holdOnFlag, perError) {
			var minHeight = 90;//默认箱子右侧区
			var lineLeft = lineObj.position().left;//当前绳子的left
			var boxNum = 0;//箱子个数
			if (lineLeft<501) {//箱子区
				if (lineLeft < (80+perError)) {
					boxNum = getBoxNum(0,0,0);
				} else if (lineLeft>(80+perError) && lineLeft<150) {//取第一列与第二列最大高度
					boxNum = Math.max(getBoxNum(-1,70,-1),getBoxNum(69,140,-1));//-1作为标识
				} else if (lineLeft == 150) {
					boxNum = getBoxNum(0,0,70);
				} else if (lineLeft>150 && lineLeft<220) {
					boxNum = Math.max(getBoxNum(69,140,-1),getBoxNum(139,210,-1));
				} else if (lineLeft == 220) {
					boxNum = getBoxNum(0,0,140);
				}else if (lineLeft>220 && lineLeft<290) {
					boxNum = Math.max(getBoxNum(139,210,-1),getBoxNum(209,280,-1));
				} else if (lineLeft == 290) {
					boxNum = getBoxNum(0,0,210);
				} else if (lineLeft>290 && lineLeft<360) {
					boxNum = Math.max(getBoxNum(209,280,-1),getBoxNum(279,350,-1));
				} else if (lineLeft == 360) {
					boxNum = getBoxNum(0,0,280);
				} else if (lineLeft>360 && lineLeft<430) {
					boxNum = Math.max(getBoxNum(279,350,-1),getBoxNum(349,417,-1));					
				} else if (lineLeft>429 && lineLeft<501) {
					boxNum = getBoxNum(349,417,-1);					
				} 
				minHeight = 135-(boxNum-1)*49;
			}
			/*console.log("lineLeft=="+lineLeft+"箱子个数="+boxNum+";可下降的高度=="+minHeight);*/
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

		/*根据绳子的位置判断------是否可以向左移动
			左右移动没有计算带箱子的情况！！！！！！！！！！！！！！！！！！！！！
		*/
		function getIfLeft(lineObj,moveDist) {
			holdOnFlag悲催的人生啊~~~~~~~~~~~~~~~~~~
			var ifLeft = false;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left-moveDist;//计算移动后的距离
			/*console.log("是否可以向左移动==移动后的位置=="+lineLeft);*/
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
					} else if(lineLeft>430 && lineLeft<501){//判断第6列对应高度是否有障碍物（在每次移动 1px 时，只需在临界值计算是否可以移动！！！！！）
						/*判断对应高度第6列是否有障碍物！！*/
						ifLeft = haveBox(lineObj,6);
					} else if(lineLeft>360 && lineLeft<431){//5
						ifLeft = haveBox(lineObj,5);
					} else if(lineLeft>290 && lineLeft<361){//4
						ifLeft = haveBox(lineObj,4);
					} else if(lineLeft>220 && lineLeft<291){//3
						ifLeft = haveBox(lineObj,3);
					} else if(lineLeft>150 && lineLeft<221){//2
						ifLeft = haveBox(lineObj,2);
					} else if(lineLeft>80 && lineLeft<151){//1
						ifLeft = true;
					} 
				}
			}
			/*console.log("是否可以向左移动=="+ifLeft);*/
			return ifLeft;
		}

		/*根据绳子的位置判断------是否可以向右移动*/
		function getIfRight(lineObj,moveDist) {
			var ifRight = true;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left+moveDist;//计算移动后的距离(+绳子的宽度??????)
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
			/*console.log("是否可以向右移动=="+ifRight);*/
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
			/*console.log("左侧箱子个数boxNum=="+boxNum);*/
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
		function flowLineObj(lineObj,cargoObj,holdOnFlag, moveDist, perError){
			var returnArr = new Array();
			cargoObj = getWhichBox(lineObj,perError);
			if (cargoObj != null) {
				console.log("flowLineObj返回值=x="+cargoObj.attr("x")+";y=="+cargoObj.attr("y"));
				if (holdOnFlag) {//释放货物条件判断
					if (getIfPutDownBox(lineObj, moveDist, perError)) {
						holdOnFlag = false;//释放货物
					} else {
						alert("放置货物位置不正确！！！！！！");
					}
					
				} else {//if货物与绳子的距离top、left＜20px,按Enter键可以抓取货物。---后续距离判断ing
					var boxTop;
					var aaa = lineObj.height()*1 + lineObj.position().top*1-280;
					var boxLeft = lineObj.position().left -85;
					cargoObj.css({top:boxTop-5,left:boxLeft+7});
					holdOnFlag = true;
				}
			}
			returnArr[0] = cargoObj;
			returnArr[1] = holdOnFlag;
			return returnArr;
		};

		/*判断可以抓取箱子是哪一个,允许误差perError = 2px*/
		function getWhichBox(lineObj,perError) {
			var testBoxNum = 0;//允许抓取的箱子的数量
			var $cargoObj = null;
			var approBoxTop = lineObj.height()*1 + lineObj.position().top*1-280-5;//将钢丝绳的top转换成对应的箱子的top
			var approboxLeft = lineObj.position().left -80;//将钢丝绳的left转换成对应的箱子的left
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					var currentBoxLeft = $currentBox.position().left;
					var currentBoxTop = $currentBox.position().top;
					var distTop = Math.abs(currentBoxTop-approBoxTop);
					var distLeft = Math.abs(currentBoxLeft-approboxLeft);
					if (displayFlag == 'block') {
						if ( distTop<perError && distLeft<perError) {//计算左侧有没有箱子
							$cargoObj = $("#box"+i+j);
							testBoxNum++;
						}
					}
				}
			}
			return $cargoObj;
		}

		/*判断是否可以将货物放下
			1.不可以超层：箱子上方不可以放 top<-110(绳子top+箱子高度)
			2.箱子区域：boxLeft=0/70/140/210/280/350
			3.车上：能放一个，且只能放一个
		*/
		function getIfPutDownBox(lineObj, moveDist, perError) {
			var putDown = false;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left;
			if (lineTop < -111) {
				putDown = false;
			} else {
				if (lineLeft > 500) {//车
					if (boxOnCar()) {//判断车上是否有货物
						putDown = false;
					} else {
						if (604<lineLeft<607) {
							if (87 < lineTop < 92) {
								putDown = true;
							} else {
								putDown = false;
							}
						} else {
							putDown = false;
						}
					}
					
				} else {
					if (lineLeft==80 || lineLeft==150 ||lineLeft==220 || lineLeft==290 || lineLeft==360 || lineLeft==430) {
						//判断是否放到其他箱子上：：防止箱子悬空
						var minHeight = getMinHeight(lineObj, moveDist, holdOnFlag, perError);
						var distop = Math.abs((lineTop+lineObj.height())-minHeight);
						if (distop<2) {//相差不大于1px
							putDown = true;
						} else {
							putDown = false;
						}
						
					}
				}
			} 
			return putDown;
		}
		//判断车上是否有货物
		function boxOnCar(lineObj) {
			var boxNum = 0;//车上箱子数量
			var isOn = false;
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					var currentBoxLeft = $currentBox.position().left;
					var currentBoxTop = $currentBox.position().top;
					if (displayFlag == 'block') {
						if ( currentBoxTop<130 && currentBoxLeft>500) {//如果放箱子没问题，，其实top不用比较
							boxNum++;
						}
					}
				}
			}
			console.log("车上货物数量=="+boxNum);
			if (boxNum > 0) {
				isOn = true;
			} 
			return isOn;
		}
/*3、抓取箱子效果--end***********************************************************************************/





/*4、提交按钮--start***********************************************************************************/
		/*提交判断车上的货物编号是否与任务中相同*/
		function subJudgment(argument) {
			// body...
		}
/*4、提交按钮--end***********************************************************************************/