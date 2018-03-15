
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
//弹窗（提示信息）
function showAlert(name,status,callback, closeShow){
	var close_html = '<div href="javascript:;" class="msg_close"></div>';
	if (closeShow == "false") {
		close_html = '';
	}
	var alert_html = '<div class="msg_box_alert">'+
						'<div class="msg_box">'+
							'<p class="msg_content">'+ name +'</p>'+
							'<a href="javascript:;" class="msg_confirm"></a>'+
							'<a href="javascript:;" class="msg_cancel"></a>'+
							close_html+
						'</div>'+
					'</div>';

	var obj = $(alert_html);
	

	if(status == 'end'){
		obj.find('.msg_cancel').remove();
	}else{
		obj.find('.msg_confirm').remove();
	}

	$('body').append(obj);

	obj.show().addClass('animated').addClass('fadeIn');
	obj.find('.msg_box').addClass('animated').addClass('jackInTheBox');

	obj.find('a.msg_confirm').click(function(){
		if(typeof callback == "function"){
			callback(obj); 
		}else{
			$("#loginBtn").attr('isSubmit','false');
		}
		obj.find('.msg_box_alert').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				obj.remove();
			},500);
	});

	obj.find('a.msg_cancel').click(function(){		
		obj.find('.msg_box_alert').removeClass('jackInTheBox').addClass('zoomOut');
		obj.removeClass('fadeIn').addClass('fadeOut');
		setTimeout(function(){
			// obj.hide();
			obj.remove();
		},500);
	});

	// 弹出框右上角关闭按钮
	obj.find('.msg_close').click(function(){
		/*if(typeof callback == "function"){
			callback(obj); 
		}else{*/
			$("#loginBtn").attr('isSubmit','false');
		/*}*/
		obj.find('.msg_box_alert').removeClass('jackInTheBox').addClass('zoomOut');
			obj.removeClass('fadeIn').addClass('fadeOut');
			setTimeout(function(){
				obj.remove();
			},500);
	});
	

};

//退出登录
function signOut(){
	/*var ucode = get_address('ucode');
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
	});*/
	window.location.href = '../../login.html';

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

// 引入头尾文件
$(function () {
	$("#header").load("../html/head.html");
	$("#footer").load("../html/foot.html");
});

/*返回按钮*/
$(".back_btn").click(
		function function_name(argument) {
			window.location.href = "index.html";
		}
	);
