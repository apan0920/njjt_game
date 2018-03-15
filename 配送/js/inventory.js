/*
 * goodsList1,goodsList2,goodsList3:保存ABC各个订单的信息，不包含数量[编号，名称；编号，名称;...]
 * company1Detail,company2Detail,company3Detail:保存ABC各个订单的详细信息，包括数量[编号，名称，数量，单位]
 * goodsDetail：ABC订单各种货物的需求数量[编号，名称，数量，单位]
 * total：库存信息：[[编号，数量],[编号，数量],...]
 * totalBak：库存信息：[[编号，数量],[编号，数量],...]
 * priorityList:单一分配已分配的订单列表[1,2,3]
 * outOrder：缺货订单列表[1,2,3]
 * outBak：缺货订单列表[1,2,3](备份)
 * priorityList:批量分配优先级列表1,2,3
 * 1_deal,2_deal,3_deal:1~6，不足订单处理的措施
 */
$(function () {
	// gameOver();
	// 判断是游戏一：存货分配or游戏二：拣货单制作
	if (get_address('orderMake') == "1") {
		$('#company1').hide();
		nextGame();
	}
});

//显示产品选择页面
function showGoods(obj){
	$("#dlg").modal("toggle");  
	$("#chooseGoodsType").val($(obj).attr("x"));
}

//新增产品确认
function chooseGoods(){
	$("#dealBtn").show();
	var goodsCode = $("input[name='goodsId']:checked").attr("gc");
	var goodsName = $("input[name='goodsId']:checked").attr("gn");
	var unit = $("input[name='goodsId']:checked").attr("unit");
	var type = $("#chooseGoodsType").val();
	if(goodsCode == null){
		$("#alertSpan").html("请选择产品");
		$("#resultAlert").modal("toggle");
		return;
	}
	$("#dlg").modal("hide");
	var goodsList = get_address("goodsList"+type);
	if(goodsList != null){
		if(goodsList.indexOf(goodsCode) != -1){
			$("#alertSpan").html("产品已存在");
			$("#resultAlert").modal("toggle");
			return;
		}else{
			goodsList = goodsList + goodsCode + "," + goodsName + ";";
		}
	}else{
		goodsList = goodsCode + "," + goodsName + ";";
	}
	set_address("goodsList"+type, goodsList);
	var len = $("#table"+type+" tr").length;
	var htmls = "<tr style='text-align:center'>"
				+"<td>"+ (len + 1) +"</td>"
				+"<td>"+ goodsName +"</td>"
				+"<td>"+ goodsCode +"</td>"
				+"<td>"+ unit +"</td>"
				+"<td><input class='form-control' name='goodsNum"+(len + 1)+"' x='"+(len + 1)+"' gn='"+goodsName+"' gc='"+goodsCode+"' unit='"+unit+"' /></td>"
				+"<td><input class='form-control' id='"+type+"_remark"+(len + 1)+"'/></td>"
				+"</tr>";
	$("#table"+type).append(htmls);
}

//保存产品数量
function saveGoods(obj){
	var type = $(obj).attr("x");
	var flag = true;
	if($("#table"+type+" tr").length < 1){
		$("#alertSpan").html("请添加产品");
		$("#resultAlert").modal("toggle");
		return;
	}
	$("#table" + type + " input[name^='goodsNum']").each(function(){
		if(!($(this).val() > 0)){
			$("#alertSpan").html("请填写正确的产品数量");
			$("#resultAlert").modal("toggle");
			flag = false;
			return false;
		}
	});
	if(flag){
		var detail = "";
		$("#table" + type + " input[name^='goodsNum']").each(function(){
			var ind = $(this).attr("x");
			var remark = "";
			if ($("#"+type+"_remark"+ind).val() != null) {
				remark = $("#"+type+"_remark"+ind).val();
			}
			detail += $(this).attr("gc") + "," + $(this).attr("gn") + "," + $(this).val() + "," + $(this).attr("unit") + "," + remark + ",";
		});
		set_address("company"+type+"Detail", detail);
		$("#company"+type).hide();
		if(type != 3){
			$("#company"+(type*1+1)).show();
		}else{
			parent.searchStorage();//显示文字介绍--库存查询
		}
	}
}

//显示库存信息
function showInventory(){
	parent.searchStorageRes();//显示库存查询结果界面-pz
	$("#table5").show();
	setInventory();
	var totalBak = "6920459905321,A010101,"+$("#inventory1").html()
				+",A010103,"+$("#inventory2").html() +",6920459905395,B010203," + $("#inventory3").html() 
				+ ",6920459904587,C010102,"+$("#inventory4").html()+ ",C010103," + $("#inventory5").html()
				+ ",6920459906687,D010203," +$("#inventory6").html() + ",6920459904698,E020301," + $("#inventory7").html();
	set_address("totalBak",totalBak);
	saveTotalNum();
}

