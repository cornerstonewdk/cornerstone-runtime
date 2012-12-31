document.addEventListener("deviceready", onDeviceReady_GEO, false);

var handlerid;

var invalidSC_GEO = "function";

function getPositionSC_GEO(p){
	if( isNaN(p.coords.latitude) || isNaN(p.coords.longitude) ) {
		ok(false, "device not supported");
	} else {
		ok(true, "latitude : " + p.coords.latitude + " longitude : " + p.coords.longitude);
	}
	start();
}

function watchPositionSC_GEO(p){
	if( isNaN(p.coords.latitude) || isNaN(p.coords.longitude) ) {
		ok(false, "device not supported");
	} else {
		ok(true, "latitude : " + p.coords.latitude + " longitude : " + p.coords.longitude);
	}
	start();
}

function validErrorCallback_GEO(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_GEO(){

	module("Geolocation");

	asyncTest("geo_001:getCurrentPosition - 모든 매개변수가 올바른경우", function() {
		navigator.geolocation.getCurrentPosition(getPositionSC_GEO, validErrorCallback_GEO);
	});
	
	asyncTest("geo_002:watchPosition - 모든 매개변수가 올바른경우", function() {
		handlerid = navigator.geolocation.watchPosition(watchPositionSC_GEO, validErrorCallback_GEO);
	});


	asyncTest("geo_003:watchPosition - successCallback이 null인 경우", function() {
		try{
			navigator.geolocation.watchPosition(null, validErrorCallback_GEO);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("geo_004:watchPosition - successCallback이 function이 아닌 경우", function() {
		try{
			navigator.geolocation.watchPosition(invalidSC_GEO, validErrorCallback_GEO);			
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("geo_005:clearwatch - 모든 매개변수가 올바른경우", function() {
		navigator.geolocation.clearWatch(handlerid);
		ok(true,"clearwatch is success");
		start();
	});
	
	asyncTest("geo_006:getCurrentPosition - 10회 반복 호출 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.geolocation.getCurrentPosition(repeatSuccessCB, validErrorCallback_GEO);
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