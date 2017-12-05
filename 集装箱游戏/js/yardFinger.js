/*
* @Author: pz
* @Date:   2017-12-04 16:01:50
* @Last Modified by:   pz
* @Last Modified time: 2017-12-05 20:02:52
*/
/*第8关-堆场指位*/

//获取任务列表
function getTaskList(){
	console.log("getTaskList()");
	/*var ucode = get_address('ucode');*/
	var ucode = 's001';  /*测试帐号*--20171205pz*/
	$.ajax({
		url: ajaxUrl + 'inter/yard-task!getTask.action',
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert('加载失败！'); return; };

			var taskList = data.taskList;

			$('#taskList').html('');
			$.each(taskList,function(i,item){
				console.log("pz调试==数据==="+item);
				var taskId = item.taskId,
					content = item.content,//任务内容
					business = item.business,//业务（放箱/提箱）
					containerType = item.containerType,//集装箱类型（冷藏箱、危险品箱、空箱区、进口箱、出口箱）
					section = item.section,//区位
					belt = item.belt,//贝位
					yfColumn = item.column,//列
					yfFloor = item.floor,//层
					cyNo = section + belt + yfColumn + yfFloor,//堆场箱位号=区+贝+列+层
					isRight = item.isRight,//是否答对
					pulishDate = item.pulishDate;//发布时间
					console.log('content=='+content);

				var html = '<a href="javascript:;" class="task_item" recordId="'+taskId+'" business="'+business+'" containerType="'+ containerType +'" cyNo="'+cyNo+'" section="'+ section +'" belt="'+ belt +'" yfColumn="'+ yfColumn +'" yfFloor="'+ yfFloor +'" >'+
							'<h3>任务'+(i+1)+'</h3>'+
							'<p>'+content+'</p>'+
							'<div class="task_item_right">'+
								'<span class="task_item_date">发布时间：'+pulishDate+'</span>'+
								'<span class="task_item_state"></span>'+
							'</div>'+
						'</a>';
				var _obj = $(html);
				if(isRight == 1){
				 _obj.addClass('isShow'); 
				}
				$('#taskList').append(_obj);
			});
			//滚动条
			$(".task_list").mCustomScrollbar();
		},
		error: function(){}
	});
};

//选择列&层-提示
$('.yf_prompt').click(function(){
	$('.yf_box_item_img3 .yf_box_intro').stop();
	$('.yf_box_item_img3 .yf_box_intro').slideToggle();
	return false;
});
$('.yf_box_item_img3').click(function(){
	$('.yf_box_item_img3 .yf_box_intro').stop();
	$('.yf_box_item_img3 .yf_box_intro').slideUp();
});

//下一步
	$('.btn_next').click(function(){
		if($('.yf_box_item_img1').css('display') == 'block'){//选择区位
			if($('.yf_box_item_img1 .yf_item.selected').length<=0){
				showAlert('请选出集装箱所在的堆场区位！','end');
				return;
			};
			var section = $('.task_item.selected').attr('section');//任务中区位编号
			var number = $('.yf_box_item_img1 .yf_item.selected').attr("number");//选择的区位编号
			if (number != section ) {
				showAlert('请选出正确的堆场区位！','end');
				return;
			}
			$('.yf_box_item_img1').fadeOut();
			$('.yf_box_item_img2').fadeIn();
		}else if($('.yf_box_item_img2').css('display') == 'block'){
			if($('.yf_box_item_img2 .yf_item.selected').length<=0){
				showAlert('请选出集装箱所在的堆场贝位！','end');
				return;
			};

			$('.yf_box_item_img2').fadeOut();
			$('.yf_box_item_img3').fadeIn();
			$('.btn_3').css('display','none');
			$('.btn_1').css('display','inline-block');
		}else{}
	});


//返回
	$('.btn_back').click(function(){
		if($('.yf_box_item_img3').css('display') == 'block'){
			$('.yf_box_item_img3').fadeOut();
			$('.yf_box_item_img2').fadeIn();
			$('.btn_sub').css('display','none');
			$('.btn_next').css('display','inline-block');
			$('.yf_box_item_img3 .yf_item').removeClass('selected');
		}else if($('.yf_box_item_img2').css('display') == 'block'){
			$('.yf_box_item_img2').fadeOut();
			$('.yf_box_item_img1').fadeIn();
			$('.yf_box_item_img2 .yf_item').removeClass('selected');
		}else if($('.yf_box_item_img1').css('display') == 'block'){
			$('.yf_box_item_img1').fadeOut();
			/*返回帮助信息界面--任务说明*/
			$('.task_alert_1').removeClass('fadeOut').show().addClass('delay_05 animated').addClass('fadeIn');
			$('.task_alert_people_1').removeClass('delay_02 zoomOutRight').show().addClass('delay_05 animated').addClass('zoomInRight');
			$('.task_alert_main_1').removeClass('rollOut').show().addClass('delay_10 rollIn');

			$('.cancle').show();
			$('#yfContent').hide();


		}else{
			window.location.href = 'index.html';
		}
	});



$(function(){

	//限制只能输入数字
	$isNaN();

	getTaskList();

	//选择任务
	$('.task_list').on('click','a',function(){
		$('.task_list a').removeClass('selected');
		$(this).addClass('selected');

		var taskTitle = $('.task_item.selected').find('h3').html(),
			taskDate = $('.task_item.selected').find('.task_item_date').html(),
			content = $('.task_item.selected').find('p').html();
			business = $('.task_item.selected').attr('business'),
			containerType = $('.task_item.selected').attr('containerType');
			cyNo = $('.task_item.selected').attr('cyNo');

		$('.task_details_title').html(taskTitle);
		$('.task_details_date').html(taskDate)
		$('.task_details_cyNo').html('场箱位号：'+cyNo)
		$('.task_details_business').html('业务类型：'+business)
		$('.task_details_containerType').html('区位类型：'+containerType)
		$('.task_details_content').html('任务内容：'+content);

		$('.task_content').removeClass('bounceInDown delay_10').addClass('bounceOutUp');

		$('#taskDetail').html('任务内容：' + content);
		$('.task_alert_1').removeClass('fadeOut').show().addClass('delay_05 animated').addClass('fadeIn');
		$('.task_alert_people_1').removeClass('delay_02 zoomOutRight').show().addClass('delay_05 animated').addClass('zoomInRight');
		$('.task_alert_main_1').removeClass('rollOut').addClass('delay_10 animated').show().addClass('rollIn');

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
			$('.task,.task_alert_people_1,.task_alert_1').hide();
		},1500);
	});

	//确定-开始游戏
	$('#determine').click(function(){
		$('.task_alert_main_1').removeClass('rollIn delay_10').show().addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_1').removeClass('delay_05 fadeIn').addClass('delay_05').addClass('fadeOut');
		$('#yfContent').show().addClass('bounceInDown animated');
		$('#taskAlert').css('z-index','1');
		$('#btnSub').hide();
		$('.isSuit em i').removeClass('selected');  /*不知道干什么用*/
		$('.yf_box_item_img1').fadeIn();

		setTimeout(function(){
			//$('.task_alert_main_1').removeClass('rollOut').hide();
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