//填写库存信息
function setInventory(){
	var detailA = get_address("company1Detail");
	var detailB = get_address("company2Detail");
	var detailC = get_address("company3Detail");
	var arrs = new Array();
	var details = detailA.split(",");
	for(var i = 0;i < details.length - 1;i++){
		arrs.push(details[i]);
	}
	arrs = checkGoods(detailB.split(","),arrs);
	arrs = checkGoods(detailC.split(","),arrs);
	set_address("goodsDetail",arrs);
	var flag1 = true;
	var flag2 = true;
	var flag3 = true;
	var flag4 = true;
	var flag5 = true;
	for(var i = 0;i < arrs.length;i = i + 5){
		if(arrs[i] == "6920459905321"){//完达山牛奶
			$("#inventory1").html((arrs[i+2]/2+8).toFixed(0));//（1）所有 订单中 完达山牛奶 数量之和的 1/2 + 8  取整数
			$("#inventory2").html((arrs[i+2]/2).toFixed(0));//（2）所有 订单中 完达山牛奶 数量之和的 1/2   取整数
			flag1 = false;
		}
		if(arrs[i] == "6920459905395"){//康师傅水
			if((arrs[i+2]-2) > 0){
				$("#inventory3").html(arrs[i+2]*1-2);//（3）所有 订单中 康师傅水 数量之和 — 2  最小值为0
			}else{
				$("#inventory3").html(0);
			}
			flag2 = false;
		}
		if(arrs[i] == "6920459904587"){//冰红茶
			$("#inventory4").html(arrs[i+2]*1+2);//（4）所有 订单中 冰红茶 数量之和 + 2 
			$("#inventory5").html(arrs[i+2]*1+2);//（5）所有 订单中 冰红茶 数量之和 + 2
			flag3 = false;
		}
		if(arrs[i] == "6920459906687"){//德芙巧克力
			$("#inventory6").html(arrs[i+2]*1+4);//（6）所有 订单中 德芙巧克力 数量之和 + 4 
			flag4 = false;
		}
		if(arrs[i] == "6920459904698"){//海之蓝酒
			$("#inventory7").html(arrs[i+2]*1+3);//（7） 所有 订单中 海之蓝酒 数量之和＋３
			flag5 = false;
		}
	}
	if(flag1){//没有选择牛奶
		$("#inventory1").html(8);
		$("#inventory2").html(0);
	}
	if(flag2){//没有选择康师傅水
		$("#inventory3").html(0);
	}
	if(flag3){//没有选择冰红茶
		$("#inventory4").html(2);
		$("#inventory5").html(2);
	}
	if(flag4){//没有选择德芙巧克力
		$("#inventory6").html(4);
	}
	if(flag5){//没有选择海之蓝酒
		$("#inventory7").html(3);
	}
}

// 订单分配
function orderDistribute() {
	parent.step5();
}

//单一订单分配
function singleDistribute(){
	parent.step5Res();//显示单一订单分配-pz
	$("#orderList").modal("toggle"); 
}

function checkGoods(details,arrs){
	for(var i = 0;i < details.length - 1;i = i + 5){
		var flag = true;
		for(var j = 0;j < arrs.length;j = j + 5){
			if(arrs[j] == details[i]){//根据产品编号判断是否为同一产品
				//是，则数量相加
				arrs[j+2] = arrs[j+2]*1 + details[i+2]*1;
				flag = false;
				break;
			}
		}
		if(flag){
			//若不是
			arrs.push(details[i]);//编号
			arrs.push(details[i+1]);//名称
			arrs.push(details[i+2]);//数量
			arrs.push(details[i+3]);//单位
			arrs.push(details[i+4]);//备注
		}
	}
	return arrs;
}

//保存库存数量
function saveTotalNum(){
	var arr = new Array();
	arr.push("6920459905321");//完达山牛奶	
	arr.push($("#inventory1").html()*1 + $("#inventory2").html()*1);
	
	arr.push("6920459905395");//康师傅水	
	arr.push($("#inventory3").html()*1);
	
	arr.push("6920459904587");//冰红茶
	arr.push($("#inventory4").html()*1 + $("#inventory5").html()*1);
	
	arr.push("6920459906687");//德芙巧克力	
	arr.push($("#inventory6").html());
	
	arr.push("6920459904698");//海之蓝酒	
	arr.push($("#inventory7").html());
	
	set_address("total",arr);
	set_address("total2",arr);
}

//显示订单详情 obj:订单id
var orderId = "";
function showOrderDetail(obj){
	orderId = obj;
	var priorityList = get_address("priorityList");//已分配订单
	if(priorityList != null && priorityList.indexOf(orderId) != -1){//不存在，未分配
		$("#alertSpan").html("该订单已分配");
		$("#resultAlert").modal("toggle");
		return;
	}
	$('#orderList').modal('hide');
	$("#table5").hide();
	$("#table6").show();
	var orderNo = '';//表单title对应的图片a\b\c
	if (orderId == 1){
		orderNo = 'a';
		$("#orderType").html("A订单");
	} else if (orderId == 2){
		orderNo = 'b';
		$("#orderType").html("B订单");
	} else{
		orderNo = 'c';
		$("#orderType").html("C订单");
	}
	//添加表单title
	var orderNoImgHtml = '<img src="../images/inventory/order-'+ orderNo +'.png" class="sel_title"></img>';
	$('#orderNoImg').empty().append(orderNoImgHtml);

	var total = get_address("total");
	var totalArr = total.split(",");
	var orderDetail = get_address("company"+orderId+"Detail");
	var goodsArr = orderDetail.split(",");
	var htmls = "";
	$("#tbody6").html("");
	for(var i = 0;i < goodsArr.length - 1;i = i + 5){
		var index = totalArr.indexOf(goodsArr[i]);//在库存中该商品编号的位置，则其库存数量位置为index+1
		htmls += "<tr><td>"+ (i*1 + 1) +"<input type='hidden' value='"+ goodsArr[i+2] +"' id='"+orderId+"checkNum"+i+"'></td>"//序号
				+"<td>"+ goodsArr[i+1] +"</td>"//产品名称
				+"<td>"+ goodsArr[i+3] +"</td>"//单位
				+"<td><span id='"+ orderId +"inventory"+ i +"'>"+ totalArr[index*1 + 1]+"</span></td>"//库存数量
				+"<td><input class='form-control' id='"+ orderId +"inputNum"+ i +"'></td>"//A订单数量
				+"<td><input type = 'radio' name='"+ orderId +"stockFlag"+ i +"' value='1'/>是 "
				+"&nbsp;<input type = 'radio' name='"+ orderId +"stockFlag"+ i +"' value='0'/>否</td></tr>";//是否缺货
		var num = totalArr[index*1 + 1] - goodsArr[i+2];//库存数量 = 库存数量 - 订单数量
		if (num < 0){
			totalArr[index*1 + 1] = 0;
		} else {
			totalArr[index*1 + 1] = num;
		}
	}
	htmls += "<tr>" 
		+ "<td>" + goodsArr.length + "</td>"
		+ "<td colspan='3'>是否满足订单</td>"
		+ "<td colspan='3'><input type='radio' name='"+ orderId +"fillFlag' value='0'>是"
		+ "&nbsp;<input type='radio' name='"+ orderId +"fillFlag' value='1'>否</td>"
		+ "</tr>";
	set_address("total",totalArr);
	$("#tbody6").append(htmls);
}

