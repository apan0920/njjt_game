
var ajaxUrl = 'http://192.168.10.196:8888/nosgame/';
/*var curWwwPath=window.document.location.href; 
//获取主机地址之后的目录如：/Tmall/index.jsp 
var pathName=window.document.location.pathname; 

var pos=curWwwPath.indexOf(pathName); 

//获取主机地址，如： http://localhost:8080 
var localhostPaht=curWwwPath.substring(0,pos); 
var ajaxUrl = localhostPaht + "/nosgame/"; //ip地址+项目名称*/

/**
 * [本地储存的字段]
 * ucode : 用户编号
 * startTime : 游戏开始时间
 * bookingTime : 订舱单游戏时间
 * bookingId : 订舱单游戏任务ID
 * 
 */
function set_address(name,value) {
	if(name == "" || value == "") return;
    return window.localStorage.setItem(name,value);
};
function get_address(name) {
    return window.localStorage.getItem(name);
};

//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

//提示弹窗
/**
 * [showAlert description]
 * @param  {[type]}   name     [提示信息]
 * @param  {[type]}   status   [是否显示按钮]
 * @param  {Function} callback [确定回调函数]
 * @return {[type]}            [description]
 * 
 * showAlert('是否修改!',true,function(obj){
 *      $('.win_alert').fadeOut(function(){
 *          obj.remove();
 *      });
 *  });
 */
//弹窗1（船期的选定）
function showAlert(name,status,callback){
	var alert_html = '<div class="task_alert task_alert_2">'+
						'<div class="task_alert_box">'+
							'<div class="task_alert_people"></div>'+
							'<div class="task_alert_main">'+
								'<p>'+name+'</p>'+
								'<div class="task_alert_btn">'+
									'<a href="javascript:;" class="complete"></a>'+
									'<a href="javascript:;" class="cancel"></a>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>';

	var obj = $(alert_html);

	if(status == 'end'){
		obj.find('.cancel').remove();
	}else{
		obj.find('.complete').remove();
	}

	$('body').append(obj);
	// $('.task_alert_2').fadeIn();
	obj.show().addClass('animated').addClass('fadeIn');
	obj.find('.task_alert_box').addClass('animated').addClass('jackInTheBox');

	obj.find('a.cancel').click(function(){		
		obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
		obj.removeClass('fadeIn').addClass('fadeOut');
		setTimeout(function(){
			// obj.hide();
			obj.remove();
		},500);
	});
	obj.find('a.complete').click(function(){
		if(typeof callback == "function"){
			obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				obj.remove();
			},500);
			callback(obj); 
		}else{
			$('.login_btn a').attr('isSubmit','false');
			$('#routeBtn').attr('isSubmit','false');

			obj.find('.task_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				// obj.hide();
				obj.remove();
			},500);
		}
	});
	// obj.find('a.determine').click(function(){
	// 	if(typeof callback == "function"){
	// 		callback(obj); 
	// 	}
	// });
};

//弹窗2（运费计算）
function showAlert_2(name,callback){
	var alert_html = '<div class="freight_alert" style="display: block;">'+
						'<div class="freight_alert_box">'+
							'<p>'+name+'</p>'+
							'<div class="freight_alert_btn">'+
								'<a href="javascript:;" class="freight_alert_Btn"></a>'+
							'</div>'+
						'</div>'+
					'</div>';
	var obj = $(alert_html);
	$('body').append(obj);
	obj.show().addClass('animated').addClass('fadeIn');
	obj.find('.freight_alert_box').addClass('animated').addClass('jackInTheBox');
	obj.find('.freight_alert_Btn').click(function(){
		obj.find('.freight_alert_box').removeClass('jackInTheBox').addClass('zoomOut');
		obj.removeClass('fadeIn').addClass('fadeOut');
		setTimeout(function(){
			obj.hide();
		},500);
	});
};

//退出登录
function signOut(){
	var ucode = get_address('ucode');
	$.ajax({
		url: ajaxUrl + 'inter/user-login!signOut.action',
		type: 'post',
		dataType: 'json',
		data: { ucode:ucode },
		success: function(data){
			// console.log(JSON.stringify(data));
			if(data.status != '1'){ showAlert(data.message,'end'); return; };
			
			window.location.href = '../index.html';

		},
		error: function(){}
	});
};

//获取获取网址参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]); return null; //返回参数值
}

$(function(){

	//退出帐号
	$('#signOut').click(function(){
		signOut();
	});
	
	//查看任务信息
	$('#task').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
			$('.task_details').removeClass('lightSpeedIn').addClass('animated_05').addClass('lightSpeedOut');
		}else{
			$(this).addClass('selected');
			$('.task_details').removeClass('lightSpeedOut').addClass('animated_05').show().addClass('lightSpeedIn');
		}		
	});

});