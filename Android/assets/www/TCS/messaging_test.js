document.addEventListener("deviceready", onDeviceReady_MSG, false);

var invalidSC = "successCallback";

var attachmentfullpath;
var attachmentname;

//[20120905][chisu]to split string 
function stringSplit(strData, strIndex){ 
	var stringList = new Array(); 
	while(strData.indexOf(strIndex) != -1){
		stringList[stringList.length] = strData.substring(0, strData.indexOf(strIndex)); 
		strData = strData.substring(strData.indexOf(strIndex)+(strIndex.length), strData.length); 
	} 
	stringList[stringList.length] = strData; 
	return stringList; 
}

function captureSuccessCallback_MSG(filepath){
	if( filepath == null || filepath == undefined ) {
		ok(false, "device not supported");
	} else {
		attachmentfullpath = filepath;
		attachmentname = stringSplit(attachmentfullpath,"/");
		ok(true, "captured file path : " + attachmentfullpath);
		ok(true, "captured file name : " + attachmentname);
	}
	start();
}

function smsSendSC(){
	ok(true, "SMS call success");
	start();
}

function mmsSendSC(){
	ok(true, "MMS call success");
	start();
}

function emailSendSC(){
	ok(true, "Email call success");
	start();
}

function validErrorCallback_MSG(response){
	ok(false,"다음 error: " +  response.message + ", 발생");
	start();
}

function onDeviceReady_MSG(){

	module("Messaging");

	asyncTest("msg_001:Precondition - 첨부파일 생성", function() {
		setTimeout(function(){
			navigator.capture.captureImage(captureSuccessCallback_MSG, validErrorCallback_MSG,
					{ destinationFilename : rootURL + "/capturedImage.jpg",highRes : true })
		},2000);;
	});

	asyncTest("msg_002:sendMessage - SMS 송신:모든 매개변수가 올바른 경우 ", function() {

		var msg = navigator.messaging.createMessage(Messaging.TYPE_SMS);

		msg.to = [ "01012345678", "01098765432" ];
		msg.body = "SMS 테스트 입니다.";

		setTimeout(function(){navigator.messaging.sendMessage(smsSendSC, validErrorCallback_MSG ,msg);}
		,1500);
	});

	if(device.platform == "Android"){
		asyncTest("msg_003:sendMessage - MMS 송신:모든 매개변수가 올바른 경우 ", function() {

			var msg = navigator.messaging.createMessage(Messaging.TYPE_MMS);

			msg.to = [ "01012345678", "01098765432" ];
			msg.body = "MMS 테스트 입니다. 메세지 내용이 길어지면 MMS로 자동 변경이 되어야 합니다. MMS로 전환이 되지 않았다면 정상동작이 아닙니다.";

			var imagefile = new FileEntry(attachmentname[attachmentname.length - 1],attachmentfullpath);
			msg.attachments = [imagefile]

			setTimeout(function() {navigator.messaging.sendMessage(mmsSendSC, validErrorCallback_MSG ,msg); }
			,500);
		});
	}
	
	asyncTest("msg_004:sendMessage - Email 송신:모든 매개변수가 올바른 경우 ", function() {

		var msg = navigator.messaging.createMessage(Messaging.TYPE_EMAIL);
		msg.to = [ "test@naver.com", "test@yahho.co.kr" ];
		msg.cc = [ "asdf@naver.com", "wwtwtw@yahho.co.kr" ];
		msg.bcc = [ "etetet@naver.com", "hfhfh@yahho.co.kr" ];
		msg.body = "Email 테스트 문장입니다. ";
		msg.subject = "Email 테스트 제목";

		var imagefile = new FileEntry(attachmentname[attachmentname.length - 1],attachmentfullpath);
		msg.attachments = [imagefile]

		setTimeout(function() {navigator.messaging.sendMessage(emailSendSC, validErrorCallback_MSG ,msg);}
		,500);
	});

	asyncTest("msg_005:sendMessage - SuccessCallback이 null인 경우 ", function() {
		var msg = navigator.messaging.createMessage(Messaging.TYPE_SMS);

		msg.to = [ "01012345678", "01098765432" ];
		msg.body = "SMS 테스트 입니다.";

		try{
			navigator.messaging.sendMessage(null, validErrorCallback_MSG ,msg);
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("msg_006:sendMessage - SuccessCallback이 function이 아닌 경우 ", function() {
		var msg = navigator.messaging.createMessage(Messaging.TYPE_SMS);

		msg.to = [ "01012345678", "01098765432" ];
		msg.body = "SMS 테스트 입니다.";

		try{
			navigator.messaging.sendMessage(invalidSC, validErrorCallback_MSG ,msg);
		}
		catch(e){
			ok(true,e);
			start();
		}
	});

	asyncTest("msg_007:sendMessage - msg가 object type이 아닌경우 ", function() {
		var msg = "msg";

		try{
			navigator.messaging.sendMessage(smsSendSC, validErrorCallback_MSG ,msg);
		}
		catch(e){
			ok(true,e);
			start();
		}
	});
}