//单一分配确认
function ensureSingle(){
	if (!checkNum(orderId)){
		$("#alertSpan").html("请正确填写表单");
		$("#resultAlert").modal("toggle");
		return;
	}
	var priorityList = get_address("priorityList");
	if (priorityList != null) {
		priorityList = priorityList + "," + orderId;
	} else {
		priorityList = orderId+"";
	}
	set_address("priorityList",priorityList);
	if (priorityList.split(",").length == 3) {//全部加载完成
		$("#table6").hide();
		$("#table7_div2").hide();
		$("#table7").show();
	} else { //否则
		//移除
		$("#orderDetail li[id='li"+orderId+"']").remove();
		singleDistribute();//选择订单
	}
}

//验证学生填的数字是否与原订单相同
function checkNum(obj){
	var detailArr = get_address("company"+orderId+"Detail").split(",");
	var flag = true;
	var fillFlag = $("input[name='"+obj+"fillFlag']:checked").val();//整个订单是否满足
	var outFlag = false;
	for	(var i = 0;i < detailArr.length - 1;i=i+5) {
		//填的跟原来的数字不一样
		var checkNum = $("#"+obj+"checkNum"+i).val();
		var inputNum = $("#"+obj+"inputNum"+i).val();
		var inventory = $("#"+obj+"inventory"+i).html();//库存数量
		var checkFlag = $("input[name='"+obj+"stockFlag"+i+"']:checked").val();//单个产品是否满足
		if (checkNum*1 != inputNum*1){
			flag = false;
			return false;
		}
		var cf = inventory*1 >= inputNum*1?0:1;//是否缺货 0:不缺货，1：缺货
		if(cf == 1){//缺货
			outFlag = true;
		}
		if (cf != checkFlag) {
			flag = false;
			return false;
		}
		
	}
	if (outFlag){//整个订单缺货
		if (fillFlag == 0){//选项fillFlag：1缺货，0：不缺货
			flag = false;
		}
		var outOrder = get_address("outOrder");
		if (outOrder == null){
			outOrder = orderId;
		} else {
			outOrder = outOrder + "," + obj; 
		}
		set_address("outOrder",outOrder);
		set_address("outBak",outOrder);
	} else {//不缺货
		if (fillFlag == 1){//选项fillFlag：1缺货，0：不缺货
			flag = false;
		}
	}
	return flag;
}

//显示缺货订单页面
function outList(){
	//obj:单一，2：批量 
	var outOrder = get_address("outOrder");
	var outList = outOrder.split(",");
	for (var i = 0;i < outList.length;i++){
		var outName = "";
		if (outList[i] == 1){
			outName = "A订单";
		} else if (outList[i] == 2) {
			outName = "B订单";
		} else {
			outName = "C订单";
		}
		$("#outDetail").append("<li role='presentation' id='out"+outList[i]+"'><a role='menuitem' tabindex='-1' onclick='editResult("+outList[i]+")'>"+outName+"</a></li>");
	}
	$("#outList").modal("toggle");  
}

//填写订单意见
var out = "";
function editResult(obj){
	out = obj;
	$("#table7").hide();
	$("#outList").modal("hide");
	$("#chooseGoodsType").val(obj);
	$("#table8").show();
}

//提交意见
function ensureEdit(){
	if ($("#reasonSelect").val() == "") {
		$("#alertSpan").html("请选择“客户意见”");  
		$("#resultAlert").modal("toggle"); 
		return;
	}
	var oid = $("#chooseGoodsType").val();
	set_address(oid+"_deal",$("#select2").val())
	if ($("#outDetail li").length == 1){
		$("#resultAlert .modal-title").html("提示");
		var htmls = "<div align='center' class='modal-footer'><button onclick='gameOver()' type='button' class='btn btn-default' data-dismiss='modal'>取消</button>"
			+ "<button type='button' onclick='nextGame()' class='btn btn-primary'>下一个游戏</button></div>";
		$("#alertSpan").html("任务完成！！！是否进行“拣货单制作”游戏?"); 
		$("#nextBtn").html(htmls);
		$("#resultAlert").modal("toggle");  
	} else {
		$("#outDetail li[id='out"+ out +"']").remove();
		$("#outList").modal("toggle");  
	}
}

// 批量订单分配
function batchDistribute(){
	parent.step5Res();//显示订单分配-pz
	$("#resultAlert .modal-title").html("选择订单");
	var htmls = "<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> A订单   </div>"
		+"<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> B订单   </div>"
		+"<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> C订单   </div>";
	htmls += "<div align='center' id='batchDiv'>"
		+"<button id='distributeBtn' type='button' onclick='showAllDetail()' class='btn btn-primary'>确定</button></div>";
	$("#alertSpan").html(htmls);
	$("#resultAlert").modal("toggle");
}

