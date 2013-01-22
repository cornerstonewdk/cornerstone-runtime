document.addEventListener("deviceready", onDeviceReady_MN, false);

var invaildMenuCallback = "callback";
var invalidMenuName = {};


function MenuCallback1(){
	alert("menu1 button click");
	ok(true,"MenuCallback이 성공적으로 호출됨");
	start();
}

function onDeviceReady_MN(){
	
	module("MenuManager");
	
	if(device.platform == "Android"){
		//test 1
		asyncTest("men_001:addMenu-모든 매개변수가 올바른 경우", function() {
			navigator.menumanager.addMenu("menu1",MenuCallback1);
			alert("Android Device의 물리 Menu버튼을 눌러 menu1을 클릭하세요.")
		});	
		
		//test 2
		asyncTest("men_002:addMenu-MenuCallback 이 null인 경우", function() {		
			 try{
				 navigator.menumanager.addMenu("menu1", null);			 
			 }
			 catch(e){
				 ok(true,e);
				 start();
			 }
		});
		
		//test 3
		asyncTest("men_003:addMenu-MenuCallback 이 funtion이 아닌경우", function() {
			 try{
				 navigator.menumanager.addMenu("menu1", invaildMenuCallback);			 
			 }
			 catch(e){
				 ok(true,e);
				 start();
			 }
		});
		
		//test 4
		asyncTest("men_004:addMenu- menu 이름이 String이 아닌경우", function() {
			 try{
				 navigator.menumanager.addMenu(invalidMenuName, MenuCallback1);			 
			 }
			 catch(e){
				 ok(true,e);
				 start();
			 }
		});
			
		//test 5
		asyncTest("men_005:removeMenu-모든 매개변수가 올바른 경우", function() {
			navigator.menumanager.removeMenu("menu1");
			ok(true,"menu1이 성공적으로 삭제됨");
			start();
		});	
		
		//test 6
		asyncTest("men_006:removeMenu - menu 이름이 String이 아닌경우", function() {
			 try{
				 navigator.menumanager.removeMenu(invalidMenuName);			 
			 }
			 catch(e){
				 ok(true,e);
				 start();
			 }
		});
		
		//test 7
		asyncTest("men_007:removeAll-모든 매개변수가 올바른 경우", function() {
			navigator.menumanager.addMenu("menu1",MenuCallback1);
			navigator.menumanager.addMenu("menu2",MenuCallback1);
			navigator.menumanager.addMenu("menu3",MenuCallback1);
					
			navigator.menumanager.removeAll();	
			
			ok(true,"사용자 custom 메뉴가 모두 삭제됨");
			start();
		});	
		
		//test 8
		asyncTest("men_008:removeMenu-default 메뉴 모두삭제", function() {
			navigator.menumanager.removeMenu("OPENBROWSER");
			navigator.menumanager.removeMenu("REFRESH");
			navigator.menumanager.removeMenu("EXITAPP");
			
			ok(true,"default 메뉴가 모두 삭제됨");
			start();
		});	
		
		//test 9
		asyncTest("men_009:addMenu-default 메뉴 추가", function() {
			navigator.menumanager.addMenu("REFRESH");

			alert("물리 메뉴버튼을 눌렀을때 REFRESH만 남아있다면 성공");
			
			ok(true,"default 메뉴추가 성공");
			start();
		});	
	}
	else{
		alert("본 테스트는 Android만 지원합니다.");
	}
}
