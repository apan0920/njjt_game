
/*文字打印效果*/
function textShow(hideObj,showObj,callback){
	var str = hideObj.text();
	var index = 0; 

	var iTime = setInterval(function(){
		showObj.html(str.substring(0, index++));
		if(index > str.length) {  
			clearInterval(iTime);
			index = 0;
			if(callback && (typeof callback == "function")){
				return callback();
			}
			return;
		}  
	}, 17);
}

/*人走动画*/
function peopleMove(leftNum,callback){
	var pngObj = $('.distribute_gif img.png');
	var gifObj = $('.distribute_gif img.gif');
	var bgObj = $('.distribute_bg');

	pngObj.hide();
	gifObj.removeClass('slideInLeft').show();
	bgObj.animate({'left':leftNum},3000,'linear',function(){
		gifObj.hide();
		pngObj.removeClass('fadeIn delay_5 animated_01').show();
		if(callback && (typeof callback == "function")){
			return callback();
		}
	});
}

// 从数组中删除指定元素
function removeByValue(arr, val) {
	for(var i=0; i<arr.length; i++) {
		if(arr[i] == val) {
			arr.splice(i, 1);
			break;
		}
	}
	return arr;
};

//两点连线
function setLine(){
	var start = $('.plan_line_left p.isLine i');
	var end = $('.plan_line_right p.isLine i');
	var index = start.index();

	var start_pL = start.parents('p').position().left,
		start_pT = start.parents('p').position().top,
		end_pL = end.parents('p').position().left,
		end_pT = end.parents('p').position().top;

	var start_y = start.position().top*1 + start_pT,
		start_x = start.position().left*1 + (start.width()/2) + start_pL,
		end_y = end.position().top*1 + end_pT,
		end_x = end.position().left*1 + (end.width()/2) + end_pL;

	var node = document.createElement('canvas');  
    document.getElementById('myCanvas').appendChild(node);

    var nodeTop = start_y<end_y ? start_y : end_y,
    	nodeLeft = start_x<end_x ? start_x : end_x;

    /*node.style.top = (nodeTop-2)+'px';*/
    node.style.top = (nodeTop+8)+'px';
    node.style.left = (nodeLeft-2)+'px';
	node.width = Math.abs(end_x - start_x) +4;
    node.height = end_y==start_y ? 4 : Math.abs(end_y - start_y) +4;

    var startX = 0,
    	startY = start_y<end_y ? 0 : node.height-1,
    	endX = node.width+2,
    	endY = start_y<end_y ? node.height+1 : 0;

    line(startX,startY,endX,endY,node);
};
//画线
function line(startX,startY,endX,endY,obj){

	var difference = 0;
	var moveTime = 300,
		spped = 15;
	var difference_x = 1,
		difference_y = 1;
	difference = Math.max(Math.abs(endX-startX),Math.abs(endY-startY));

	difference_x = Math.abs(endX-startX)/(moveTime/spped);
	difference_y = Math.abs(endY-startY)/(moveTime/spped);

	difference_x = endX>startX ? difference_x : -difference_x;
	difference_y = endY>startY ? difference_y : -difference_y;

	var end_x = startX,
		end_y = startY;

	var iTime = setInterval(function(){
		draw();
	},spped);

	var _obj = obj;
	function draw(){
		var canvas=obj;
		var ctx=canvas.getContext('2d');

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#eff9fd';

		ctx.clearRect(0,0,500,500) // 擦除画布一个区域xy、xy
		ctx.fillStyle="blue"; //定义颜色
		ctx.beginPath(); //从新开始画，防止冲突重叠

		ctx.moveTo(startX,startY);
		ctx.lineTo(end_x,end_y);
		ctx.stroke();

		ctx.closePath(); //结束画布，防止冲突重叠
						
		if(end_x==endX && end_y==endY){
			clearInterval(iTime);
			$('.plan_line_parent p.isLine').addClass('isCorrect').removeClass('isLine');
			if($('.plan_line_parent p').length == $('.plan_line_parent p.isCorrect').length){
				$('.plan_4 .plan_bgn').addClass('isClick');				
			}
			return;
		};

		end_x = end_x+difference_x;
		end_y = end_y+difference_y;

		if((difference_x<0 && end_x<endX) || (difference_x>0 && end_x>endX) || (difference_y>0 && end_y>endY) || (difference_y<0 && end_y<endY)){
			end_x = endX;
			end_y = endY;
			// clearInterval(iTime);
		}
	};
};

/*弹窗*/
function showAlert(text,callback){
	var alert_html = '<div class="win_alert bounceInDown animated">'+
						'<div class="win_box">'+
							'<div class="win_intro">'+
								'<p>'+text+'</p>'+
							'</div>'+
							'<div class="win_btn"></div>'+
						'</div>'+
					'</div>';

	var obj = $(alert_html);

	$('body').append(obj);
	$('.win_alert').show();	

	obj.find('.win_btn').click(function(){
		obj.removeClass('bounceInDown').addClass('bounceOutUp');
		if(typeof callback == "function"){
			callback(obj); 
		}
	});
}

