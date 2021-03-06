/*
* @Author: pz
* @Date:   2018-02-06 17:28:40
* @Last Modified by:   pz
* @Last Modified time: 2018-02-26 17:37:27
*/
$(function () {
	fadeInTime = 1500;
	// 百度地图API功能
	var map = new BMap.Map("mapContainer");
	
	map.enableScrollWheelZoom(true);
	var start = "深圳市";
	var end = "北京市";
	/*var start = new BMap.Point(116.310791, 40.003419);
	var end = new BMap.Point(116.486419, 39.877282);*/
	/*map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);//北京*/
	map.centerAndZoom(new BMap.Point(106.559584,29.567739), 6);//重庆
	
	/*添加城市列表控件*/
	/*var size = new BMap.Size(10, 20);
	map.addControl(new BMap.CityListControl({
	    anchor: BMAP_ANCHOR_TOP_LEFT,
	    offset: size
	}));*/
	/*关键字检索*/
	/*var myKeys = ["酒店", "加油站"];*/
	/*var myKeys = ["河"];
	var local = new BMap.LocalSearch(map, {
		renderOptions:{map: map, panel:"r-result"},
		pageCapacity:5
	});
	local.searchInBounds(myKeys, map.getBounds());*/
	/*实时路况*/
	/*var ctrl = new BMapLib.TrafficControl({
		showPanel: false //是否显示路况提示面板
	});      
	map.addControl(ctrl);
	ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);  */
	/*实时路况--end*/
	//三种驾车策略：最少时间，最短距离，避开高速
	var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
	
	
	var driving0 = new BMap.DrivingRoute(map, {
	/*renderOptions:{map: map ,panel:"r-result-0", autoViewport: true},*/
	policy: routePolicy[0],
	onSearchComplete: function(results){
		var num = results.getNumPlans();//获取方案数量
		if (num>0) {
			// 获取第一条方案
            var plan = results.getPlan(0);
            $("#result-0-time").html(plan.getDuration()+"&nbsp;|");
            $("#result-0-dist").html(plan.getDistance());
		} else {
			 $("#result-0-time").html("没有可选方案");
		}
	}
	});
	driving0.search(start,end);
	
	/*var driving1 = new BMap.DrivingRoute(map, {renderOptions:{map: map ,panel:"r-result-1", autoViewport: true},policy: routePolicy[1]});*/
	var driving1 = new BMap.DrivingRoute(map, {
	/*renderOptions:{map: map ,panel:"r-result-0", autoViewport: true},*/
	policy: routePolicy[1],
	onSearchComplete: function(results){
		var num = results.getNumPlans();//获取方案数量
		if (num>0) {
			// 获取第一条方案
            var plan = results.getPlan(0);
            $("#result-1-time").html(plan.getDuration()+"&nbsp;|");
            $("#result-1-dist").html(plan.getDistance());
		} else {
			 $("#result-1-time").html("没有可选方案");
		}
	}
	});
	driving1.search(start,end);

	/*var driving2 = new BMap.DrivingRoute(map, {renderOptions:{map: map,panel:"r-result-2", autoViewport: true},policy: routePolicy[2]});*/
	var driving2 = new BMap.DrivingRoute(map, {
	/*renderOptions:{map: map ,panel:"r-result-0", autoViewport: true},*/
	policy: routePolicy[2],
	onSearchComplete: function(results){
		var num = results.getNumPlans();//获取方案数量
		if (num>0) {
			// 获取第一条方案
            var plan = results.getPlan(0);
            $("#result-2-time").html(plan.getDuration()+"&nbsp;|");
            $("#result-2-dist").html(plan.getDistance());
		} else {
			 $("#result-2-time").html("没有可选方案");
		}
	}
	});

	/*driving2.search(start,end,{waypoints:["南昌"]});//waypoints表示途经点 （"北京科技大学","北京国际会议中心"）*/
	driving2.search(start,end);

		

	// map.clearOverlays(); 
	var driving3 = new BMap.DrivingRoute(map, {
		onSearchComplete: function(results){
			if (driving3.getStatus() == BMAP_STATUS_SUCCESS) {
		            // 地图覆盖物
		            addOverlays(results);
		            // 方案描述
		            // addText(results);
		            // console.log(results);
		            // 获取第一条方案
	                var plan = results.getPlan(0);
	                var num = results.getNumPlans();
	                /*// 获取方案的驾车线路
	                var route = plan.getRoute(0);*/
	                // 返回方案总时间+总距离
	                console.log( plan.getDuration() +"*****" + plan.getDistance() +"*****" + num);


		        }
		}}
		);
	driving3.search(start,end);

		// 添加覆盖物并设置视野
	function addOverlays(results) {
	    // 自行添加起点和终点
	    var start = results.getStart();
	    var end = results.getEnd();
	    addStart(start.point, start.title);
	    addEnd(end.point, end.title);
	    var viewPoints = [start.point, end.point];
	    // 获取方案
	    var plan = results.getPlan(0);
	    // 获取方案中包含的路线
	    for (var i =0; i < plan.getNumRoutes(); i ++) {
	    	addRoute(plan.getRoute(i).getPath());
	    	viewPoints.concat(plan.getRoute(i).getPath());
	    }
	    // 设置地图视野
	    map.setViewport(viewPoints, {
	    	margins: [40, 10, 10, 10]
	    });
	}
	// 添加起点覆盖物
	function addStart(point, title){
	    map.addOverlay(new BMap.Marker(point, {
	        title: title,
	        icon: new BMap.Icon('../images/img7/marker-start.png', new BMap.Size(38, 41), {
	            anchor: new BMap.Size(4, 36)
	        })}));
	}

	// 添加终点覆盖物
	function addEnd(point, title){
	    map.addOverlay(new BMap.Marker(point, {
	        title: title,
	        icon: new BMap.Icon('../images/img7/marker-end.png', new BMap.Size(38, 41), {
	            anchor: new BMap.Size(4, 36)
	        })}));
	}

	/*// 添加路线
	function addRoute(path){
	    map.addOverlay(new BMap.Polyline(path, {
	        strokeColor: '#333',
	        enableClicking: false
	    }));
	}*/
	// 添加路线
	function addRoute(path){
		map.addOverlay(new BMap.Polyline(path, {
			strokeColor: '#00bd00',//线路颜色
			/*fillColor: "red",*/
			/*strokeWeight: 3,        //边线的宽度，以像素为单位。  */
            strokeOpacity: 1,     //边线透明度，取值范围0 - 1。  
          /*  fillOpacity: 0.3,       //填充的透明度，取值范围0 - 1。  */
            strokeStyle: 'solid',    //边线的样式，solid或dashed。
			enableClicking: false
		}));
	}
	/*路线筛选*/
	/*function selRoute(){
		map.clearOverlays(); 
		var i=$("#driving_way select").val();
		search(start,end,routePolicy[i]); 
		function search(start,end,route){ 
			var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
			driving.search(start,end);
		}
	};*/

});



