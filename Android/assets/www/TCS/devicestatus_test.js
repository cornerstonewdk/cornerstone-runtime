document.addEventListener("deviceready", onDeviceReady_DS, false);

var invalidSC_DS = "successCallback";
var invalidarg_DS = -1;

function validSuccessCalback_DS(prop,value) {
	ok(true,"The aspect::" + prop.aspect + "  property::" + prop.property + " is " + value);
	start();
}

function invalidSuccessCalback_DS(prop,value) {
	ok(false,"The aspect::" + prop.aspect + "  property::" + prop.property + " is " + value);
	start();
}

function invalidErrorCallback_DS(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_DS(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function expectedErrorCallback_DS(response){
	ok(true,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_DS(){

	module("DeviceStatus");

	//cellularNetwork
	asyncTest("dst_001:getPropertyValue-aspect:CellularNetwork,property:operatorName", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"CellularNetwork", property:"operatorName"});
	});

	if(device.platform == "Android"){
		asyncTest("dst_002:getPropertyValue-aspect:CellularNetwork,property:isInRoaming", function() {
			navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"CellularNetwork", property:"isInRoaming"});
		});

		asyncTest("dst_003:getPropertyValue-aspect:CellularNetwork,property:signalStrength", function() {
			navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"CellularNetwork", property:"signalStrength"});
		});
	}

	asyncTest("dst_004:getPropertyValue-aspect:CellularNetwork,property:mnc", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"CellularNetwork", property:"mnc"});
	});

	asyncTest("dst_005:getPropertyValue-aspect:CellularNetwork,property:mcc", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"CellularNetwork", property:"mcc"});
	});

	if(device.platform == "Android"){
		//device
		asyncTest("dst_006:getPropertyValue-aspect:Device,property:imei", function() {
			navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"imei"});
		});
	}
	asyncTest("dst_007:getPropertyValue-aspect:Device,property:model", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"model"});
	});

	asyncTest("dst_008:getPropertyValue-aspect:Device,property:vendor", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"vendor"});
	});

	if(device.platform == "Android"){
		asyncTest("dst_009:getPropertyValue-aspect:Device,property:imsi", function() {
			navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"imsi"});
		});
	}
	asyncTest("dst_010:getPropertyValue-aspect:Device,property:version", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"version"});
	});

	asyncTest("dst_011:getPropertyValue-aspect:Device,property:platform", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Device", property:"platform"});
	});

	//os
	asyncTest("dst_012:getPropertyValue-aspect:OperatingSystem,property:language", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"OperatingSystem", property:"language"});
	});

	asyncTest("dst_013:getPropertyValue-aspect:OperatingSystem,property:version", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"OperatingSystem", property:"version"});
	});

	asyncTest("dst_014:getPropertyValue-aspect:OperatingSystem,property:name", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"OperatingSystem", property:"name"});
	});

	asyncTest("dst_015:getPropertyValue-aspect:OperatingSystem,property:vendor", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"OperatingSystem", property:"vendor"});
	});

	//runtime
	asyncTest("dst_016:getPropertyValue-aspect:Runtime,property:version", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Runtime", property:"version"});
	});

	asyncTest("dst_017:getPropertyValue-aspect:Runtime,property:name", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Runtime", property:"name"});
	});

	asyncTest("dst_018:getPropertyValue-aspect:Runtime,property:vendor", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"Runtime", property:"vendor"});
	});

	//wifi
	asyncTest("dst_019:getPropertyValue-aspect:WiFiNetwork,property:ssid", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"WiFiNetwork", property:"ssid"});
	});

	if(device.platform == "Android"){
		asyncTest("dst_020:getPropertyValue-aspect:WiFiNetwork,property:signalStrength", function() {
			navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"WiFiNetwork", property:"signalStrength"});
		});
	}
	asyncTest("dst_021:getPropertyValue-aspect:WiFiNetwork,property:networkStatus", function() {
		navigator.devicestatus.getPropertyValue(validSuccessCalback_DS ,validErrorCallback_DS ,{aspect:"WiFiNetwork", property:"networkStatus"});
	});

	//errortest
	asyncTest("dst_022:getPropertyValue-aspect:WiFiNetwork,property:notexist", function() {
		navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS ,expectedErrorCallback_DS ,{aspect:"WiFiNetwork", property:"notexist"});
	});

	asyncTest("dst_023:getPropertyValue-aspect:notexist,property:networkStatus", function() {
		navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS ,expectedErrorCallback_DS ,{aspect:"WiFiNetwork", property:"notexist"});
	});

	asyncTest("dst_024:getPropertyValue-null", function() {
		navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS ,expectedErrorCallback_DS ,null);
	});

	asyncTest("dst_025:getPropertyValue-aspect:null,property:null", function() {
		navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS ,expectedErrorCallback_DS ,{aspect:null, property:null});
	});

	asyncTest("dst_026:getPropertyValue-aspect:1,property:1", function() {
		navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS ,expectedErrorCallback_DS ,{aspect:1, property:1});
	});

	//exceptioncheck
	asyncTest("dst_027:getPropertyValue-SuccessCallback 이 null인 경우", function() {		
		try{
			navigator.devicestatus.getPropertyValue(null, invalidErrorCallback_DS,{aspect:"WiFiNetwork", property:"networkStatus"});			 
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	//test 6
	asyncTest("dst_028:getPropertyValue-SuccessCallback 이 function이 아닌경우", function() {
		try{
			navigator.devicestatus.getPropertyValue(invalidSC_DS, invalidErrorCallback_DS,{aspect:"WiFiNetwork", property:"networkStatus"});			 
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	//test 6
	asyncTest("dst_029:getPropertyValue-매개변수가 올바르지 않은 경우", function() {
		try{
			navigator.devicestatus.getPropertyValue(invalidSuccessCalback_DS, invalidErrorCallback_DS,invalidarg_DS);			 
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
	
	asyncTest("dst_030:getPropertyValue- 10회 반복 호출 테스트", function() {
		
		function validSuccessCalback_DS_repeat(prop,value) {			
			if( prop == null || typeof value == "undefined" || value == null || typeof value == "undefined" ) {
				ok(false, "반복 호출 테스트 실패");
			}
		}
		
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.devicestatus.getPropertyValue(validSuccessCalback_DS_repeat ,validErrorCallback_DS ,{aspect:"Runtime", property:"name"});
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
