### COPYRIGHT(C) 2012 BY SKTELECOM CO., LTD. ALL RIGHTS RESERVED ###

----------

### 1 iOS Runtime 웹앱 개발 환경 구조  

1) SRT.framework - Cornerstone Runtime Library

2) www - 실제 웹앱의 웹 리소스(HTML/CSS/JS/IMG) 와 Cornerstone Runtime JavaScript Library 가 저장되는 위치 

-	**www** : 웹앱의 저장 위치 
-	**www/index.html** : 웹앱의 첫 실행 파일

		- Corenrstone Runtime은 웹 리소스이름의 대소문자를 구분한다.
		- index.html 파일의 경우 파일 이름을 전부 소문자로 하지 않으면 파일을 찾을 수 없다는 에러를 발생시키니 유의한다.

-	**www/SRT-1.0.js** : Cornerstone Runtime JavaScript Library

3) SRT_Template/Resources - 어플에 필요한 리소스를 저장하는 위치

-	**icons** : Icon을 위한 이미지 폴더
-	**splash** : splash screen을 위한 이미지 폴더


4) SRT_Template/Supporting Files - 앱 및 런타임 설정 파일이 위치하는 폴더

-	**SRT_Template-Info.plist** : iOS 앱을 위한 설정 파일
-	**SRT.plist** : Cornerstone Runtime을 위한 설정 파일

5) iOS Runtime을 이용하여 웹앱을 개발하는 상세한 방법은 다음 링크의 문서를 참조한다. 

	- http://cornerstone.sktelecom.com/2/livedoc/#6300
<br>