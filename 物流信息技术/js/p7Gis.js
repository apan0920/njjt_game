/*
* @Author: pz
* @Date:   2018-02-06 17:28:40
* @Last Modified by:   pz
* @Last Modified time: 2018-03-12 11:40:14
*/
$(function () {

	fadeInTime = 1500;//动画fadeIn时长定义
	// 随机出题
	question();

	// 路线选项
	$(".btn-check").find("img").hide();//默认不选中路线选项
	$(".plan").hide();//隐藏所有方案
	
	// 百度地图API功能
	map = new BMap.Map("mapContainer");// 定义地图
	map.enableScrollWheelZoom(true);//鼠标滚动缩放
	map.centerAndZoom(new BMap.Point(116.404, 39.915), 6);//地图初始中心点-北京；初始层级-6

	// 百度地图API功能--实时路况
	var ctrl = new BMapLib.TrafficControl({
		showPanel: false //是否显示路况提示面板
	});      
	map.addControl(ctrl);
	ctrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);  

	// 输入框自动补全（关键字输入提示）
	loadMapAutocomplete("startPointId", "searchResultStart");
    loadMapAutocomplete("endPointId", "searchResultPanelEnd");
});

/*根据id获取元素*/
function G(id) {
        return document.getElementById(id);
    }
/*输入框自动补全（关键字输入提示）*/
function loadMapAutocomplete(pointId, searchResultPanel) {
        var checkValue;
        Ac = new BMap.Autocomplete( //建立一个自动完成的对象
            {
                "input": pointId,
                "location" : map,
                "types":"city"//只返回城市
                /*,
                onSearchComplete:function (res) {
                	var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                	console.log(pp);
                }*/
            });
        Ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if(e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if(e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            G(searchResultPanel).innerHTML = str;
        });

        Ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            G(searchResultPanel).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + checkValue;
        });
    }


/*任务查看按钮*/
$(".p7-mission-btn").click(function () {
	$(".p7-mission-box").toggle(200);
});
/*任务关闭按钮*/
$(".p7-mission-close").click(function () {
	$(".p7-mission-box").hide(200);
});

/*添加途经点*/
var pointNum = 0;//添加后途经点总数
$(".route-input-add-icon").click(function(){
   if (pointNum>4) {return;}//最多添加5个途经点
   /* var throughHtml = '<div class="routebox-input route-through">' +
							'<div class="route-input-icon">    </div>' +  
							'<div class="p7-point-middle">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
							'</div>' +
							'<input autocomplete="off" maxlength="256" placeholder="输入途经点" class="route-through-input" type="text" value="">' +    
							'<div class="route-input-remove-icon" data-index="'+ pointNum +'"></div>' +
						'</div>' ;*/
	var throughHtml = '<div class="routebox-input route-through">' +
							'<div class="route-input-icon">    </div>' +  
							'<div class="p7-point-middle">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
								'<img src="../images/img7/point-middle.png" alt="中间点" class="p7-point-middle-img">' +
							'</div>' +
							'<input id="wayPoint'+pointNum+'" autocomplete="off" maxlength="256" placeholder="输入途经点" class="route-through-input" type="text" value="">' + 
							'<div id="wayPointDiv'+pointNum+'" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;">隐藏域</div>' +      
							'<div class="route-input-remove-icon" data-index="'+ pointNum +'"></div>' +
						'</div>' ;						
	$(".route-end").before(throughHtml);
	loadMapAutocomplete("wayPoint"+pointNum, "wayPointDiv"+pointNum);//输入框自动补全
	pointNum++;

});
/*删除途经点*/
$(".routebox-inputs").on('click','.route-input-remove-icon', function () {
	/*$(this).parent().remove();*/
	$('*[data-index="'+ (pointNum-1) +'"]').parent().remove();//始终先移除最后一个途经点
    pointNum--;
});

/*路线选项-多选框效果控制*/
$(".btn-check").click(function () {
	var roadType = $(this).attr("roadType");
	resultAhow(roadType);
});

/*搜索按钮*/
$(".p7-menu-search").click(function () {
	resultAhow(0);//默认显示最少时间方案	
});
/*搜索结果显示*/
function resultAhow(roadType) {
	//三种路线选项(驾车策略)：最少时间，最短距离，避开高速
	var routePolicy = [BMAP_DRIVING_POLICY_LEAST_TIME,BMAP_DRIVING_POLICY_LEAST_DISTANCE,BMAP_DRIVING_POLICY_AVOID_HIGHWAYS];
	var start = $(".route-start-input").val();//起点
	var end = $(".route-end-input").val();//终点

	if (start != "" &&　end != "" ) {
		// 路线选项复选框
		$(".btn-check").find("img").hide();
		$("[roadType="+ roadType +"]").find("img").show();
		// 方案显示面板
		$(".plan").hide();
		$("#plan-result-" + roadType).show();
		
		drivingRouteSearch(start, end, getWayPoints(), routePolicy[roadType], roadType);
	} else {
		showAlert("请输入起点和终点","end");
	}
}

