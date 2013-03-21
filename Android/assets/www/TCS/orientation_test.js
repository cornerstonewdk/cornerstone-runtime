document.addEventListener("deviceready", onDeviceReady_ORI, false);

var invalidSC_ORI = "successCallback" ; 

function orientation_handler(event){
	ok(true, "deviceorientation.alpha = " + event.alpha
			 +"\ndeviceorientation.beta = " + event.beta
			 +"\ndeviceorientation.gamma = " + event.gamma);
}

function validErrorCallback_ORI(response){
	ok(false,"다음 error code: " +  response.code + ", 발생");
	start();
}

function expectedErrorCallback_ORI(response){
	ok(true,"다음 error code: " +  response.code + ", 발생");
	start();
}

var repeatSuccessCallback_ORI_nancheck = function(rotation) {
	if( isNaN(rotation.alpha) || isNaN(rotation.beta) || isNaN(rotation.gamma) ) {
		ok(false, "device not supported");
	}
}

function onDeviceReady_ORI(){

	module("Orientation");
     
	asyncTest("ori_001:getCurrentOrientation - 모든 매개변수가 올바른 경우 ", function() {


		var onSuccess = function(rotation) {
			if( isNaN(rotation.alpha) || isNaN(rotation.beta) || isNaN(rotation.gamma) ) {
				ok(false, "device not supported");
			} else {
				ok(true, "alpah:" + rotation.alpha + " beta:" + rotation.beta + " gamma:" + rotation.gamma);
			}
			start();
		}

		navigator.orientation.getCurrentOrientation(onSuccess, validErrorCallback_ORI);
	});
	
	asyncTest("ori_002:getCurrentOrientation - successCallback이 null인 경우", function() {
		try{
			navigator.orientation.getCurrentOrientation(invalidSC_ORI, validErrorCallback_ORI);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("ori_003:getCurrentOrientation - successCallback이 function이 아닌 경우", function() {
		try{
			navigator.orientation.getCurrentOrientation(invalidSC_ORI, validErrorCallback_ORI);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("ori_004:deviceorientation event listener 확인 테스트", function() {
		window.addEventListener("deviceorientation",orientation_handler , true);
		ok(true,"add listener sucess");

		setTimeout(function(){
			window.removeEventListener("deviceorientation",orientation_handler , true);
			start();
		},200);
	});
	
	
	asyncTest("ori_005:getCurrentOrientation - 10회 반복 호출 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.orientation.getCurrentOrientation(repeatSuccessCallback_ORI_nancheck, validErrorCallback_ORI);
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