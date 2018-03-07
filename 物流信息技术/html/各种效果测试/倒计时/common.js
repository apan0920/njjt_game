//运算方法
function yunSuan(x,y,ysf)
	{
		return eval(x+ysf+y);
	}
//检测是否为数字
function isNum(chuan)
		{
			var flag=true;
			for(var i=0;i<chuan.length;i++)
			{
				if(isNaN(parseInt(chuan[i])))
				{
					flag=false;
					break;
				}
				else
				{
					flag=true;
				}
			}
			return flag;
		}
//查找HTML的id
function $(selector)
{
	if(selector.substr(0,1)=="#")
	{
		return document.getElementById(selector.slice(1));
	}
}
//多少到多少之间产生随机数字
function minMax(minNum,maxNum)
		{
			return minNum+Math.floor(Math.random()*(maxNum-minNum+1));
		}