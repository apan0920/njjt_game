
//两点连线
function setLine(){

	var start = $('.task_port.start');
	var end = $('.task_port.end');
	var start_y = start.position().top*1 + (start.width()/2),
		start_x = start.position().left*1 + (start.width()/2),
		end_y = end.position().top*1 + (end.width()/2),
		end_x = end.position().left*1 + (end.width()/2);

	var node = document.createElement('canvas');  
    node.id = 'myCanvas';
    document.getElementById('task_map').appendChild(node);
    line(start_x,start_y,end_x,end_y);
};
//画线
function line(startX,startY,endX,endY){

	var difference = 0;
	var moveTime = 300,
		spped = 15;
	var difference_x = 1,
		difference_y = 1;
	difference = Math.max(Math.abs(endX-startX),Math.abs(endY-startY));
	// if(Math.abs(endX-startX)>Math.abs(endY-startY)){
	// 	// difference_y = Math.abs(endY-startY)/Math.abs(endX-startX);
	// }else if(Math.abs(endX-startX)<Math.abs(endY-startY)){
	// 	// difference_x = Math.abs(endX-startX)/Math.abs(endY-startY);
	// };
	difference_x = Math.abs(endX-startX)/(moveTime/spped);
	difference_y = Math.abs(endY-startY)/(moveTime/spped);

	difference_x = endX>startX ? difference_x : -difference_x;
	difference_y = endY>startY ? difference_y : -difference_y;

	var end_x = startX,
		end_y = startY;

	var iTime = setInterval(function(){
		draw();
	},spped);

	function draw(){
		var canvas=document.getElementById('myCanvas');
		var ctx=canvas.getContext('2d');

		canvas.width=document.getElementById('task_map').offsetWidth;
        canvas.height=document.getElementById('task_map').offsetHeight;

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#000';

		ctx.clearRect(0,0,500,500) // 擦除画布一个区域xy、xy
		ctx.fillStyle="blue"; //定义颜色
		ctx.beginPath(); //从新开始画，防止冲突重叠

		ctx.moveTo(startX,startY);
		ctx.lineTo(end_x,end_y);
		ctx.stroke();

		ctx.closePath(); //结束画布，防止冲突重叠
						
		if(end_x==endX && end_y==endY){
			clearInterval(iTime);
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

//获取任务列表
function getTaskList(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/task!getTask.action',
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert(data.message); return; };

			var taskList = data.taskList;

			$('#taskList').html('');
			$.each(taskList,function(i,item){
				var taskId = item.taskId,
					remark = item.remark,
					pulishDate = item.pulishDate,
					isDone = item.isDone,
					startingPort = item.startingPort,
					endingPort = item.endingPort;
				var taskTitle = startingPort + '至' + endingPort;

				var html = '<a href="javascript:;" class="task_item" taskId='+taskId+' startingPort='+startingPort+' endingPort='+endingPort+'>'+
							'<h3>任务'+(i+1)+'</h3>'+
							'<p class="task_item_content" title="'+remark+'">'+remark+'</p>'+
							'<div class="task_item_right">'+
								'<span class="task_item_date">发布时间：'+pulishDate+'</span>'+
								'<span class="task_item_state"></span>'+
							'</div>'+
						'</a>';
				var _obj = $(html);
				if(isDone == 1){ _obj.addClass('isShow'); }

				$('#taskList').append(_obj);
			});

			//滚动条
			$(".task_list").mCustomScrollbar();
		},
		error: function(){}
	});
};

//获取航班列表
function getRouteList(){
	var endingPort = $('#taskList a.selected').attr('endingport');

	$.ajax({
		url: ajaxUrl + 'inter/task!getRouteDetail.action',
		type: 'post',
		dataType: 'json',
		data: { endingPort:endingPort },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert(data.message); return; };

			var routeDetailList = data.routeDetailList;

			$('#route').html('');
			$.each(routeDetailList,function(i,item){
				var recordId = item.recordId,
					vessel = item.vessel,
					voyage = item.voyage,
					operator = item.operator,
					startingTime = item.startingTime,
					startingPort = item.startingPort,
					endingTime = item.endingTime,
					endingPort = item.endingPort;

				var html = '<tr recordId='+recordId+'>'+
							'<td><span>'+vessel+'</span></td>'+
							'<td><span>'+voyage+'</span></td>'+
							'<td><span>'+operator+'</span></td>'+
							'<td><span>'+startingPort+'</span></td>'+
							'<td><span>'+startingTime+'</span></td>'+
							'<td><span>'+endingPort+'</span></td>'+
							'<td><span>'+endingTime+'</span></td>'+
							'<td class="last"><i class="ico"></i></td>'+
						'</tr>';

				$('#route').append(html);
			});

			//滚动条
			$("#route").mCustomScrollbar();

		},
		error: function(){}
	});
};

