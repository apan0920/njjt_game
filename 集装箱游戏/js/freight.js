
//获取任务列表
function getTaskList(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/fare-task!getFareTask.action',
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert_2(data.message); return; };

			var fareTaskList = data.fareTaskList;

			$('#taskList').html('');
			$.each(fareTaskList,function(i,item){
				var fareTaskId = item.fareTaskId,
					isRight = item.isRight,
					pulishDate = item.pulishDate,
					remark = item.remark;

				var html = '<a href="javascript:;" class="task_item" fareTaskId='+fareTaskId+'>'+
							'<h3>任务'+(i+1)+'</h3>'+
							'<p class="task_item_content" title="'+remark+'">'+remark+'</p>'+
							'<div class="task_item_right">'+
								'<span class="task_item_date">发布时间：'+pulishDate+'</span>'+
								'<span class="task_item_state"></span>'+
							'</div>'+
						'</a>';
				var _obj = $(html);
				if(isRight == 1){ _obj.addClass('isShow'); }

				$('#taskList').append(_obj);
			});

			//滚动条
			$(".task_list").mCustomScrollbar();
		},
		error: function(){}
	});
};

//获取货物信息接口：（任务详情）
function getRouteList(){
	var fareTaskId = $('#taskList a.selected').attr('fareTaskId');

	$.ajax({
		url: ajaxUrl + 'inter/fare-task!getGoodsInfo.action',
		type: 'post',
		dataType: 'json',
		data: { fareTaskId:fareTaskId },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert_2(data.message); return; };

			var endingPort = data.goodsInfo.endingPort;
			$('#taskPort').html('诺先生委托A货代公司出口一批货物从上海至'+endingPort+'。');

			var goodsName = data.goodsInfo.goodsName,
				goodsWeight = data.goodsInfo.goodsWeight,
				goodsVolume = data.goodsInfo.goodsVolume,
				goodsNum = data.goodsInfo.goodsNum;

			$('#goodsName').html(goodsName);
			$('#goodsWeight').html(goodsWeight);
			$('#goodsVolume').html(goodsVolume);
			$('#goodsNum').html(goodsNum);

			//附加费列表
			$('#surchargeInfoList').html('');
			var surchargeInfoList = data.goodsInfo.surchargeInfoList;
			$.each(surchargeInfoList,function(i,item){
				var recordId = item.recordId,
					surcharge = item.surcharge,
					cost = item.cost,
					costUnit = item.costUnit,
					chargeMethods = item.chargeMethods;
				var html = '<tr recordId='+recordId+'>'+
								'<td>'+surcharge+'</td>'+
								'<td>'+cost+'</td>'+
								'<td>'+costUnit+'</td>'+
								'<td>'+chargeMethods+'</td>'+
								'<td><input type="text" class="isNaN totalCost"></td>'+
							'</tr>';

				$('#surchargeInfoList').append(html);

			});

			$('.task').fadeIn();
			$('.task_details_title').html($('.task_item.selected').find('h3').html());
			$('.task_details_date').html($('.task_item.selected').find('.task_item_date').html());
			$('.task_details_start').html('起始港：上海');
			$('.task_details_end').html('目的港：'+endingPort);
			$('.task_details_intro').html('备注：'+$('.task_item.selected').find('p').html());	

			//滚动条
			$(".task_freight_scroll").mCustomScrollbar();

		},
		error: function(){}
	});
};

//提交运费计算
function submitRoute(){
	if($('#submitRoute').attr('isSubmit') == 'false'){ return; };
	$('#submitRoute').attr('isSubmit','false');

	var ucode = get_address('ucode'),
		fareTaskId = $('#taskList a.selected').attr('fareTaskId'),
		answerInfo = '';

	var isClick = true;
	var baseFare = $('#baseFare').val(),
		chargingTons = $('#chargingTons').val(),
		price = $('#price').val(),
		totalSurchargeDollar = $('#totalSurchargeDollar').val(),
		totalSurchargeYuan = $('#totalSurchargeYuan').val(),
		totalFareDollar = $('#totalFareDollar').val(),
		totalFareYuan = $('#totalFareYuan').val();
	var surchargeInfoList = [];
	$('#surchargeInfoList tr').each(function(){
		if($(this).find('.totalCost').val() == ''){
			isClick = false;
		};
		var surcharge = {
			'recordId': $(this).attr('recordId'),
			'totalCost': $(this).find('.totalCost').val()
		};
		surchargeInfoList.push(surcharge);
	});

	if(baseFare==''||chargingTons==''||price==''||totalSurchargeDollar==''||totalSurchargeYuan==''||totalFareDollar==''||totalFareYuan==''){
		isClick = false;
	};
	if(!isClick){ showAlert_2('请先完善运费计算！'); $('#submitRoute').attr('isSubmit','true'); return; }
	answerInfo = {
		baseFare: baseFare,
		chargingTons: chargingTons,
		price: price,
		surchargeInfoList: surchargeInfoList,
		totalSurchargeDollar: totalSurchargeDollar,
		totalSurchargeYuan: totalSurchargeYuan,
		totalFareDollar: totalFareDollar,
		totalFareYuan: totalFareYuan
	};

	var answer = {
		ucode:ucode,
		fareTaskId:fareTaskId,
		answerInfo:answerInfo
	};

	console.log(JSON.stringify(answer));

	$.ajax({
		url: ajaxUrl + 'inter/fare-task!grade.action',
		type: 'post',
		dataType: 'json',
		data: { answer: JSON.stringify(answer) },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert_2(data.message); return; };

			var message = data.message; // 'T'答对；‘F’错;

			if(message == 'T'){
				$('.freight_alert_box_1').removeClass('f').addClass('t');
			}else if(message == 'F'){
				$('.freight_alert_box_1').removeClass('t').addClass('f');
			}else{};

			$('.freight_alert_1').fadeIn();
			$('.freight_alert_box_1').addClass('animated').addClass('jackInTheBox');

			$('#submitRoute').attr('isSubmit','true');
		},
		error: function(){ $('#submitRoute').attr('isSubmit','true'); }
	});
};

