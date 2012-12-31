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

#import "RTPlugin.h"

@interface RTProximitySensor : RTPlugin
{
    
}

@property (nonatomic, retain) NSString* callbackId;

- (RTProximitySensor*) init;
- (void)start:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)stop:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end

#define TYPE_TEMPERATURE    1
#define TYPE_PRESSURE       2
#define TYPE_HUMIDTY        3
#define TYPE_LIGHT          4
#define TYPE_PROXIMITY      5
