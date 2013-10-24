package co.kr.skt.cornerstone.yourappname;

import org.skt.runtime.RuntimeActivity;
import org.skt.runtime.UriReceiver;
import org.skt.runtime.UriReceiver.UriData;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class RuntimeStandAlone extends RuntimeActivity {

	private static final String BASE_URL = "file:///android_asset/www/";
	//private static final String BASE_URL = "file:///android_asset/www_softpackaging/";
	private static final String BASE_PAGE = "index.html";
	//private static final String BASE_PAGE = "index.html?arg=test?arg2=2";

	private static final String LOG_TAG = "RuntimeMAin";

	//DownloadThread dThread = null; 

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		String openPage = BASE_URL + BASE_PAGE; // load page var 

		//STEP 1: browser to runtime check 
		Intent i = getIntent();
		String action = i.getAction();
		String type = i.getType();

		if(Intent.ACTION_SEND.equals(action)){
			if ("text/plain".equals(type)) {
				String sharedText = i.getStringExtra(Intent.EXTRA_TEXT);
				String sharedSubject = i.getStringExtra(Intent.EXTRA_SUBJECT);
				if (sharedText != null) {
					Log.e("BrowserToRuntime", sharedText);
					Log.e("BrowserToRuntime", sharedSubject);

					//TODO : input your page to load with argument 
					openPage = BASE_URL + "push_sample.html?arg=" + sharedText;
				}
			}
		}
		else {
			//STEP 2: custom uri check  
			UriData data = (UriData)getIntent().getSerializableExtra(UriReceiver.FLAG_DATA);
			if(data == null) {
				openPage = BASE_URL + BASE_PAGE;
			}
			else {
				if(data.page != null){
					//ex -http://www.naver.com
					if(data.page.contains("http://") || data.page.contains("https://"))
						openPage = data.page;
					// local page 
					else
						openPage = BASE_URL + data.page;
				}
				else
					openPage = BASE_URL + BASE_PAGE;
			}
		}
	
		//STEP 2-1 : Hydration Check;
        //[20130823][chisu]set hydration build
        boolean usehydration = useHydrationBuild();
        if(usehydration){
        	UriData data = (UriData)getIntent().getSerializableExtra(UriReceiver.FLAG_DATA);
        	if(data == null)
        		openPage = BASE_URL + "softpackaging.html";
        	//소프트패키징을 사용하는 앱에서 push가 왔을 경우 
        	else if(data.page != null)
        		openPage = "file:///data/data/" + getPackageName() + "/hydapp/" + data.page;
        }
        
        
		//STEP 3 : load url
		if(super.splashscreen != 0){
			//super.loadUrl("file:///android_asset/www/index.html",3000);
			super.loadUrl(openPage,3000);
		}
		else{
			//super.loadUrl("file:///android_asset/www/index.html");
			super.loadUrl(openPage);
			//super.loadUrl("file:///data/data/" + getPackageName() + "/hydapp/index.html");
			//super.loadUrl("http://mwultong.blogspot.com/2007/07/html-download-link-tag.html");
		}

	}	   
}
