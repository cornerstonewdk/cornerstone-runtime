//
//  RTPageLoading.h
//  SRT_Template
//
//  Created by INFRA dev1 on 12. 9. 24..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import <SRT/RTPlugin.h>

@interface RTPageLoading : RTPlugin {
    
}

-(void) getStartPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) getEndPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) getPageLoadingTime:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