//批量订单分拣
function batchDistribute2(){
	$("#resultAlert .modal-title").html("选择订单");
	var htmls = "<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> A订单   </div>"
		+"<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> B订单   </div>"
		+"<div class='checkbox'><input type='checkbox' checked='checked' disabled='disabled'> C订单   </div>";
	htmls += "<div align='center' id='batchDiv'>"
		+"<button id='distributeBtn' type='button' onclick='showAllDetail()' class='btn btn-primary'>确定</button></div>";
	$("#alertSpan").html(htmls);
	$("#resultAlert").modal("toggle");
}
//显示订单合并编辑页面
function showAllDetail(){
	$("#resultAlert").modal("hide");
	$("#company1").hide();
	$("#company2").hide();
	$("#company3").hide();
	$("#table15").hide();
	$("#table5").hide();
	$("#table9").show();
	var total = "";
	if ($("#game2").val() == "") {
		total = get_address("total");//库存信息
	} else {
		total = get_address("total2");//库存信息
	}
	var totalArr = total.split(",");//[编号，数量，编号，数量,...]
	var goodsDetail = get_address("goodsDetail").split(",");//[编号,名称，数量，单位，编号,名称，数量，单位,...]
	var htmls = "";
	var num = 1;
	for(var i = 0;i < goodsDetail.length;i = i + 5){
		var index=totalArr.indexOf(goodsDetail[i]);//找到产品编号所在的位置，+1则为其库存信息
		htmls += "<tr>"
			+ "<td>"+ num +"</td>"//序号
			+ "<td>"+ goodsDetail[i + 1] +"</td>"//产品名称
			+ "<td>"+ goodsDetail[i + 3] +"</td>"//单位
			+ "<td>"+ totalArr[index + 1] +"</td>"//库存数量
			+ "<td><input class='form-control' id='allInputNum"+ num +"' in='"+num+"' x='"+goodsDetail[i + 2]+"' y='"+ totalArr[index + 1] +"'></td>"//A+B+C订单总计
			+ "<td><input type='radio' name='AllFlag"+num+"' value='0'>是"
			+"&nbsp;&nbsp;<input type='radio' name='AllFlag"+num+"' value='1'>否</td>"//是否满足
			+ "</tr>";
		num++;
	}
	$("#tbody9").append(htmls);
}

//提交批量订单分配信息
function ensureBatch(){
	var flag = true;
	var enoughFlag = true;
	$("input[id^=allInputNum]").each(function(){
		var num =$(this).attr("in");
		if($(this).val() != $(this).attr("x")){//填的数字跟订单总的数量不一致
			flag = false;
			return false;
		}
		
		//校验库存是否足够
		var inventoryFlag = $(this).attr("x")*1 > $(this).attr("y")*1?0:1;//0:不满足 1：满足
		var radioVal=$("input[name='AllFlag"+num+"']:checked").val();
		if(inventoryFlag != radioVal){
			flag = false;
			return false;
		}
		if(inventoryFlag == 0){
			enoughFlag = false;
		}
	});
	if (!flag) {//填写不正确
		$("#alertSpan").html("请正确填写表单！");
		$("#resultAlert").modal("toggle");
	} else {
		if (enoughFlag) {//不缺货
			$("#alertSpan").html("任务完成");
			$("#resultAlert").modal("toggle");
		} else {//缺货
			$("#table9").hide();
			$("#table10").show();
		}
	}
}

//显示优先级编辑页面
function priorityList(){
	$("#table10").hide();
	$("#table11").show();
}


function ensurePriority(obj){
	var priorityList = "";
	var flag = true;
	$("select[id^='priority']").each(function(){
		if(priorityList == ""){
			priorityList += $(this).val();
		} else {
			if (priorityList.indexOf($(this).val()) != -1) {//已存在
				$("#alertSpan").html("请选择正确的顺序");
				$("#resultAlert").modal("toggle");
				flag = false;
				return false;
			} else {
				priorityList += "," + $(this).val();
			}
		}
	});
	if(flag){
		set_address("priorityList",priorityList);//优先级顺序
		$("#table11").hide();
		$("#table12").show();
	}
}

//播种式库存分配
function seed(){
	$("#table12").hide();
	$("#table13").show();
	var total = get_address("total");//库存信息
	var totalArr = total.split(",");//[编号，数量，编号，数量,...]
	var goodsDetail = get_address("goodsDetail").split(",");//[编号,名称，数量，单位，编号,名称，数量，单位,...]
	var detailA = get_address("company1Detail").split(",");//["6920459905321", "完达山牛奶", "1", "箱",...]
	var detailB = get_address("company2Detail").split(",");
	var detailC = get_address("company3Detail").split(",");
	var num = 1;
	var htmls = "";
	for (var i = 0;i < goodsDetail.length - 1;i = i + 5) {
		var index = totalArr.indexOf(goodsDetail[i]);//找到产品编号所在的位置，+1则为其库存信息
		var num1 = 0, num2 = 0,num3 = 0;
		num1 = getNumByGoodsCode(detailA,goodsDetail[i]);
		num2 = getNumByGoodsCode(detailB,goodsDetail[i]);
		num3 = getNumByGoodsCode(detailC,goodsDetail[i]);
		if (goodsDetail[i] != '6920459905395') {//6920459905395:康师傅水
			htmls += "<tr>"
				+ "<td>"+ num +"<input type='hidden' id='eachCheck"+ num +"' in='"+num+"' x='"+goodsDetail[i + 2]+"' y='"+ totalArr[index + 2] +"'></td>"//序号
				+ "<td>"+ goodsDetail[i + 1] +"</td>"//产品名称
				+ "<td>"+ goodsDetail[i + 3] +"</td>"//单位
				+ "<td>"+ totalArr[index + 1] +"</td>"//库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[i]+"' id='1_eachNum"+ num +"' x='"+num1+"'></td>"//A订单库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[i]+"' id='2_eachNum"+ num +"' x='"+num2+"'></td>"//B订单库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[i]+"' id='3_eachNum"+ num +"' x='"+num3+"'></td>"//C订单库存数量
				+ "<td><input type='radio' name='eachFlag"+num+"' value='1'>是"
				+"&nbsp;&nbsp;<input type='radio' name='eachFlag"+num+"' value='0'>否</td>"//是否满足
				+ "</tr>";
		} else {
			var totalNum = totalArr[index + 1];//库存数量
			var priorityList = get_address("priorityList").split(",");//优先级顺序
			var outOrder = get_address("outOrder");
			//各个订单原来需要的数量
			$("#num1").val(num1);
			$("#num2").val(num2);
			$("#num3").val(num3);
			for(var j = 1;j < 4;j++){
				var ind = priorityList.indexOf(""+j);//找出各个优先级对应的订单，为index + 1
				if ($("#num"+(ind*1 + 1)).val() <= totalNum) {//库存足够该订单
					totalNum -= $("#num"+(ind*1 + 1)).val();
				} else {//库存不足
					if (outOrder == null) {
						outOrder = ind*1 + 1;
					} else {
						outOrder = outOrder + "," + (ind*1 + 1);
					}
					if (totalNum == 0) {//库存为0
						$("#num"+(ind*1 + 1)).val(0);
					} else {//库存不为0
						$("#num"+(ind*1 + 1)).val(totalNum);
					}
				}
			}
			set_address("outOrder",outOrder);
			//各个订单只能分配的数量
			num1 = $("#num1").val();
			num2 = $("#num2").val();
			num3 = $("#num3").val();
			
			htmls += "<tr>"
				+ "<td>"+ num +"<input type='hidden' id='eachCheck"+ num +"' in='"+num+"' x='"+goodsDetail[i + 2]+"' y='"+ totalArr[index + 1] +"'></td>"//序号
				+ "<td>"+ goodsDetail[i + 1] +"</td>"//产品名称
				+ "<td>"+ goodsDetail[i + 3] +"</td>"//单位
				+ "<td>"+ totalArr[index + 1] +"</td>"//库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[0]+"' id='1_eachNum"+ num +"' in='"+num+"' x='"+num1+"' onblur='checkInventory(1,"+num+")'></td>"//A订单库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[0]+"' id='2_eachNum"+ num +"' in='"+num+"' x='"+num2+"' onblur='checkInventory(2,"+num+")'></td>"//B订单库存数量
				+ "<td style='width:20%'><input class='form-control' gc='"+goodsDetail[0]+"' id='3_eachNum"+ num +"' in='"+num+"' x='"+num3+"' onblur='checkInventory(3,"+num+")'></td>"//C订单库存数量
				+ "<td><input type='radio' name='eachFlag"+num+"' value='1'>是"
				+"&nbsp;&nbsp;<input type='radio' name='eachFlag"+num+"' value='0'>否</td>"//是否满足
				+ "</tr>";
		}
		num++;
	}
	$("#tbody13").append(htmls);
}

