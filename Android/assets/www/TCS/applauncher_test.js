document.addEventListener("deviceready", onDeviceReady_AL, false);

var invalidSC_AL = "successCallback";
var invalidarg_AL = {};

var gApps = {};
var gAppNum;

function validSuccessCalback_AL(response) {
	
	ok(true, response.length + " app is installed");
	
	for(var i = 0 ; i < response.length ; i ++){
		ok(true, response[i] + " is installed");
	}
	
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	
	gApps = response;
	
	start();
}

function validLaunchSuccessCallback_AL(){
	ok(true, gApps[0] + "이 정상적으로 호출됨");
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	start();
}

function invalidSuccessCalback_AL(reponse) {
	ok(false,"SuccessCallback이 호출되어선 안됨");
	start();
}

function invalidErrorCallback_AL(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_AL(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_AL(){

	module("AppLauncher");

	//test 1
	asyncTest("app_001:getInstalledApplications-모든 매개변수가 올바른 경우", function() {
		navigator.applauncher.getInstalledApplications(validSuccessCalback_AL, validErrorCallback_AL);
	});

	//test 2
	asyncTest("app_002:getInstalledApplications-SuccessCallback 이 null인 경우", function() {		
		 try{
			 navigator.applauncher.getInstalledApplications(null, invalidErrorCallback_AL);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 3
	asyncTest("app_003:getInstalledApplications-SuccessCallback 이 funtion이 아닌경우", function() {
		 try{
			 navigator.applauncher.getInstalledApplications(invalidSC_AL, invalidErrorCallback_AL);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 4
	asyncTest("app_004:launchApplication-모든 매개변수가 올바른 경우, 앱리스트의 [0]번째를 호출함", function() {
		if(device.platform == "Android"){
			confirm("launchApplication api를 테스트 하기 위해 앱리스트의 [0]번째를 호출합니다. 어플이 실행되면 back키를 눌러 앱을 종료하세요" );
		}
		else{
			confirm("launchApplication api를 테스트 하기 위해 앱리스트의 [0]번째를 호출합니다. 어플이 실행되면 다시 홈키를 눌러서 TCS를 실행해주세요" );
		}
		navigator.applauncher.launchApplication(validLaunchSuccessCallback_AL,validErrorCallback_AL, gApps[0]);	
	});
	
	//test 5
	asyncTest("app_005:launchApplication-SuccessCallback 이 null인 경우", function() {		
		 try{
			 navigator.applauncher.launchApplication(null, invalidErrorCallback_AL,gApps[gAppNum]);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 6
	asyncTest("app_006:getInstalledApplications-SuccessCallback 이 function이 아닌경우", function() {
		 try{
			 navigator.applauncher.launchApplication(invalidSC_AL, invalidErrorCallback_AL,gApps[gAppNum]);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});

	//test 6
	asyncTest("app_007:getInstalledApplications-app url이 String이 아닌경우", function() {
		 try{
			 navigator.applauncher.launchApplication(invalidSuccessCalback_AL, invalidErrorCallback_AL,invalidarg_AL);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test7
	asyncTest("app_008:getInstalledApplications 10회 반복 호출 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.applauncher.getInstalledApplications(repeatSuccessCB, validErrorCallback_AL);
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
