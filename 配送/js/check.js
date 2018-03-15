/**
 * inventoryDetail:库存详情：[编号1，名称1，数量1，单位1,编号2，名称2，数量2，单位2,...]
 * 			["6920459905321","完达山牛奶","5","箱"],
 * 			["6920459905395","康师傅水","3","瓶"],
 * 			["6920459904587","冰红茶","5","瓶"],
 * 			["6920459906687","德芙巧克力","3","盒"],
 * 			["6920459904698","海之蓝酒","2","瓶"],
 * 
 * planDetail:盘点计划详情：[编号1，名称1，单位1；编号2，名称2，单位2；]
 * 				["6920459905321","完达山牛奶","箱";"6920459905395","康师傅水","瓶";...],
 * 1_checkDetail,2_checkDetail,...:保存着每个组员的盘点情况，[编号，数量,]
 */
$(function () {
	// newPlan();
	goodsData = [];//盘点数据
});
var inventoryDetail = "6920459905321,完达山牛奶,5,箱,6920459905395,康师傅水,3,瓶,6920459904587,冰红茶,5,瓶,6920459906687,德芙巧克力,3,盒,6920459904698,海之蓝酒,2,瓶";
var detailArr = inventoryDetail.split(",");
var num1 = "";
//新建判断按钮
function newPlan(){
	// $("#newPlan").hide();
	parent.newPlanStart();
	$("#plan_table").show();
}

//显示选择产品页面
function showGoods(){
	$("#dlg").modal("toggle");
}

//选择产品
function chooseGoods(){
	var goodsCode = $("input[name='goodsId']:checked").attr("gc");
	var goodsName = $("input[name='goodsId']:checked").attr("gn");
	var unit = $("input[name='goodsId']:checked").attr("unit");
	if(goodsCode == null){
		$("#alertSpan").html("请选择产品");
		$("#resultAlert").modal("toggle");
		return;
	}
	$("#dlg").modal("hide");
	var planDetail = get_address("planDetail");
	if(planDetail != null){
		if(planDetail.indexOf(goodsCode) != -1){
			$("#alertSpan").html("产品已存在");
			$("#resultAlert").modal("toggle");
			return;
		}else{
			planDetail = planDetail + goodsCode + "," + goodsName + "," + unit + ";";
		}
	}else{
		planDetail = goodsCode + "," + goodsName + "," + unit + ";";
	}
	set_address("planDetail", planDetail);
	var len = $("#plan_body tr").length;
	var htmls = "<tr style='text-align:center'>"
				+"<td>"+ (len + 1) +"</td>"
				+"<td>"+ goodsName +"</td>"
				+"<td>"+ goodsCode +"</td>"
				+"<td>"+ unit +"</td>"
				+"</tr>";
	$("#plan_body").append(htmls);
}


//保存盘点计划
var member = 1;//小组成员
function saveGoods(){
	var planDetail = get_address("planDetail");//盘点明细
	if (planDetail != null && planDetail.length > 0) {
		$("#plan_table").hide();//隐藏盘点方案
		parent.printAnimate();// 打印盘点表动画--调用父页面
		/*显示盘点表*/
		/*$("#check_table").show();
		$("#checkSpan").html('NO:0001');
		var htmls = getCheckBodyHtml(member);
		$("#check_body").append(htmls);*/
	}else{
		parent.prompt("请添加盘点方案明细");//弹出提示框
	}
	
}
// 显示盘点单
function checkOrderShow() {
	$("#check_table").show();
	$("#checkSpan").html('NO:0001');
	var htmls = getCheckBodyHtml(member);
	$("#check_body").append(htmls);
	// console.log(goodsData);
	parent.showGoodsOnShelf(goodsData, 1);//调用父页面方法--根据数据显示货架上的货物
	// console.log("显示货架上的货物");
}


