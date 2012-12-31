document.addEventListener("deviceready", onDeviceReady_VIB, false);

function onDeviceReady_VIB(){
	
	module("Vibration");
	
	//test 1
	test("vib_001:vibrate-1초간 진동", function() {
		navigator.vibrate(1000);
		stop();
		setTimeout(function(){
			ok(true,"Vibration이 정상적으로 동작함")
			start();
		},1500)
	});
	
	//test 2
	test("vib_002:vibrate-특정 패턴으로 진동", function() {
		navigator.vibrate([500,30,1000,500,500]);
		stop();
		setTimeout(function(){
			ok(true,"Vibration이 특정 패턴에 의해 정상적으로 동작함")
			start();
		},1500)
	});
	
	//test 3
	test("vib_003:vibrate-5회 반복 호출 테스트", function() {
		try {
			var count = 0;
			stop();
			
			var repeat = function () {
				navigator.vibrate(1000);
				setTimeout(function(){
					count++;
					if(count < 5) {
						repeat();
					} else {
						ok(true, "반복 호출이 성공적으로 수행됨")
						start();
					}
				},1500);
			}
			
			repeat();
		} catch (e) {
			ok(false, e);
			start();
		}
	});
}