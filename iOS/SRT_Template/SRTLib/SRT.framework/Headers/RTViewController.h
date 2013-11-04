/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "RTWebView.h"

#import "JSONKit.h"
#import "RTInvokedUrlCommand.h"
#import "RTCommandDelegate.h"
#import "CDVWhitelist.h"
#import "RTAppLauncher.h"
#import "SSZipArchive.h"


@interface RTViewController : UIViewController<UIWebViewDelegate, RTCommandDelegate> {
    
}

@property (nonatomic, retain) IBOutlet RTWebView* webView;

@property (nonatomic, readonly, retain) NSMutableDictionary* pluginObjects;
@property (nonatomic, readonly, retain) NSDictionary* pluginsMap;
@property (nonatomic, readonly, retain) NSDictionary* settings;
@property (nonatomic, readonly, retain) CDVWhitelist* whitelist; // readonly for public
@property (nonatomic, readonly, retain) NSArray* supportedOrientations;
@property (nonatomic, readonly, assign) BOOL loadFromString;
@property (nonatomic, readwrite, copy) NSString* invokeString;

@property (nonatomic, readwrite, assign) BOOL useSplashScreen;
@property (nonatomic, readwrite, assign) BOOL useStatusbarSpinner;
@property (nonatomic, readwrite, assign) BOOL useScreenSpinner;
@property (nonatomic, readonly, retain) IBOutlet UIImageView* activityView;
@property (nonatomic, readonly, retain) UIImageView *imageView;
@property (nonatomic, readwrite, retain) id<RTCommandDelegate> commandDelegate;

@property (nonatomic, readwrite, copy) NSString* wwwFolderName;
@property (nonatomic, readwrite, copy) NSString* startPage;
@property (nonatomic, readwrite, copy) NSString* query;
@property (nonatomic, readwrite, assign) BOOL pushfromsp;
@property (nonatomic, readwrite, copy) NSString* currentURL;

@property (nonatomic, readwrite, assign) NSTimeInterval startloadingtime;
@property (nonatomic, readwrite, assign) NSTimeInterval endloadingtime;


+ (NSDictionary*) getBundlePlist:(NSString*)plistName;
+ (NSString*) cordovaVersion;
+ (NSString*) applicationDocumentsDirectory;
+ (NSString*) getDeviceToken;

- (void) printMultitaskingInfo;
- (void) createGapView;
- (RTWebView*) newCordovaViewWithFrame:(CGRect)bounds;

- (int) executeQueuedCommands;
- (void) flushCommandQueue;

- (void) javascriptAlert:(NSString*)text;
- (NSString*) appURLScheme;
- (NSDictionary*) deviceProperties;

- (NSArray*) parseInterfaceOrientations:(NSArray*)orientations;

//[20130823][chisu]for hydration
@property (nonatomic, retain) NSURLConnection *theConnection;
@property (nonatomic, retain) NSMutableData *DownLoad_Data;
@property (nonatomic) long Total_FileSize;

@property (nonatomic, readonly, retain) NSDictionary* softpackagingPlist;

- (BOOL) useSoftpackaging;
- (void) getDocFolder;
- (void) unzip;
- (void) downloadzip;
- (NSString*) getCurrentURL;

@end
