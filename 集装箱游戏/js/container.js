
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

					alert(isDone)

				var html = '<a href="javascript:;" class="task_item" recordId='+recordId+' goodsName="'+goodsName+'" goodsParameter="'+goodsParameter+'">'+
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

//获取集装箱参数
function getContainer(){
	var size = $('.container_size').attr('size')*1,
		type = $('.container_type').attr('type')*1;
	if(size<=0 || type<=0){ return; }

	$.ajax({
		url: ajaxUrl + 'inter/container-question!getContainerParameter.action',
		type: 'get',
		dataType: 'json',
		data: { containerType: type, containerSize:size },
		success: function(data){
			console.log(JSON.stringify(data));
			$('.see_intro2').html('');
			if(data.status == 0){
				$('.see_intro1').html('此类集装箱无该尺寸大小，请重新选择尺寸！');
			}else if(data.status == 1){
				var intro = data.containerParameter;
				intro = intro.split(',');
				console.log(intro)
				$.each(intro,function(i,item){
					var html = '<span>'+item+'</span><br>';
					$('.see_intro2').append(html);
				})
				$('.see_intro1').html('根据您选择的集装箱参数确认需要的集装箱数量！');
			}
			$('.see_details').removeClass('enlargeOutLeftUp delay_05').show().addClass('enlargeInLeftUp');
			$('.see_middle').removeClass('zoomOut').show().addClass('animated_05 delay_05').addClass('zoomIn');

		},
		error: function(){}
	});
};

