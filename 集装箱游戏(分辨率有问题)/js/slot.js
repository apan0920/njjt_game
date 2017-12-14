

// 从数组中随机取出n个元素（不重复）；
function arrRand(source,num){
 	var _arr = source;
    var sL = source.length;
    var _num = num;
    if (num==''||num=='undefined'||num==null||num==undefined){
    	_num = sL;
    }

    var target= [];   //存储下标

    //随机num个数组下标
    for(var i = 0; i < _num; i++){
        var rand = Math.floor( Math.random() * sL );
        if(target.length > 0){
            detection(target, rand);
        }else{
            target.push(rand);
        }
    };

    //检测num是否存在于arr，存在重新添加，不存在直接添加
    function detection(arr, randNum){
        var repeatFlag = false;
        for(var j = 0; j < arr.length; j++){
            if(arr[j] == randNum){
                repeatFlag = true;
            }
        }
        if(repeatFlag){
            //递归
            arguments.callee(arr, Math.floor( Math.random() * sL ));
        }else{
            arr.push(randNum);
        }
    };

    // 测试,输出target
    var newArr = [];
    for(var i=0; i<target.length; i++){
    	newArr.push(_arr[target[i]]);
    };
    if(num>1){
    	return newArr;
    }else{
    	return newArr[0];
    }
};

$(function(){

	//随机设置箱位号
	var bay = ['01','03','05','06','07','09','10','11','13','14','15','17','18','19'];
	var row = [
		'2294','1094','1492','0890','1190','0988','1886','0086','0084','0184',
		'2182','0312','1512','2010','0510','1408','0208','1306','0604','1002'
	];
	var bayRand = arrRand(bay,1);
	var rowRand = arrRand(row,1);
	$('.p_num').html('箱位号：'+bayRand+rowRand);

	var myVideo = document.getElementById('video1');

	//播放视频
	$('.slot_video_bg').click(function(){
		$(this).hide();
		myVideo.play();
		myVideo.setAttribute('controls','controls');
	});

	//点击视频暂停播放
	// myVideo.onclick = function(){
	// 	// this.removeAttribute('controls');
	// 	$('.slot_video_bg').show();
	// 	this.pause();
	// };
	// myVideo.addEventListener('pause',function(){
	// 	var _this = this;
	// 	setTimeout(function(){
	// 		if(_this.paused){
	// 			$('.slot_video_bg').show();
	// 			_this.pause();
	// 		}
	// 	},500);
	// });

	myVideo.addEventListener('ended',function(){
		// console.log('播放结束'); 
		$('.slot_box_item_video').fadeOut();
		$('.slot_box_item_img1').fadeIn();
		$('.btn_4').hide();
		$('.btn_3').css('display','inline-block');

		myVideo.removeAttribute('controls');
		$('.slot_video_bg').show();
	});

	//选择列&层-提示	
	$('.slot_prompt').click(function(){
		$('.slot_box_item_img3 .slot_box_intro').stop();
		$('.slot_box_item_img3 .slot_box_intro').slideToggle();
		return false;
	});
	$('.slot_box_item_img3').click(function(){
		$('.slot_box_item_img3 .slot_box_intro').stop();
		$('.slot_box_item_img3 .slot_box_intro').slideUp();
	});

	//下一步
	$('.btn_3').click(function(){
		if($('.slot_box_item_img1').css('display') == 'block'){
			$('.slot_box_item_img1').fadeOut();
			$('.slot_box_item_img2').fadeIn();
		}else if($('.slot_box_item_img2').css('display') == 'block'){
			if($('.slot_box_item_img2 .slot_item.selected').length<=0){
				showAlert('请先出集装箱所在的行！','end');
				return;
			};

			$('.slot_box_item_img2').fadeOut();
			$('.slot_box_item_img3').fadeIn();
			$('.btn_3').css('display','none');
			$('.btn_1').css('display','inline-block');
		}else{}
	});

	//跳过
	$('.btn_4').click(function(){
		$('.slot_box_item_video').fadeOut();
		$('.slot_box_item_img1').fadeIn();
		$('.btn_4').hide();
		$('.btn_3').css('display','inline-block');

		myVideo.pause();
		myVideo.removeAttribute('controls');
		$('.slot_video_bg').show();
	});

	//返回
	$('.btn_2').click(function(){
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

	//提交
	$('.btn_1').click(function(){
		if($('.slot_box_item_img3 .slot_item.selected').length<=0){
			showAlert('请先选择集装箱所在的列和所在层！','end');
			return;
		};

		// console.log('判断是否正确')	
		var answerBay = $('.slot_box_item_img2 .slot_item.selected').attr('number');
		var answersBay = answerBay.split(',');
		var answerRow = $('.slot_box_item_img3 .slot_item.selected').attr('number');
		var answersRow = answerRow.split(',');

		var isBay=true,isRow=true;
		if(answersBay.indexOf(bayRand) == -1){
			//行选择错误
			isBay = false;
		};
		if(answersRow.indexOf(rowRand) == -1){
			//列和层选择错误
			isRow = false;
		};

		if(!isBay && !isRow){
			showAlert('答题失败！集装箱所在的行、列、层都选择错误。','end',function(){
				$('.slot_box_item_img3').fadeOut();
				$('.slot_box_item_img2').fadeIn();
				$('.btn_1').css('display','none');
				$('.btn_3').css('display','inline-block');				
			});
		}else if(!isBay && isRow){
			showAlert('答题失败！集装箱所在的行选择错误。','end',function(){
				$('.slot_box_item_img3').fadeOut();
				$('.slot_box_item_img2').fadeIn();
				$('.btn_1').css('display','none');
				$('.btn_3').css('display','inline-block');				
			});
		}else if(isBay && !isRow){
			showAlert('答题失败！集装箱所在的列、层选择错误。','end');
		}else{
			showAlert('答题正确！','end',function(obj){
				$('.slot_content').removeClass('bounceInDown').addClass('delay_02').addClass('bounceOutUp');
				setTimeout(function(){
					window.location.href = 'index.html';
				},1000);
			});
		}
	});

	//选择
	$('.slot_item').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
		}else{	
			$(this).parents('.slot_list').find('.slot_item').removeClass('selected');
			$(this).addClass('selected');
		}
	});

});