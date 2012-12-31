document.addEventListener("deviceready", onDeviceReady_DI, false);

var gRingtonefile = "file://sdcard/Music/test.mp3";
var gRingtonename = "GangNam_style";
var gWallpaperfile = "file://sdcard/images/a.jpg";

var invalidSC_DI = "successCallback";
var invalidarg_DI = {};

function validSuccessCalback_DI() {
	ok(true,"성공적으로 SuccessCallback이 호출됨");
	start();
}

function invalidSuccessCalback_DI(filename) {
	ok(false,"SuccessCallback이 호출되어선 안됨");
	start();
}

function invalidErrorCallback_DI(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_DI(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function expectedErrorCallback_DI(response){
	ok(true,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_DI(){

	module("DeviceInteraction");

	//test 1
	asyncTest("din_001:startBeep-모든 매개변수가 올바른 경우", function() {
		navigator.deviceinteraction.startBeep(10); 
		ok(true,"startBeep 정상적으로 작동");
		start();
	});

	//test 2
	asyncTest("din_002:startBeep-매개변수가 올바르지 않은경우(number type이 아닌경우) ", function() {
		try{
			navigator.deviceinteraction.startBeep("testString"); 			
		}
		catch(e){
			ok(true,"exception 정상적으로 발생");
			start();			
		}
	});

	//test 3
	asyncTest("din_003:stopBeep-모든 매개변수가 올바른 경우", function() {
		setTimeout(function(){
			navigator.deviceinteraction.stopBeep(); 
			ok(true,"stopBeep 정상적으로 작동");
			start();
		},3000)
	});
	
	//test 4
	asyncTest("din_004:start/stopBeep- 5회 반복 호출 테스트", function() {
		try {
			var count = 0;
			var repeat = function () {
				navigator.deviceinteraction.startBeep(1);
				setTimeout(function(){
					navigator.deviceinteraction.stopBeep(); 
					count++;
					if(count < 5) {
						setTimeout(repeat,100);
					} else {
						ok(true, "반복 호출이 성공적으로 수행됨")
						start();
					}
				},2000);
			}
			
			repeat();
		} catch (e) {
			ok(false, e);
			start();
		}
	});

	//Android Test
	if(device.platform == "Android"){
		//test 5
		asyncTest("din_005:setCallRingtone-모든 매개변수가 올바른 경우", function() {
			navigator.deviceinteraction.setCallRingtone(validSuccessCalback_DI,validErrorCallback_DI,gRingtonefile,gRingtonename); 
		});

		//test 6
		asyncTest("din_006:setCallRingtone-SuccessCallback 이 null인 경우", function() {		
			try{
				navigator.deviceinteraction.setCallRingtone(null, invalidErrorCallback_DI,gRingtonefile,gRingtonename);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 7
		asyncTest("din_007:setCallRingtone-SuccessCallback 이 funtion이 아닌경우", function() {
			try{
				navigator.deviceinteraction.setCallRingtone(invalidSC_DI, invalidErrorCallback_DI,gRingtonefile,gRingtonename);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 8
		asyncTest("din_008:setCallRingtone-filePath 가 String 이 아닌경우", function() {
			try{
				navigator.deviceinteraction.setCallRingtone(invalidSuccessCalback_DI, invalidErrorCallback_DI,invalidarg_DI,gRingtonename);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 9
		asyncTest("din_009:setCallRingtone-filePath 가 device에 존재하지 않는경우", function() {
			try{
				navigator.deviceinteraction.setCallRingtone(invalidSuccessCalback_DI, expectedErrorCallback_DI,"there is no file","nofile");			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 10
		asyncTest("din_010:setWallpaper-모든 매개변수가 올바른 경우", function() {
			navigator.deviceinteraction.setWallpaper(validSuccessCalback_DI,validErrorCallback_DI,gWallpaperfile); 
		});

		//test 11
		asyncTest("din_011:setWallpaper-SuccessCallback 이 null인 경우", function() {		
			try{
				navigator.deviceinteraction.setWallpaper(null, invalidErrorCallback_DI,gWallpaperfile);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 12
		asyncTest("din_012:setWallpaper-SuccessCallback 이 funtion이 아닌경우", function() {
			try{
				navigator.deviceinteraction.setWallpaper(invalidSC_DI, invalidErrorCallback_DI,gWallpaperfile);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 13
		asyncTest("din_013:setWallpaper-filePath 가 String 이 아닌경우", function() {
			try{
				navigator.deviceinteraction.setWallpaper(invalidSuccessCalback_DI, invalidErrorCallback_DI,invalidarg_DI);			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});

		//test 14
		asyncTest("din_014:setWallpaper-filePath 가 device에 존재하지 않는경우", function() {
			try{
				navigator.deviceinteraction.setWallpaper(invalidSuccessCalback_DI, expectedErrorCallback_DI,"there is no file");			 
			}
			catch(e){
				ok(true,e);
				start();
			}
		});
	}
}