$(function(){

	/*连线题选择Correct*/
	$('.plan_line_parent p').click(function(){
		var parentObj = $(this).parents('.plan_line_parent');
		var siblingObj = parentObj.siblings('.plan_line_parent');

		if(siblingObj.find('.isLine').length > 0){
			var answer1 = $(this).attr('answer');
			var answer2 = siblingObj.find('.isLine').attr('answer');

			if(answer1 == answer2){
				parentObj.find('p').removeClass('isLine');
				$(this).addClass('isLine');	
				//连线;
				setLine();
			}else{
				/*winAlert('选择错误！','determine');*/
				showAlert('选择错误,请重新选择！')
			}
		}else{
			parentObj.find('p').removeClass('isLine');
			$(this).addClass('isLine');			
		}
	});

	/*弹出对话框&文字打印*/
	setTimeout(function(){
		$('.distribute_info').show().addClass('animated').addClass('fadeInSize');
		textShow($('.distribute_info .hide h3'),$('.distribute_info .show h3'),function(){
			textShow($('.distribute_info .hide p').eq(0),$('.distribute_info .show p').eq(0),function(){
				textShow($('.distribute_info .hide p').eq(1),$('.distribute_info .show p').eq(1),function(){
					$('.next_btn').attr('isNext','true');
				});
			});
		});
	},3500);

	/*点击下一步*/
	$('.next_btn').on('click',function(){
		if($(this).attr('isNext') != 'true') return false;
		var introObj = $('.distribute_info .show');
		if(introObj.css('display') != 'none'){
			introObj.fadeOut(function(){
				$('.distribute_info .plan_intro').fadeIn();
			});
		}else{
			$('.distribute_info .plan_intro').fadeOut(function(){
				$('.distribute_info').removeClass('fadeInSize').addClass('fadeOutSize');
				setTimeout(function(){
					peopleMove('-15%',function(){
						$('.plan_1').fadeIn();
					});
				},1000);
			});
		}
	});

	/*步骤一_1确定*/
	$('.plan_1 .plan_bgn').on('click',function(){
		$('.plan_1 table input').removeClass('error');
		var isNull = false;
		var nullObj;
		var errorIndex = [];
		$('.plan_1 table input').each(function(i){
			var answer = $(this).attr('answer');
			var val = $(this).val();

			var str = $(this).val();
			if(str == ''){ isNull = true; nullObj = $(this); return false; }

			if(answer != val){ errorIndex.push(i); }
		});

		if(isNull){
			showAlert('答案不能为空，请完成填空！',function(){
				nullObj.focus();
			});			
			return false;
		};

		if(errorIndex.length > 0){
			showAlert('答案错误，正确答案已标记为红色！');
			var obj = $('.plan_1 table input');

			for(i=0; i<errorIndex.length; i++){
				var _index = errorIndex[i];
				obj.eq(_index).val(obj.eq(_index).attr('answer')).addClass('error');
			}

			return false;			
		}

		$('.plan_1').fadeOut(function(){
			peopleMove('-40%',function(){
				$('.plan_1_2').fadeIn();
			});
		});
	});

	/*步骤一_2确定*/
	$('.plan_1_2 .plan_bgn').on('click',function(){
		$('.plan_1_2 table input').removeClass('error');
		var isNull = false;
		var nullObj;
		var errorIndex = [];
		$('.plan_1_2 table input:not([disabled])').each(function(i){
			var answer = $(this).attr('answer');
			var val = $(this).val();

			var str = $(this).val();
			if(str == ''){ isNull = true; nullObj = $(this); return false; }

			if(answer != val.toUpperCase()){ errorIndex.push(i); }
		});

		if(isNull){
			showAlert('答案不能为空，请完成填空！');
			nullObj.focus();
			return false;
		};

		if(errorIndex.length > 0){
			showAlert('答案错误，正确答案已标记为红色！');
			var _obj = $('.plan_1_2 table input:not([disabled])');	

			for(i=0; i<errorIndex.length; i++){
				var _index = errorIndex[i];
				_obj.eq(_index).val(_obj.eq(_index).attr('answer')).addClass('error');
			}

			return false;			
		}

		$('.plan_1_2').fadeOut(function(){
			peopleMove('-65%',function(){
				$('.plan_2').fadeIn();
			});
		});
	});

	/*步骤二确定*/
	var error = [];
	$('.plan_2 .plan_bgn').on('click',function(){
		$('.plan_2 .bottom .item p i').removeClass('error');
		var isNull = false;
		var nullObj;
		$('.plan_2 .bottom .item p i').each(function(i){
			var str = $(this).html();
			if(str == ''){ isNull = true; return false; }
		});

		if(isNull){
			showAlert('请将答案拖拽至对应的区域内！');
			return false;
		};

		if(error.length > 0){
			console.log(error);

			$.each(error,function(i,item){
				$('.plan_2 .bottom .item p i:contains('+item+')').addClass('error');
			});

			$('.plan_2 .bottom .item').each(function(i){
				var answer = $(this).find('p').eq(0).find('i').attr('answer').split(',');
				//console.log(answer);

				$(this).find('p').each(function(j){
					if(!$(this).find('i').hasClass('error')){
						answer = removeByValue(answer,$(this).find('i').html());
					}
				});
				$(this).find('i.error').each(function(j){
					$(this).html(answer[j]);
				})
			});

			showAlert('答案错误，正确答案已标记为红色！');
			error = [];
			return false;			
		}

		$('.plan_2').fadeOut(function(){
			peopleMove('-90%',function(){
				$('.plan_3').fadeIn();
			});
		});
	});

	/*步骤三确定*/
	$('.plan_3 .plan_bgn').on('click',function(){
		var isNull = true;
		$('.plan_3 label input').each(function(i){
			if($(this).prop('checked')){ isNull = false; return false; }
		});

		if(isNull){
			showAlert('请选择方案！');
			return false;
		};

		$('.plan_3').fadeOut(function(){
			peopleMove('-115%',function(){
				$('.plan_4').fadeIn();
			});
		});
	});

	/*步骤四_1确定*/
	$('.plan_4 .plan_bgn').on('click',function(){
		if(!$(this).hasClass('isClick')){
			showAlert('请完成连线！');
			return false;
		};

		$('.plan_4').fadeOut(function(){
			peopleMove('-140%',function(){
				$('.plan_4_2').fadeIn();
			});
		});
	});

	/*图片拖拽*/
	void function(){
		var source = $('.plan_2 .top span');
		var target = $('.plan_2 .bottom .item p i');
		var sourceBox = document.getElementById('sourceBox');
		var targetBox = document.getElementById('targetBox');
		/*var error = [];*/

		var index = 0,sourceObj,removeObj,isTarget=false;
		//底部流程区块
		$.each(source,function(i,item){
			item.ondragstart = function(){
				// console.log('开始拖拽'+i);
				index = i;	
				sourceObj = $(this);
				isTarget=false;
			}
			item.ondrag = function(ev){
				// console.log('拖拽中'+i);
				// ev.dataTransfer.setData("id",ev.target.id);
			}
			item.ondragend = function(){
				// console.log('拖拽结束'+i);
			}
		});
		//图片区流程步骤
		$.each(target,function(i,item){
			item.ondragenter = function(){
				// console.log('拖动进入目标元素');
			}
			item.ondragover = function(e){
				// console.log('目标元素中拖拽');
				e.preventDefault(); //取消默认事件
			}
			item.ondragleave = function(){
				// console.log('拖动离开目标元素');
			}
			item.ondrop = function(ev){
				$(this).removeClass('error');
				// console.log('拖放');			
				if(isTarget){
					error = removeByValue(error,removeObj.html());
					removeObj.removeClass('selected').html('').attr('draggable','return false');
				}	
				if($(this).hasClass('selected')){
					// console.log('此位已用');
					error = removeByValue(error,$(this).html());
					sourceRemoveObj = $('.plan_2 .top span[step="'+$(this).html()+'"]');
					sourceRemoveObj.removeClass('selected');
					sourceRemoveObj.attr('draggable','true');
				}

				var answer = $(item).attr('answer');
				var answers = answer.split(',');
				var step = sourceObj.attr('step');

				item.className += ' selected';
				item.innerHTML = step;
				item.setAttribute('draggable','true');
				sourceObj.addClass('selected');
				sourceObj.attr('draggable','return false');

				if(answers.indexOf(step) == -1){
					error.push(step);
				};

				isTarget=false;					
			}

			item.ondragstart = function(){
				// console.log('开始拖拽'+i);
				isTarget=true;
				sourceObj = $('.plan_2 .top span[step="'+$(this).html()+'"]');
				removeObj = $(this);
				removeObj.removeClass('error');
			}
		});

		targetBox.ondragover = function(e){
			e.preventDefault(); //取消默认事件
		}
		sourceBox.ondragover = function(e){
			e.preventDefault(); //取消默认事件
		}
		//图片区步骤还原到底部区
		sourceBox.ondrop = function(e){
			var sourceRemoveObj = $('.plan_2 .top span[step="'+removeObj.html()+'"]');
			error = removeByValue(error,removeObj.html());
			removeObj.removeClass('selected').html('').attr('draggable','return false');
			sourceRemoveObj.removeClass('selected');
			sourceRemoveObj.attr('draggable','true');

			isTarget=false;
		}

		//鼠标获得图片区序号-底部区高亮显示相应区块
		target.hover(function(){
			if($(this).hasClass('selected')){
				var indexObj = $('.plan_2 .top span[step="'+$(this).html()+'"]');
				indexObj.addClass('selected2');
			}
		},function(){
			source.removeClass('selected2');
		});
	}();	

	/*输入框获得焦点删除错误标记*/	
	$('.distribute_content').on('focus','input.error',function(){
		$(this).removeClass('error');
	})
	
});

// 完成游戏
$('.plan_bgn_2').click(function () {
	showAlert('游戏完成，返回主界面!','end',function(){
				window.location.href = "index.html";//orderMake=1 释放拣货单制作按钮
			},"false");
});