function ensureEachBatch(){
	var flag = true;
	$("input[id*='_eachNum']").each(function(){
		//比较数量与订单数量是否相同
		if ($(this).val() != $(this).attr("x")) {
			flag = false;
			return false;
		}
	});
	//比较库存是否满足
	$("input[id^='eachCheck']").each(function(){
		var index = $(this).attr("in");
		var num = $(this).attr("x");
		var inventory = $(this).attr("y");
		var inFlag = num*1 > inventory*1?0:1;
		if (inFlag != $("input[name='eachFlag"+index+"']:checked").val()) {
			flag = false;
			return false;
		}
	});
	
	if(!flag){
		$("#alertSpan").html("请正确填写表单");
		$("#resultAlert").modal("toggle");
	} else {
		$("#table13").hide();
		$("#table7_div2").hide();
		$("#table7").show();
	}
}

//根据产品编号返回数量
function getNumByGoodsCode(arr,goodsCode){
	for(var i = 0;i < arr.length - 1;i=i+5){
		if(arr[i] == goodsCode){
			return arr[i+2];
		}
	}
	return 0;
}

//检测缺货产品的是否按优先级填写
function checkInventory(id,index){
	var flag = true;
	var priorityList = get_address("priorityList").split(",");//优先级顺序
	var order = priorityList[id - 1];//获取该订单的优先级
	if ($("input[id='"+id+"_eachNum"+index+"']").val() != "") {
		if (order != 1) {//如果不是最优的，判断优先级比它高的是否已经填写
			for (var i = 1;i < order;i++) {
				var preIndex = priorityList.indexOf(i+"");//preIndex + 1 为订单类型 .input id 命名格式id='3_eachNum1',id='3_eachNum2'
				var val = $("input[id='"+(preIndex*1 + 1)+"_eachNum"+index+"']").val();
				var vala = $("input[id='"+(preIndex*1 + 1)+"_eachNum"+index+"']").attr("x");
				if (val != vala) {
					flag = false;
					$("input[id='"+id+"_eachNum"+index+"']").val("");
					break;
				}
			}
		}
		if (!flag) {
			$("#alertSpan").html("请按照优先级顺序填写缺货产品");
			$("#resultAlert").modal("toggle");
		} else {
			if ($("input[id='"+id+"_eachNum"+index+"']").val() != $("input[id='"+id+"_eachNum"+index+"']").attr("x")) {
				$("input[id='"+id+"_eachNum"+index+"']").val("");
				$("#alertSpan").html("请正确填写数量");
				$("#resultAlert").modal("toggle");
			}
		}
	}
}

$("#reasonSelect").change(function(){
	var reason = $("#reasonSelect").val();
	var str = "";
	$("#select2").empty();
	if (reason == 1) {
		 $("#select2").get(0).options.add(new Option("重新调拨",1));
		 $("#select2").get(0).options.add(new Option("取消订单",2));
	} else if (reason == 2) {
		$("#select2").get(0).options.add(new Option("公司有货时，补送不足额商品",3));
		$("#select2").get(0).options.add(new Option("公司政策不允许分批出货，删除订单中不足额部分商品",4));
		$("#select2").get(0).options.add(new Option("客户允许一定时间的延期交货，并所有订单一次配送",5));
	} else if (reason == 3){
		$("#select2").get(0).options.add(new Option("取消订单",6));
	} else {
		$("#select2").get(0).options.add(new Option("请选择...",""));
	}
});

function nextGame(){
	$("#game2").val(2);
	$("#resultAlert").modal("hide");
	$("#table8").hide();
	$(".btnClass").hide();
	showOrderTableDetail(1);
	showOrderTableDetail(2);
	showOrderTableDetail(3);
	$("#company1").show();
	$("#company2").show();
	$("#company3").show();
	
	
	setInventory();
	$("#table5").show();
	$("#table15").show();
}

function showOrderTableDetail(obj) {
	var orderDetail = get_address("company"+obj+"Detail").split(",");
	$("#table"+obj).empty();
	var len = 0;
	var htmls = "";
	for (var i = 0;i < orderDetail.length - 1;i = i + 5) {
		htmls += "<tr>"
			+ "<td>"+ (len + 1) +"</td>"
			+ "<td>"+ orderDetail[i+1] +"</td>"//名称
			+ "<td>"+ orderDetail[i] +"</td>"//编号
			+ "<td>"+ orderDetail[i+3] +"</td>"//单位
			+ "<td>"+ orderDetail[i+2] +"</td>"//数量
			+ "<td>"+ orderDetail[i+4] +"</td>"//备注
			+ "</tr>";
	}
	$("#table"+obj).html(htmls);
}

