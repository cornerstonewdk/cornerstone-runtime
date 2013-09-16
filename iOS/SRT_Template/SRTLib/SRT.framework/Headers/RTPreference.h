//
//  RTPreference.h
//  SRTLib
//
//  Created by dev1 INFRA on 13. 6. 25..
//
//

#import "RTPlugin.h"

@interface RTPreference : RTPlugin {
    
}
-(void) setItem:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) getItem:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) removeItem:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) clear:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end