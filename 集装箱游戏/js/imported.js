
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
function sortNumber(a,b) { 
	return a - b 
} 

// 从数组中取出随机个元素（不重复）；
function arrRand(source,num){
 	var _arr = source;
    var sL = source.length;
    var _num = num;
    if (num==''||num=='undefined'||num==null||num==undefined){
    	_num = sL;
    }

    var target= [];   //存储下标

    //随机num个数组下标
    for(var i = 0; i < _num; i++){
        var rand = Math.floor( Math.random() * sL );
        if(target.length > 0){
            detection(target, rand);
        }else{
            target.push(rand);
        }
    };

    //检测num是否存在于arr，存在重新添加，不存在直接添加
    function detection(arr, randNum){
        var repeatFlag = false;
        for(var j = 0; j < arr.length; j++){
            if(arr[j] == randNum){
                repeatFlag = true;
            }
        }
        if(repeatFlag){
            //递归
            arguments.callee(arr, Math.floor( Math.random() * sL ));
        }else{
            arr.push(randNum);
        }
    };

    // 测试,输出target
    var newArr = [];
    for(var i=0; i<target.length; i++){
    	newArr.push(_arr[target[i]]);
    }
    return newArr;
};


$(function(){

	var row = [
		' <span draggable="true" step="1"><i></i><em>委托代理</em></span> ',
		' <span draggable="true" step="2"><i></i><em>卸船准备</em></span> ',
		' <span draggable="true" step="3"><i></i><em>集装箱卸船</em></span> ',
		' <span draggable="true" step="4"><i></i><em>集装箱理箱</em></span> ',
		' <span draggable="true" step="5"><i></i><em>付款赎单</em></span> ',
		' <span draggable="true" step="6"><i></i><em>换取提货单</em></span> ',
		' <span draggable="true" step="7"><i></i><em>进口报检</em></span> ',
		' <span draggable="true" step="8"><i></i><em>进口报关</em></span> ',
		' <span draggable="true" step="9"><i></i><em>集装箱交接</em></span> ',
		' <span draggable="true" step="10"><i></i><em>集装箱拆箱</em></span> ',
		' <span draggable="true" step="11"><i></i><em>空箱回运</em></span> ',
		' <span draggable="true" step="12"><i></i><em>投保索赔</em></span> '
	];

	$('#sourceBox').html('');
	$.each(arrRand(row),function(i,item){
		$('#sourceBox').append(item);
	});
	$('#sourceBox span').each(function(i){
		$(this).find('i').html(i+1);
	});

	var source = $('.export_item span');
	var target = $('.export_target span');
	var sourceBox = document.getElementById('sourceBox');
	var targetBox = document.getElementById('targetBox');
	var error = [];

	var index = 0,removeObj,isTarget=false;
	//底部流程区块
	$.each(source,function(i,item){
		item.ondragstart = function(){
			// console.log('开始拖拽'+i);
			index = i;	
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
			// console.log('拖放');
			
			if(isTarget){
				error = removeByValue(error,removeObj.html()*1);
				removeObj.removeClass('selected').html('').attr('draggable','return false');
			}	
			if($(this).hasClass('selected')){
				// console.log('此位已用');
				error = removeByValue(error,$(this).html()*1);
				var _index = $(this).html()*1-1;
				source.eq(_index).removeClass('selected');
				source.eq(_index).attr('draggable','true');
			}

			item.className += ' selected';
			item.innerHTML = index+1;
			item.setAttribute('draggable','true');
			source.eq(index).addClass('selected');
			source.eq(index).attr('draggable','return false');

			var answer = $(item).attr('answer');
			var answers = answer.split(',');
			var step = source.eq(index).attr('step');
			if(answers.indexOf(step) == -1){
				// if(answer!=step){
				error.push(step);
			};

			isTarget=false;					
		}

		item.ondragstart = function(){
			// console.log('开始拖拽'+i);
			isTarget=true;
			index = $(this).html()*1-1;	
			removeObj = $(this);
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
		error = removeByValue(error,removeObj.html()*1);
		removeObj.removeClass('selected').html('').attr('draggable','return false');
		source.eq(index).removeClass('selected');
		source.eq(index).attr('draggable','true');

		isTarget=false;
	}

	//鼠标获得图片区序号-底部区高亮显示相应区块
	target.hover(function(){
		if($(this).hasClass('selected')){
			var _index = $(this).html()*1-1;
			source.eq(_index).addClass('selected2');
		}
	},function(){
		source.removeClass('selected2');
	});

	//提交
	$('.btn_1').click(function(){
		var _obj = $('.export_target span').length;
		var _obj_selected = $('.export_target span.selected').length;
		if(_obj!=_obj_selected){
			showAlert('请先完成匹配！','end');
			return;
		}
		if(error.length<=0){
			showAlert('恭喜您！全部答对。','end',function(obj){
				obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
				obj.removeClass('fadeIn').addClass('fadeOut');

				$('.imported_content').removeClass('bounceInDown').addClass('delay_05').addClass('bounceOutUp');
				setTimeout(function(){
					obj.remove();
					window.location.href = 'index.html';
				},1300);
			});
		}else{
			var len = error.length;
			error = error.sort(sortNumber);
			var str = error.join("、");
			showAlert('很遗憾你未通关！您答错'+len+'处，分别是序号'+str+'。','end',function(obj){

				obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
				obj.removeClass('fadeIn').addClass('fadeOut');
				setTimeout(function(){
					obj.remove();
				},500);

				$('.export_item span').removeClass('selected').attr('draggable','true');
				$('.export_target span').removeClass('selected').attr('draggable','return false').html('');
				error = [];
			});
		}
	});

})