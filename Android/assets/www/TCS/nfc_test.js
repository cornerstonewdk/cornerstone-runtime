document.addEventListener("deviceready", onDeviceReady_Nfc, false);

var invalidSC_Nfc = "successCallback";
var invalidarg_Nfc = {};

function validSuccessCalback_Nfc(tag) {
	ok(true,"스캔된 tag 정보 : " + tag.tag);
	start();
}

function invalidSuccessCalback_Nfc(tag) {
	ok(false,"스캔된 tag 정보 : " + tag.tag);
	start();
}

function invalidErrorCallback_Nfc(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_Nfc(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_Nfc(){

	module("Nfc");

	//Android Test
	if(device.platform == "Android"){
		//test 1
		asyncTest("nfc_001:isNFCSupport-모든 매개변수가 올바른 경우", function() {
			if(navigator.nfc.isNFCSupport()){
				ok(true,"Device가 NFC를 지원함");
			}
			else{
				ok(true,"Device가 NFC를 지원 하지 않음");
			}
			start();
		});

		//test 2
		asyncTest("nfc_002:setNFCUse-모든 매개변수가 올바른 경우(true)", function() {		
			if(navigator.nfc.isNFCSupport()){
				navigator.nfc.setNFCUse(true);
				ok(true,"Device가 NFC를 를 사용함");
				start();
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}

		});

		//test 3
		asyncTest("nfc_003:setNFCUse-매개변수가 boolean이 아닌경우", function() {		
			if(navigator.nfc.isNFCSupport()){
				try{
					navigator.nfc.setNFCUse(invalidarg_Nfc);
					ok(false,"exception이 발생하여야 함");
					start();
				}
				catch(e){
					ok(true,e);
					start();
				}
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}
		});

		//test 4
		asyncTest("nfc_004:setReadTagCallback-ReadTagCallback이 올바른 경우", function() {		
			if(navigator.nfc.isNFCSupport()){
				navigator.nfc.setReadTagCallback(validSuccessCalback_Nfc);
				ok(true,"ReadTagCallback이 정상적으로 등록됨");
				start();
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}
		});
		
		//test 4_1
		asyncTest("nfc_005:setReadTagCallback-ReadTagCallback이 null인경우", function() {		
			if(navigator.nfc.isNFCSupport()){
				try{
					navigator.nfc.setReadTagCallback(null);	 
					ok(false,"exception이 발생하여야 함");
					start();
				 }
				catch(e){
					 ok(true,e);
					 start();
				 }
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}
		});
		
		//test 4_2
		asyncTest("nfc_005:setReadTagCallback-ReadTagCallback이 function이 아닌경우", function() {		
			if(navigator.nfc.isNFCSupport()){
				try{
					navigator.nfc.setReadTagCallback(invalidSC_Nfc);
					ok(false,"exception이 발생하여야 함");
					start();
				 }
				catch(e){
					 ok(true,e);
					 start();
				 }
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}
		});
		
		//test 5
		asyncTest("nfc_006:setReadTagCallback-TAG 읽기", function() {		
			alert("NFC TAG를 스캔 하세요");
		});
		
		//test 6
		asyncTest("nfc_007:setNFCUse-모든 매개변수가 올바른 경우(false)", function() {		
			if(navigator.nfc.isNFCSupport()){
				navigator.nfc.setNFCUse(false);
				ok(true,"Device가 NFC를 를 사용하지 않음");
				start();
			}
			else{
				ok(false,"Device가 NFC를 지원 하지 않음");
			}
		});
	}
	else{
		alert("본 테스트는 Android만 지원합니다.");
	}
	
}