// 存货分配--游戏完成
function gameOver() {
//	window.onbeforeunload = null
	$("#inventoryBody").attr("onbeforeunload",null);
	parent.inventoryGameOver();
}


// 单一订单分拣
function singlePick(){
	$("#nextBtn").show();
	var htmls = "<div align='center' class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>取消</button>"
		+ "<button type='button' onclick='pick()' class='btn btn-primary'>确定</button></div>";
	$("#alertSpan").html("游戏将按照“存货分配”中的配货顺序拣货"); 
	$("#nextBtn").html(htmls);
	$("#resultAlert").modal("toggle");   
}
//显示客户拣货单
var companyOrder = 0;
function pick(){
	$("#alertDiv").modal("hide"); 
	$("#resultAlert").modal("hide"); 
	$("#table15").hide();
	$("#company1").hide();
	$("#company2").hide();
	$("#company3").hide();
	$("#table5").hide();
//	$("#table14").hide();
	var totalBak = get_address("totalBak").split(",");//库存信息：[编号，数量,编号，数量,...]
	var priorityArr = get_address("priorityList").split(",");
	var obj = priorityArr[companyOrder]; //公司订单顺序，1：公司A,2:公司B,3:公司C
	$("#outList").modal("hide");
	$("#chooseGoodsType").val(obj);
	var companyName = "";
	var phone = "";
	var orderNo = "";
	var orderName = "";
	//设置公司名字，单号，电话
	if (obj == 1){
		companyName = "A公司";
		phone = "025-86115093";
		orderNo = "NO0001";
		orderName = "A公司订单"
	} else if (obj == 2) {
		companyName = "B公司";
		phone = "025-86115094";
		orderNo = "NO0002";
		orderName = "B公司订单"
	} else {
		companyName = "C公司";
		phone = "025-86115095";
		orderNo = "NO0003";
		orderName = "C公司订单"
	}
	$("#orderNo").html(orderNo);
	$("#companyName").html(companyName);
	$("#phone").html(phone);
	$("#orderName").html(orderName);
	$("#table16").show();

	var orderDetail=get_address("company"+obj+"Detail").split(",");//[编号，名称，数量，单位]
	var ind = orderDetail.indexOf("6920459905395");
	if (ind != -1) {//存在康师傅水
		var orderNum = orderDetail[ind*1 + 2];//康师傅水的数量
		var index = totalBak.indexOf("6920459905395");
		if (orderNum <= totalBak[index+2]) {//库存足够
			$("#transferBtn").hide();
			$("#addGoods").show();
			$('#transferBtn').empty().html('确定');
			
			showOrderList(obj);
		} else {//库存不足
			$("#addGoods").hide();
			$("#dealBtn").hide();
			$("#transferBtn").show();
			var deal = get_address(obj+"_deal");
			if (deal == 1){//重新调拨,等调拨完成后  ，再生成拣货单
				var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='transfer()' class='btn btn-primary'>确定</button></div>";
				$("#btnDiv").empty();
				$("#btnDiv").html(htmls);
				$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：重新调拨。所以需要先完成调拨完成后  ，才能生成拣货单"); 
				totalBak[index+2] = orderNum;//设置库存数量与订单数量相同
				set_address("totalBak",totalBak);
				$("#alertDiv").modal("toggle");
			} else if (deal == 2 || deal == 6){//取消整张订单,则不生成拣货单
				$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：取消整张订单。所以该订单不生成拣货单"); 
				var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='nextOrder()' class='btn btn-primary'>确定</button></div>";
				$("#btnDiv").empty();
				$("#btnDiv").html(htmls);
				$("#alertDiv").modal("toggle"); 
			} else if (deal == 3) {//公司有货时，补送不足额商品
				var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='transfer()' class='btn btn-primary'>确定</button></div>";
				$("#btnDiv").empty();
				$("#btnDiv").html(htmls);
				$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：公司有货时，补送不足额商品。");
				totalBak[index+2] = orderNum;//设置库存数量与订单数量相同
				set_address("totalBak",totalBak);
				$("#alertDiv").modal("toggle");
			} else if (deal == 4) {//公司政策不允许分批出货，删除订单中不足额部分商品
				//则  生成拣货单  康师傅水商品 删除  其他的商品 生成拣货单
				if (orderDetail.length == 6) {
					orderDetail = null;
				} else {
					var n = 0;
					for (var j = ind;j < orderDetail.length - 5;j++) {
						orderDetail[j] = orderDetail[j+5];
						n = j;
					}
					for (var k = n;k < orderDetail.length - 1;k++){
						orderDetail[k] = "";
					}
				}
				set_address("company"+obj+"Detail",orderDetail);
				if (orderDetail != null) {
					var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='transfer()' class='btn btn-primary'>确定</button></div>";
					$("#btnDiv").empty();
					$("#btnDiv").html(htmls);
					$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：公司政策不允许分批出货，删除订单中不足额部分商品。所以需要先删除库存不足的产品，再生成拣货单。"); 
					$("#alertDiv").modal("toggle");
				} else {
					$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：公司政策不允许分批出货，删除订单中不足额部分商品。所以需要先删除库存不足的产品，再生成拣货单。<br>删除缺货产品后，该订单已没有产品，所以不产生拣货单"); 
					var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='nextOrder()' class='btn btn-primary'>确定</button></div>";
					$("#btnDiv").empty();
					$("#btnDiv").html(htmls);
					$("#alertDiv").modal("toggle"); 
				}
			} else {//(deal == 5) 客户允许一定时间的延期交货，并所有订单一次配送
				var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='transfer()' class='btn btn-primary'>确定</button></div>";
				$("#btnDiv").empty();
				$("#btnDiv").html(htmls);
				$("#dialogSpan").html("由于当前订单："+orderName+" 中的康师傅水库存不足，并且配送措施选择：客户允许一定时间的延期交货，并所有订单一次配送。所以需要先等产品库存足够  ，才能生成拣货单"); 
				totalBak[index+2] = orderNum;//设置库存数量与订单数量相同
				set_address("totalBak",totalBak);
				$("#alertDiv").modal("toggle");
			}
		}
	} else {//不存在
		showOrderList(obj);
	}
}

