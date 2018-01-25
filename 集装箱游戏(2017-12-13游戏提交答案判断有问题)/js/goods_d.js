

//文本域高度变化；
function MaxMe(o) {
	o.style.height = o.scrollTop + o.scrollHeight + 2 + "px";
};

//获取答题时间
function getDate(){
	var bookingId = get_address('bookingId');
	var time;

	$.ajax({
		url: ajaxUrl + 'inter/delivery-game!getTime.action',
		type: 'get',
		dataType: 'json',
		data: { deliveryId:bookingId },
		async: false,
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status == 0){ showAlert('aaa！'); return; }

			time = data.time;
		},
		error: function(){ console.log('加载失败') }
	});

	return time;
};

//提交成绩；
var startTime,endTime,time;
function bookingSubmit(recordId,startTime,endTime){
	var obj = $('.booking_submit a');
	if(obj.attr('isSubmit') == 'false'){ return; }
	obj.attr('isSubmit','false');

	var recordId = get_address('bookingId')*1;
	var timeDifference;

	if(endTime==0){
		timeDifference = time;
	}else{
		var endTime = new Date();
		var date = endTime.getTime()-startTime.getTime(); //时间差的毫秒数
		timeDifference = Math.floor(date/(60*1000));
		timeDifference = timeDifference<=0 ? 1 : timeDifference;
	};

	var data;
	switch(recordId){
		case 1:
			data = goodsAnswer.answer_1;
			break;
		case 2:
			data = goodsAnswer.answer_2;
			data2 = goodsAnswer.answer_2_b;		
			break;
		case 3:
			data = goodsAnswer.answer_3;
			break;
		case 4:
			data = goodsAnswer.answer_4;
			break;
		case 5:
			data = goodsAnswer.answer_5;
			break;
		case 6:
			data = goodsAnswer.answer_6;
			data6 = goodsAnswer.answer_6_b;	
			break;
		case 7:
			data = goodsAnswer.answer_7;
			break;
		case 8:
			data = goodsAnswer.answer_8;
			data8 = goodsAnswer.answer_8_b;	
			break;
		case 9:
			data = goodsAnswer.answer_9;
			data9 = goodsAnswer.answer_9_b;	
			break;
		case 10:
			data = goodsAnswer.answer_10;
			break;
		default:
	};

	// console.log(data);
	var isSubmit = true;
	$('.answer').each(function(i){
		if($(this).val() == ''){
			isSubmit = false;
		};
	});
	// if(!isSubmit){
	// 	showAlert('请先完成答题！',true);
	// 	return false;
	// }

	var errorList = [];
	$('.answer').each(function(i){
		var _answer;

		var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
		var a2 = data[i].toLowerCase().replace(/\s/ig,'');

		if(a1!=a2){
			errorList.push(i);
		}			
	});
	switch(recordId){
		case 2:
			$('.goods_2').each(function(i){
				var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
				var a2 = data2[i].toLowerCase().replace(/\s/ig,'');

				if(a1!=a2){
					errorList.push('b2'+i);
				}			
			});
			break;
		case 6:
			$('.goods_6').each(function(i){
				var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
				var a2 = data6[i].toLowerCase().replace(/\s/ig,'');

				if(a1!=a2){
					errorList.push('b6'+i);
				}			
			});
			break;
		case 8:
			$('.goods_8').each(function(i){
				var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
				var a2 = data8[i].toLowerCase().replace(/\s/ig,'');

				if(a1!=a2){
					errorList.push('b8'+i);
				}			
			});
			break;
		case 9:
			$('.goods_9').each(function(i){
				var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
				var a2 = data9[i].toLowerCase().replace(/\s/ig,'');

				if(a1!=a2){
					errorList.push('b9'+i);
				}			
			});
			break;
		default:
	};

	var ucode = get_address('ucode'),
		lenTotal = $('.answer').length*1;

	switch(recordId){
		case 2:
			lenTotal += $('.goods_2').length*1;
			break;
		case 6:
			lenTotal += $('.goods_6').length*1;
			break;
		case 8:
			lenTotal += $('.goods_8').length*1;
			break;
		case 9:
			lenTotal += $('.goods_9').length*1;
			break;
		default:
	};
	var	lenSuccess = lenTotal - errorList.length;

	$.ajax({
		url: ajaxUrl + 'inter/delivery-game!grade.action',
		type: 'post',
		dataType: 'json',
		data: { 'deliveryScoreVo.ucode': ucode ,'deliveryScoreVo.deliveryInfoId': recordId ,'deliveryScoreVo.num': lenTotal ,'deliveryScoreVo.rightNum': lenSuccess ,'deliveryScoreVo.time': timeDifference },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status == 0){ showAlert('成绩保存失败，请重新提交！'); return; }

			obj.attr('isSubmit','true');
			showAlert('成绩保存成功！','end',function(){
				$(this).removeClass('delay_10 bounceInRight');
				$('.booking_date_bg').removeClass('bounceInDown delay_05').addClass('bounceOutDown');
				$('.booking_date_ico').removeClass('bounceInDown delay_08 tada').addClass('delay_02').addClass('bounceOutDown');
				$('.booking_main').removeClass('zoomIn').addClass('delay_05').addClass('bounceOut');

				setTimeout(function(){
					window.location.href = 'goods.html';
				},1200);
			})

		},
		error: function(){ console.log('加载失败') }
	});
};

$(function(){
	time = getDate();

	var recordId = get_address('bookingId')*1;
	switch(recordId){
		case 2:
			$('.goods_2').removeClass('goods_hide');
			break;
		case 6:
			$('.goods_6').removeClass('goods_hide');
			break;
		case 8:
			$('.goods_8').removeClass('goods_hide');
			break;
		case 9:
			$('.goods_9').removeClass('goods_hide');
			break;
		default:
	}

	$('.booking_pic').hide();
	$('.booking_pic').eq(recordId-1).show();

	//倒计时；
	setTimeout(function(){
		$('.booking_date_ico').removeClass('bounceInDown delay_08').addClass('tada');
		startTime = new Date();
		$('.booking_submit a').attr('isSubmit','true');

		var _time = time*1000*60;
		$('.booking_date_speed').animate({'top':'100%'},_time,function(){
			bookingSubmit(recordId,startTime,0);
		});
	},2000);

	//文本域值变化
	$('textarea').bind('input propertychange', function() {  
		MaxMe(this);
	}); 

	//滚动条
	$(".booding_scroll").mCustomScrollbar({
        set_width: '100%',
    });

	//返回列表页
	$('.booking_btn .btn_1').click(function(){
		$(this).removeClass('delay_10 bounceInRight');
		$('.booking_date_bg').removeClass('bounceInDown delay_05').addClass('bounceOutDown');
		$('.booking_date_ico').removeClass('bounceInDown delay_08 tada').addClass('delay_02').addClass('bounceOutDown');
		$('.booking_main').removeClass('zoomIn').addClass('delay_05').addClass('bounceOut');

		setTimeout(function(){
			window.location.href = 'goods.html';
		},1200);
	});

	//查看题目；
	$('.booking_btn .btn_2').click(function(){
		if($('.booking_question').css("display") == "block") return;
		$('.booking_question').slideDown(function(){
			$('.booking_close').fadeIn();
		});
	});

	//关闭题目;
	$('.booking_close').click(function(){
		$('.booking_close').hide();
		$('.booking_question').slideUp();
	});

	//提交
	$('.booking_submit a').click(function(){
		bookingSubmit(recordId,startTime,1);
	});

});