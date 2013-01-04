### COPYRIGHT(C) 2012 BY SKTELECOM CO., LTD. ALL RIGHTS RESERVED ###

----------

## 1.1 Android Runtime 기본 구조 
<br>
### 1.1.1 Android Native Layer 

-	Android Webview를 이용하여 Runtime JavaScript Library에서 호출된 API를 그에 해당하는 Native Class를 실행하고 성공/실패 콜백 전달하는 모듈

-	WebApp에서 Device의 특정 기능을 수행 및 webview를 사용하기 위하여 **Runtime.jar** 가 배포된다. 

	-	Runtime.jar는 Java class로 구성되어 있는 Android용 native library 이다. 
	- 	Runtime.jar는 web app의 index.html을 load하는 파일을 포함 하고 있다. 
	- 	Runtime.jar는 Cornerstone Runtime에서 제공하는 DeviceAPI가 포팅되어 있다. 
	- 	Runtime.jar는 Native code로 모듈화 되어 Android SDK 로 부터 작업을 수행하고 결과를 JavaScript layer에 반환 한다. 


<br>

### 1.1.2 Android Project Files 

-	Android용 webapp을 개발하기 위해서는 아래 와 같은 project file 들을 세팅하여야 한다. 

	1) AndroidManifest.xml
	-	WebApp의 고유한 **package** 명 설정 

	2) res/value/string.xml 
	-	 실제 단말에서 보여지는 **WebApp의 이름** 설정 

	3)  res/drawable/icon.png
	-	 실제 단말에서 보여지는 **아이콘** 설정 


<br>

----------

## 1.2 IOS Runtime 기본 구조 

### 1.2.1 IOS Native Layer

- UIWebview를 이용하여 Runtime JS Library에서 불리는 API를 그에 해당하는 Native Class를 실행하고 성공/실패 콜백 전달 모듈

 - RuntimeDelegate : UIWebview를 생성하고 Runtime API를 연동
 - ViewController : UIWebview와 Device를 연결하고 Orientaion을 제어
 - Commands : JS API 를 Native Platform API를 통해서 구현
 - Utils : JSON / Base64 / ExtendMutableArray / ExtendMutableDictionary 라이브러리

- SRT.framework 라는 이름으로 배포된다.

<br>

### 1.2.2 IOS Project Files

-	iOS용 webapp을 개발하기 위해서는 아래 와 같은 project file 들을 세팅하여야 한다. 

	1) SRT_Template-Info.plist
	- **iOS 어플 설정**을 위한 프로젝트 파일

	2) SRT.plist
	-	**Cornerstone Runtime 설정**을 위한 프로젝트 파일

	3) Resources
	-	icon / splash screen 용 이미지 파일들

<br>