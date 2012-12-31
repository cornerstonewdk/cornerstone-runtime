//
//  RTAppLauncher.h
//  SRT_Template
//
//  Created by INFRA dev1 on 12. 9. 17..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"
#import "JSONKit.h"
#import "NSData+Base64.h"

@interface RTAppLauncher : RTPlugin
{
    
}

- (NSDictionary*) getBundlePlist:(NSString*)plistName;
- (void)launchApplication:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)getInstalledApplications:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
