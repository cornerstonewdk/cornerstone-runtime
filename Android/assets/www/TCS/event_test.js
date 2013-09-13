document.addEventListener("deviceready", onDeviceReady_EV, false);

function onPause_EV(){
	ok(true,"onPause 정상적으로 작동.");
	start();
}
function onResume_EV(){
	ok(true,"onResume 정상적으로 작동");
	start();
}
function onBackbutton_EV(){
	ok(true,"backbutton override 정상적으로 작동");
	start();
}
function onOnline_EV(){
	test("online-Device가 onLine 상태인지 확인",function(){
		ok(true,"onOnline 정상적으로 작동");
	});
}
function onOffline_EV(){
	test("offline-Device가 offLine 상태인지 확인",function(){
		ok(true,"onOffline 정상적으로 작동");
	});
}

function onDeviceReady_EV(){	

	module("Event");

	//test 1
	test("eve_001:deviceready-SKT SRT가 정상적으로 load 되었는지 확인",function(){
		ok(true,"onDeviceReady 정상적으로 작동");
	});

	// test 2
	asyncTest("eve_002:pause-Webview가 pause 되었을때를 확인", function() {
		document.addEventListener("pause", onPause_EV, false);
		alert("단말의 home 키를 눌러 webview를 pause 상태로 만드세요.\n그런 다음 TC app을 다시 실행시켜  webview를 resume 상태로 만드세요. ");
	});

	// test 3 
	asyncTest("eve_003:resume-Webview가 resume 되었을때를 확인", function() {
		document.addEventListener("resume", onResume_EV, false);
	});

	if(device.platform == "Android"){
		// test 4 
		asyncTest("eve_004:backbutton-물리 backbutton활성화 되었을때를 확인", function() {
			document.addEventListener("backbutton", onBackbutton_EV, false);
			alert("alert창은 닫고 backbutton을 클릭하세요.\n이전 화면으로 돌아간다면 실패 , 테스트가 진행되면 성공.");
		});
	}
	else{
		test("eve_004:backbutton-물리 backbutton활성화 되었을때를 확인",function(){
			ok(true,"iOS는 본테스트 생략.");
		});
	}

	// test 5 
	asyncTest("eve_005:removeEvent - event가 remove 되는지 확인", function() {
		//remove event 
		document.removeEventListener("pause",onPause_EV, false);
		document.removeEventListener("resume",onResume_EV, false);
		document.removeEventListener("backbutton", onBackbutton_EV, false);
		ok(true,"removeEvent 정상적으로 작동");
		start();
	});

}