/*获取路径途经点-删除空白的途经点*/
function getWayPoints() {
	var wayPointArr = [];
	var nullInput = 0;//记录空白的途经点数量
	for (var i = 0; i < pointNum; i++) {
		var pointName = $('*[data-index="'+ i +'"]').parent().find("input").val().trim();
		if (pointName != "") {
			wayPointArr.push(pointName);
		} else {
			nullInput++;
		}
	}
	if (nullInput > 0) {//按顺序（data-index=0、1、2、3、4、5）删除空白的途经点，将值补充到前面的input
		for (var i = 0; i < pointNum; i++) {
			if (i < wayPointArr.length) {
				$('*[data-index="'+ i +'"]').parent().find("input").val(wayPointArr[i]);
			} else {
				$('*[data-index="'+ i +'"]').parent().remove();
			}
		}
	} 
	pointNum = wayPointArr.length;//更新途经点个数
	// console.log(wayPointArr+"途经点个数:"+pointNum);
	return wayPointArr;
}

/*查询方案*/
var currentAnswer = null;//当前答案<==>最后一次查询结果
function drivingRouteSearch(start, end, wayPointArr, route, routeType){ 
		// 判断地名是否存在！！！！！！！！！！！！！！！！！！！！！！！！待优化！！！

		map.clearOverlays(); //清除覆盖物
		// var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true},policy: route});
		// var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map ,panel:"plan-result-1", autoViewport: true},policy: route});
		var driving = new BMap.DrivingRoute(map, {
			renderOptions:{map: map ,autoViewport: true},
			policy: route,
			onSearchComplete: function(results){
				var num = results.getNumPlans();//获取方案数量
				if (num>0) {
		            var plan = results.getPlan(0);// 获取第一条方案
		            $("#result-"+ routeType +"-time").html(plan.getDuration()+"&nbsp;|");
		            $("#result-"+ routeType +"-dist").html(plan.getDistance());
		            $(".p7-menu-confirm").css("display","inline-block");//确定按钮
				} else {
					$("#result-"+ routeType +"-time").html("没有可选方案");
					$(".p7-menu-confirm").hide();//确定按钮
				}
			}
		});
		driving.search(start,end, {waypoints:wayPointArr});
		currentAnswer = [start, end, wayPointArr, routeType];
	}

/*随机出题*/
var standerAnswer = null;//标准答案[起点，终点，途经点，驾车策略]
function question() {
	var nameArr = ["小李","小张","小王"];//人名
	var startArr = ["南京市","扬州市","常州市","苏州市","上海市"];//起点
	var endArr = ["深圳市","广州市","珠海市","南宁市","昆明市"];//终点
	var wayArr = ["合肥市","武汉市","南昌市","长沙市","重庆市"];//途径城市
	var routePolicy = ["最少时间", "最短距离", "避开高速"]//三种路线选项(驾车策略0,1,2)

	
	var rStart = getRandom(startArr);
	var rEnd = getRandom(endArr);
	var rWay = getRandom(wayArr);
	var rPolicy = getRandom(routePolicy);

	$(".p7-mission-box span").empty();
	var questionText = ""+ getRandom(nameArr) +"准备从"+ rStart +"运送一批货物去"+ rEnd +"，利用地图寻找最佳路线。<br/>" +
					   "1.要求"+ rPolicy +"<br/>" +
					   "2.要求经过"+ rWay +"装货<br/>";
	$(".p7-mission-box span").html(questionText);

	rPolicyAnswer = 0;
	if (rPolicy == "最少时间") {
		rPolicyAnswer = 0;
	}else if (rPolicy == "最短距离") {
		rPolicyAnswer = 1;
	}else{
		rPolicyAnswer = 2;
	}
	standerAnswer = [rStart, rEnd, rWay, rPolicyAnswer];
}
/*随机获取数组中的值*/
function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
/*提交答案*/
$(".p7-menu-confirm").click(function () {
	console.log("当前答案："+currentAnswer.toString());
	console.log("标准答案："+standerAnswer.toString());
	if (currentAnswer.toString() == standerAnswer.toString()) {
		showAlert('游戏完成，返回主界面!','end',function(){
					window.location.href = "index.html";
				}, "false");
	}else {
		showAlert('答案错误，请重新选择！','end');
		return;
	}
});
