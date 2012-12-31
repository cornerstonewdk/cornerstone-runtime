//
//  RTPageLoading.m
//  SRT_Template
//
//  Created by INFRA dev1 on 12. 9. 24..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPageLoading.h"
#import <SRT/RTViewController.h>

@implementation RTPageLoading


-(void) getStartPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    NSString* callbackId = [arguments objectAtIndex:0];
    
    RTViewController *rvc = (RTViewController*)[self viewController];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDouble:rvc.startloadingtime * 1000];
    [super writeJavascript:[result toSuccessCallbackString:callbackId]]; 
}

-(void) getEndPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    NSString* callbackId = [arguments objectAtIndex:0];
    
    RTViewController *rvc = (RTViewController*)[self viewController];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDouble:rvc.endloadingtime * 1000];
    [super writeJavascript:[result toSuccessCallbackString:callbackId]]; 
}

-(void) getPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    NSString* callbackId = [arguments objectAtIndex:0];
    
    RTViewController *rvc = (RTViewController*)[self viewController];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDouble:(rvc.endloadingtime - rvc.startloadingtime) * 1000];
    [super writeJavascript:[result toSuccessCallbackString:callbackId]]; 
}


@end
