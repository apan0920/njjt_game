/*
* @Author: pz
* @Date:   2017-12-04 16:01:50
* @Last Modified by:   pz
* @Last Modified time: 2017-12-04 20:24:22
*/
/*第8关-堆场指位*/

//获取任务列表
function getTaskList(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/container-question!getContainerQuestion.action',
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert('加载失败！'); return; };

			var taskList = data.containerQuestionList;

			$('#taskList').html('');
			$.each(taskList,function(i,item){
				var recordId = item.recordId,
					isDone = item.isDone,
					pulishDate = item.pulishDate,
					remark = item.remark,
					goodsName = item.goodsName,
					goodsParameter = item.goodsParameter;

				var html = '<a href="javascript:;" class="task_item" recordId='+recordId+' goodsName="'+goodsName+'" goodsParameter="'+goodsParameter+'">'+
							'<h3>任务'+(i+1)+'</h3>'+
							'<p>'+remark+'</p>'+
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





//下一步
	$('.btn_next').click(function(){
		if($('.slot_box_item_img1').css('display') == 'block'){
			$('.slot_box_item_img1').fadeOut();
			$('.slot_box_item_img2').fadeIn();
		}else if($('.slot_box_item_img2').css('display') == 'block'){
			if($('.slot_box_item_img2 .slot_item.selected').length<=0){
				showAlert('请先出集装箱所在的堆场区域！','end');
				return;
			};

			$('.slot_box_item_img2').fadeOut();
			$('.slot_box_item_img3').fadeIn();
			$('.btn_3').css('display','none');
			$('.btn_1').css('display','inline-block');
		}else{}
	});


//返回
	$('.btn_back').click(function(){
		if($('.slot_box_item_img3').css('display') == 'block'){
			$('.slot_box_item_img3').fadeOut();
			$('.slot_box_item_img2').fadeIn();
			$('.btn_1').css('display','none');
			$('.btn_3').css('display','inline-block');
			$('.slot_box_item_img3 .slot_item').removeClass('selected');
		}else if($('.slot_box_item_img2').css('display') == 'block'){
			$('.slot_box_item_img2').fadeOut();
			$('.slot_box_item_img1').fadeIn();
			$('.slot_box_item_img2 .slot_item').removeClass('selected');
		}else if($('.slot_box_item_img1').css('display') == 'block'){
			$('.slot_box_item_img1').fadeOut();
			$('.slot_box_item_video').fadeIn();
			$('.btn_3').css('display','none');
			$('.btn_4').show();
		}else{
			window.location.href = 'index.html';
		}
	});



$(function(){

	//限制只能输入数字
	$isNaN();

	/*getTaskList();*/

	//选择任务
	$('.task_list').on('click','a',function(){
		$('.task_list a').removeClass('selected');
		$(this).addClass('selected');

		var taskTitle = $('.task_item.selected').find('h3').html(),
			taskDate = $('.task_item.selected').find('.task_item_date').html(),
			taskDateRemarks = $('.task_item.selected').find('p').html(),
			goodsName = $('.task_item.selected').attr('goodsname'),
			goodsDetails = $('.task_item.selected').attr('goodsparameter');
		$('.task_details_title').html(taskTitle);
		$('.task_details_date').html(taskDate);
		$('.task_details_name').html('货物名称：'+goodsName);
		$('.task_details_goods').html('货物详情：'+goodsDetails);
		$('.task_details_intro').html('备注：'+taskDateRemarks);
		$('.goodsIntro').html(goodsDetails);

		$('.task_content').removeClass('bounceInDown delay_10').addClass('bounceOutUp');

		$('.task_alert_1').removeClass('fadeOut').show().addClass('delay_05 animated').addClass('fadeIn');
		$('.task_alert_people_1').removeClass('delay_02 zoomOutRight').show().addClass('delay_05 animated').addClass('zoomInRight');
		$('.task_alert_main_1').removeClass('rollOut').show().addClass('delay_10 animated').addClass('rollIn');

		$('.task').removeClass('fadeOut').show().addClass('delay_10 animated').addClass('fadeIn');
	});

	//取消-返回任务选择
	$('.task_alert_1 .cancel').click(function(){
		$('.task').removeClass('delay_10 fadeIn').addClass('fadeOut');
		$('#task').removeClass('selected');
		$('.task_details').removeClass('lightSpeedIn lightSpeedOut').hide();	

		$('.task_alert_main_1').removeClass('rollIn delay_10').addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_1').removeClass('fadeIn').addClass('fadeOut');

		$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');

		setTimeout(function(){
			$('.task,.task_alert_main_1,.task_alert_people_1,.task_alert_1').hide();
		},1500);
	});

	//确定-开始游戏
	$('.task_alert_1 .determine').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_10').addClass('rollOut');
		$('.task_alert_main_2').removeClass('rollOut').show().addClass('animated').addClass('rollIn');
		$('.isSuit em i').removeClass('selected');

		setTimeout(function(){
			$('.task_alert_main_1').removeClass('rollOut').hide();
		},1500);
	});


	/***********************************************************************/

	//选择
	$('.yf_item').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}else{	
			$(this).parents('.yf_list').find('.yf_item').removeClass('selected');
			$(this).addClass('selected');
		}
	});

});