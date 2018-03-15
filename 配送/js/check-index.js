/*
* @Author: pz
* @Date:   2018-03-12 17:09:27
* @intro:  存货分配游戏
* @Last Modified by:   pz
* @Last Modified time: 2018-03-15 19:40:12
*/

$(function () {
    // newPlan();
	missionIntro();
    // showGoodsOnShelf(); 
    // $('#shelfBg').animate({
    //             left: '-2080px'
    //         },1000*30);
    // $('.move-div').css({"left":"-2000px"});
});
// 任务介绍
function missionIntro() {
    $('#msgBox').show();
     $("#ticker").ticker({
         rate:        10,//打印信息的速度,1/25秒是40
         delay:       4000,//阅读信息停顿的时间，2000指的是4秒
         cursorList:  "_",//显示字的后边跟的符号
         // cursor://鼠标移上去显示的样式
    }).trigger("play").trigger("stop");

    $('#ticker').on('click','#startCheck',function(){
        $('.renwu-bg').fadeOut();//隐藏任务背景
        $('#msgBox').fadeOut();
        setTimeout(function () {
            $('.move-div').fadeIn(function () {
                lock();
            });
            
        },500);
    });
}


// 锁库
function lock() {
    $('.shelf-img-lock').show().addClass('animated flash');
   
    setTimeout(function () {//现场整理
         peoMove('#sideStop','#theBackStop',1);
    },2000);
}
// 背景移动
function bgMove(dist, no) {
    $('#theBackStop').fadeOut();
    setTimeout(function () {
         $('#sideMove').fadeIn(function () {
            $('#shelfBg').animate({
                left: dist
            },3000,function () {
                peoMove('#sideMove','#theBackStop', no);
            });
         });
    },500);

   
    //  document.getElementById("shelfBg").addEventListener("webkitAnimationEnd", function(){ //动画结束时事件-移除添加的车辆 
    //     console.log(666);
    // });
    
}
// 控制小人走走停停
function peoMove(outObj ,inObj, no) {
    $(outObj).fadeOut();
    setTimeout(function () {
         $(inObj).fadeIn(function () {
            if (no != '') {
                setTimeout(function () {
                    if (no == 'print') {
                        $('#printDiv').show(function () {
                            setTimeout(function () {
                                $('#printDiv').hide();//打印动画消失
                                bgMove('-2000px','checkOrder');//打印完成走到货架旁边
                            },2000);
                           
                        });//打印动画
                    }else if (no == 'checkOrder') {//显示盘点单
                        // $('.move-div').show(); //隐藏移动层（不能隐藏-要看图填表）
                        $('.game-select-bg').addClass("game-select-bg-check").show(); //显示iframe
                        childframe.window.checkOrderShow(); //调用子页面函数显示盘点表
                        
                    } else {
                        arrange(no);//现场整理动画
                    }
                },1000);
            }
         });
    },500);
}
var selfNo = 2;
//现场整理
function arrange(no) {
    $('#fire'+ no).show(
        function () {
           setTimeout(function () {//现场整理完成
                $('#shelfBefore'+ no).hide();
                $('#fire'+ no).hide();
                $('#shelfAfter'+ no).show(function () {
                    if (selfNo<4) {
                        var dist = 500*(selfNo-1);
                        bgMove('-'+ dist +'px',selfNo)
                        selfNo++;
                    } else {
                        // alert("盘点前的准备--动画结束");
                        peoMove('#theBackStop' ,'#sideStop');
                        newPlan();//新建盘点方案
                    }
                    
                });
            },2000);
       }
       );
}

// 新建盘点方案【按钮】
function newPlan() {
    $('#newPlanDiv').show();
    $("#newPlanSpan").ticker({
         rate:        10,//打印信息的速度,1/25秒是40
         delay:       4000,//阅读信息停顿的时间，2000指的是4秒
         cursorList:  "_",//显示字的后边跟的符号
         // cursor://鼠标移上去显示的样式
    }).trigger("play").trigger("stop");

    $('#newPlanSpan').on('click','#newPlan',function(){
        childframe.window.newPlan();
    });
}
//开始新建盘点 方案
function newPlanStart() {
    $('#newPlanDiv').hide();//隐藏对话框
    $('.move-div').hide();// 隐藏移动层
    $('.game-select-bg').show();// 显示子界面
}

// 信息提示框
function prompt(textContent) {
    showAlert(textContent, 'end');
}

