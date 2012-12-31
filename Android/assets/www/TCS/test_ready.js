var rootURL = null;

function requestFileSystemtest() {
    function onFileSystemSuccess(fileSystem) {
        //rootURL = fileSystem.root.toURL();
    	rootURL = fileSystem.root.fullPath;
        ok(true,"the Root URL ::" + rootURL);
    	start();
    }
    
    function fail(error) {
        console.log(error.code);
    }
    
    //test 1
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                             onFileSystemSuccess, fail);
}

//common
var repeatSuccessCB = function(result) {
	if( result == null || typeof result == "undefined" ) {
		ok(false, "반복 호출 테스트 실패");
	}
}


asyncTest("DeviceReady", function() {

    var onSuccess = function(acc) {
          ok(true, "DeviceReady = uuid : " + device.uuid + " platform : " + device.platform + " name : " + device.name );
          requestFileSystemtest();
    }

    document.addEventListener("deviceready", onSuccess, true);
        
});
