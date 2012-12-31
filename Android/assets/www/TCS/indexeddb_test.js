document.addEventListener("deviceready", onDeviceReady_ID, false);


window.indexedDB = window.indexedDB || window.webkitIndexedDB ||window.mozIndexedDB;

if ('webkitIndexedDB' in window) {
	window.IDBTransaction = window.webkitIDBTransaction;
	window.IDBKeyRange = window.webkitIDBKeyRange;
}

var storename = "srt";
var dbname = "tcs";
var db = null;

var onFail = function(err) {
	ok(false, err.message);
	start();
}

function onDeviceReady_ID(){
	module("IndexedDB");

	asyncTest("idb_001:createDB", function() {

		var request = window.indexedDB.open(dbname);

		request.onsuccess = function(e) {
			ok(true, "window.indexedDB.open success");
			db = e.target.result;
			var version = new Date().getTime();

            if(device.platform == "Android") {
                var setVrequest = db.setVersion(version);
                setVrequest.onerror = onFail;
                setVrequest.onsuccess = function(e) {
                    if(db.objectStoreNames.length != 0) {
                        db.deleteObjectStore(storename);
                        ok(true, "deleteObjectStore success");
                    }
                    var store = db.createObjectStore(storename,{ keyPath: "id", autoIncrement : true });
                    ok(true, "createObjectStore success");
                    var index = store.createIndex("textIndex", "text", {"unique": false,"multiEntry": true});
                    ok(true, "createIndex success");
                };
            } else {
                if(db.objectStoreNames != null) {
                    db.deleteObjectStore(storename);
                    ok(true, "deleteObjectStore success");
                }
                var store = db.createObjectStore(storename,{ keyPath: "id", autoIncrement : true });
                ok(true, "createObjectStore success");
                var index = store.createIndex("textIndex", "text", {"unique": false,"multiEntry": true});
                ok(true, "createIndex success");
            }
			start();
		};
		request.onerror = onFail;
	});

	asyncTest("idb_002:indexeddb.transaction", function() {
        try {
              var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
              ok(true, "transaction IDBTransaction.READ_WRITE success");
        } catch(e) {
              ok(false, "transaction IDBTransaction.READ_WRITE fail");
        }
        
        try {
            var store = trans.objectStore(storename);
            ok(true, "transaction.objectStore success");
        } catch(e) {
            ok(false, "transaction.objectStore fail");
        }
        
        start();
    });
    
       
    asyncTest("idb_003:objectStore.add", function() {          
		var time = parseInt((new Date().getTime()) / 10000);
		var data = {
				"text": "addtest : "+time,
				"text2": [time],
				"timeStamp": time
		};

		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
		
		//add test
		var addrequest = store.add(data);
		addrequest.onsuccess = function(e) {
			ok(true, "objectStore.add success");
			start();
		};
		addrequest.onerror = onFail;
    });

    asyncTest("idb_004:objectStore.put", function() {
        var data = {
            "text": "puttest",
            "text2": "puttest", 
            "timeStamp": "puttest"
        };
        
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
        
		var putrequest = store.put(data);
		putrequest.onsuccess = function(e) {
			ok(true, "objectStore.put success");
            start();
		};
		putrequest.onerror = onFail;
    });
    
    asyncTest("idb_005:objectStore add - 5회 반복테스트", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
		
		for(var i=0;i<7;i++) {
            var time = parseInt((new Date().getTime()));
            var data = {
            "text": "testid : " + i,
            "timeStamp": time
            };
			store.add(data);
		}
        ok(true, "objectStore add for precondition success");
        start();
	});
    
    asyncTest("idb_006:objectStore.delete", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
    	
		var delreq = store.delete(6);
		delreq.onsuccess = function(e) {
			ok(true, "objectStore.delete success");
            start();
		};
		delreq.onerror = onFail;
	});
    
    asyncTest("idb_007:objectStore.get", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
    	
		var req = store.get(2);
		req.onsuccess = function(e) {
			ok(true, "objectStore.get success");
			start();
		}
		req.onerror = onFail;
	});

	asyncTest("idb_008:opencursor", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
		var keyRange = IDBKeyRange.lowerBound(0);
		ok(true, "IDBKeyRange set success");
		var cursorRequest = store.openCursor(keyRange);

		cursorRequest.onsuccess = function(e) {
			var result = e.target.result;
			if(!!result == false) {
				return;
			}
              
			if(result.value.id == "1") {
				ok(true, "objectStore.openCursor success");
				result.continue();

			}else if(result.value.id == "2"){
				ok(true, "IDBCursor.continue success");
                result.continue();
              
			} else if(result.value.id == "3"){
				var data = {
						"id" : result.value.id ,
						"text": "updated",
						"text2": ":" + "updated",
						"timeStamp": "updated"
				};
				var updatereq = result.update(data);
				updatereq.onsuccess = function(e) {
					ok(true, "IDBCursor.update success");
					result.continue();
				}
				updatereq.onerror = onFail;

			} else if(result.value.id == "4"){
				var delreq = result.delete();
				delreq.onsuccess = function(e) {
					ok(true, "IDBCursor.delete success");
					start();
				}
				delreq.onerror = onFail;
			}
		}
	});


	asyncTest("idb_009:openindexcursor", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
        var keyRange = IDBKeyRange.lowerBound(0);
		var index = store.index("textIndex");
		ok(true, "IDBIndex set success");
		var cursorRequest = index.openCursor(keyRange);
		var seq = 0;

		cursorRequest.onsuccess = function(e) {

			var result = e.target.result;

			if(!!result == false) {
				return;
			}

			if(seq == 0) {
				ok(true, "IDBIndex.openCursor success");
				seq++;
				result.continue();

			} else if(seq == 1){
				ok(true, "IDBIndexCursor.continue success");
				seq++;
                result.continue();

			} else if(seq == 2){
				var data = {
						"id" : result.value.id ,
						"text": "updated",
						"text2": ":" + "updated",
						"timeStamp": "updated"
				};
				var updatereq = result.update(data);
				updatereq.onsuccess = function(e) {
					ok(true, "IDBIndexCursor.update success");
					seq++;
					result.continue();
				}
				updatereq.onerror = onFail;

			} else if(seq == 3){
				var delreq = result.delete();
				delreq.onsuccess = function(e) {
					ok(true, "IDBIndexCursor.delete success");
					start();
				}
				delreq.onerror = onFail;
			}
		}
	});


	asyncTest("idb_010:openindexkeycursor", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
		var keyRange = IDBKeyRange.lowerBound(0);
		var index = store.index("textIndex");
		var getreq = index.get("updated");

		getreq.onsuccess = function(e) {
			ok(true, "IDBIndex.get : " + e.target.result.text);
		}
		getreq.onerror = onFail;

		var getKeyreq = index.getKey("updated");

		getKeyreq.onsuccess = function(e) {
			ok(true, "IDBIndex.getKey : " + e.target.result);
		}
		getKeyreq.onerror = onFail;


		var cursorRequest = index.openKeyCursor(keyRange);
		var seq = 0;

		cursorRequest.onsuccess = function(e) {

			var result = e.target.result;
			if(!!result == false) {
				return;
			}
			if(seq == 0) {
				ok(true, "IDBIndex.openCursor success");
				seq++;
				result.continue();

			} else if(seq == 1){
				ok(true, "IDBIndexKeyCursor.continue success");
                start();
            }
		}
	});

	asyncTest("idb_011:objectStore.clear", function() {
		var trans = db.transaction([storename], IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storename);
		try {
			store.clear();
			ok(true, "objectStore.clear success");
		} catch(e) {
			ok(false, "objectStore.clear is not supported");
		}
        start();
	});

}