//显示订单物品
function showOrderGoods(){
	$("#orderGoodsList").modal("toggle");
}

//选择订单产品
function ensureAddGoods(obj){//obj:编号在company*Detail 中的位置
	var len = $("#orderBody tr").length;
	var index = $("#chooseGoodsType").val();
	$("#resultAlert").modal("hide");
	$("#alertDiv").modal("hide");
	$("#orderGoodsList").modal("hide");
	var orderDetail=get_address("company"+index+"Detail").split(",");//[编号，名称，数量，单位]
	var totalBak = get_address("totalBak").split(",");//库存【编号，数量...】
	var totalInd = totalBak.indexOf(orderDetail[obj]);
	var goodsLen = $("input[id^='"+orderDetail[obj]+"']").length;
	if (orderDetail[obj] == "6920459905321" || orderDetail[obj] == "6920459904587") {//6920459905321:完达山牛奶,6920459904587:冰红茶
		//这两张产品存在两个库位
		if (goodsLen == 2) {
			$("#alertSpan").html("该产品只存在于2个库位中，无法再添加"); 
			$("#resultAlert").modal("toggle"); 
			return false;
		} else if (goodsLen == 1 && orderDetail[obj+2] == 1) {
			$("#alertSpan").html("该产品只需要拣货1个，只能从1个库位上拣货"); 
			$("#resultAlert").modal("toggle"); 
			return false;
		}
	} else {//其他产品只有一个库位
		if (goodsLen == 1) {
			$("#alertSpan").html("该产品只存在于1个库位中，无法再添加"); 
			$("#resultAlert").modal("toggle"); 
			return false;
		}
	}
	var htmls = "<tr>" 
			+ "<td>"+(len*1 + 1)+"</td>"//序号
			+ "<td><input type='hidden' id='"+orderDetail[obj]+"_"+len+"'/>"+orderDetail[obj+1]+"</td>"//产品名称
			+ "<td>"+orderDetail[obj]+"</td>"//条码
			+ "<td>"+orderDetail[obj+3]+"</td>"//单位
			+ "<td><span id='inventory_"+len+"'></span></td>"//库存数量
			+ "<td><select class='form-control' id='select_"+len+"' x='"+len+"' onchange='orderBodySelectChange(this)'>";
	//库位列
	var aInd = "",bInd = "";
	if (orderDetail[obj] == "6920459905321") {//6920459905321:完达山牛奶
		aInd = totalBak.indexOf("A010101");
		bInd = totalBak.indexOf("A010103");
		htmls += "<option id='A010101' x='"+totalBak[aInd + 1]+"'>A010101</option>"
			+ "<option id='A010103' x='"+totalBak[bInd + 1]+"'>A010103</option>";
	} else if (orderDetail[obj] == "6920459905395") {//6920459905395:康师傅水
		aInd = totalBak.indexOf("B010203");
		htmls += "<option id='B010203' x='"+totalBak[aInd + 1]+"'>B010203</option>";
	} else if (orderDetail[obj] == "6920459904587") {//6920459904587:冰红茶
		aInd = totalBak.indexOf("C010102");
		bInd = totalBak.indexOf("C010103");
		htmls += "<option id='C010102' x='"+totalBak[aInd + 1]+"'>C010102</option>"
			+ "<option id='A010103' x='"+totalBak[bInd + 1]+"'>C010103</option>";
	} else if (orderDetail[obj] == "6920459906687") {//6920459906687:德芙巧克力
		aInd = totalBak.indexOf("D010203");
		htmls += "<option id='D010203' x='"+totalBak[aInd + 1]+"'>D010203</option>";
	} else {//海之蓝酒
		aInd = totalBak.indexOf("E020301");
		htmls += "<option id='E020301' x='"+totalBak[aInd + 1]+"'>E020301</option>";
	}
	var num = "";
	if (totalBak[totalInd+2] == 0) {
		num = 0;
	} else {
		if (totalBak[totalInd+2]*1 >= orderDetail[obj+2]*1) {
			num = orderDetail[obj+2];
		} else {
			num = totalBak[totalInd+2];
		}
	}
	htmls += "</select></td><td><input class='form-control' id='"+obj+"_pickNum"+(len*1 + 1)+"' x='"+len+"' num='"+num+"' gn='"+orderDetail[obj+1]+"' gc='"+orderDetail[obj]+"'/></td>"//拣货数量
			+ "<td><input class='form-control'/></td>"//备注
			+ "</tr>";
	$("#orderBody").append(htmls);
	$("#inventory_"+len).html(totalBak[aInd + 1]);
}
//确定调拨
function transfer(){
	$("#alertDiv").modal("hide");
	$("#transferBtn").show();
	$('#transferBtn').empty().html("调拨产品");
}
//调拨产品
function transferGoods(){
	$("#dialogSpan").html("调拨完成，请填写拣货单");
	$("#btnDiv").empty();
	$("#alertDiv").modal("toggle");
	$("#addGoods").show();
	$("#dealBtn").show();
	$("#transferBtn").hide();
	showOrderList($("#chooseGoodsType").val());
}

function nextOrder(){
	if (companyOrder != 2) {//未完成拣货
		companyOrder++;
		pick();
	} else {
		var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='newGame()' class='btn btn-primary'>确定</button></div>";
		$("#nextBtn").empty();
		$("#nextBtn").html(htmls);
		$("#alertSpan").html("任务完成"); 
		$("#resultAlert").modal("toggle"); 
	}
}

