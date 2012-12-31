//
//  RTDeviceStatus.h
//  c3
//
//  Created by INFRA dev1 on 12. 8. 22..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"
#import <CoreTelephony/CTCarrier.h>
#import <CoreTelephony/CTTelephonyNetworkInfo.h>
#import <SystemConfiguration/CaptiveNetwork.h>

@interface RTDeviceStatus : RTPlugin
{
    
}

- (void)getPropertyValue:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
