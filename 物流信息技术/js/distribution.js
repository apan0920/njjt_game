$(function(){
	getTaskList();
	//选择任务
	$('.task_list').on('click','a',function(){
		//获取订单Id
		var recordId = $(this).data('recordid');
	    $('.task_content').removeClass('bounceInDown delay_12').addClass('bounceOutUp');
	    var ucode = get_address("ucode");
	    //开始配送
	    $('iframe').attr("src",ajaxUrl+'inter/dis-order!selectDistributionLine.action?orderId='+recordId+'&ucode='+ucode);
		//等iframe加载完毕,修改地图样式
		$('iframe').load(function(){                             
	    	$('#map').addClass("map-border");
	    	$("#map").mCustomScrollbar();//滚动条
		}); 
	});
	
});

//获取任务列表
function getTaskList(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/dis-order!findDisOrderList.action',
		type: 'get',
		dataType: 'json',
		success: function(data){
			if(data.status != '1'){ return; };
			var disOrderList = data.disOrderList;
			$('#taskList').html('');
			$.each(disOrderList,function(i,item){
				var disOrderNo = item.disOrderNo;//订单编号
				var disOrderName = item.disOrderName;//订单名
				var timeFormat = item.timeFormat;//订单日期
				var statusFormat = item.statusFormat;//订单状态
				var recordId = item.recordId;//订单id
				var html = '<a href="javascript:;" class="task_item" data-recordid="'+item.recordId+'" '+'>'+
							'<h3>订单号: '+disOrderNo+'</h3>'+
							'<p class="task_item_content">订单制作人: '+disOrderName+'</p>'+
							'<div class="task_item_right">'+
								'<span class="task_item_date">订单日期：'+timeFormat+'</span>'+
							'</div>'+
						'</a>';
				var _obj = $(html);
				$('#taskList').append(_obj);
			});

			//滚动条
			$(".task_list").mCustomScrollbar();
		},
		error: function(){}
	});
};
