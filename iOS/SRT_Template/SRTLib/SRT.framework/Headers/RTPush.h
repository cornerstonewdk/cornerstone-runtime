//
//  RTPush.h
//  SRTLib
//
//  Created by dev1 INFRA on 13. 6. 25..
//
//

#import "RTPlugin.h"

@interface RTPush : RTPlugin {
    
}
-(void) getRegistrationID:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) getCurrentURL:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
