/*
* @Author: pz
* @Date:   2017-12-04 16:01:50
* @Last Modified by:   pz
* @Last Modified time: 2017-12-12 11:43:31
*/
/*第8关-堆场指位*/

//获取任务列表
function getTaskList(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/yard-task!getTask.action',
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data,XMLHttpRequest){
			if(data.status != '1'){ showAlert('加载失败！'); return; };

			var taskList = data.taskList;

			$('#taskList').html('');
			$.each(taskList,function(i,item){
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

				var html = '<a href="javascript:;" class="task_item" recordId="'+taskId+'" business="'+business+'" containerType="'+ containerType +'" cyNo="'+cyNo+'" section="'+ section +'" belt="'+ belt +'" yfColumn="'+ yfColumn +'" yfFloor="'+ yfFloor +'" >'+
							'<h3>任务'+(i+1)+'</h3>'+
							'<p class="task_item_content" title="'+content+'">'+content+'</p>'+
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
		error : function(XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest.status == 0) {
					showAlert('服务器连接错误！','end',function(obj){
						setTimeout(function(){
							window.location.href = 'index.html';
						},1000);
					});
				}
			}
	});
};


//下一步
	$('.btn_next').click(function(){
		if($('.yf_box_item_img1').css('display') == 'block'){//选择区位
			if($('.yf_box_item_img1 .yf_item.selected').length<=0){
				showAlert('请选出集装箱所在的堆场区位！','end');
				return;
			};
			var section = $('.task_item.selected').attr('section');//任务中区位编号
			var sectionNumber = $('.yf_box_item_img1 .yf_item.selected').attr("number");//选择的区位编号
			if (sectionNumber != section ) {
				showAlert('请选出正确的堆场区位！','end');
				return;
			}
			$('.yf_box_item_img1').fadeOut();
			$('.yf_box_item_img2').fadeIn();
		}else if($('.yf_box_item_img2').css('display') == 'block'){
			if($('.yf_box_item_img2 .yf_bay_style.selected').length<=0){
				showAlert('请选出集装箱所在的堆场贝位！','end');
				return;
			}else{
				var belt = $('.task_item.selected').attr('belt');//任务中贝位
				var beltNumber = $('.yf_box_item_img2 .yf_bay_style.selected').attr("number");//选择的贝位编号
				if (beltNumber != belt ) {
					showAlert('请选出正确的堆场贝位！','end');
					return;
				}else{
					/*进入动画----啦啦啦~~~~~~~~~~~~~~~~~~~~~~~~~~~*************************************/
					/*任务赋值*/
					var taskTitle = $('#taskTite').html(),
						taskDate = splitColon($('#taskDate').html()),
						content = splitColon($('#taskContent').html()),
						business = splitColon($('#taskBusuness').html()),
						containerType = splitColon($('#taskContainerType').html()),
						cyNo = splitColon($('#taskCyNo').html()),
						yfColumn = $('#yfColumn').val(),
						yfFloor = $('#yfFloor').val();
						/*console.log("调试--URL的参数值=="+taskTitle,taskDate, cyNo, business, containerType, content, yfColumn, yfFloor);*/
						window.location.href = "yardFingerGame.html?taskTitle="+taskTitle+"&taskDate="+taskDate+"&content="+content+"&business="+business+"&containerType="+containerType+"&cyNo="+cyNo+"&yfColumn="+yfColumn+"&yfFloor="+yfFloor;
						$('.yf_box_item_img2').fadeOut();
						$('.btn_next').css('display','none');
				}
			}
		}
	});


//返回
	$('.btn_back').click(function(){
		if($('.yf_box_item_img2').css('display') == 'block'){
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

	getTaskList();

	//选择任务
	$('.task_list').on('click','a',function(){
		$('.task_list a').removeClass('selected');
		$(this).addClass('selected');

		var taskTitle = $('.task_item.selected').find('h3').html(),
			taskDate = $('.task_item.selected').find('.task_item_date').html(),
			content = $('.task_item.selected').find('p').html(),
			business = $('.task_item.selected').attr('business'),
			containerType = $('.task_item.selected').attr('containerType'),
			cyNo = $('.task_item.selected').attr('cyNo'),
			yfColumn = $('.task_item.selected').attr('yfColumn'),
			yfFloor = $('.task_item.selected').attr('yfFloor');

		$('.task_details_title').html(taskTitle)
		$('.task_details_date').html(taskDate)
		$('.task_details_cyNo').html('场箱位号：'+cyNo)
		$('.task_details_business').html('业务类型：'+business)
		$('.task_details_containerType').html('区位类型：'+containerType)
		$('.task_details_content').html('任务内容：'+content)
		$('#yfColumn').val(yfColumn)
		$('#yfFloor').val(yfFloor)

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
		var recordId = $('.task_item.selected').attr('recordId');
		set_address('yardFingerId',recordId);
		set_address('yardFingerStartTime',getNowFormatDate());

		$('.task_alert_main_1').removeClass('rollIn delay_10').show().addClass('rollOut');
		$('.task_alert_people_1').removeClass('zoomInRight delay_05').addClass('delay_02').addClass('zoomOutRight');
		$('.task_alert_1').removeClass('delay_05 fadeIn').addClass('delay_05').addClass('fadeOut');
		$('#yfContent').show().addClass('bounceInDown animated');
		$('#taskAlert').css('z-index','1');
		$('#btnSub').hide();
		$('.isSuit em i').removeClass('selected');  //任务列表界面后边的对号
		$('.yf_box_item_img1').fadeIn();

		/*setTimeout(function(){
			//$('.task_alert_main_1').removeClass('rollOut').hide();
		},1500);*/
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


	//贝位选择
	$('.yf_bay_style').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');//清除数字选中状态
			var  bayNo = Number($(this).attr("number"));//清除贝位选中状态
			if (bayNo%2 == 0) {
				var minBayNo = ".yf_bay_"+(bayNo-1);
				var maxBayNo = ".yf_bay_"+(bayNo+1);
				$(minBayNo).removeClass('selected');
				$(maxBayNo).removeClass('selected');
			} else {
				$(".yf_bay_"+bayNo).removeClass('selected');
			}
		}else{	
			$(this).parents('.yf_bay_list').find('.yf_bay_style').removeClass('selected');
			$(this).addClass('selected');
			/*控制对应贝位变色*/
			$(this).parents('.yf_bay_list').find('.yf_bay').removeClass('selected');
			var  bayNo = Number($(this).attr("number"));
			if (bayNo%2 == 0) {
				var minBayNo = ".yf_bay_"+(bayNo-1);
				var maxBayNo = ".yf_bay_"+(bayNo+1);
				$(minBayNo).addClass('selected');
				$(maxBayNo).addClass('selected');
			} else {
				$(".yf_bay_"+bayNo).addClass('selected');
			}
		}
	});

});
	/*截取冒号后的字符串*/
	function splitColon(str) {
		var result=str.split("：");
		if (result !=null && result.length>0) {
			return result[1];
		} 
	}