//保存盘点详情
var diffFlag = false;//打印差异盘点单标记
function saveCheckDetail(){
	var checkDetail = "";
	var flag = checkCheckBody(member);
	if (flag) {
		$("input[id^='"+member+"_checkDetail']").each(function(){
			checkDetail += $(this).attr("gc") + "," 
			+ $(this).val() + "," ;//[编号，数量,]
		});
		set_address(member+"_checkDetail",checkDetail);
	} else {
		$("#alertSpan").html("请正确填写数量");
		$("#resultAlert").modal("toggle");
		return;
	}
	member++;
	if (member == 2) {//第二个同学
		$("#checkSpan").html('NO:0002');//添加盘点单编号
		var htmls = getCheckBodyHtml(member);
		// console.log(goodsData);
		parent.showGoodsOnShelf(goodsData, member);//调用父页面方法--根据数据显示货架上的货物

		$("#check_body").empty();
		$("#check_body").append(htmls);
	} else if (member == 3){//第三个同学
		var checkDetail1 = get_address("1_checkDetail");
		if (checkDetail1 == checkDetail) {
			// $("#alertSpan").html("任务完成");
			// $("#resultAlert").modal("toggle");
			checkGameOver();//游戏完成
		} else {
			$("#checkSpan").html('NO:0003');//添加盘点单编号
			var htmls = getCheckBodyHtml(member);
			// console.log(goodsData);
			parent.showGoodsOnShelf(goodsData, member);//调用父页面方法--根据数据显示货架上的货物

			$("#check_body").empty();
			$("#check_body").append(htmls);
		}
	} else if(member == 4){//组长 与第三个同学相同
		if (diffFlag == false) {//未打印差异盘点单
			parent.messengerAnimate();// 调用父界面--信息员录入及打印动画
			// showPrint();
		} else {
			$("#checkSpan").html("NO:0004");
			parent.showGoodsOnShelf(goodsData, member);//调用父页面方法--根据数据显示货架上的货物
			showCheckTable4();

		}
	} else {
		$("#check_table").hide();
		showDiffTable2();
		$("#diff_table2").show();
	}
}
//6、提交差异处理--前的打印动画
function ensureEditAnimate() {
	parent.diffOrderPrint("打印《打印盘点差异表》","ensureEdit");
}
//提交差异处理
function ensureEdit(){
	$("#diff_table2").hide();
	$("#report").show();
	var htmls = "";
	var arr = get_address("4_checkDetail").split(",");
	var planDetail = get_address("planDetail").split(";");
	for (var i = 0;i < planDetail.length - 1;i++) {
		var detail = planDetail[i].split(",");//[编号，名称，单位]
		var index = arr.indexOf(detail[0]);
		var num = 0;
		var ind = detailArr.indexOf(detail[0]);
		num = detailArr[ind*1 + 2];
		var diffNum = 0;
		diffNum = arr[index+1] - num;
		if (diffNum > 0) { //盘盈
			htmls += "<tr>"
				+ "<td>"+ (i*1+1) +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td>"+ arr[index+1] +"</td>"//盘点数量
				+ "<td>"+ num +"</td>"//账面数量
				+ "<td><input class='form-control' id='surplus"+ (i*1+1) +"' num='"+diffNum+"'</td>"//盘盈
				+ "<td><input class='form-control' id='loss"+ (i*1+1) +"' num=''</td>"//盘亏
				+ "</tr>";
		} else if (diffNum < 0){//盘亏
			htmls += "<tr>"
				+ "<td>"+ (i*1+1) +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td>"+ arr[index+1] +"</td>"//盘点数量
				+ "<td>"+ num +"</td>"//账面数量
				+ "<td><input class='form-control' id='surplus"+ (i*1+1) +"' num=''</td>"//盘盈
				+ "<td><input class='form-control' id='loss"+ (i*1+1) +"' num='"+(diffNum*(-1))+"'</td>"//盘亏
				+ "</tr>";
		} else {
			htmls += "<tr>"
				+ "<td>"+ (i*1+1) +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td>"+ arr[index+1] +"</td>"//盘点数量
				+ "<td>"+ num +"</td>"//账面数量
				+ "<td><input class='form-control' id='surplus"+ (i*1+1) +"' num=''</td>"//盘盈
				+ "<td><input class='form-control' id='loss"+ (i*1+1) +"' num=''</td>"//盘亏
				+ "</tr>";
		}
	}
	$("#report_body").append(htmls);
}

//提交盘点报告
function submit(){
	var flag = true;
	$("input[id^='surplus']").each(function(){
		if ($(this).val() != $(this).attr("num")) {
			flag = false;
			return false;
		}
	});
	$("input[id^='loss']").each(function(){
		if ($(this).val() != $(this).attr("num")) {
			flag = false;
			return false;
		}
	});
	if (flag) {
		/*$("#alertSpan").html("任务完成");
		$("#resultAlert").modal("toggle");*/
		parent.checkGameOver();//游戏完成
	} else {
		$("#alertSpan").html("请正确填写表单");
		$("#resultAlert").modal("toggle");
	}
}

