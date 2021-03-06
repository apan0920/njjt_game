/*
* @Author: pz
* @Date:   2017-12-06 20:25:13
* @Last Modified by:   pz
* @Last Modified time: 2017-12-27 20:31:56
*/

/*1、游戏界面初始化---start********************************************************************************************/
       
		/*给箱子随机添加背景图,根据业务类型生成界面
			1.左侧箱子区
			2.右侧任务提示栏
		*/
		holdOnCargoX = 0,
		holdOnCargoY = 0;

		function initGame(taskTitle,taskDate, cyNo, business, containerType, content, yfColumn, yfFloor) {
			//1.左侧箱子区
			var bg = ["boxBgImgBlue","boxBgImgGreen","boxBgImgGrey","boxBgImgLightBlue","boxBgImgGreyBlue","boxBgImgYellow"];//"boxBgImgOrange",
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var randomBg = bg[Math.floor(Math.random() * bg.length)];
					if (i==yfColumn && j==yfFloor) {
						$("#box"+i+j).addClass("boxBgImgRed");//任务箱子设置为醒目的橘色
					}else{
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
				for (var i = yfFloor; i < 6; i++) {
						$("#box"+yfColumn+i).hide();
				}
				//将任务中箱子放在车上
				$("#box"+yfColumn+yfFloor).css({top:"147px",left:"527px"}).show();
			}

			//2.右侧任务提示栏
			$('.task_details_title').html(taskTitle);
			$('.task_details_date').html('发布时间：'+taskDate)
			$('.task_details_cyNo').html('场箱位号：'+cyNo)
			$('.task_details_business').html('业务类型：'+business)
			$('.task_details_containerType').html('区位类型：'+containerType)
			$('.task_details_content').html('任务内容：'+content);
			$('#yfColumn').val(yfColumn);
			$('#yfFloor').val(yfFloor);
			$('.task').removeClass('fadeOut').show().addClass('delay_10 animated').addClass('fadeIn');

		}
		
		
