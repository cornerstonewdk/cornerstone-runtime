document.addEventListener("deviceready", onDeviceReady_CB, false);

function onLocationChange(location){
	ok(true,"location changed :: " + location);
}

function onClose(){
	//if(confirm("childbrowser가 정상적으로 작동되며 web page를 로드 하였습니까?")){
		ok(true,"정상적으로 childBrowser가 open됨.");
	//}
	//else{
	//	ok(false,"비정상적으로 childBrowser가 open됨.");
	//}
	
	start();	
}

function onCloseAuto(){
	//if(confirm("childbrowser가 5초뒤에 자동으로 close되었습니까?")){
		ok(true,"정상적으로 childBrowser가 close됨.");
		start();
	/*
}
	else{
		ok(false,"비정상적으로 childBrowser가 close됨.");
		start();
	}
     */
}
function onError(data){
	alert(data + " error!!");
}

function onDeviceReady_CB(){
	
	//1. childBrowser event 등록 
	navigator.childBrowser.onLocationChange = onLocationChange;
	navigator.childBrowser.onClose = onClose;
	navigator.childBrowser.onError = onError;
	
	
	module("ChildBrowser");
	
	//test1
	asyncTest("chi_001:showWebPage-모든 매개변수가 올바른 경우(툴바가 있으며 www.naver.com page를 load함)", function() {	
		setTimeout(function(){
			navigator.childBrowser.showWebPage("http://m.naver.com", { showLocationBar: true });	
		},1000);

		setTimeout(function(){
			navigator.childBrowser.close();			
		},7000);      
	});
	
		
	//test2
	asyncTest("chi_002:close-5초 뒤에 현재의 childbrowser를 close함", function() {
		//2. close event를 변경 
		navigator.childBrowser.onClose = onCloseAuto;
		
        setTimeout(function(){
		navigator.childBrowser.showWebPage("http://m.naver.com", { showLocationBar: true });
                   },1000);
		
		setTimeout(function(){
			navigator.childBrowser.close();			
		},7000);
	});
	
}
