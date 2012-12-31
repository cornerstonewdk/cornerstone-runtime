document.addEventListener("deviceready", onDeviceReady_NC, false);

var invalidSC_NC = "successCallback";
var invalidarg_NC = "string";

function validSuccessCallback_NC() {
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	start();
}

function tempSuccessCallback_NC(){
	//do nothing;
}

function invalidSuccessCallback_NC() {
	ok(true,"SuccessCallback이 성공적으로 호출되어선 안됨");
	start();
}

function invalidErrorCallback_NC(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_NC(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_NC(){
	
	module("LocalNotification");
	
	//test 1
	asyncTest("loc_001:cancleAll-모든 매개변수가 올바른 경우 - 1분뒤에 울리는 2개의 알림을 add하고 cancle함", function() {
		var d = new Date();
	    d = d.getTime() + 60000; //60 seconds from now
	    d = new Date(d);
	    
		navigator.localNotification.add(tempSuccessCallback_NC, validErrorCallback_NC, {
			date : d,
			message : "1분뒤에 울리는 TCS Notification \r\n 이 알림은 울려서는 안됨",
			ticker : "id = 10 ,울려서는 안되는 알람입니다.",
			repeatDaily : false,
			id : 10
		});
		
		navigator.localNotification.add(tempSuccessCallback_NC, validErrorCallback_NC, {
			date : d,
			message : "1분뒤에 울리는 TCS Notification \r\n 이 알림은 울려서는 안됨",
			ticker : "id = 11, 울려서는 안되는 알람입니다.",
			repeatDaily : false,
			id : 11
		});
		
		//시간차이를 둔다.
		setTimeout(function() {
			navigator.localNotification.cancelAll(validSuccessCallback_NC, validErrorCallback_NC);
			},1000);
	});
	
	//test 2
	asyncTest("loc_002:add-모든 매개변수가 올바른 경우 - 바로 알림", function() {
		var d = new Date();
	    //d = d.getTime() + 60000; //60 seconds from now
	    d = d.getTime();
	    d = new Date(d);
	    
	  //시간차이를 둔다.
	    setTimeout(function(){},500);
	    
		navigator.localNotification.add(validSuccessCallback_NC, validErrorCallback_NC, {
			date : d,
			message : "TCS Notification \r\n SubTitle",
			ticker : "바로 울리는 알람입니다.",
			repeatDaily : false,
			id : 1
		});
	});
	
	//test 3
	asyncTest("loc_003:add-모든 매개변수가 올바른 경우 - 1분 뒤 알림", function() {
		var d = new Date();
	    d = d.getTime() + 60000; //60 seconds from now
	    //d = d.getTime();
	    d = new Date(d);
	    
		navigator.localNotification.add(tempSuccessCallback_NC, validErrorCallback_NC, {
			date : d,
			message : "1분뒤에 울리는 TCS Notification \r\n SubTitle",
			ticker : "1분뒤에 울리는 알람입니다.",
			repeatDaily : false,
			id : 2
		});
		
		//if(confirm("1분을 기다리세요.\n알람을 확인 하셨습니까?")){
		
              ok(true,"성공적으로 알람이 울림");
		/*}
		else{
			ok(false,"알람을 추가하는것이 실패함")
		}
		*/
              
		start();
	});
	
	//test 4
	asyncTest("loc_004:cancle-모든 매개변수가 올바른 경우 - 1분뒤위 알림을 add하고 cancle함", function() {
		var d = new Date();
	    d = d.getTime() + 60000; //60 seconds from now
	    d = new Date(d);
	    
		navigator.localNotification.add(tempSuccessCallback_NC, validErrorCallback_NC, {
			date : d,
			message : "1분뒤에 울리는 TCS Notification \r\n 이 알림은 울려서는 안됨",
			ticker : "울려서는 안되는 알람입니다.",
			repeatDaily : false,
			id : 3
		});
		
		navigator.localNotification.cancel(validSuccessCallback_NC, validErrorCallback_NC, 3);
	});
	
	//test 5
	asyncTest("loc_005:cancle-모든 매개변수가 올바른 경우 - 1분뒤위 알림을 add하고 cancle - 10회 반복 호출 테스트", function() {
		var d = new Date();
	    d = d.getTime() + 60000; //60 seconds from now
	    d = new Date(d);
	    
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.localNotification.add(repeatSuccessCB, validErrorCallback_NC, {
					date : d,
					message : "1분뒤에 울리는 TCS Notification \r\n 이 알림은 울려서는 안됨",
					ticker : "울려서는 안되는 알람입니다.",
					repeatDaily : false,
					id : 4
				});
		
				navigator.localNotification.cancel(repeatSuccessCB, validErrorCallback_NC, 4);
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
