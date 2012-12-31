document.addEventListener("deviceready", onDeviceReady_BA, false);

function onBatteryStatus() {
	if(isNaN(navigator.battery.level)) {
		ok(false, "device not supported");
	} else {
		ok(true, "levelchange:: Level: " + navigator.battery.level + " , isPlugged: " + navigator.battery.charging);
	}
	start();
}

function onBatteryStatus_1() {
	if(isNaN(navigator.battery.level)) {
		ok(false, "device not supported");
	} else {
		ok(true, "chargingchange:: Level: " + navigator.battery.level + " , isPlugged: " + navigator.battery.charging);
	}
	start();
}


function onDeviceReady_BA(){

	module("Battery");
	
	asyncTest("bat_001:levelchange event listener 확인 테스트", function() {
		navigator.battery.addEventListener("levelchange", onBatteryStatus,false);
	});
	
	asyncTest("bat_002:chargingchange event listener 확인 테스트", function() {
		navigator.battery.addEventListener("chargingchange", onBatteryStatus_1,false);
	});
	
	asyncTest("bat_003:removeListener 확인테스트", function(){
		navigator.battery.removeEventListener("levelchange", onBatteryStatus,false);
		navigator.battery.removeEventListener("chargingchange", onBatteryStatus_1,false);
		ok(true,"remove battery listener success");
		start();
	});	
}