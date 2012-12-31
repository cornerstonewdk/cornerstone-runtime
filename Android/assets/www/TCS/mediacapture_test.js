document.addEventListener("deviceready", onDeviceReady_CAP, false);

var invalidcaptureSC_CAP = "function";

function captureSuccessCallback_CAP(filepath){
	if( filepath == null || filepath == undefined ) {
		ok(false, "device not supported");
	} else {
		ok(true, "captured file path : " + filepath);
	}
	start();
}

function validErrorCallback_CAP(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_CAP(){


	module("Capture");

	asyncTest("med_001:captureImage - 모든 매개변수가 올바른 경우", function() {
		navigator.capture.captureImage(captureSuccessCallback_CAP, validErrorCallback_CAP,
				{ destinationFilename : rootURL + "/capturedImage.jpg",highRes : true });
	});

	asyncTest("med_002:captureImage - SuccessCallback이 null인 경우 ", function() {
		try{
			navigator.capture.captureImage(null, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedImage.jpg",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("med_003:captureImage - SuccessCallback이 function이 아닌 경우 ", function() {
		try{
			navigator.capture.captureImage(invalidcaptureSC_CAP, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedImage.jpg",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("med_004:captureAudio - 모든 매개변수가 올바른 경우", function() {
		setTimeout(function() {
			navigator.capture.captureAudio(captureSuccessCallback_CAP, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedAudio.wav", highRes : true }); }
		, 2000);
	});

	asyncTest("med_005:captureAudio - SuccessCallback이 null인 경우 ", function() {
		try{
			navigator.capture.captureAudio(null, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedAudio.wav",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("med_006:captureAudio - SuccessCallback이 function이 아닌 경우 ", function() {
		try{
			navigator.capture.captureAudio(invalidcaptureSC_CAP, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedAudio.wav",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("med_007:captureVideo - 모든 매개변수가 올바른 경우", function() {
		setTimeout(function() {
			navigator.capture.captureVideo(captureSuccessCallback_CAP, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedVideo.mp4",highRes : true }); }
		, 2000);
	});

	asyncTest("med_008:captureVideo - SuccessCallback이 null인 경우 ", function() {
		try{
			navigator.capture.captureVideo(null, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedVideo.mp4",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("med_009:captureVideo - SuccessCallback이 function이 아닌 경우 ", function() {
		try{
			navigator.capture.captureVideo(invalidcaptureSC_CAP, validErrorCallback_CAP,
					{ destinationFilename : rootURL + "/capturedVideo.mp4",highRes : true });
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

}