/*任务查看按钮*/
$(".p7-mission-btn").click(function () {
	$(".p7-mission-box").fadeIn();
});
/*任务关闭按钮*/
$(".p7-mission-close").click(function () {
	$(".p7-mission-box").fadeOut();
});

/*添加途经点*/
var pointNum = 0;
$(".route-input-add-icon").click(function(){
   if (pointNum>4) {return;}//最多只能添加5个途经点
    var throughHtml = '<div class="routebox-input route-through">' +
							'<div class="route-input-icon">    </div>' +  
							'<div class="p7-point-middle">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
							'</div>' +
							'<input autocomplete="off" maxlength="256" placeholder="输入途经点" class="route-through-input" type="text" value="">' +    
							'<div class="route-input-remove-icon" data-index="'+ pointNum +'"></div>' +
						'</div>' ;
	$(".route-end").before(throughHtml);
	pointNum++;
});
/*删除途经点*/
$(".routebox-inputs").on('click','.route-input-remove-icon', function () {
	$(this).parent().remove();
    pointNum--;
});

/*路线选项-多选框效果控制*/
$(".btn-check").click(function () {
	$(".btn-check").find("img").hide();
	$(this).find("img").toggle();
	console.log($(this).attr("roadType"));
	/*console.log(this.getAttribute("roadType"));*/
});

