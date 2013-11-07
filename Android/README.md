### COPYRIGHT(C) 2012 BY SKTELECOM CO., LTD. ALL RIGHTS RESERVED ###

----------

### 1 Android Runtime 웹앱 개발 환경 구조 

1) src - plugin 개발시에 작성하는 Java Native Code

2) asset - 실제 웹앱의 웹 리소스(HTML/CSS/JS/IMG) 와 Runtime JavaScript Library 가 저장되는 위치 
	
-	**assets/www** : 웹앱의 저장 위치 

		- 본 프로젝트에서는 Corenrstone에서 제공하는 각 Device API를 테스트 하는 웹앱이 기본으로 포함되어 있다. 
		- 웹앱 개발자는 www폴더 내부의 웹앱을 삭제하고 개발자가 원하는 html 및 js , css 를 추가하여 웹앱을 개발할 수 있다. 

-	**assets/www/index.html** : 웹앱의 첫 실행 파일 (RuntimeStandAlone.java 에서 변경가능) 

3) libs - Webview 를 이용하여 Device 의 단말 접근 기능을 제공하는 DeviceAPI가 포팅된 Android library 위치 

-	**Runtime.jar** : webview 및 DeviceAPI가 포팅된 JAVA library

4) drawable - device에 보여지는 icon 및 splash image를 저장하는 위치 

-	**icon.png** : device에 보여지는 icon
-	**splash.png** : 웹앱 실행 초기에 보여지는 splash image (optional) 

5) values , xml - 웹앱의 name 및 runtime setting을 할 수 있는 폴더 

-	**value/string.xml** : 웹앱의 name을 세팅하는 파일 
-	**xml/config.xml** : device의 orientation(portrait , landscape , auto) 및 splash image , 메뉴 사용여부 , loading progressbar 사용여부를 세팅 하는 파일 

6) AndroidManifest.xml : 하나의 Native Application으로써의 고유한 Package 명을 지정하는 파일, 하드웨어 가속 GPU 렌더링 사용여부를 지정하는 파일.


7) Cornerstone Runtime을 이용하여 웹앱을 개발하는 상세한 방법은 다음 문서를 참조한다. 

	- http://cornerstone.sktelecom.com/2/livedoc/#6200