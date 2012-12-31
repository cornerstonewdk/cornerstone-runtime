document.addEventListener("deviceready", onDeviceReady_CON, false);

function validSuccessCallback_CO(contacts) {
	ok(true,"SuccessCallback이 성공적으로 호출됨");
	start();
    
}

function findSuccessCallback_CO(contacts) {
    if(contacts.length == 0) {
       ok(false,"not found"); 
    } else {
       ok(true,"find success"); 
    }
	
	start();
}

function expectedErrorCallback_CO(contacts) {
    if(contacts.length == 0) {
        ok(true,"not found"); 
    } else {
        ok(false,"find success"); 
    }
	
	start();
}

function validErrorCallback_CO(response){
	ok(false,"다음 error code: " +  response.code + ", 발생");
	start();
}


function onDeviceReady_CON(){

	module("Contact");
	
	asyncTest("con_001:create - Contact 생성 테스트", function() {
              try {
                var contact = navigator.contacts.create({
                    displayName : 'user',
                    emails : [ {
                        value : 'user@domain.com',
                        type : 'work'
                    } ],
                    phoneNumbers : [ {
                        value : '01012345678',
                        type : 'mobile'
                    } ],
                    note : 'manager',
                    nickname : 'nick'                                 
                                                        
                });
                ok(true, "Contacts create complete");
              }
              catch(e) {
                ok(false, "Calendar is not suppoted");
              }
		start();
	});
    
    asyncTest("con_002:add - phoneNumbers 설정", function() {
              var contact = navigator.contacts.create({
                                                      nickname : 'nick',
                                                      phoneNumbers : [{value : '01012345678',
                                                                      type : 'mobile'}]
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });
    
    asyncTest("con_003:add - emails 설정", function() {
              var contact = navigator.contacts.create({
                                                      nickname : 'nick',
                                                      emails : [{value : 'user@domain.com',
                                                                type : 'work'}],
                                                      phoneNumbers : [{value : '01012345678',
                                                                        type : 'mobile'}]
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });
    
    asyncTest("con_004:add - name 설정", function() {
              var contact = navigator.contacts.create({
                                                      displayName : 'user',
                                                      nickname : 'nick',
                                                      name : [ {familyname : 'A',
                                                                 givenName : 'B',
                                                           honorificPrefix : 'Mr.'
                                                              }],
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });
    
    asyncTest("con_005:add - address 설정", function() {
              var contact = navigator.contacts.create({
                                                      displayName : 'user',
                                                      nickname : 'nick',
                                                      addresses : [{type : 'home',
                                                                 country : 'korea',
                                                                locality : 'seoul',
                                                              postalCode : '144-211',
                                                                  region : 'gangnam',
                                                                    pref : false,
                                                           streetAddress : '12-1'}],
  
                                                      phoneNumbers : [{value : '01012345678',
                                                                        type : 'mobile'}]
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });
    
    
    asyncTest("con_006:add - organizations 설정", function() {
              var contact = navigator.contacts.create({
                                                      nickname : 'nick',
                                                      organizations : [{type : 'engineer',
                                                                  department : 'dev2',
                                                                        name : 'business dev2',
                                                                        pref : false}],
                                                      phoneNumbers : [{value : '01012345678',
                                                                        type : 'mobile'}]
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });
    
    asyncTest("con_007:add - note / urls 설정", function() {
              var contact = navigator.contacts.create({
                                                      nickname : 'nick',
                                                      phoneNumbers : [{value : '01012345678',
                                                                        type : 'mobile'}],
                                                      note : 'TCS test',
                                                      urls : [{type : 'Home',
                                                              value : 'User'}]
                                                      });
              navigator.contacts.add(validSuccessCallback_CO, validErrorCallback_CO, contact);
              });

	asyncTest("con_008:find - multiple false 설정", function() {
              function successFind(contacts) {
                  if(contacts.length == 1) {
                  ok(true, "find multiple success");
                  } else {
                  ok(false, "find multiple fail");
                  }
                  start();
              }
              navigator.contacts.find([ "displayName", "nickname" ],
                                      successFind, validErrorCallback_CO,
                                      {filter : 'nick',
                                      multiple : false});
	});
                                       
   asyncTest("con_009:find - multiple true 설정", function() {
             function successFind(contacts) {
             if(contacts.length != 1) {
             ok(true, "find multiple success");
             } else {
             ok(false, "find multiple fail");
             }
             start();
             }
             navigator.contacts.find([ "displayName", "nickname" ],
                                     successFind, validErrorCallback_CO,
                                     {filter : 'nick',
                                     multiple : true});
    });
    
    asyncTest("con_010:find - phoneNumbers", function() {
              navigator.contacts.find([ "phoneNumbers" ],
                                      findSuccessCallback_CO, validErrorCallback_CO,
                                      {filter : '01012345678',
                                      multiple : true});
              });
    
    asyncTest("con_011:find - addresses", function() {
              navigator.contacts.find([ "addresses" ],
                                      findSuccessCallback_CO, validErrorCallback_CO,
                                      {filter : 'korea',
                                      multiple : true});
              });
    
    asyncTest("con_012:find - organizations", function() {
              navigator.contacts.find([ "organizations" ],
                                      findSuccessCallback_CO, validErrorCallback_CO,
                                      {filter : 'dev2',
                                      multiple : true});
              });
    
    
    asyncTest("con_013:find - emails", function() {
              navigator.contacts.find([ "emails" ],
                                      findSuccessCallback_CO, validErrorCallback_CO,
                                      {filter : 'user',
                                      multiple : true});
              });
    
    asyncTest("con_014:find - not found", function() {
              navigator.contacts.find([ "emails" ],
                                      expectedErrorCallback_CO, validErrorCallback_CO,
                                      {filter : 'abcdefg',
                                      multiple : true});
              });
    
    asyncTest("con_015:find - no filter", function() {
              function successFind(contacts) {
              if(contacts.length != 1) {
              ok(true, "find multiple success");
              } else {
              ok(false, "find multiple fail");
              }
              start();
              }
              navigator.contacts.find([ "displayName", "nickname" ],
                                      successFind, validErrorCallback_CO,
                                      {multiple : true});
              });
    
    asyncTest("con_016:add - 10회 반복 호출 테스트", function() {
    	var contact = navigator.contacts.create({
            nickname : 'nick',
            phoneNumbers : [{value : '01012345678',
                            type : 'mobile'}]
            });

		try {
			for ( var i = 0; i < 10; i++) {
				 navigator.contacts.add(repeatSuccessCB, validErrorCallback_CO, contact);
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
    
	asyncTest("con_017:remove - 모든 연락처 삭제", function() {
		function successFind(contacts) {
			function tempDeleteSC_CO(){
				//do notthing
				//ok(true,"Contact가 성공적으로 삭제됨");
			}
			
            for(var i = 0; i < contacts.length; ++i){
            	if(i != contacts.length -1 )
            		navigator.contacts.remove(tempDeleteSC_CO,validErrorCallback_CO, contacts[i].id);
            	else
            		navigator.contacts.remove(validSuccessCallback_CO,validErrorCallback_CO, contacts[i].id);
            }
            
		}
        navigator.contacts.find([ "displayName", "nickname" ],
                              successFind, validErrorCallback_CO,
                              {multiple : true});
	});

}