$(function(){

	//限制只能输入数字
	$isNaN();

	//滚动条
	$('.task_freight_table_content').mCustomScrollbar();

	getTaskList();

	//选择任务
	$('.task_list').on('click','a',function(){
		$('.task_list a').removeClass('selected');
		$(this).addClass('selected');

		getRouteList();

		$('.task_content').removeClass('bounceInDown delay_10').addClass('bounceOutUp');
		$('body').addClass('transition_2').addClass('freight');

		$('.task_alert_1').removeClass('fadeOut').addClass('delay_05 animated').show().addClass('fadeIn');
		$('.task_alert_people_1').removeClass('zoomOutRight').addClass('delay_05 animated').show().addClass('zoomInRight');
		$('.task_alert_main_1').removeClass('rollOut').addClass('delay_10 animated').css('display','table').addClass('rollIn');
	});

	//取消-返回任务选择
	$('.task_alert_1 .cancel').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_10').addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');

		$('.task_alert_1').removeClass('fadeIn').addClass('fadeOut');

		$('body').removeClass('freight');
		$('.task_details,.task').fadeOut();	
		$('#task').removeClass('selected');
		$('.task_details').removeClass('lightSpeedIn');	

		$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');
		setTimeout(function(){
			$('.task_alert_1,.task_alert_1,.task_alert_people_1,.task_alert_main_1').hide();
		},1800);
	});

	//确定-开始游戏
	$('.task_alert_1 .determine').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_10').addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_1').removeClass('fadeIn').addClass('fadeOut');

		$('.route_content').show().addClass('animated delay_10').addClass('bounceInDown');

		setTimeout(function(){
			$('.task_alert_1').hide();
		},1500);
	});

	// 返回任务列表
	$('.freight_btn2').click(function(){
		$('.route_content').removeClass('bounceInDown delay_10').addClass('bounceOutUp');
		$('body').removeClass('freight');
		$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');
		$('.task_details,.task').fadeOut();	
		$('#task').removeClass('selected');
		$('.task_details').removeClass('lightSpeedIn');		

		setTimeout(function(){
			$('.route_content').removeClass('bounceOutUp').hide();
		},1800);
	});

	//确定-进入答题页;
	$('.freight_btn1').click(function(){
		$('.task_freight_2').removeClass('fadeIn fadeOut delay_05').show().addClass('animated_05').addClass('fadeIn');
		$('.task_freight_people').removeClass('delay_05 fadeOutLeftBig').addClass('animated_05').addClass('fadeInLeftBig');
		$('.task_freight_form').show().addClass('animated_05 delay_05').addClass('rotateInUpLeft');

		$('#baseFare').val(''),
		$('#chargingTons').val(''),
		$('#price').val(''),
		$('#totalSurchargeDollar').val(''),
		$('#totalSurchargeYuan').val(''),
		$('#totalFareDollar').val(''),
		$('#totalFareYuan').val('');
	});

	//取消-退出答题页;
	$('.freight_btn4').click(function(){
		$('.task_freight_form').removeClass('rotateInUpLeft delay_05').addClass('rotateOutDownLeft');
		$('.task_freight_people').removeClass('fadeInLeftBig').addClass('delay_05').addClass('fadeOutLeftBig');
		$('.task_freight_2').removeClass('fadeIn').addClass('delay_05').addClass('fadeOut');
		setTimeout(function(){
			$('.task_freight_form,.task_freight_form,.task_freight_2').removeClass('rotateOutDownLeft fadeOutLeftBig').hide();			
		},1000);
	});

	//查看海运运价本
	$('#see').click(function(){
		$('.task_freight_table').fadeIn();
	});

	//确定-关闭海运运价本 &　提交答案;
	$('.freight_btn3').click(function(){
		if($(this).parents('.task_freight_table').length>0){
			//关闭海运运价本
			$('.task_freight_table').fadeOut();
		}else{
			//提交答案
			submitRoute();
		}
	});

	//提交完成提示确定
	$('#freight_alert_Btn').click(function(){
		$('.freight_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
		$('.freight_alert').fadeOut();

		$('.task_freight_form').removeClass('rotateInUpLeft delay_08').addClass('delay_05').addClass('rotateOutDownLeft');
		$('.task_freight_people').removeClass('fadeInLeftBig').addClass('delay_10').addClass('fadeOutLeftBig');
		$('.task_freight_2').removeClass('fadeIn').addClass('delay_10').addClass('fadeOut');
		
		$('.route_content').removeClass('bounceInDown').addClass('bounceOutUp');
		$('body').removeClass('freight');
		$('.task_content').removeClass('bounceOutUp').addClass('delay_20').addClass('bounceInDown');

		$('.task_details,.task').fadeOut();	
		$('#task').removeClass('selected');
		$('.task_details').removeClass('lightSpeedIn');		

		getTaskList();

		setTimeout(function(){
			$('.freight_alert_box').removeClass('zoomOut');

			$('.task_freight_form,.task_freight_form,.task_freight_2').removeClass('delay_05 rotateOutDownLeft fadeOutLeftBig').hide();
			$('.task_freight_2').removeClass('fadeIn fadeOut delay_10');
			$('.task_freight_people').removeClass('delay_10 fadeOutLeftBig');

			$('.route_content').removeClass('bounceOutUp delay_13').hide();
			$('.task_content').removeClass('delay_20');
		},2500);
	});
});