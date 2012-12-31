//
//  RTLocalNotification.h
//  c3
//
//  Created by INFRA dev1 on 12. 8. 28..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"

@interface RTLocalNotification : RTPlugin

- (void)add:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)cancel:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)cancelAll:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