//提交航线
function submitRoute(){

	if($('#routeBtn').attr('isSubmit') == 'true'){ return; }
	$('#routeBtn').attr('isSubmit','true');

	var len = $('#route tr.selected').length;
	if(len<=0){ 
		showAlert('请先选择航线！','end'); 
		return; 
	}

	var ucode = get_address('ucode'),
		taskId = $('.task_item.selected').attr('taskid'),
		routeDetailId = $('#route tr.selected').attr('recordid'),
		startTime = get_address('startTime'),
		endTime = getNowFormatDate();

	$.ajax({
		url: ajaxUrl + 'inter/student-grade!grade.action',
		type: 'post',
		dataType: 'json',
		data: { ucode:ucode ,taskId:taskId ,routeDetailId:routeDetailId ,startTime:startTime ,endTime:endTime },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert(data.message); return; };

			$('#routeBtn').attr('isSubmit','false');

			getTaskList();
			var message = data.message;
			if(message == 'T'){
				showAlert('恭喜你！回答正确。游戏通过。','end',function(obj){
					obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
					obj.removeClass('fadeIn').addClass('fadeOut');
					setTimeout(function(){
						obj.hide();
					},500);

					$('.route_content').removeClass('delay_13 bounceInDown').addClass('delay_03').addClass('bounceOutUp');
					$('.task_map').removeClass('zoomIn delay_05').addClass('delay_10').addClass('zoomOut');
					$('body').removeClass('map');
					$('.task_details').hide();
					$('#task').removeClass('selected');
					$('.task_content').removeClass('bounceOutUp').addClass('delay_12').addClass('bounceInDown');

					setTimeout(function(){
						$('#myCanvas').remove();
						$('.task_port.start').removeClass('start');
						$('.task_port.end').removeClass('end');
						$('.task_alert_1,.task_map,.task_alert_1,.task_alert_people_1,.task_alert_main_1,.task_port').hide();

						$('.route_content').removeClass('bounceOutUp delay_03').hide();
						$('.task_map').removeClass('zoomOut delay_10');
						$('.task_content').removeClass('bounceInDown delay_12');
						$('.task_port[endingport]').removeAttr('state');
					},1800);
				});
			}else{
				showAlert('很遗憾！回答错误。游戏结束。','end',function(obj){
					obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
					obj.removeClass('fadeIn').addClass('fadeOut');
					setTimeout(function(){
						obj.hide();
					},500);

					$('.route_content').removeClass('delay_13 bounceInDown').addClass('delay_03').addClass('bounceOutUp');
					$('.task_map').removeClass('zoomIn delay_05').addClass('delay_10').addClass('zoomOut');
					$('body').removeClass('map');
					$('.task_details').hide();
					$('#task').removeClass('selected');
					$('.task_content').removeClass('bounceOutUp').addClass('delay_12').addClass('bounceInDown');

					setTimeout(function(){
						$('#myCanvas').remove();
						$('.task_port.start').removeClass('start');
						$('.task_port.end').removeClass('end');
						$('.task_alert_1,.task_map,.task_alert_1,.task_alert_people_1,.task_alert_main_1,.task_port').hide();

						$('.route_content').removeClass('bounceOutUp delay_03').hide();
						$('.task_map').removeClass('zoomOut delay_10');
						$('.task_content').removeClass('bounceInDown delay_12');
						$('.task_port[endingport]').removeAttr('state');
					},1800);
				});
			}
		},
		error: function(){$('#routeBtn').attr('isSubmit','false');}
	});
};

