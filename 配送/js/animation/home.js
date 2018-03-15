
$(function(){

	var $rabbit = $('rabbit');
	var images = ['images/img.png'];

	var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
	var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
	var rabbitWinMap = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];

	run();

	function run() {
		var interval = 50;
		var speed = 6;
		var initLeft = 100;
		var finalLeft = 400;
		var frame = 4;
		var frameLength = 6;
		var right = true;

		var runAnimation = animation().loadImage(images).enterFrame(function (success, time) {
			var ratio = (time) / interval;
			var position;
			var left;
			if (right) {
				position = rightRunningMap[frame].split(' ');
				left = Math.min(initLeft + speed * ratio, finalLeft);
				if (left === finalLeft) {
					right = false;
					frame = 4;
					success();
					return;
				}
			} else {
				position = leftRunningMap[frame].split(' ');
				left = Math.max(finalLeft - speed * ratio, initLeft);
				if (left === initLeft) {
					right = true;
					frame = 4;
					success();
					return;
				}
			}
			if (++frame === frameLength) {
				frame = 0;
			}
			$rabbit.style.backgroundImage = 'url(' + images[0] + ')';
			$rabbit.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
			$rabbit.style.left = left + 'px';
		}).repeat(1).wait(1000).changePosition($rabbit, rabbitWinMap, images[0]).then(function () {
			console.log('finish');
		});
		runAnimation.start(interval);
	}
});