function showOrderList(obj){
//	$("#resultAlert").modal("hide");
//	$("#alertDiv").modal("hide");
	var orderDetail=get_address("company"+obj+"Detail").split(",");//[编号，名称，数量，单位]
	getOrderGoodsList(orderDetail);
}
//拣货确认
function ensureSinglePick(){
	if (checkPickDetail()) {
		//拣货成功，减去库存
		var totalBak = get_address("totalBak").split(",");
		$("input[id*='_pickNum']").each(function(){
			var len = $(this).attr("x");
			var invCode = $("#select_"+len).val();//库位
			var ind = totalBak.indexOf(invCode);
			totalBak[ind+1] = totalBak[ind+1] - $(this).val();
		});
		$("#orderBody").empty();
		set_address("totalBak",totalBak);
		pickNextOrder();
	}
}

//批量订单分拣
function batchPick(){
	$("#nextBtn").hide();
	$("#ensureBatch").hide();
	$("#ensureBatchPick").show();
	$("#alertDiv").modal("hide"); 
	$("#resultAlert").modal("hide"); 
	$("#tbody9").empty();
	batchDistribute2();
}

//确认批量拣货
function ensureBatchPick(){
	var flag = true;
	var enoughFlag = true;
	$("input[id^=allInputNum]").each(function(){
		var num =$(this).attr("in");
		if($(this).val() != $(this).attr("x")){//填的数字跟订单总的数量不一致
			flag = false;
			return false;
		}
		
		//校验库存是否足够
		var inventoryFlag = $(this).attr("x")*1 > $(this).attr("y")*1?0:1;//0:不满足 1：满足
		var radioVal=$("input[name='AllFlag"+num+"']:checked").val();
		if(inventoryFlag != radioVal){
			flag = false;
			return false;
		}
		if(inventoryFlag == 0){
			enoughFlag = false;
		}
	});
	if (!flag) {//填写不正确
		$("#alertSpan").html("请正确填写表单！");
		$("#resultAlert").modal("toggle");
	} else {
		if (enoughFlag) {//不缺货
			$("#alertSpan").html("任务完成");
			$("#resultAlert").modal("toggle");
		} else {//缺货
			$("#table9").hide();
			singlePick();
		}
	}
}

function pickNextOrder(){
	if (companyOrder != 2) {//未完成拣货
		companyOrder++;
		pick();
	} else {
		var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='newGame()' class='btn btn-primary'>确定</button></div>";
		$("#nextBtn").empty();
		$("#nextBtn").html(htmls);
		$("#alertSpan").html("任务完成"); 
		$("#resultAlert").modal("toggle"); 
	}
}

function newGame(){
	clearData();
	window.location.href="index.html";
}

//检验拣货详情是否符合
function checkPickDetail(){
	var flag = true;
	if ($("input[id*='_pickNum']").length < $("#orderGoodsDetail li").length) {
		$("#alertSpan").html("拣货未完成"); 
		$("#nextBtn").empty();
		$("#resultAlert").modal("toggle"); 
		flag = false;
		return;
	}
	if (flag) {
		$("input[id*='_pickNum']").each(function(){
			if ($(this).attr("gc") != "6920459905321" && $(this).attr("gc") != "6920459904587") {//完达山牛奶、冰红茶
				if ($(this).val() != $(this).attr("num")) {
					$("#alertSpan").html("请正确填写表单"); 
					$("#resultAlert").modal("toggle"); 
					flag = false;
					return false;
				}
				var len = $(this).attr("x");
				if ($("#inventory_"+len).html()*1 < $(this).val()*1) {
					$("#alertSpan").html("请正确填写表单"); 
					$("#resultAlert").modal("toggle"); 
					flag = false;
					return false;
				}
			}
		});
	}
	if (flag) {
		flag = checkTotalNum("6920459905321");
		if (flag) {
			flag = checkTotalNum("6920459904587");
			if (!flag) {
				$("#alertSpan").html("请正确填写表单"); 
				$("#resultAlert").modal("toggle"); 
			}
		} else {
			$("#alertSpan").html("请正确填写表单"); 
			$("#resultAlert").modal("toggle"); 
		}
	} else {
		$("#alertSpan").html("请正确填写表单"); 
		$("#resultAlert").modal("toggle"); 
		return false;
	}
	return flag;
}

function checkTotalNum(goodsCode){
	var goodsTotalNum = 0;
	$("input[id*='_pickNum'][gc='"+goodsCode+"']").each(function(){
		goodsTotalNum += $(this).val()*1;
	});
	var orderType = $("#chooseGoodsType").val();
	var orderDetail = get_address("company"+orderType+"Detail").split(",");
	var ind = orderDetail.indexOf(goodsCode);
	if (ind != -1) {
		var num = orderDetail[ind*1+2];
		if (goodsTotalNum != num) {
			return false;
		}
	}
	return true;
}

function orderBodySelectChange(obj){
	var totalBak = get_address("totalBak").split(",");//库存【编号，数量...】
	var ind = totalBak.indexOf($(obj).val());
	$("#inventory_"+$(obj).attr("x")).html(totalBak[ind + 1]);
}

//获取订单产品列表
function getOrderGoodsList(orderDetail){
	if (orderDetail.length > 5) {
		$("#transferBtn").hide();
		$("#addGoods").show();
		$("#dealBtn").show();
		$("#orderGoodsDetail").empty();
		var htmls = "";
		for (var i = 0;i < orderDetail.length - 1;i = i + 5) {
			if (orderDetail[i] != ""){
				htmls += "<li role='presentation' id='orderDetail"+i+"'><a role='menuitem' tabindex='-1' onclick='ensureAddGoods("+i+")'>"+orderDetail[i+1]+"</a></li>";
			}
		}
		$("#orderGoodsDetail").append(htmls);
	} else {
		var htmls = "<div align='center' class='modal-footer'><button type='button' onclick='pickNextOrder()' class='btn btn-primary'>确定</button></div>";
		$("#nextBtn").empty();
		$("#nextBtn").html(htmls);
		$("#alertSpan").html("该订单为空订单，将对下一张拣货单进行拣货"); 
		$("#resultAlert").modal("toggle"); 
	}
}