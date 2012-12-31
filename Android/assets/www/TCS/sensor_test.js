document.addEventListener("deviceready", onDeviceReady_SE, false);

var timer1 = null;
var timer2 = null;
var timer3 = null;
var timer4 = null;
var timer5 = null;

var onFail_proximity = function(e) {
	ok(false, "Device not support proximity sensor");
	window.removeEventListener("deviceproximity", onSuccess_proximity, true);
	start();
}

var onFail_temperature = function(e) {
	ok(false, "Device not support temperature sensor");
	window.removeEventListener("devicetemperature", onSuccess_temperature, true);
	start();
}

var onFail_pressure = function(e) {
	ok(false, "Device not support pressure sensor");
	window.removeEventListener("devicepressure", onSuccess_pressure, true);
	start();
}

var onFail_humidity = function(e) {
	ok(false, "Device not support humidity sensor");
	window.removeEventListener("devicehumidity", onSuccess_humidity, true);
	start();
}

var onFail_light = function(e) {
	ok(false, "Device not support light sensor");
	window.removeEventListener("devicelight", onSuccess_light, true);
	start();
}

var onSuccess_proximity = function(sensor) {
	ok(true, "sensor type:" + sensor.type + " sensor value:" + sensor.value);
	window.removeEventListener("deviceproximity", onSuccess_proximity, true);
	clearTimeout(timer1);
	start();
}
var onSuccess_temperature = function(sensor) {
	ok(true, "sensor type:" + sensor.type + " sensor value:" + sensor.value);
	window.removeEventListener("devicetemperature", onSuccess_temperature, true);
	clearTimeout(timer2);
	start();
}
var onSuccess_pressure = function(sensor) {
	ok(true, "sensor type:" + sensor.type + " sensor value:" + sensor.value);
	window.removeEventListener("devicepressure", onSuccess_pressure, true);
	clearTimeout(timer3);
	start();
}
var onSuccess_humidity = function(sensor) {
	ok(true, "sensor type:" + sensor.type + " sensor value:" + sensor.value);
	window.removeEventListener("devicehumidity", onSuccess_humidity, true);
	clearTimeout(timer4);
	start();
}
var onSuccess_light = function(sensor) {
	ok(true, "sensor type:" + sensor.type + " sensor value:" + sensor.value);
	window.removeEventListener("devicelight", onSuccess_light, true);
	clearTimeout(timer5);
	start();
}

function onDeviceReady_SE(){

	module("DeviceSensor");

	asyncTest("sen_001:deviceproximity", function() {
		window.addEventListener("deviceproximity", onSuccess_proximity, true);
		timer1 = setTimeout(onFail_proximity,5000);
	});

//	asyncTest("devicetemperature", function() {
//	window.addEventListener("devicetemperature", onSuccess_temperature, true);
//	timer2 = setTimeout(onFail_temperature,5000);
//	});

//	asyncTest("devicepressure", function() {
//	window.addEventListener("devicepressure", onSuccess_pressure, true);
//	timer3 = setTimeout(onFail_pressure,5000);
//	});

//	asyncTest("devicehumidity", function() {
//	window.addEventListener("devicehumidity", onSuccess_humidity, true);
//	timer4 = setTimeout(onFail_humidity,5000);
//	});

	if(device.platform == "Android"){
		asyncTest("sen_002:devicelight", function() {
			window.addEventListener("devicelight", onSuccess_light, true);
			timer5 = setTimeout(onSuccess_light,5000);
		});
	}
}