document.addEventListener("deviceready", onDeviceReady_FS, false);

var gTestUrl = null;
var gTestDirEntry = null;

var invalidSC_FS = "successCallback";
var invalidarg_FS = {};

function invalidErrorCallback_FS(response){
	ok(false,"errorCallback이 아닌 exception이 발생하여야 함");
	start();
}

function validErrorCallback_FS(response){
	ok(false,"다음 error code: " +  response.code + ", 발생");
	start();
}

function expectedErrorCallback_FS(response){
	ok(true,"다음 error code: " +  response.code + ", 발생");
	start();
}

function onDeviceReady_FS(){

	module("FileSystem");

	//precondition 1
	asyncTest("fil_001:FileSystem TCS precondition::remove former test data", function() {
		function onFileSystemSuccess(rootDir) {
			ok(true,"rootDir.name::"+rootDir.name);
			ok(true,"rootDir.root.name::"+rootDir.root.name);

			function removeRecursivesuccess(){
				ok(true,"remove former test files");
				start();
			}
			
			function dirmakesuccess(direntry) {
				ok(true,"direntry Name: " + direntry.name);
				ok(true,"direntry fullpath: " + direntry.fullPath);

				direntry.removeRecursively(removeRecursivesuccess, validErrorCallback_FS);
			}
			// Retrieve an existing directory, or create it if it does not already exist
			rootDir.root.getDirectory("srtfiletest", {create: true, exclusive: false}, dirmakesuccess, validErrorCallback_FS);		
		}

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,	onFileSystemSuccess, validErrorCallback_FS);
	});
	
	//precondition 1
	asyncTest("fil_002:FileSystem TCS precondition::make precondition files", function() {
		function onFileSystemSuccess(rootDir) {
			ok(true,"rootDir.name::"+rootDir.name);
			ok(true,"rootDir.root.name::"+rootDir.root.name);

			function removeRecursivesuccess(){
				ok(true,"remove former test files");
			}
			
			function dirmakesuccess(direntry) {
				ok(true,"direntry Name: " + direntry.name);
				ok(true,"direntry fullpath: " + direntry.fullPath);

                gTestUrl = direntry.toURL();
				gTestDirEntry = direntry

				function filemakesuccess(fileentry) {
					ok(true,"fileentry Name: " + fileentry.name);
				}

				function subdirmakesuccess_only(direntry){
					ok(true,"subdirentry Name: " + direntry.name);
				}
				
				function subdirmakesuccess(direntry){
					ok(true,"subdirentry Name: " + direntry.name);
					direntry.getFile("subdirFile.txt", {create: true, exclusive: false}, filemakesuccess, validErrorCallback_FS);
				}

				function finalsuccess(fileentry){
					ok(true,"fileentry Name: " + fileentry.name);
					start();
				}
				direntry.getDirectory("deleteDirTest", {create: true, exclusive: false}, subdirmakesuccess_only, validErrorCallback_FS);
				direntry.getDirectory("deleteDirRecursiveTest", {create: true, exclusive: false}, subdirmakesuccess, validErrorCallback_FS);
				direntry.getDirectory("moveDirTest", {create: true, exclusive: false}, subdirmakesuccess, validErrorCallback_FS);
				direntry.getDirectory("copyDirTest", {create: true, exclusive: false}, subdirmakesuccess, validErrorCallback_FS);

				direntry.getFile("writeTestFile.txt", {create: true, exclusive: false}, filemakesuccess, validErrorCallback_FS);
				direntry.getFile("moveTestFile.txt", {create: true, exclusive: false}, filemakesuccess, validErrorCallback_FS);
				direntry.getFile("copyTestFile.txt", {create: true, exclusive: false}, filemakesuccess, validErrorCallback_FS);
				direntry.getFile("deleteTestFile.txt", {create: true, exclusive: false}, finalsuccess, validErrorCallback_FS);

			}

			// Retrieve an existing directory, or create it if it does not already exist
			rootDir.root.getDirectory("srtfiletest", {create: true, exclusive: false}, dirmakesuccess, validErrorCallback_FS);


			//rootDir.root.removeRecursively(removeRecursivesuccess, validErrorCallback_FS);
		}

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,	onFileSystemSuccess, validErrorCallback_FS);
	});

	//test 1
	asyncTest("fil_003:requestFileSystem-PERSISTENT filesystem", function() {
		function onFileSystemSuccess(fileSystem) {
			ok(true,"fileSystem.name::"+fileSystem.name);
			ok(true,"fileSystem.root.name::"+fileSystem.root.name);
			start();
		}

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,	onFileSystemSuccess, validErrorCallback_FS);
	});

	//test 2
	asyncTest("fil_004:requestFileSystem-TEMPORARY filesystem", function() {
		function onFileSystemSuccess(fileSystem) {
			ok(true,"fileSystem.name::"+fileSystem.name);
			ok(true,"fileSystem.root.name::"+fileSystem.root.name);

			start();
		}	
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 1024 * 1024, onFileSystemSuccess, validErrorCallback_FS);
	});
	
	//test 2-1
	asyncTest("fil_005:requestFileSystem- not local filesystem type", function() {
		function onFileSystemSuccess(fileSystem) {
			ok(false,"fileSystem.name::"+fileSystem.name);
			ok(false,"fileSystem.root.name::"+fileSystem.root.name);

			start();
		}	
		window.requestFileSystem(-1, 1024 * 1024, onFileSystemSuccess, expectedErrorCallback_FS);
	});

	//test 3
	asyncTest("fil_006:resolveLocalFileSystemURI-모든 매개변수가 올바른 경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			start();
		}

		window.resolveLocalFileSystemURI(gTestUrl+"/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 3-1
	asyncTest("fil_007:resolveLocalFileSystemURI-url이 올바르지 않은 경우 ", function() {
		function onResolveSuccess(fileEntry) {
			ok(false,"fileEntry.name::"+fileEntry.name);
			ok(false,"fileEntry.fullPath::"+ fileEntry.fullPath);

			start();
		}

		window.resolveLocalFileSystemURI("file://noexist/noexist.txt",onResolveSuccess, expectedErrorCallback_FS);
	});

	//test 4
	asyncTest("fil_008:getMetadata-모든 매개변수가 올바른 경우", function() {
		function success(metadata) {
			ok(true,"Last Modified: " + metadata.modificationTime);
			ok(true,"Size: " + metadata.size);

			start();
		}	

		function onResolveSuccess(fileSystem) {
			ok(true,"fileSystem.name::"+fileSystem.name);
			ok(true,"fileSystem.root.name::"+fileSystem.root.name);

			// Request the metadata object for this entry
			fileSystem.root.getMetadata(success, validErrorCallback_FS);
		}	

		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onResolveSuccess, validErrorCallback_FS);
	});

	//test 5
	asyncTest("fil_009:moveTo-file 이동", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(true,"move success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.moveTo(parentEntry,"movedfile.txt",success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/moveTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});

	//test 5-1
	asyncTest("fil_010:moveTo- file 이동 , parent가 null 인경우 ", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"move success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.moveTo(null,"moveTestFile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedfile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 5-2
	asyncTest("fil_011:moveTo-file 이동, 동일한 위치에 move 하였을 경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"move success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.moveTo(parentEntry,"movedfile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedfile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 5-3
	asyncTest("fil_012:moveTo-file 이동, move 될 대상이 directory인 경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"move success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.moveTo(parentEntry,"moveDirTest",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedfile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 6
	asyncTest("fil_013:moveTo-dir 이동", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(true,"move success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.moveTo(parentEntry,"movedDir",success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/moveDirTest",onResolveSuccess, validErrorCallback_FS);
	});

	//test 6-1
	asyncTest("fil_014:moveTo-dir 이동 , parent가 null인경우 ", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"move success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.moveTo(null,"moveDirTest",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedDir",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 6-2
	asyncTest("fil_015:moveTo-dir 이동 , 동일한 위치에 move 하였을 경우", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"move success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.moveTo(parentEntry,"movedDir",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedDir",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 6-3
	asyncTest("fil_016:moveTo-dir 이동 , move 될 대상이 file 경우", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"move success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.moveTo(parentEntry,"movedfile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/movedDir",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 7
	asyncTest("fil_017:copyTo-file 복사", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(true,"copy success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.copyTo(parentEntry,"copiedfile.txt",success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});

	//test 7-1
	asyncTest("fil_018:copyTo-file 복사, parent가 null인경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"copy success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.copyTo(null,"copiedfile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 7-2
	asyncTest("fil_019:copyTo-file 복사, 동일한 위치에 copy 하였을 경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"copy success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.copyTo(parentEntry,"copyTestFile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 7-3
	asyncTest("fil_020:copyTo-file 복사, copy 될 대상이 dir 경우", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			function success(entry) {
				ok(false,"copy success,New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			fileEntry.copyTo(parentEntry,"copyDirTest",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 8
	asyncTest("fil_021:copyTo-dir 복사", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(true,"copy success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.copyTo(parentEntry,"copiedDir",success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 8-1
	asyncTest("fil_022:copyTo-dir 복사,parent가 null인경우", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"copy success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.copyTo(null,"copiedDir",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 8-2
	asyncTest("fil_023:copyTo-dir 복사,동일한 위치에 copy 하였을 경우", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"copy success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.copyTo(parentEntry,"copyDirTest",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 8-3
	asyncTest("fil_024:copyTo-dir 복사,copy 될 대상이 dir 경우", function() {
		function onResolveSuccess(dirEntry) {
			ok(true,"dirEntry.name::"+dirEntry.name);
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);

			function success(entry) {
				ok(false,"copy success, New Path: " + entry.fullPath);
				start();
			}

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);

			dirEntry.copyTo(parentEntry,"copyTestFile.txt",success,expectedErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 9
	asyncTest("fil_025:toURL-DirEntry URL", function() {
		function onResolveSuccess(dirEntry) {

			var dirURL =  dirEntry.toURL();
			ok(true,"DirEntry URL::" + dirURL);  
			start();
		}

		window.resolveLocalFileSystemURI(gTestUrl,onResolveSuccess, validErrorCallback_FS);
	});

	//test 10
	asyncTest("fil_026:toURL-FileEntry URL", function() {
		function onResolveSuccess(fileEntry) {

			var fileURL =  fileEntry.toURL();
			ok(true,"FileEntry URL::" + fileURL);     
			start();
		}

		window.resolveLocalFileSystemURI(gTestUrl+"/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 11
	asyncTest("fil_027:remove-FileEntry remove", function() {
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success() {
				ok(true,"Removal succeeded");
				start();
			}
			//remove file
			fileEntry.remove(success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/deleteTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 12
	asyncTest("fil_028:remove-DirEntry remove", function() {
		function onResolveSuccess(dirEntry) {		
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);
			
			function success() {
				ok(true,"Removal succeeded");
				start();
			}
			//remove file
			dirEntry.remove(success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/deleteDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 12
	asyncTest("fil_029:remove-DirEntry remove, 빈 폴더가 아닌경우", function() {
		function success() {
			ok(false,"Removal succeeded");
			start();
		}
		//remove file
		gTestDirEntry.remove(success,expectedErrorCallback_FS);
	});
	
	//test 13
	asyncTest("fil_030:getParent-file get Parent", function() {
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(parent) {
				ok(true,"Parent Name: " + parent.name);
				ok(true,"Parent fullPath: " + parent.fullPath);
				start();
			}

			// Get the parent FileEntry
			fileEntry.getParent(success, validErrorCallback_FS);
		}


		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 14
	asyncTest("fil_031:getParent-dir get Parent", function() {
		function onResolveSuccess(dirEntry) {		
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);
			
			function success(parent) {
				ok(true,"Parent Name: " + parent.name);
				ok(true,"Parent fullPath: " + parent.fullPath);
				start();
			}

			// Get the parent FileEntry
			dirEntry.getParent(success, validErrorCallback_FS);
		}


		window.resolveLocalFileSystemURI(gTestUrl+ "/copyDirTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 15
	asyncTest("fil_032:createReader- 디렉토리 리더 생성", function() {
		// Get a directory reader
		var directoryReader = gTestDirEntry.createReader();

		if(directoryReader != null){
			ok(true,"Directory reader is created.");
		}
		else{
			ok(false,"Directory reader is not created.");
		}
		start();
	});
	
	//test 16
	asyncTest("fil_033:getDirectory- create  = false", function() {
		function success(entry) {
			ok(false,"entry Name: " + entry.name);
			ok(false,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getDirectory("newDir", {create: false, exclusive: false}, success, expectedErrorCallback_FS);
	});
	
	//test 17
	asyncTest("fil_034:getDirectory- create  = true", function() {
		function success(entry) {
			ok(true,"entry Name: " + entry.name);
			ok(true,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getDirectory("newDir", {create: true, exclusive: false}, success, validErrorCallback_FS);
	});
	
	//test 18
	asyncTest("fil_035:getDirectory- create  = false , but created already.", function() {
		function success(entry) {
			ok(true,"entry Name: " + entry.name);
			ok(true,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getDirectory("copyDirTest", {create: false, exclusive: false}, success, validErrorCallback_FS);
	});
	
	//test 19
	asyncTest("fil_036:getFile- create  = false", function() {
		function success(entry) {
			ok(false,"entry Name: " + entry.name);
			ok(false,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getFile("newDir.txt", {create: false, exclusive: false}, success, expectedErrorCallback_FS);
	});
	
	//test 20
	asyncTest("fil_037:getFile- create  = true", function() {
		function success(entry) {
			ok(true,"entry Name: " + entry.name);
			ok(true,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getFile("newDir.txt", {create: true, exclusive: false}, success, validErrorCallback_FS);
	});
	
	//test 21
	asyncTest("fil_038:getFile- create  = false , but created already.", function() {
		function success(entry) {
			ok(true,"entry Name: " + entry.name);
			ok(true,"entry fullPath: " + entry.fullPath);
			start();
		}

		gTestDirEntry.getFile("copiedfile.txt", {create: false, exclusive: false}, success, validErrorCallback_FS);
	});
	
	//test 22
	asyncTest("fil_039:removeRecursively-DirEntry remove Recursively", function() {
		function onResolveSuccess(dirEntry) {		
			ok(true,"dirEntry.fullPath::"+ dirEntry.fullPath);
			
			function success() {
				ok(true,"Removal succeeded");
				start();
			}
			//remove file
			dirEntry.removeRecursively(success,validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/deleteDirRecursiveTest",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 23
	asyncTest("fil_040:file-FileEntry file", function() {
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
				function success(file) {
					ok(true, "obtain properties of a file.");
					ok(true,"File name: " + file.name);
					ok(true,"File lastModifiedDate: " + file.lastModifiedDate);
					ok(true,"File size: " + file.size);
					ok(true,"File type: " + file.type);
					start();
				}
				
				// obtain properties of a file
				fileEntry.file(success, validErrorCallback_FS);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	//test 24
	asyncTest("fil_041:readEntries-create DirReader And readEntries", function() {
		
		function success(entries) {
		    var i;
		    for (i=0; i<entries.length; i++) {
		        ok(true, "Entries[" + i +"].name = " + entries[i].name);
		        ok(true, "Entries[" + i +"].isFile = " + entries[i].isFile);
		    }
		    
		    start();
		}
		
		var directoryReader = gTestDirEntry.createReader();
		
		// Get a list of all the entries in the directory
		directoryReader.readEntries(success,validErrorCallback_FS);
		
	});
	
	//test 25
	asyncTest("fil_042:createWriter-createWriter test", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(writer) {
				
				ok(true,"writer is created.");
				
				writer.onabort = function(evt) {
					ok(true,"onabort");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);			
				};
				writer.onerror = function(evt) {
					ok(false,"onerror");
					ok(false,"readyState = " + evt.target.readyState);
					ok(false,"position = " + evt.target.position);
					ok(false,"length = " + evt.target.length);			
				};
				writer.onprogress = function(evt) {
					ok(true,"onprogress");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);			
				};
				writer.onwrite = function(evt) {
					ok(true,"onwrite");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);			
				};
				writer.onwriteend = function(evt) {
					ok(true,"onwriteend");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);				
				};
				writer.onwritestart = function(evt) {
					ok(true,"onwritestart");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);			
				};
						
				start();
			}

			// create a FileWriter to write to the file
			fileEntry.createWriter(success, validErrorCallback_FS);	
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 26
	asyncTest("fil_043:write-createWriter And wirte", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(writer) {
				
				ok(true,"writer is created.");
				
				writer.onwrite = function(evt) {
					ok(true,"onwrite");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);	
					start();
				};	
				writer.onerror = function(evt) {
					ok(false,"onerror");
					ok(false,"readyState = " + evt.target.readyState);
					ok(false,"position = " + evt.target.position);
					ok(false,"length = " + evt.target.length);			
				};
				
				writer.write("some text is written.");
			}

			// create a FileWriter to write to the file
			fileEntry.createWriter(success, validErrorCallback_FS);	
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 27
	asyncTest("fil_044:abort-createWriter And abort", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(writer) {
				
				ok(true,"writer is created.");
				
				writer.onabort = function(evt) {
					ok(true,"onabort");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);	
					start();
				};
				
				writer.onwrite = function(evt) {
					ok(true,"onwrite");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);			
				};
				
				writer.onerror = function(evt) {
					ok(false,"onerror");
					ok(false,"readyState = " + evt.target.readyState);
					ok(false,"position = " + evt.target.position);
					ok(false,"length = " + evt.target.length);			
				};
			
				writer.write("This is not text");
				writer.abort();
			}

			// create a FileWriter to write to the file
			fileEntry.createWriter(success, validErrorCallback_FS);	
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});

	//test 28
	asyncTest("fil_045:seek-createWriter And seek", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(writer) {
				
				ok(true,"writer is created.");
							
				writer.onwrite = function(evt) {
					ok(true,"onwrite");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);	
					start();
				};
				
				writer.onerror = function(evt) {
					ok(false,"onerror");
					ok(false,"readyState = " + evt.target.readyState);
					ok(false,"position = " + evt.target.position);
					ok(false,"length = " + evt.target.length);			
				};
			
				writer.seek(writer.length);
				writer.write("this is tail text");
			}

			// create a FileWriter to write to the file
			fileEntry.createWriter(success, validErrorCallback_FS);	
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 29
	asyncTest("fil_046:truncate-createWriter And truncate", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			function success(writer) {
				
				ok(true,"writer is created.");
							
				writer.onwrite = function(evt) {
					ok(true,"onwrite");
					ok(true,"readyState = " + evt.target.readyState);
					ok(true,"position = " + evt.target.position);
					ok(true,"length = " + evt.target.length);	
					start();
				};
				
				writer.onerror = function(evt) {
					ok(false,"onerror");
					ok(false,"readyState = " + evt.target.readyState);
					ok(false,"position = " + evt.target.position);
					ok(false,"length = " + evt.target.length);			
				};
			
				writer.truncate(10);
			}

			// create a FileWriter to write to the file
			fileEntry.createWriter(success, validErrorCallback_FS);	
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 30
	asyncTest("fil_047:readAsText-create file reader And readAsText", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			var reader = new FileReader();
		    reader.onload = function(evt) {
		    	ok(true,"onload");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
				start();
		    };
		    reader.onerror = function(evt) {
		    	ok(true,"onerror");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
		    };
		    reader.onabort = function(evt) {
		    	ok(true,"onabort");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
		    };
		    
		    reader.readAsText(fileEntry);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 31
	asyncTest("fil_048:readAsDataURL-create file reader And readAsDataURL", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			var reader = new FileReader();
		    reader.onload = function(evt) {
		    	ok(true,"onload");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
				start();
		    };
		    reader.onerror = function(evt) {
		    	ok(false,"onerror");
		    	ok(false,"evt.target.result = " + evt.target.result);
				ok(false,"evt.target.readyState = " + evt.target.readyState);
		    };
		    
		    reader.readAsDataURL(fileEntry);
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 32
	asyncTest("fil_049:readAsDataURL-create file reader And abort", function() {
		
		function onResolveSuccess(fileEntry) {		
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);
			
			var reader = new FileReader();

		    reader.onload = function(evt) {
		    	ok(true,"onload");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
		    };
		    reader.onerror = function(evt) {
		    	ok(false,"onerror");
		    	ok(false,"evt.target.result = " + evt.target.result);
				ok(false,"evt.target.readyState = " + evt.target.readyState);
		    };
		    reader.onabort = function(evt) {
		    	ok(true,"onabort");
		    	ok(true,"evt.target.result = " + evt.target.result);
				ok(true,"evt.target.readyState = " + evt.target.readyState);
				start();
		    };
		    
		    reader.readAsText(fileEntry);
		    reader.abort();
		}

		window.resolveLocalFileSystemURI(gTestUrl+ "/writeTestFile.txt",onResolveSuccess, validErrorCallback_FS);
		
	});
	
	//test 33 - repeat tests
	asyncTest("fil_050:requestFileSystem-PERSISTENT 10회 반복 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,	repeatSuccessCB, validErrorCallback_FS);
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
	
	asyncTest("fil_051:copyTo-file 10회 반복 테스트", function() {
		function onResolveSuccess(fileEntry) {
			ok(true,"fileEntry.name::"+fileEntry.name);
			ok(true,"fileEntry.fullPath::"+ fileEntry.fullPath);

			var parentEntry = new DirectoryEntry("srtfiletest",gTestUrl);
			
			try {
				for ( var i = 0; i < 10; i++) {
					fileEntry.copyTo(parentEntry,"copiedfile"+i+".txt",repeatSuccessCB,validErrorCallback_FS);
				}
				setTimeout(function(){
					ok(true, "반복 호출이 성공적으로 수행됨");
					start();
				},200);
			} catch (e) {
				ok(false, e);
				start();
			}
		}

		window.resolveLocalFileSystemURI(gTestUrl + "/copyTestFile.txt",onResolveSuccess, validErrorCallback_FS);
	});
	
	asyncTest("fil_052:getDirectory- create  = true 10회 반복 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				gTestDirEntry.getDirectory("newDir"+i , {create: true, exclusive: false}, repeatSuccessCB, validErrorCallback_FS);
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
	
	asyncTest("fil_053:getFile- create  = true 10회 반복 테스트", function() {
		try {
			for ( var i = 0; i < 10; i++) {
				gTestDirEntry.getFile("newDir"+i+".txt", {create: true, exclusive: false}, repeatSuccessCB, validErrorCallback_FS);
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
