document.addEventListener("deviceready", onDeviceReady_CAL, false);

function validSuccessCallback_CA(event) {
	ok(true, "SuccessCallback이 성공적으로 호출됨");
	start();
}

function vaildFindSuccessCallback_CA(events) {
	ok(true, events.length + " 개의 이벤트 검색 완료 ");
	start();
}
function validErrorCallback_CA(response) {
	ok(false, "다음 error code: " + response.code + ", 발생");
	start();
}

function expectedErrorCallback_CA(response) {
	ok(true, "다음 error code: " + response.code + ", 발생");
	start();
}

function onDeviceReady_CAL() {

	module("Calendar");

	asyncTest("cal_001:create - Calendar 생성 테스트", function() {
		try {
			var calEvent = navigator.calendar.createEvent({
				description : 'HTML5 Introduction',
				summary : 'HTML5 test ',
				start : '2012-09-14 09:00',
				end : '2012-09-14 12:00',
				recurrence : {
					expires : '2012-10-30',
					frequency : 'weekly',
					interval : 1,
				},
				reminder : '-3600000',
				status : 'tentative',
				location : 'SK bundang'
			});
			ok(true, "Calendar create complete");
			start();
		} catch (e) {
			ok(false, "Calendar is not suppoted");
			start();
		}
	});

	asyncTest("cal_002:add - 기본 설정", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test',
			start : '2012-09-14 09:00',
			end : '2012-09-14 12:00',
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);
	});

	asyncTest("cal_003:add - Reminder 설정1", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-15 09:00',
			end : '2012-09-15 12:00',
			reminder : '-3600000'
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_004:add - Reminder 설정2", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-16 09:00',
			end : '2012-09-16 12:00',
			reminder : '2012-12-31 12:00'
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_005:add - Recurrence 설정1", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-17 09:00',
			end : '2012-09-17 12:00',
			recurrence : {
				frequency : 'daily'
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_006:add - Recurrence 설정2", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-18 09:00',
			end : '2012-09-18 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'weekly',
				daysInWeek : [ 2, 4 ]
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_007:add - Recurrence 설정3", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-19 09:00',
			end : '2012-09-19 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'monthly',
				daysInMonth : [ 2, 18 ]
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_008:add - Recurrence 설정4", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-20 09:00',
			end : '2012-09-20 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'yearly',
				daysInYear : [ 2, 230 ]
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_009:add - Recurrence 설정5", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-21 09:00',
			end : '2012-09-21 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'yearly',
				monthsInYear : [ 4, 10 ]
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_010:add - Recurrence 설정6", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-22 09:00',
			end : '2012-09-22 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'yearly',
				monthsInYesr : [ 4, 10 ],
				interval : 1
			}
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_011:add - status / locartion 설정", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test ',
			start : '2012-09-23 09:00',
			end : '2012-09-23 12:00',
			recurrence : {
				expires : '2012-10-30',
				frequency : 'weekly',
				daysInWeek : [ 2, 4 ]
			},
			reminder : '-3600000',
			status : 'tentative',
			location : 'SK bundang'
		});

		navigator.calendar.addEvent(validSuccessCallback_CA,
				validErrorCallback_CA, calEvent);

	});

	asyncTest("cal_012:find - multiple false 설정", function() {
		function successFind(events) {
			if (events.length == 1) {
				ok(true, "findEvents multiple success");
			} else {
				ok(false, "findEvents multiple fail");
			}
			start();
		}
		navigator.calendar.findEvents(successFind, validErrorCallback_CA, {
			filter : {
				startAfter : '2012-09-14 09:00',
				endBefore : '2012-09-22 18:00'
			},
			multiple : false
		});

	});

	asyncTest("cal_013:find - multiple true 설정", function() {
		function successFind(events) {
			if (events.length != 1) {
				ok(true, "findEvents multiple success");
			} else {
				ok(false, "findEvents multiple fail");
			}
			start();
		}
		navigator.calendar.findEvents(successFind, validErrorCallback_CA, {
			filter : {
				startAfter : '2012-09-14 0:00',
				endBefore : '2012-09-22 18:00'
			},
			multiple : true
		});

	});

	asyncTest("cal_014:find - startAfter-endBefore 설정", function() {
		navigator.calendar.findEvents(vaildFindSuccessCallback_CA,
				validErrorCallback_CA, {
					filter : {
						startAfter : '2012-09-14 09:00',
						endBefore : '2012-09-22 18:00'
					},
					multiple : true
				});

	});

	asyncTest("cal_015:find - startBefore 설정", function() {
		navigator.calendar.findEvents(vaildFindSuccessCallback_CA,
				validErrorCallback_CA, {
					filter : {
						startBefore : '2012-09-20 09:00'
					},
					multiple : true
				});

	});

	asyncTest("cal_016:find - endAfter 설정", function() {
		navigator.calendar.findEvents(vaildFindSuccessCallback_CA,
				validErrorCallback_CA, {
					filter : {
						endAfter : '2012-09-14 18:00'
					},
					multiple : true
				});

	});
	
	asyncTest("cal_017:add - 10회 반복 호출 테스트", function() {
		var calEvent = navigator.calendar.createEvent({
			description : 'HTML5 Introduction',
			summary : 'TCS test',
			start : '2012-09-14 09:00',
			end : '2012-09-14 12:00',
		});		
		
		try {
			for ( var i = 0; i < 10; i++) {
				navigator.calendar.addEvent(repeatSuccessCB, validErrorCallback_CA, calEvent);
			}
			setTimeout(function(){
				ok(true, "반복 호출이 성공적으로 수행됨");
				start();
			},200);
		} catch (e) {
			ok(true, e);
			start();
		}
	});

	asyncTest("cal_018:remove - 모든 일정 삭제 (반복 호출 테스트)", function() {
		function successFind(events) {
			function tempDeleteSC_CA() {
				// do notthing
				// ok(true,"Event가 성공적으로 삭제됨");
			}

			for ( var i = 0; i < events.length; ++i) {
				if (i != events.length - 1)
					navigator.calendar.deleteEvent(tempDeleteSC_CA,
							validErrorCallback_CA, events[i].id);
				else
					navigator.calendar.deleteEvent(validSuccessCallback_CA,
							validErrorCallback_CA, events[i].id);
			}
		}
		navigator.calendar.findEvents(successFind, validErrorCallback_CA);

	});
}