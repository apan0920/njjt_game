

function login(){
	if($('#loginBtn').attr('isSubmit') == 'true'){ return; }
	$('#loginBtn').attr('isSubmit','true');

	var ucode = $('#ucode').val(),
		password = $('#pwd').val();

	if(ucode=='' || password==''){
		showAlert('帐号和密码不能为空！','end');
		return;
	};
	$.ajax({
		url: ajaxUrl + 'inter/user-login!login.action',
		type: 'post',
		dataType: 'json',
		data: { ucode:ucode ,password:password },
		success: function(data){
			if(data.status != '1'){ showAlert(data.message,'end'); return; };
			$('#loginBtn').attr('isSubmit','false');
			set_address('ucode',ucode);

			window.location.href = 'html/index.html';
		},
		error: function(){
			$('#loginBtn').attr('isSubmit','false');
		}
	});
};

$(function(){

	/*//监听输入框值变化：有值时显示删除按钮
	$('.login_item input').bind('input propertychange', function() {  
		var val = $(this).val().length;
		if(val>0){
			$(this).siblings('i.login_close').fadeIn();
		}else{
			$(this).siblings('i.login_close').fadeOut();
		};
	});  

	//删除输入框的值
	$('i.login_close').click(function(){
		$(this).siblings('input').val('');
		$(this).fadeOut();
	});*/

	//登录游戏
	$('#loginBtn').click(function(){
		login();		
	});
	$(document).bind('keydown', function (e) {
        var key = e.which;
        if (key == 13) {
            e.preventDefault();
            login();
        }
    });

});