/*1、游戏界面初始化---end********************************************************************************************/


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
				afterMoveTop = afterMoveTop + 49 - (perError-1);//携带货物时加上货物的高度,误差为2px。6为夹子的下编辑
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
		function getMinHeight(lineObj, moveDist, holdOnFlag, perError) {
			var minHeight = 90;//默认箱子右侧区
			if (holdOnFlag) {
				if (!(boxOnCar()!=null && boxOnCar()[0])) {
					minHeight = minHeight+45;//车上没有箱子
				}
			}
			var lineLeft = lineObj.position().left;//当前绳子的left
			var boxNum = 0;//箱子个数
			if (lineLeft<501) {//箱子区
				if (lineLeft < (80+perError)) {
					boxNum = getBoxNum(0,0,0, holdOnFlag);
				} else if (lineLeft>(80+perError) && lineLeft<150) {//取第一列与第二列最大高度
					boxNum = Math.max(getBoxNum(-1,70,-1, holdOnFlag),getBoxNum(69,140,-1, holdOnFlag));//-1作为标识
				} else if (150-perError<lineLeft && lineLeft< 150+perError) {//误差左右2px
					boxNum = getBoxNum(0,0,70, holdOnFlag);
				} else if (lineLeft>150 && lineLeft<220) {
					boxNum = Math.max(getBoxNum(69,140,-1, holdOnFlag),getBoxNum(139,210,-1, holdOnFlag));
				} else if (220-perError<lineLeft && lineLeft< 220+perError) {//lineLeft == 220
					boxNum = getBoxNum(0,0,140, holdOnFlag);
				}else if (lineLeft>220 && lineLeft<290) {
					boxNum = Math.max(getBoxNum(139,210,-1, holdOnFlag),getBoxNum(209,280,-1, holdOnFlag));
				} else if (290-perError<lineLeft && lineLeft< 290+perError) {//lineLeft == 290
					boxNum = getBoxNum(0,0,210, holdOnFlag);
				} else if (lineLeft>290 && lineLeft<360) {
					boxNum = Math.max(getBoxNum(209,280,-1, holdOnFlag),getBoxNum(279,350,-1, holdOnFlag));
				} else if (360-perError<lineLeft && lineLeft< 360+perError) {//lineLeft == 360
					boxNum = getBoxNum(0,0,280, holdOnFlag);
				} else if (lineLeft>360 && lineLeft<430) {
					boxNum = Math.max(getBoxNum(279,350,-1, holdOnFlag),getBoxNum(349,417,-1, holdOnFlag));					
				} else if (lineLeft>429 && lineLeft<501) {
					boxNum = getBoxNum(349,417,-1, holdOnFlag);					
				} 
				minHeight = 135-(boxNum-1)*49;
			}
			/*console.log("lineLeft=="+lineLeft+"箱子个数="+boxNum+";可下降的高度=="+minHeight);*/
			return minHeight;
		}

		function getBoxNum(minLeft, maxLeft, left, holdOnFlag){
			/*循环获取位置内display：block的元素的数量*/
			/*console.log("调试---抓取的箱子 holdOnCargoX="+holdOnCargoX+";y轴=="+holdOnCargoY);*/
			var boxNum = 0;
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					/*console.log("displayFlag==" + displayFlag);*/
					var currentBoxLeft = $currentBox.position().left;
					if (left > -1) {
						if (currentBoxLeft == left && displayFlag == 'block') {
							//如果抓取的箱子也在同一列，要去除掉
							if (holdOnFlag && holdOnCargoX==i && holdOnCargoY==j) {
								console.log("如果抓取的箱子也在同一列，要去除掉");
							} else {
								boxNum++;	
							}
						}
					}else {
						if (currentBoxLeft>minLeft && currentBoxLeft<maxLeft && displayFlag == 'block') {
							//如果抓取的箱子也在同一列，要去除掉
							if (holdOnFlag && holdOnCargoX==i && holdOnCargoY==j) {
								console.log("如果抓取的箱子也在同一列，要去除掉");
							} else {
								boxNum++;	
							}
						}
					}
				}
			}

			return boxNum;
		}

		/*根据绳子的位置判断------是否可以向左移动*/
		function getIfLeft(lineObj, moveDist, holdOnFlag, perError) {
			perError = perError-1;//左右移动误差不大于1
			var ifLeft = false;
			var lineTop = lineObj.position().top;
			if (holdOnFlag) {//抓取货物时加上货物的高度
				lineTop = lineTop + 49;
			} 
			var lineLeft = lineObj.position().left-moveDist+8;//计算移动后的距离，8是夹子边距的距离
			/*console.log("调试---是否可以向左移动==移动后的位置=="+lineLeft);*/
			if (lineLeft<80) {
				ifLeft = false;
			} else {
				if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
						ifLeft = true;
				} else {//箱子区域（top：135px至-66px）
					if (lineLeft>500) {//箱子右侧（left：521px至630px）
						ifLeft = true;
					} else if(500-perError<lineLeft && lineLeft<500+perError){//判断第6列对应高度是否有障碍物（在每次移动 1px 时，只需在临界值计算是否可以移动！！！！！）
						/*判断对应高度第6列是否有障碍物！！*/
						ifLeft = haveBox(lineObj, 6, holdOnFlag);
					}else if(430-perError<lineLeft && lineLeft<430+perError){
						ifLeft = haveBox(lineObj, 5, holdOnFlag);
					} else if(360-perError<lineLeft && lineLeft<360+perError){
						ifLeft = haveBox(lineObj, 4, holdOnFlag);
					} else if(290-perError<lineLeft && lineLeft<290+perError){
						ifLeft = haveBox(lineObj, 3, holdOnFlag);
					} else if(220-perError<lineLeft && lineLeft<220+perError){
						ifLeft = haveBox(lineObj, 2, holdOnFlag);
					} else if(150-perError<lineLeft && lineLeft<150+perError){
						ifLeft = haveBox(lineObj, 1, holdOnFlag);
					} else{
						ifLeft = true;
					}
				}
			}
			return ifLeft;
		}

		/*根据绳子的位置判断------是否可以向右移动*/
		function getIfRight(lineObj, moveDist, holdOnFlag, perError) {
			perError = perError-1;//左右移动误差不大于1
			var ifRight = true;
			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left+moveDist+67;//计算箱子右侧的位置【移动后的距离+箱子宽度。】
			
			if (holdOnFlag) {//抓取货物时加上货物的高度
				lineTop = lineTop + 49;
			} 

			if (lineLeft > 707) {//最右侧边距
				ifRight = false;
			} else {
				if (lineTop<-66) {//箱子上方（top:-66px至-162px  left:80px至630px）
					ifRight = true;
				} else {//箱子区域（top：135px至-66px）
					if (lineLeft>430) {//箱子第六列+箱子右侧（left：521px至630px）
						if (lineLeft > 595 ) {//考虑车上集装箱时的高度
							if (boxOnCar()!=null && boxOnCar()[0] && lineTop>87) {
								ifRight = false;
							}else{
								ifRight = true;
							} 
						} else {
							ifRight = true;
						}
					} else if(430-perError<lineLeft && lineLeft<430+perError){//判断第6列对应高度是否有障碍物（在每次移动 1px 时，只需在临界值计算是否可以移动！！！！！）
						ifRight = haveBox(lineObj, 6, holdOnFlag);
					} else if(360-perError<lineLeft && lineLeft<360+perError){//5
						ifRight = haveBox(lineObj, 5, holdOnFlag);
					} else if(290-perError<lineLeft && lineLeft<290+perError){//4
						ifRight = haveBox(lineObj, 4, holdOnFlag);
					} else if(220-perError<lineLeft && lineLeft<220+perError){//3
						ifRight = haveBox(lineObj, 3, holdOnFlag);
					} else if(150-perError<lineLeft && lineLeft<150+perError){//2
						ifRight = haveBox(lineObj, 2, holdOnFlag);
					} else{
						ifRight = true;
					}
				}
			}
			return ifRight;
		}

		//判断对应高度是否有箱子==》是否可以移动
		function haveBox(lineObj, columnNo, holdOnFlag){
			/*循环获取位置内display：block的元素的数量*/
			var ifMove = false;//是否可以移动
			var haveBoxFlag = false;
			var boxNum = 0;
			var lineTop = lineObj.position().top;
			if (holdOnFlag) {//抓取货物时加上货物的高度
				lineTop = lineTop + 49;
			} 
			var boxTop = lineObj.height()*1 + lineTop-280;//计算绳子对应的箱子top
			
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
				columnMinLeft = -1;
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
				minTop = 195;
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
			if ($("#task_alert").css("display") == "block") {//弹出提示框时，禁止操作
				returnArr = new Array(cargoObj,holdOnFlag);
			} else{
				cargoObj = getWhichBox(lineObj,perError);
				if (cargoObj != null) {
					/*console.log("调试---flowLineObj返回值=x="+cargoObj.attr("x")+";y=="+cargoObj.attr("y"));*/
					if (holdOnFlag) {//释放货物条件判断
						var putDownArr = getIfPutDownBox(lineObj, moveDist, holdOnFlag, perError);
						if (putDownArr[0]) {
							autoHoming(cargoObj, perError);
							holdOnFlag = false;//释放货物

							//给已抓取的货物赋值
							holdOnCargoX = 0;
							holdOnCargoY = 0;
						} else {
							showAlert(putDownArr[1],'end');
						}

					} else {//if货物与绳子的距离top、left＜20px,按Enter键可以抓取货物。---后续距离判断ing
						var boxTop;
						var aaa = lineObj.height()*1 + lineObj.position().top*1-280;
						var boxLeft = lineObj.position().left -85;
						cargoObj.css({top:boxTop-5,left:boxLeft+5});
						holdOnFlag = true;
						//给已抓取的货物赋值
						holdOnCargoX = cargoObj.attr("x");
						holdOnCargoY = cargoObj.attr("y");
					}
				}
				returnArr[0] = cargoObj;
				returnArr[1] = holdOnFlag;
			}
			return returnArr;
		};
		/*货物自动归位*/
		function autoHoming(cargoObj, perError) {
			var cargoTop = cargoObj.position().top,
				cargoLeft = cargoObj.position().left;
				//top
				if (cargoLeft < 430) {//箱子区
					if (0-perError<cargoTop && cargoTop<0+perError) {
						cargoObj.css({top:0});
					} else if (49-perError<cargoTop && cargoTop<49+perError) {
						cargoObj.css({top:49});
					} else if (98-perError<cargoTop && cargoTop<98+perError) {
						cargoObj.css({top:98});
					} else if (147-perError<cargoTop && cargoTop<147+perError) {
						cargoObj.css({top:147});
					} else if (196-perError<cargoTop && cargoTop<196+perError) {
						cargoObj.css({top:196});
					}
				//left
					if (cargoLeft < 0+perError) {
						cargoObj.css({left:0});
					} else if (70-perError<cargoLeft && cargoLeft<70+perError) {
						cargoObj.css({left:70});
					} else if (140-perError<cargoLeft && cargoLeft<140+perError) {
						cargoObj.css({left:140});
					} else if (210-perError<cargoLeft && cargoLeft<210+perError) {
						cargoObj.css({left:210});
					} else if (280-perError<cargoLeft && cargoLeft<280+perError) {
						cargoObj.css({left:280});
					} else if (350-perError<cargoLeft && cargoLeft<350+perError) {
						cargoObj.css({left:350});
					}

				} else {//小车区
					cargoObj.css({top:149,left:527});
				}
		}

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
		function getIfPutDownBox(lineObj, moveDist, holdOnFlag, perError) {
			var putDownArr = new Array();
			var putDown = false;
			var putDownPrompt = '集装箱放置位置错误,请重新放置！' ;

			var lineTop = lineObj.position().top;
			var lineLeft = lineObj.position().left;
			if (holdOnFlag) {
				lineTop = lineTop+49;//加上箱子的高度
			}
			if (lineTop < -25) {//不能超过5层（-61）
				putDown = false;
			} else {
				if (lineLeft > 500) {//车
					if (boxOnCar()!=null && boxOnCar()[0]) {//判断车上是否有货物
						putDown = false;
						if (lineLeft>607 && lineTop>88) {
							putDownPrompt = "车上只能放一个集装箱!";
						}
						
					} else {
						if (604<lineLeft && lineLeft<609) {	
							if (87<(lineTop-49) && (lineTop-49)<92) {
								putDown = true;
							} else {
								putDown = false;
							}
						} else {
							putDown = false;
						}
					}
				} else {
					var putDownFlag = false;
					if (80-perError<lineLeft && lineLeft<80+perError){
						putDownFlag = true;
					} else if (150-perError<lineLeft && lineLeft<150+perError) {
						putDownFlag = true;
					} else if (220-perError<lineLeft && lineLeft<220+perError) {
						putDownFlag = true;
					} else if (290-perError<lineLeft && lineLeft<290+perError) {
						putDownFlag = true;
					} else if (360-perError<lineLeft && lineLeft<360+perError) {
						putDownFlag = true;	
					} else if (430-perError<lineLeft && lineLeft<430+perError) {
						putDownFlag = true;
					}
					if (putDownFlag) {
						//判断是否放到其他箱子上：：防止箱子悬空
						var minHeight = getMinHeight(lineObj, moveDist, holdOnFlag, perError);
						var distop = Math.abs(lineTop-minHeight);
						if (distop<perError) {//相差不大于1px
							putDown = true;
						} else {
							putDown = false;
						}
					} 
				}
			} 
			putDownArr[0] = putDown;
			putDownArr[1] = putDownPrompt;
			return putDownArr;
		}
		//判断车上是否有货物
		function boxOnCar() {
			var returnArr = new Array();
			var boxNum = 0;//车上箱子数量
			var isOn = false;
			var cargoOnCarObj = null;
			for (var i = 1; i < 7; i++) {
				for (var j = 1; j < 6; j++) {
					var $currentBox = $("#box"+i+j);
					var displayFlag = $currentBox.css('display');//可见属性
					var currentBoxLeft = $currentBox.position().left;
					var currentBoxTop = $currentBox.position().top;
					if (displayFlag == 'block') {
						if (currentBoxTop>130 && currentBoxLeft>500) {//如果放箱子没问题，，其实top不用比较
							if (!(holdOnCargoX == i && holdOnCargoY == j)) {//排除是当前抓取的箱子
								boxNum++;
								cargoOnCarObj = $currentBox;
							}
						}
					}
				}
			}
			/*console.log("调试--车上货物数量=="+boxNum);*/
			if (boxNum > 0) {
				isOn = true;
			} 
			returnArr[0] = isOn;
			returnArr[1] = cargoOnCarObj;
			return returnArr;
		}