//提交集装箱选择
function submitRoute(callback){
	if($('.task_alert_box').attr('isClick') == 'false'){ return; }
	$('.task_alert_box').attr('isClick','false');

	var ucode = get_address('ucode'),
		taskId = $('.task_item.selected').attr('recordid'),
		isSuit = $('.isSuit').attr('isSuit')*1,
		size = $('.container_size').attr('size')*1,
		type = $('.container_type').attr('type')*1,
		num = $('.container_num input').val()*1;

	if(isSuit == 2){
		size = 0; type = 0; num = 0;
	}else{
		if(size<=0){ showAlert('请输入集装箱尺寸！'); $('.task_alert_box').attr('isClick','true'); return; }
		if(type<=0){ showAlert('请输入集装箱类型！'); $('.task_alert_box').attr('isClick','true'); return; }
		if(num==''){showAlert('请输入集装箱数量！'); $('.task_alert_box').attr('isClick','true'); return;}
	}	

	var answer = {
		ucode: ucode,
		taskId: taskId,
		isSuit: isSuit,
		containerType: type,
		containerSize: size,
		containerNum: num
	};

	// console.log(JSON.stringify(answer));
	$.ajax({
		url: ajaxUrl + 'inter/container-question!grade.action',
		type: 'post',
		dataType: 'json',
		data: { answer: JSON.stringify(answer) },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert(data.message); $('.task_alert_box').attr('isClick','true'); return; };

			var message = data.message; // 'T'答对；‘F’错;
			if(message == 'T'){
				showAlert('恭喜你！回答正确。游戏通过。','end',function(obj){
					if(typeof callback == "function"){
						callback(message,obj); 
					}
				});
			}else{
				showAlert('很遗憾！回答错误。游戏结束。','end',function(obj){
					if(typeof callback == "function"){
						callback(message,obj); 
					}
				});
			}

			$('.task_alert_box').attr('isClick','true');
		},
		error: function(){ $('.task_alert_box').attr('isClick','true'); }
	});
};

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
	//否-提交答案
	$('.container_btn a.no').click(function(){
		$('.isSuit').attr('isSuit',2);
		submitRoute(function(state,obj){
			obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');

			$('.task_alert_main_2').removeClass('rollIn').addClass('delay_05').addClass('rollOut');
			$('.task_alert_people').removeClass('delay_05 zoomInRight').addClass('delay_05').addClass('zoomOutRight');
			$('.task_alert_1').removeClass('delay_05 fadeIn').addClass('delay_05').addClass('fadeOut');

			$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');
			getTaskList();

			$('.task').removeClass('delay_10 fadeIn').addClass('fadeOut');
			$('#task').removeClass('selected');
			$('.task_details').removeClass('lightSpeedIn lightSpeedOut').hide();

			setTimeout(function(){
				obj.remove();
				$('.task_alert_main_2').removeClass('delay_05 rollOut').hide();
				$('.task_alert_people').removeClass('delay_05 zoomOutRight');
				$('.task_alert_1').removeClass('delay_05 fadeOut').hide();
				$('.task_content').removeClass('delay_10 bounceInDown');
				$('.task').hide();
			},1500);
		});
	});
	//是-下一步答题
	$('.container_btn a.yes').click(function(){
		$('.task_alert_main_2').removeClass('rollIn delay_10').hide();

		$('.task_alert').addClass('content_alert');
		$('.task_alert_main_3').removeClass('fadeOut').show().addClass('animated').addClass('fadeIn');
		$('.isSuit').attr('isSuit',1);

		$('.container_size span i').removeClass('selected');
		$('.container_size span').eq(0).find('i').addClass('selected');
		$('.container_size').attr('size',1);
		$('.container_type').attr('type',$('.container_type_list p').eq(0).attr('type'));
		$('.container_type_top span').html($('.container_type_list p').eq(0).html());
		$('.container_num input').val('');
		$('.container_alert_pic').removeClass('img_2 img_3 img_4 img_5 img_6 img_7').addClass('img_1');
	});
	/***********************************************************************/

	//选择是否适箱
	$('.isSuit em').click(function(){
		$('.isSuit em i').removeClass('selected');
		$(this).find('i').addClass('selected');
		$('.isSuit').attr('isSuit',$(this).attr('isSuit'));
	});

	//确定 - 进入集装箱选择 || 提交
	$('.container_btn a.ok').click(function(){
		if($('.task_alert_main_2 p em i.selected').length<=0){ showAlert('请选择是否适箱！'); return; }

		if($('.isSuit').attr('isSuit') == 2){
			//选择不适箱，提交答案；
			submitRoute(function(state,obj){
				obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
				obj.removeClass('fadeIn').addClass('fadeOut');

				$('.task_alert_main_2').removeClass('rollIn').addClass('delay_05').addClass('rollOut');
				$('.task_alert_people').removeClass('delay_05 zoomInRight').addClass('delay_05').addClass('zoomOutRight');
				$('.task_alert_1').removeClass('delay_05 fadeIn').addClass('delay_05').addClass('fadeOut');

				$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');
				getTaskList();

				$('.task').removeClass('delay_10 fadeIn').addClass('fadeOut');
				$('#task').removeClass('selected');
				$('.task_details').removeClass('lightSpeedIn lightSpeedOut').hide();

				setTimeout(function(){
					obj.remove();
					$('.task_alert_main_2').removeClass('delay_05 rollOut').hide();
					$('.task_alert_people').removeClass('delay_05 zoomOutRight');
					$('.task_alert_1').removeClass('delay_05 fadeOut').hide();
					$('.task_content').removeClass('delay_10 bounceInDown');
					$('.task').hide();
				},1500);
			});
		}else if($('.isSuit').attr('isSuit') == 1){
			//选择适箱，进入集装箱页面			
			$('.container_size span i').removeClass('selected');
			$('.container_size').attr('size',0);
			$('.container_type').attr('type',0);
			$('.container_type_top span').html('');
			$('.container_num input').val('');
			$('.container_alert_pic').removeClass('img_1 img_2 img_3 img_4 img_5 img_6 img_7');
			$('.see_intro1').html('请选择集装箱尺寸及类型！');
			$('.see_intro2').html('');

			$('.task_alert_main_2').removeClass('rollIn delay_10').hide();
			$('.task_alert').addClass('content_alert');
			$('.task_alert_main_3').removeClass('fadeOut').show().addClass('animated').addClass('fadeIn');

			$('.see_btn').addClass('animated_05 delay_08').addClass('swing');
			$('.see_details').removeClass('enlargeOutLeftUp delay_05').addClass('animated_05 delay_12').show().addClass('enlargeInLeftUp');

			$('.see_middle').removeClass('zoomOut delay_05').show().addClass('animated_05 delay_15').addClass('zoomIn');
		}
	});

	//打开提示语
	$('.see_btn').click(function(){
		$('.see_details').removeClass('enlargeOutLeftUp delay_05').show().addClass('enlargeInLeftUp');
		$('.see_middle').removeClass('zoomOut').show().addClass('animated_05 delay_05').addClass('zoomIn');
		return false;		
	});
	//关闭提示语
	$('.task_alert_main_3').click(function(){
		$('.see_middle').removeClass('delay_15 zoomIn').addClass('zoomOut');
		$('.see_details').removeClass('delay_12 enlargeInLeftUp').addClass('animated_05 delay_05').addClass('enlargeOutLeftUp');
		setTimeout(function(){
			$('.see_details,.see_middle').hide();
		},1000);
	});

	//选择尺寸
	$('.container_size span').click(function(){
		$('.container_size span i').removeClass('selected');
		$(this).find('i').addClass('selected');
		$('.container_size').attr('size',$(this).find('i').attr('size'));
		getContainer();
		return false;		
	});

	//打开-选择类型选项
	$('.container_type_top').click(function(){
		var obj = $(this).siblings('.container_type_list');
		if(obj.css('display') == 'block'){
			obj.slideUp();
		}else{
			obj.slideDown();
		}
		return false;		
	});

	//选择类型
	$('.container_type_list p').click(function(){
		$(this).parent().slideUp();
		$('.container_type_top span').html($(this).html());
		$('.container_type').attr('type',$(this).attr('type'));
		var index = $(this).attr('type')*1;
		$('.container_alert_pic').addClass('transition_05').removeClass('img_1 img_2 img_3 img_4 img_5 img_6 img_7').addClass('img_'+index);		
		getContainer();
		return false;		
	});

	//返回是否装箱选择
	$('.container_btn2').click(function(){
		$('.task_alert_main_3').removeClass('fadeIn').addClass('animated').addClass('fadeOut');
		$('.task_alert').removeClass('content_alert');
		$('.task_alert_main_2').show().addClass('fadeIn');
		setTimeout(function(){
			$('.task_alert_main_3').hide();
		},1000);
	});

	//提交答案
	$('.container_btn1').click(function(){
		submitRoute(function(state,obj){
			obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');
			
			$('.task_alert_main_3').removeClass('fadeIn').addClass('delay_05').addClass('rollOut');
			$('.task_alert_people').removeClass('delay_05 zoomInRight').addClass('delay_05').addClass('zoomOutRight');
			$('.task_alert_1').removeClass('delay_05 fadeIn').addClass('delay_05').addClass('fadeOut');

			$('.task_content').removeClass('bounceOutUp').addClass('delay_10').addClass('bounceInDown');
			getTaskList();

			$('.task').removeClass('delay_10 fadeIn').addClass('fadeOut');
			$('#task').removeClass('selected');
			$('.task_details').removeClass('lightSpeedIn lightSpeedOut').hide();

			setTimeout(function(){
				obj.remove();
				$('.task_alert_main_3').removeClass('delay_05 rollOut').hide();
				$('.task_alert_people').removeClass('delay_05 zoomOutRight');
				$('.task_alert_1').removeClass('delay_05 fadeOut').hide();
				$('.task_content').removeClass('delay_10 bounceInDown');

				$('.task_alert').removeClass('content_alert');
				$('.task').hide();
			},1500);
		});
	});

});