$(function(){

	getTaskList();

	//选择任务
	$('.task_list').on('click','a',function(){
		set_address('startTime',getNowFormatDate());
		$('.task_list a').removeClass('selected');
		$(this).addClass('selected');

		var startingport = $(this).attr('startingport'),
			endingport = $(this).attr('endingport');
		$('#taskPort').html('我有一批货物需要从'+startingport+'运至'+endingport+'，你能帮我在地图上找到这两个港口的位置吗？');
		$('.task_details_title').html($(this).find('h3').html());
		$('.task_details_date').html($(this).find('.task_item_date').html());
		$('.task_details_start').html('起航港口：'+startingport);
		$('.task_details_end').html('目的港口：'+endingport);
		$('.task_details_intro').html('备注：'+$(this).find('p').html());
		$('.task_port[endingport]').removeAttr('state');
		$('.task_port[endingport="'+endingport+'"]').attr('state','end');

		$('.task_content').removeClass('bounceInDown delay_12').addClass('bounceOutUp');

		// $('.task_map').removeClass('zoomOut delay_10').show().addClass('delay_05 animated').addClass('flipInX');
		$('.task_map').removeClass('zoomOut delay_10').show().addClass('delay_05 animated').addClass('zoomIn');
		$('body').addClass('transition_2').addClass('map');

		$('.task_alert_1').removeClass('fadeOut').addClass('delay_10 animated').show().addClass('fadeIn');
		$('.task_alert_people_1').removeClass('zoomOutRight').addClass('delay_10 animated').show().addClass('zoomInRight');

		$('.task_alert_main_1').removeClass('rollOut').addClass('delay_15 animated').show().addClass('rollIn');
	});

	//确定-开始游戏
	$('.task_alert_1 .determine').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_15').addClass('rollOut');

		$('.task_alert_people_1').removeClass('zoomInRight delay_10').addClass('delay_02').addClass('zoomOutRight');

		$('.task_alert_1').removeClass('fadeIn').addClass('fadeOut');

		$('.task_port').show().addClass('animated delay_10').addClass('zoomIn');
		setTimeout(function(){
			$('.task_alert_1').hide();
		},1500);
	});

	//取消-返回任务选择
	$('.task_alert_1 .cancel').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_15').addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_10').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_1').removeClass('fadeIn').addClass('fadeOut');

		$('.task_map').removeClass('zoomIn delay_05').addClass('delay_10').addClass('zoomOut');
		$('body').removeClass('map');
		$('.task_details').hide();
		$('#task').removeClass('selected');

		$('.task_content').removeClass('bounceOutUp').addClass('delay_12').addClass('bounceInDown');
		setTimeout(function(){
			$('.task_port[endingport]').removeAttr('state');
			$('.task_alert_1,.task_map,.task_alert_1,.task_alert_people_1,.task_alert_main_1').hide();
		},1800);
	});

	//选中港口
	$('.task_port').click(function(){
		var startLen = $('.task_port.start').length,
			endLen = $('.task_port.end').length;
		if(startLen<=0){
			if($(this).attr('state') != 'start'){
				showAlert('这不是我准备出发的港口','end');
			}else{
				$(this).addClass('start');
			}
		}else{
			if($(this).attr('state') != 'end'){
				showAlert('这不是我的目的地','end');
			}else{
				//showAlert('太棒了，谢谢你!');
				$(this).addClass('end');
				setLine();

				var taskIntro = $('#taskList a.selected p').html();
				$('#taskIntro').html('太棒了，谢谢你！这批货物需要满足以下条件（'+taskIntro+'），你能帮我找到合适的航线和船吗？')
				
				$('.task_alert_3').show().addClass('animated delay_05').addClass('fadeIn');
				$('.task_alert_people_3').show().addClass('animated delay_05').addClass('zoomInRight');

				$('.task_alert_main_3').show().addClass('animated delay_10').addClass('rollIn');
			}
		};
	});

	//确定-打开航线列表
	$('.task_alert_3 .determine').click(function(){
		getRouteList();

		$('.task_alert_main_3').removeClass('rollIn delay_10').addClass('rollOut');

		$('.task_alert_people_3').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_3').removeClass('fadeIn delay_05').addClass('delay_08').addClass('fadeOut');

		// setTimeout(function(){
		// 	$('.task_alert_3').hide();
		// },1500);

		$('.route_content').show().addClass('animated delay_13').addClass('bounceInDown');

		setTimeout(function(){
			$('.task_alert_3').removeClass('fadeOut animated delay_08').hide();
			$('.task_alert_people_3').removeClass('zoomOutRight animated delay_02').hide();
			$('.task_alert_main_3').removeClass('animated rollOut').hide();
		},1500);
	});

	//选择-航线
	$('#route').on('click','tr',function(){
		$('#route tr').removeClass('selected');
		$(this).addClass('selected');
	});

	//提交航线列表
	$('#routeBtn').click(function(){
		submitRoute();
	});

});