/*3、抓取箱子效果--end***********************************************************************************/


/*4、提交按钮--start***********************************************************************************/
		/*提交判断车上的货物编号是否与任务中相同*/
		function gameSubBtn(business, holdOnFlag) {
			var business = splitColon($(".task_details_business").html());
			var missionX = $("#yfColumn").val();
			var missionY = $("#yfFloor").val();
			var scoreFlag = 1;////是否答对	(0:错 1:对)
			var prompt = "答题正确！";
			if (business == "提箱") {	/*获取车上是否有箱子（及箱子编号）*/
				if (boxOnCar()!=null && boxOnCar()[0]) {
					var boxOnCarX = boxOnCar()[1].attr("x"),
						boxOnCarY = boxOnCar()[1].attr("y");
					if (holdOnFlag) {
						showAlert('答题失败！请先完成放箱作业。','end');
					} else {
						if (!(boxOnCarX == missionX && boxOnCarY == missionY)) {
							scoreFlag = 0;
							prompt = "答题错误！";
						} 
					}
				} else {
					showAlert('请进行提箱操作！','end');
				}
			} else if (business == "放箱") {
				if (holdOnFlag) {
					showAlert('答题失败！请先完成放箱作业。','end');
				} else {
					if (!putRight(missionX, missionY)) {
						scoreFlag = 0;
						prompt = "答题错误！";
					}
				}
			}
			showAlert(prompt,'end',function(obj){
				setTimeout(function(){
					window.location.href = 'yardFinger.html';
				},1000);
			});
			gameSub(scoreFlag);//提交结果
		};

		/*调用接口提交答题结果*/
		function gameSub(scoreFlag) {
				var obj = $('.gameSubBtn a');
				if(obj.attr('isSubmit') == 'false'){ return; }//禁止重复提交
				obj.attr('isSubmit','false');

				var ucode = get_address('ucode');//用户编号	
				var taskId = get_address('yardFingerId')*1;//任务Id	
				var startingTime = get_address('yardFingerStartTime');//开始时间	
				var endingTime = getNowFormatDate();//结束时间	base.js
			$.ajax({
				url: ajaxUrl + 'inter/yard-task!grade.action',/*http://ip:port/congame/inter/yard-task!grade.action*/
				type: 'post',
				dataType: 'json',
				data: { 'ucode': ucode ,'taskId': taskId ,'startingTime': startingTime ,'endingTime': endingTime ,'flag': scoreFlag },
				success: function(data){
					if(data.status == 0){
					 showAlert('成绩保存失败，请重新提交！'); 
					 return; 
					}
					obj.attr('isSubmit','true');
					showAlert('成绩保存成功！','end',function(){
						/*$(this).removeClass('delay_10 bounceInRight');
						$('.booking_date_bg').removeClass('bounceInDown delay_05').addClass('bounceOutDown');
						$('.booking_date_ico').removeClass('bounceInDown delay_08 tada').addClass('delay_02').addClass('bounceOutDown');
						$('.booking_main').removeClass('zoomIn').addClass('delay_05').addClass('bounceOut');*/
						setTimeout(function(){
							window.location.href = 'yardFinger.html';
						},1200);
					});

				},
				error: function(){ console.log('加载失败') }
			});
		}
		
	/*判断放箱位置是否正确*/
	function putRight(missionX, missionY) {
		var res = true, rightTop = 0, rightLeft = 0;

		switch(Number(missionX)){
			case 1:
			  rightLeft = 0
			  break;
			case 2:
			  rightLeft = 70
			  break;
			case 3:
			  rightLeft = 140
			  break;
			case 4:
			  rightLeft = 210
			  break;
			case 5:
			  rightLeft = 280
			  break;
			case 6:
			  rightLeft = 350
			  break;
		}

		switch(Number(missionY)){
			case 1:
			  rightTop = 196
			  break;
			case 2:
			  rightTop = 147
			  break;
			case 3:
			  rightTop = 98
			  break;
			case 4:
			  rightTop = 49
			  break;
			case 5:
			  rightTop = 0
			  break;
		}

		var missionBox = $("#box"+missionX+missionY);

		if (missionBox.position().left == rightLeft && missionBox.position().top == rightTop) {
			res = true;
		} else {
			res = false;
		}
		return res;
	}
/*4、提交按钮--end***********************************************************************************/

 	/*截取冒号后的字符串*/
	function splitColon(str) {
		var result=str.split("：");
		if (result !=null && result.length>0) {
			return result[1];
		} 
	}