// 5.打印差异盘点单-前的打印动画
function printDiffAnimate(){
	parent.diffOrderPrint("打印《打印盘点差异单》","printDiff");// 调用父级--打印动画
}
//打印差异盘点表
function printDiff(){
	diffFlag = true;
	member--;
	saveCheckDetail();
}

//显示盘点差异表
function showPrint(){
	$("#check_table").hide();
	$("#diff_table").show();
	var htmls = "";
	var planDetail = get_address("planDetail").split(";");
	var arr1 = get_address("1_checkDetail").split(",");
	var arr2 = get_address("2_checkDetail").split(",");
	var arr3 = get_address("3_checkDetail").split(",");
	for (var i = 0;i < planDetail.length - 1;i++) {
		var detail = planDetail[i].split(",");//[编号，名称，单位]
		var index1 = arr1.indexOf(detail[0]);
		var index2 = arr2.indexOf(detail[0]);
		var index3 = arr3.indexOf(detail[0]);
		htmls += "<tr>"
			+ "<td>"+ (i*1+1) +"</td>"//序号
			+ "<td>"+ detail[1] +"</td>"//产品名称
			+ "<td>"+ detail[0] +"</td>"//条码
			+ "<td>"+ detail[2] +"</td>"//单位
			+ "<td>"+arr1[index1*1 + 1]+"</td>"//组员A
			+ "<td>"+arr2[index2*1 + 1]+"</td>"//组员B
			+ "<td>"+arr3[index3*1 + 1]+"</td>"//组员C
			+ "</tr>";
	}
	$("#diff_body").append(htmls);
}
//显示组长盘点页面
function showCheckTable4(){
	var htmls = "";
	var arr = get_address("3_checkDetail").split(",");
	var planDetail = get_address("planDetail").split(";");
	for (var i = 0;i < planDetail.length - 1;i++) {
		var detail = planDetail[i].split(",");//[编号，名称，单位]
		var index = arr.indexOf(detail[0]);
		htmls += "<tr>"
			+ "<td>"+ (i*1+1) +"</td>"//序号
			+ "<td>"+ detail[1] +"</td>"//产品名称
			+ "<td>"+ detail[0] +"</td>"//条码
			+ "<td>"+ detail[2] +"</td>"//单位
			+ "<td><input class='form-control' id='4_checkDetail"+ (i*1+1) +"' goodsNum='"+ arr[index*1 + 1] +"'  gn='"+detail[1]+"' gc='"+detail[0]+"' unit='"+detail[2]+"' </td>"//数量
			+ "</tr>";
	}
	$("#check_body").empty();
	$("#check_body").append(htmls);
	$("#diff_table").hide();
	$("#check_table").show();
}

