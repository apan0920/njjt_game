//判断是否为整数；
function isInteger(obj) {
 return obj%1 === 0
};
//判断是否有小数点
function isDot(num) {
    var result = (num.toString()).indexOf(".");
    if(result != -1) {
        return true;
        //alert("含有小数点");
    } else {
        return false;
        //alert("不含小数点");
    }
};

//配置 - 判断是否为数字；
function $isNaN(callback){
	var isFocusVal = '';

    $(document).on('focus','input.isNaN',function(){
        isFocusVal = $(this).val();
    });

    $(document).bind('input propertychange', 'input.isNaN:focus', function() {
        var obj = $(this).find('input.isNaN:focus');
        var _val = $(this).find('input.isNaN:focus').val();

        //alert(isInteger(_val)+"|"+parseInt(_val));

        if(isNaN(_val)){
            obj.val(isFocusVal);
        }else{
            if(obj.hasClass('isInteger')&&isDot(_val)){
                obj.val(isFocusVal);
            }else{
                // if(_val.length > 8){
                //     obj.val(isFocusVal);
                // }else{
                    isFocusVal = _val;
                // } 
            }                       
        };

        if(isFocusVal!='' && isFocusVal>0){
        	(callback && typeof(callback) === "function") && callback(1,isFocusVal);
        }else{
        	(callback && typeof(callback) === "function") && callback(2,isFocusVal);
        }               
                    
    });
};

//配置 - 限制长度；
function $isLen(callback){
    var isFocusVal = '';

    $(document).on('focus','input.isLen',function(){
        isFocusVal = $(this).val();
    });

    $(document).bind('input propertychange', 'input.isLen:focus', function() {
        var obj = $(this).find('input.isLen:focus');
        if(obj.length>0){
            var _val = $(this).find('input.isLen:focus').val();

            if(_val.length > 8){
                obj.val(isFocusVal);
            }else{
                isFocusVal = _val;
            }; 
        };   
    });
};
