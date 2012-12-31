document.addEventListener("deviceready", onDeviceReady_AC, false);

var invalidSC_AC = "successCallback" ; 

function acceleration_handler(event) {
	ok(true,"accelerationIncludingGravity.x = " + event.accelerationIncludingGravity.x +
			"\naccelerationIncludingGravity.y = " + event.accelerationIncludingGravity.y +
			"\naccelerationIncludingGravity.z = " + event.accelerationIncludingGravity.z);
}

function validErrorCallback_AC(response){
	ok(false,"다음 error code: " +  response.code + ", 발생");
	start();
}

function expectedErrorCallback_AC(response){
	ok(true,"다음 error code: " +  response.code + ", 발생");
	start();
}

var repeatSuccessCallback_AC_nancheck = function(acc) {
	if( isNaN(acc.x) || isNaN(acc.y) || isNaN(acc.z) ) {
		ok(false, "반복 호출 테스트 실패");
	}
}

function onDeviceReady_AC(){

	module("Accelerometer");

	asyncTest("acc_001:watchAcceleration - 모든 매개변수가 올바른 경우", function() {

		var onSuccess = function(acc) {
			if( isNaN(acc.x) || isNaN(acc.y) || isNaN(acc.z) ) {
				ok(false, "device not supported");
			}	else {
				ok(true, "acc.x : " + acc.x + " acc.y : " + acc.y + " acc.z : " + acc.z);
			}
			navigator.accelerometer.clearWatch(accelerationWatch);
			start();
		}

		var onFail = function(err) {
			ok(false, err.message);
			navigator.accelerometer.clearWatch(accelerationWatch);
			start();
		}

		var options = {};
		options.frequency = 1000;
		var accelerationWatch = navigator.accelerometer.watchAcceleration(onSuccess, onFail, options);


	});

	asyncTest("acc_002:watchAcceleration - successCallback이 function이 아닌 경우", function() {
		try{
			navigator.accelerometer.watchAcceleration(invalidSC_AC, validErrorCallback_AC);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("acc_003:watchAcceleration - successCallback이 null인 경우", function() {
		try{
			navigator.accelerometer.watchAcceleration(null, validErrorCallback_AC);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("acc_004:watchAcceleration - 10회 반복 호출 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.accelerometer.watchAcceleration(repeatSuccessCallback_AC_nancheck, validErrorCallback_AC);
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

	asyncTest("acc_005:getCurrentAcceleration - 모든 매개변수가 올바른 경우", function() {

		var onSuccess = function(acc) {
			if( isNaN(acc.x) || isNaN(acc.y) || isNaN(acc.z) ) {
				ok(false, "device not supported");
			}	else {
				ok(true, "acc.x : " + acc.x + " acc.y : " + acc.y + " acc.z : " + acc.z);
			}
			start();
		}

		var onFail = function(err) {
			ok(false, err.message);
			start();
		}

		navigator.accelerometer.getCurrentAcceleration(onSuccess, onFail);
	});

	
	asyncTest("acc_006:getCurrentAcceleration - successCallback이 function이 아닌 경우", function() {
		try{
			navigator.accelerometer.getCurrentAcceleration(null, validErrorCallback_AC);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("acc_007:getCurrentAcceleration - successCallback이 null인 경우", function() {
		try{
			navigator.accelerometer.getCurrentAcceleration(null, validErrorCallback_AC);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("acc_008:getCurrentAcceleration - 10회 반복 호출 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.accelerometer.getCurrentAcceleration(repeatSuccessCallback_AC_nancheck, validErrorCallback_AC);
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

	asyncTest("acc_009:devicemotion event listener 확인 테스트 ", function() {
		window.addEventListener("devicemotion",acceleration_handler , true);
		ok(true,"add listener sucess");

		setTimeout(function(){
			window.removeEventListener("devicemotion",acceleration_handler , true);
			start();
		},200);

	});
}