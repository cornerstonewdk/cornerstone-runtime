document.addEventListener("deviceready", onDeviceReady_AD, false);

var invalidSC_AD = "successCallback";
var invalidarg_AD = {filepath:"http://www.html5rocks.com/en/tutorials/audio/quick/test.mp3"};

var gAudio;
var gAudioPath = "http://www.html5rocks.com/en/tutorials/audio/quick/test.mp3";

function validSuccessCalback_AD(response) {
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	start();
}

function validCreateAudioSuccessCallback_AD(audio){
	gAudio = audio;
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	ok(true, gAudio.src + " 가 성공적으로 생성됨")
	start();
}

function invalidSuccessCalback_AD(reponse) {
	ok(false,"SuccessCallback이 호출되어선 안됨");
	start();
}

function invalidErrorCallback_AD(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_AD(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_AD(){

	module("Audio");

	//test 1
	asyncTest("aud_001:createAudio-모든 매개변수가 올바른 경우", function() {
		navigator.mediamanager.createAudio(validCreateAudioSuccessCallback_AD,validErrorCallback_AD,gAudioPath);
	});

	//test 2
	asyncTest("aud_002:createAudio-SuccessCallback 이 null인 경우", function() {		
		 try{
			 navigator.mediamanager.createAudio(null, invalidErrorCallback_AD,gAudioPath);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 3
	asyncTest("aud_003:createAudio-SuccessCallback 이 funtion이 아닌경우", function() {
		 try{
			 navigator.mediamanager.createAudio(invalidSC_AD, invalidErrorCallback_AD,gAudioPath);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 4
	asyncTest("aud_004:createAudio-filePath 가 String 이 아닌경우", function() {
		 try{
			 navigator.mediamanager.createAudio(invalidSuccessCalback_AD, invalidErrorCallback_AD,invalidarg_AD);			 
		 }
		 catch(e){
			 ok(true,e);
			 start();
		 }
	});
	
	//test 5
	asyncTest("aud_005:play-모든 매개변수가 올바른 경우", function() {
		gAudio.play();
        setTimeout(function(){
            if(confirm("Audio가 정상적으로 play됨을 확인 하셨습니까?")){
                ok(true,"정상적으로 audio가 play됨")
                start();
            }
            else{
                ok(false,"정상적으로 audio가 play되지 않음")
                start();			
            }
        }, 2000);
	});

	//test 6
	asyncTest("aud_006:pause-2초뒤에 현재 play중인 audio가 pause됨", function() {
		
		setTimeout(function(){               
			gAudio.pause();
            setTimeout(function(){
                if(confirm("Audio가 정상적으로 pause됨을 확인 하셨습니까?")){
                    ok(true,"정상적으로 audio가 pause됨")
                    start();
                }
                else{
                    ok(false,"정상적으로 audio가 pause되지 않음")
                    start();
                }
            }, 500);
                       
		},2000)
	});
	
	
	//test 7
	asyncTest("aud_007:stop-2초뒤에 현재 play중인 audio가 stop됨", function() {
		gAudio.play();
		
		setTimeout(function(){
			gAudio.stop();
                   
            setTimeout(function(){
                if(confirm("Audio가 정상적으로 stop됨을 확인 하셨습니까?")){
                    ok(true,"정상적으로 audio가stop됨");
                    start();
                }
                else{
                    ok(false,"정상적으로 audio가 stop되지 않음");
                    start();
                }
            }, 500);
		},2000)	
	});
	
	// test 8
	asyncTest("aud_008:play/stop - 5회 반복 호출 테스트", function() {
		try {
			var count = 0;
			var repeat = function () {
				gAudio.play();
				setTimeout(function(){
					gAudio.stop();
					count++;
					if(count < 5) {
						setTimeout(repeat,100);
					} else {
						ok(true, "반복 호출이 성공적으로 수행됨")
						start();
					}
				},2000);
			}
			
			repeat();
		} catch (e) {
			ok(false, e);
			start();
		}
	});
	
	
	//test 9
	asyncTest("aud_009:getDuration-모든 매개변수가 올바른 경우", function() {
		var duration = gAudio.getDuration();		
		notEqual(-1,duration,"daration(s) = " + duration);
		start();
	});
	
	
	//test 10
	asyncTest("aud_010:seekTo- 3초 뒤에 현재 play중인 audio를 30초 뒤로 이동", function() {
		gAudio.play();
		
        setTimeout(function(){
            gAudio.seekTo(30*1000);
            setTimeout(function(){
                if(confirm("Audio가 정상적으로 이동됨을 확인 하셨습니까?")){
                    ok(true,"seekTo api가 정상적으로 동작함");
                    start();
                }
                else{
                    ok(false,"seekTo api가 정상적으로 동작하지 않음");
                    start();
                }
            }, 2000);
        }, 3000);
	});
	
	//test 11
	asyncTest("aud_011:setVolume-모든 매개변수가 올바른 경우", function() {
		gAudio.setVolume(50);		
		ok(true,"setVolume(50%)가 정상적으로 동작함");
		
		setTimeout(function(){
			gAudio.setVolume(100);
			ok(true,"setVolume(100%)가 정상적으로 동작함");
			start();
		},3000);
	});
	
	//test 12
	asyncTest("aud_012:getCurrentPosition-모든 매개변수가 올바른 경우", function() {
		gAudio.getCurrentPosition(
	            function(position) {
	                if (position > -1) {
	                	ok(true,"현재 재생되고 있는 위치::" + position);
	                	start();
	                }
	            },validErrorCallback_AD);
	});
	
	//test 13
	asyncTest("aud_013:release-모든 매개변수가 올바른 경우", function() {
		setTimeout(function() {
			gAudio.release();
			gAudio = null;
			ok(true,"정상적으로 audio object를 release함");
	    	start();
	    }, 5000);
	});
}