//显示盘点单差异表
function showDiffTable2(){
	var htmls = "";
	var arr = get_address("4_checkDetail").split(",");
	var planDetail = get_address("planDetail").split(";");
	var arr1 = get_address("1_checkDetail").split(",");
	var arr2 = get_address("2_checkDetail").split(",");
	var arr3 = get_address("3_checkDetail").split(",");
	for (var i = 0;i < planDetail.length - 1;i++) {
		var detail = planDetail[i].split(",");//[编号，名称，单位]
		var index = arr.indexOf(detail[0]);
		var num = 0;
		var ind = detailArr.indexOf(detail[0]);
		num = detailArr[ind*1 + 2];
		var index1 = arr1.indexOf(detail[0]);
		var index2 = arr2.indexOf(detail[0]);
		var index3 = arr3.indexOf(detail[0]);
		if (i == 0) {
			htmls += "<tr>"
				+ "<td>"+ (i*1+1) +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>";//单位
			//组员A
			if (arr1[index1*1 + 1] == num) {
				htmls += "<td>"+arr1[index1*1 + 1]+"</td>";
			} else {
				htmls += "<td><font color='red'>"+arr1[index1*1 + 1]+"</font></td>";
			}
			//组员B
			if (arr2[index2*1 + 1] == num) {
				htmls += "<td>"+arr2[index2*1 + 1]+"</td>";
			} else {
				htmls += "<td><font color='red'>"+arr2[index2*1 + 1]+"</font></td>";
			}
			//组员C
			if (arr3[index3*1 + 1] == num) {
				htmls += "<td>"+arr3[index3*1 + 1]+"</td>";
			} else {
				htmls += "<td><font color='red'>"+arr3[index3*1 + 1]+"</font></td>";
			}
			//组长
			if (arr[index*1 + 1] == num) {
				htmls += "<td>"+arr[index*1 + 1]+"</td>";
			} else {
				htmls += "<td><font color='red'>"+arr[index*1 + 1]+"</font></td>";
			}
			/*htmls +="<td style='text-align: left;'><select class='form-control' style='width:206px;'>"*/
			htmls +="<td style='text-align: left;'><select class='form-control' >"
                + "<option>错盘、漏盘</option>"
                + "<option>计算错误</option>"
                + "<option>偷窃</option>"
                + "<option>收货错误，或空收货，结果帐多物少</option>"
                + "<option>报废商品未进行库存更正</option>"
                + "<option>对一些清货商品，未计算降价损失</option>"
                + "<option>生鲜品失重等处理不当； 商品变价未登记和任意变价</option>"
                + "</select></td>"
				// + "<td><select class='form-control' style='width:206px;'>"
				+ "<td><select class='form-control' >"
				+ "<option>重新确认盘点区域，看是否漏盘</option>"
				+ "<option>检查收货，有无异常进货，并且未录入电脑</option>"
				+ "<option>检查有无退货，并且未录入电脑</option>"
				+ "<option>检查库存更正及清货变价表</option>"
				+ "<option>检查是否有新来生鲜处理员工，技术不熟练</option>"
				+ "<option>重新计算</option>"
				+ "</select></td>"//组员C
				+ "</tr>";
		} else {
			htmls += "<tr>"
				+ "<td>"+ (i*1+1) +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td>"+arr1[index1*1 + 1]+"</td>"
				+ "<td>"+arr2[index2*1 + 1]+"</td>"
				+ "<td>"+arr3[index3*1 + 1]+"</td>"	
				+ "<td>"+arr[index*1 + 1]+"</td>"
				+ "<td>无</td>"//组员B
				+ "<td>无</td>"//组员B
				+ "</tr>";
		}
	}
	$("#diff_body2").append(htmls);
}

//校验盘点表是否填写完成
function checkCheckBody(obj){
	var flag = true;
	$("input[id^='"+obj+"_checkDetail']").each(function(){
		var inputNum = $(this).val();//输入的数量
		if (inputNum != $(this).attr("goodsNum")) {
			flag = false;
			return false;
		}
	});
	return flag;
}

//获取盘点表checkbody拼接的html
function getCheckBodyHtml(obj){
	goodsData = [];//清空上个人的盘点数据
	var str = "";

	var planDetail = get_address("planDetail").split(";");

	var trNum = 1;
	for (var i = 0;i < planDetail.length - 1;i++) {
		var goodsDataObj = new Object();//盘点表中每个产品对应的当前数量
		var detail = planDetail[i].split(",");//[编号，名称，单位]
		var num = 0;
		var ind = detailArr.indexOf(detail[0]);
		num = detailArr[ind*1 + 2];
		if (i != 0) {//默认第一个为差异产品
			str += "<tr>"
				+ "<td>"+ trNum +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td><input class='form-control' id='"+obj+"_checkDetail"+ (i*1+1) +"' goodsNum='"+ num +"'  gn='"+detail[1]+"' gc='"+detail[0]+"' unit='"+detail[2]+"' </td>"//数量
				+ "</tr>";
			goodsDataObj.num = num;//正确盘点数量--pz
		} else {//完达山牛奶
			var goodsNum = randomNum(1,num);
			if (obj == 1) {
				num1 = goodsNum;
			} else if (obj == 2){
				while (goodsNum == num1) {
					goodsNum = randomNum(1,num);
				}
			}
			str += "<tr>"
				+ "<td>"+ trNum +"</td>"//序号
				+ "<td>"+ detail[1] +"</td>"//产品名称
				+ "<td>"+ detail[0] +"</td>"//条码
				+ "<td>"+ detail[2] +"</td>"//单位
				+ "<td><input class='form-control' id='"+obj+"_checkDetail"+ (i*1+1) +"' goodsNum='"+ goodsNum +"'  gn='"+detail[1]+"' gc='"+detail[0]+"' unit='"+detail[2]+"' </td>"//数量
				+ "</tr>";
			goodsDataObj.num = goodsNum;//正确盘点数量
		}
		goodsDataObj.name = detail[1];//产品名称
		goodsDataObj.no = detail[0];//产品条码
		// goodsDataObj.num = detail[1];//正确盘点数量
		goodsData.push(goodsDataObj);
		console.log(goodsData);//盘点数据调试--pz
		trNum++;
	}
	return str;
}

//生成从minNum到maxNum的随机数
function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 