function set_address(name,value) {
	if(name == "" || value == "") return;
    return window.localStorage.setItem(name,value);
};

function get_address(name) {
    return window.localStorage.getItem(name);
};

function clearData(){
	window.localStorage.clear();
}
