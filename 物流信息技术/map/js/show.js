// JavaScript Document
function weaver(obj){
obj.style.backgroundColor="#EDEDE3";
}
function out(obj){
obj.style.backgroundColor="";
}

var win="";
function sample(){
	var win=window.open("page04.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}

var win2="";
function sample2(){
	var win2=window.open("page14.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win2.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}

var win3="";
function sample3(){
	var win3=window.open("page15.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win3.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}


var win4="";
function sample4(){
	var win4=window.open("page16.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win4.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}



var win5="";
function sample5(){
	var win5=window.open("page06.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win5.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}



var win6="";
function sample6(){
	var win6=window.open("page08.html","","width=600,height=400,scrollbars=no,menubar=no,statusbar=no,top=50,left=200");
	win6.moveTo((screen.availWidth-600)/2,(screen.availHeight-400)/2);
}



var win7="";
function sample7(){
	var win7=window.open("../help/default.html","","width=750,height=500,scrollbars=no,menubar=no,statusbar=no,top=50,left=200,resizable=yes");
	win7.moveTo((screen.availWidth-750)/2,(screen.availHeight-500)/2);
}

$(function(){
	if($(".query_content").length > 0){
	    $(".query_content").width($(window).width()-130);
	    $(window).resize(function(){
			$(".query_content").width($(window).width()-130);
		});
	}
});
