
//获取得分&答题时间
function getTime(){
	var ucode = get_address('ucode');
	var url = ajaxUrl + 'inter/delivery-game!getDeliveryInfo.action';
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		data: { ucode: ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert('加载失败！'); return; };

			var list = data.deliveryGameVoList;

			$.each(list,function(i,item){
				var recordId = item.recordId*1,
					star = item.star*1;
					
				var linkObj = $('.booking_item a[recordId="'+recordId+'"]'),
					starObj = linkObj.siblings('.booking_ico').find('span');
				starObj.removeClass('selected');
				starObj.each(function(i){
					if(i < star){
						$(this).addClass('selected');
					}
				});

			});

		},
		error: function(){console.log('加载失败')}
	});
};

$(function(){
	getTime();

	//进入答题页
	$('.booking_item a').click(function(){
		$('.booking_content').removeClass('bounceInDown').addClass('bounceOutUp');
		var _this = $(this);
		var recordId = $(this).attr('recordId'),
			time = $(this).attr('time');
		set_address('bookingId',recordId);
		set_address('bookingTime',time);

		setTimeout(function(){
			if(_this.hasClass('img_11')){
				window.location.href = 'index.html';
			}else{
				window.location.href = 'goods_answer.html';
			}
		},800);
	});

});