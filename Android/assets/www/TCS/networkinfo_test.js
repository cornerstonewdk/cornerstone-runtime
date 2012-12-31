document.addEventListener("deviceready", onDeviceReady_NET, false);

function onDeviceReady_NET(){

	module("NetworkInfo");
	
	asyncTest("net_001:type", function() {
		var netstate = navigator.connection.type;
		ok(true, "Network type : " + netstate);
		start();
	});

}