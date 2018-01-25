

//文本域高度变化；
function MaxMe(o) {
	o.style.height = o.scrollTop + o.scrollHeight + 2 + "px";
};

//提交成绩；
function bookingSubmit(recordId,startTime,endTime){
	var obj = $('.booking_submit a');
	if(obj.attr('isSubmit') == 'false'){ return; }
	obj.attr('isSubmit','false');

	var recordId = get_address('bookingId')*1,
		time = get_address('bookingTime');

	if(endTime==0){
		var timeDifference = time;
	}else{
		var endTime = new Date();
		var date = endTime.getTime()-startTime.getTime(); //时间差的毫秒数
		var timeDifference = Math.floor(date/(60*1000));
		timeDifference = timeDifference<=0 ? 1 : timeDifference;
	};

	var data;
	switch(recordId){
		case 1:
			data = answer.answer_1;
			break;
		case 2:
			data = answer.answer_2;			
			break;
		case 3:
			data = answer.answer_3;
			break;
		case 4:
			data = answer.answer_4;
			break;
		case 5:
			data = answer.answer_5;
			break;
		case 6:
			data = answer.answer_6;
			break;
		case 7:
			data = answer.answer_7;
			break;
		case 8:
			data = answer.answer_8;
			break;
		case 9:
			data = answer.answer_9;
			break;
		case 10:
			data = answer.answer_10;
			break;
		default:
	};

	// console.log(data);
	var isSubmit = true;
	$('.answer').each(function(i){
		if($(this).hasClass('answer_18') || $(this).hasClass('answer_19') || $(this).hasClass('answer_20')){
			var _index = $(this).find('.radio_selected input:checked').index();
			if(_index == -1){
				isSubmit = false;
			};
		}else{
			if($(this).val() == ''){
				isSubmit = false;
			};
		};
	});
	// if(!isSubmit){
	// 	showAlert('请先完成答题！',true);
	// 	return false;
	// }

	var errorList = [];
	$('.answer').each(function(i){
		var _answer;
		if($(this).hasClass('answer_18') || $(this).hasClass('answer_19') || $(this).hasClass('answer_20')){
			var _index = $(this).find('.radio_selected input:checked').index();
			console.log(_index==data[i]);
			if(_index!=data[i]){
				errorList.push(i);
			}
		}else{
			var a1 = $(this).val().toLowerCase().replace(/\s/ig,'');
			var a2 = data[i].toLowerCase().replace(/\s/ig,'');
			console.log(a1==a2);
			if(a1!=a2){
				errorList.push(i);
			}
		};
	});

	var ucode = get_address('ucode'),
		lenTotal = $('.answer').length*1,
		lenSuccess = lenTotal - errorList.length,
		time = timeDifference;

	$.ajax({
		url: ajaxUrl + 'inter/order-game!grade.action',
		type: 'post',
		dataType: 'json',
		data: { 'orderScoreVo.ucode': ucode ,'orderScoreVo.orderInfoId': recordId ,'orderScoreVo.num': lenTotal ,'orderScoreVo.rightNum': lenSuccess ,'orderScoreVo.time': time },
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
					window.location.href = 'booking.html';
				},1200);
			})

		},
		error: function(){ console.log('加载失败') }
	});
};

$(function(){
	var startTime,endTime;

	var recordId = get_address('bookingId')*1,
		time = get_address('bookingTime');
	$('.booking_pic').hide();
	$('.booking_pic').eq(recordId-1).show();

	//倒计时；
	setTimeout(function(){
		$('.booking_date_ico').removeClass('bounceInDown delay_08').addClass('tada');
		startTime = new Date();
		$('.booking_submit a').attr('isSubmit','true');

		time = 600;
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
			window.location.href = 'booking.html';
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