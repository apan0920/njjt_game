// JavaScript Document




var dates=new Date();
years=dates.getFullYear();
months=dates.getMonth()+1;
days=dates.getDate();
week=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
weeked=dates.getDay();


function weaver(obj){
obj.style.backgroundColor="#EDEDE3";
}
function out(obj){
obj.style.backgroundColor="";
}