/*
* @Author: pz
* @Date:   2018-01-23 15:40:35
* @Last Modified by:   pz
* @Last Modified time: 2018-01-23 15:43:02
*/
$(function () {
	// 播放视频--start
	var myVideo = document.getElementById('rfid');
	$('.p2_video_bg , .p2_video_bg_refresh').click(function(){
		$(this).hide();

		myVideo.play();
		myVideo.setAttribute('controls','controls');

		// 播放结束
		myVideo.addEventListener('ended',function(){
			myVideo.removeAttribute('controls');

			$(".p2_video_bg_refresh").show();
		});
	});

	
});