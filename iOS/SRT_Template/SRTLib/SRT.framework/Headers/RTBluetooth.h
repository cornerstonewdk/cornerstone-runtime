//
//  RTBluetooth.h
//  SRTLib
//
//  Created by INFRA dev1 on 13. 5. 28..
//  Copyright (c) 2013년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"
#import <CoreBluetooth/Corebluetooth.h>
#import <GameKit/GameKit.h>

#define TRANSFER_SERVICE_UUID           @"E20A39F4-73F5-4BC4-A12F-17D1AD07A961"
#define TRANSFER_CHARACTERISTIC_UUID    @"08590F7E-DB05-467E-8757-72F6FAEB13D4"

@interface RTBluetooth : RTPlugin {
    CBCentralManager      *centralManager;
    CBPeripheral          *discoveredPeripheral;
    
    GKSession *currentSession;
}

@property (nonatomic, retain) GKSession             *currentSession;

- (void) scanDevice:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) stopScanDevice:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
