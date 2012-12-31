document.addEventListener("deviceready", onDeviceReady_SH, false);

var gscfile = "testsh.png";

var invalidSC_SH = "successCallback";
var invalidarg_SH = {};

function validSuccessCalback_SH(filename) {
	ok(true,"캡쳐된 스크린샷 파일의 위치 : " + filename);
	start();
}

function invalidSuccessCalback_SH(filename) {
	ok(false,"캡쳐된 스크린샷 파일의 위치 : " + filename);
	start();
}

function invalidErrorCallback_SH(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_SH(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_SH(){
	
	module("ScreenShot");
	
	//test 1
	asyncTest("scr_001:captureScreenshot-모든 매개변수가 올바른 경우", function() {
		navigator.screenshot.captureScreenshot(validSuccessCalback_SH, validErrorCallback_SH , gscfile);
	});
	
	//test 2
	asyncTest("scr_002:captureScreenshot-SuccessCallback 이 null인 경우", function() {		
		 try{
			 navigator.screenshot.captureScreenshot(null, invalidErrorCallback_SH , gscfile);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 3
	asyncTest("scr_003:captureScreenshot-SuccessCallback 이 function이 아닌경우", function() {
		 try{
			 navigator.screenshot.captureScreenshot(invalidSC_SH, invalidErrorCallback_SH , gscfile);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 4
	asyncTest("scr_004:captureScreenshot-errorCallback이 null인 경우", function() {
		navigator.screenshot.captureScreenshot(validSuccessCalback_SH, null , gscfile);
	});
	
	//test 5
	asyncTest("scr_005:captureScreenshot-filename이 string이 아닌경우", function() {
		 try{
			 navigator.screenshot.captureScreenshot(invalidSuccessCalback_SH, invalidErrorCallback_SH , invalidarg_SH);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 6
	asyncTest("scr_006:captureScreenshot- 5회 반복 호출 테스트", function() {		
		try {
			for ( var i = 0; i < 5; i++) {
				navigator.screenshot.captureScreenshot(repeatSuccessCB, validErrorCallback_SH , gscfile);
			}			
			setTimeout(function(){
				ok(true, "반복 호출이 성공적으로 수행됨");
				start();
			},200);
		} catch (e) {
			ok(false, e);
			start();
		}
		
	});
}