// 打印盘点表动画
function printAnimate() {
    $('.game-select-bg').hide();//隐藏iframe
    $('.shelf-img-lock').removeClass('animated flash');//移除锁库的闪烁动画
    $('.move-div').show();//显示移动层
    $('#sideStop').hide();
    bgMove('-1500px','print');//开始移动到打印机
    //正在打印ing动画
    //打印完成-
    //走动到货架旁边-盘点货物
    //点击盘点完成-填写盘点表
    //隐藏移动层
    //显示iframe
    //调用子页面函数显示盘点表
}
// 根据数据显示货架上的货物
function showGoodsOnShelf(goodsData, member) {
    $('#checkerId').show();
    if (member == 1) {
         $('#checkerNo').html("组员A");
    } else if (member == 2) {
        $('#checkerNo').html("组员B");
    } else if (member == 3) {
        $('#checkerNo').html("组员C");
    } else if (member == 4) {//组长 与第三个同学相同(不重新显示货物)
        $('#checkerNo').html("小组长");
        return;
    }
    // 先清空
    for (var i = 0; i < 4; i++) {
        $('.floor' + i).empty();
    }
    // 测试数据（==库存数据）
    // goodsData = [{num: 5, name: "完达山牛奶", no: "6920459905321"},
    //              {num: "3", name: "康师傅水", no: "6920459905395"},
    //              {num: "5", name: "冰红茶", no: "6920459904587"},
    //              {num: "3", name: "德芙巧克力", no: "6920459906687"},
    //              {num: "2", name: "海之蓝酒", no: "6920459904698"}];
    
    for (var i = 0; i < goodsData.length; i++) {
        
        var goodsNo = goodsData[i].no.trim();//货物代码
        var goodsName = goodsData[i].name.trim();//货物名称
        var goodsNum = goodsData[i].num*1;//货物盘点数量
        var floorNum = 0;//存放的货架层数
        var goodImg = '';
        if (goodsNo == "6920459905321") {//完达山牛奶
            goodImg = 'g-milk.png';
            floorNum = 2;
        } else if (goodsNo == "6920459905395") {//康师傅水
            goodImg = 'g-water.png';
            floorNum = 1;
        } else if (goodsNo == "6920459904587") {//冰红茶
            goodImg = 'g-tea.png';
            floorNum = 0;
        } else if (goodsNo == "6920459906687") {//德芙巧克力
            goodImg = 'g-dove.png';
            floorNum = 3;
        } else if (goodsNo == "6920459904698") {//海之蓝酒
            goodImg = 'g-wine.png';
            floorNum = 3;
        }
        var goodsHtml = '<img src="../images/check/' + goodImg + '" alt="'+ goodsName +'">';
        for (var j = 0; j < goodsData[i].num; j++) {
            $('.floor'+floorNum).append(goodsHtml);
        }
    }
}
// 信息员录入动画
function messengerAnimate() {
    $('.game-select-bg').hide();//隐藏iframe
    $('#messengerStop').hide(); //隐藏信息员图片
    $('#messengerMove').show();//显示信息员GIF
    setTimeout(function () {// 2s后
        $('#messengerMove').hide();//隐藏信息员GIF
        $('#messengerStop').show(); //显示信息员图片
        childframe.window.showPrint();//调用子页面--显示差异盘点单
        $('.game-select-bg').show();//显示iframe
       
    },2000);
    
}

// 打印订单
function diffOrderPrint(text, funName) {
    $('.move-div').hide();//隐藏移动层（因为样式有影响）
    $('#printTextId').html(text)
    $('#diffOrderPrint').show();
    setTimeout(function () {
        $('#diffOrderPrint').hide();
        $('.move-div').show();
        if (funName == "printDiff") {
            childframe.window.printDiff();//5、调用子页面--显示差异盘点单--组长复盘
        } else if(funName == "ensureEdit"){
            // 把人换成经理
            $('#theBackStop').fadeOut();//隐藏小组长图片
            $('#checkerNo').html("经理");
            $('#managerStop').fadeIn();//显示经理图片
            
            childframe.window.ensureEdit();//6、调用子页面--显示差异盘点单--经理签字
        }
        
    },2000);
    
}
// 游戏结束
function checkGameOver() {
     showAlert('游戏完成，返回主界面!','end',function(){
                    // 返回主界面
                    window.location.href = "index.html";//orderMake=1 释放拣货单制作按钮
                },"false");
}