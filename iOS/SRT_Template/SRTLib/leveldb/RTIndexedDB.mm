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


#import "RTIndexedDB.h"

@implementation RTIndexedDB

@synthesize callbackId,isNextDirection,isUniqueDirection;


- (RTIndexedDB*) init
{
    self = [super init];
    if (self)
    {
        self.callbackId = nil;
    }

    return self;
}

- (void) dealloc {
    [keyRange release];
    [super dealloc]; // pretty important.
}

- (void)open:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    keyRange = [[RTKeyRange alloc] init];
    self.callbackId = [arguments objectAtIndex:0];
    NSString *dbname = [arguments objectAtIndex:1];

    ldb = [LevelDB databaseInLibraryWithName:dbname];
    [ldb putObject:dbname forKey:kSRTDBName];
    
    if([arguments objectAtIndex:2]) {
        [ldb putObject:[arguments objectAtIndex:2] forKey:kSRTDBVersion];
        NSLog(@"DBVersion %@",[ldb getString:kSRTDBVersion]);
    }
    
    NSMutableDictionary *resultdict = [NSMutableDictionary dictionaryWithCapacity:4];
    [resultdict setObject:[ldb getString:kSRTDBName] forKey:kSRTDBName];
    [resultdict setObject:[ldb getString:kSRTDBVersion] forKey:kSRTDBVersion];
    [resultdict setObject:[ldb getArray:kSRTDBobjectStoreNames] forKey:kSRTDBobjectStoreNames];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:resultdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)close:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    ldb = nil;
}

- (void)deleteDatabase:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *dbname = [arguments objectAtIndex:1];

    LevelDB *db = [LevelDB databaseInLibraryWithName:dbname];
    [db deleteDatabase];
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)createObjectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    if(ldb == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if([options valueForKeyIsNull:kSRTDBkeyPath] && [options valueForKeyIsNull:kSRTDBautoIncrement]) {
        [self doFailWithError:@"Invalid Parameters"];
        return;
    }
   
    if([[ldb getArray:kSRTDBobjectStoreNames] isKindOfClass:[NSNull class]]){
        [ldb putObject:[NSArray arrayWithObject:storename] forKey:kSRTDBobjectStoreNames];
    } else {
        NSMutableArray *objectStoreNames = [NSMutableArray arrayWithArray:[ldb getArray:kSRTDBobjectStoreNames]];
        if([objectStoreNames containsObject:storename]) {
            [self doFailWithError:@"already exist"];
            return;
        }

        [objectStoreNames addObject:storename];
        [ldb putObject:objectStoreNames forKey:kSRTDBobjectStoreNames];
    }
    
    storeDB = [self getObejctStoreDB:storename];
    
    if([options valueForKeyIsNull:kSRTDBkeyPath]) {
        [storeDB putObject:kSRTDBkeyPath forKey:kSRTDBDefaultkeyPath];
    } else {
        [storeDB putObject:[options valueForKey:kSRTDBkeyPath] forKey:kSRTDBDefaultkeyPath];
    }
    
    NSLog(@"keyPath is %@", [storeDB getString:kSRTDBDefaultkeyPath]);
    
    BOOL autoIncrement = TRUE;
    
    if(![options valueForKeyIsNull:kSRTDBautoIncrement]) {
        autoIncrement = [[options objectForKey:kSRTDBautoIncrement] boolValue];
    }
    
    if(autoIncrement) {
        [storeDB putObject:@"0" forKey:kSRTDBkeyGenValue];
    }
    
    NSNumber *autoIncrementObject = [NSNumber numberWithBool:autoIncrement];
    [storeDB putObject:autoIncrementObject forKey:kSRTDBautoIncrement];
    
    [storeDB closeDatabase];
    storeDB = nil;
    
    NSMutableDictionary *resultdict = [NSMutableDictionary dictionaryWithCapacity:4];
    [resultdict setObject:storename forKey:kSRTDBName];
    [resultdict setObject:[options valueForKey:kSRTDBkeyPath] forKey:kSRTDBkeyPath];
    [resultdict setObject:autoIncrementObject forKey:kSRTDBautoIncrement];
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:resultdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]]; 
    
}

- (void)deleteObjectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    if(ldb == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    NSMutableArray *objectStoreNames = [NSMutableArray arrayWithArray:[ldb getArray:kSRTDBobjectStoreNames]];
    
    if([objectStoreNames containsObject: storename]) {
        [objectStoreNames removeObject:storename];
        [ldb putObject:objectStoreNames forKey:kSRTDBobjectStoreNames];
        storeDB = [self getObejctStoreDB:storename];
        [storeDB clear];
        [storeDB closeDatabase];
        storeDB = nil;
    } else {
        NSLog(@"Not found");
    }
}


- (void)transaction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSArray *storenames = [arguments objectAtIndex:1];
    NSInteger mode = kSRTDBmode_ReadOnly; 
    if([arguments count] > 2)
        mode = [[arguments objectAtIndex:2] integerValue];
    if(ldb == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSArray *storeNames = [ldb getArray:kSRTDBobjectStoreNames];
    NSLog(@"%@",storeNames);
    
    if([storeNames isKindOfClass:[NSNull class]]){
        [self doFailWithError:@"objectStore was not opened"];
        return;
    }
    
    for(NSString *storename in storenames) {
        if(![storeNames containsObject:storename]) {
            [self doFailWithError:@"objectStore was not opened"];
            return;
        }
        
        storeDB = [self getObejctStoreDB:storename];
        if(storeDB == nil) {
            [self doFailWithError:@"DB was not opened"];
            return;
        }
        
        [storeDB putObject:[NSNumber numberWithInteger:mode] forKey:kSRTDBmode];
        [storeDB closeDatabase];
        storeDB = nil;
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)objectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];

    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSMutableDictionary *resultdict = [NSMutableDictionary dictionaryWithCapacity:4];
    [resultdict setObject:storename forKey:kSRTDBName];
    [resultdict setObject:[storeDB getString:kSRTDBDefaultkeyPath] forKey:kSRTDBkeyPath];
    [resultdict setObject:[storeDB getString:kSRTDBindexNames] forKey:kSRTDBindexNames];
    [resultdict setObject:[storeDB getObject:kSRTDBautoIncrement] forKey:kSRTDBautoIncrement];
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:resultdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)put:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSString *keyValue = nil; 
    if([arguments count] > 2) { 
        keyValue = [self getStringFromObject:[arguments objectAtIndex:2]];
    }
    
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if([[storeDB getObject:kSRTDBmode] integerValue] == kSRTDBmode_ReadOnly) {
        [self doFailWithError:@"ReadOnlyError"];
        return;
    }
    
    NSString *keyPath = [storeDB getString:kSRTDBDefaultkeyPath];
    BOOL autoInrement = [[storeDB getObject:kSRTDBautoIncrement] boolValue];
    NSString *key = nil;
    NSInteger nextindex = 0;
    
    if([options valueForKeyIsNull:keyPath]) {
        if(keyValue == nil) {
            if(autoInrement) {
                nextindex = [[storeDB getObject:kSRTDBkeyGenValue] intValue] + 1;
                key = [NSString stringWithFormat:@"%d",nextindex];
                [storeDB putObject:key forKey:kSRTDBkeyGenValue];
            } else {
                [self doFailWithError:@"there is no key"];
                return;
            }
        } else {
            key = keyValue;
            [self delete:arguments withDict:nil];
        }
        [options setObject:key forKey:keyPath];
    } else {
        key = [self getStringFromObject:[options valueForKey:keyPath]];
        NSInteger keyInt = [key integerValue];
        if(keyInt > 0) {
            [storeDB putObject:key forKey:kSRTDBkeyGenValue];
        }
    }
    
    if(![options valueForKeyIsNull:kSRTDBModifyEnable]) {
        if([storeDB getObject:key] != nil) {
            [self doFailWithError:@"already key exists"];
            return;
        }
    }
    
    
    //index procress
    
    NSArray *indexNames = [storeDB getArray:kSRTDBindexNames];
    
    if(indexNames !=nil && ![indexNames isKindOfClass:[NSNull class]]) {
        for(NSString* indexname in indexNames) {
            NSMutableDictionary *indexdict = [storeDB getDictionary:[self getSRTIndexName:indexname]];
            NSString *keyPath = [indexdict objectForKey:kSRTDBindexkeyPath];
            if(![options valueForKeyIsNull:keyPath]) {
                id indexvalueid = [options valueForKey:keyPath];
                NSString *indexvalue = [[[NSString alloc]init] autorelease];
                
                if([indexvalueid isKindOfClass:[NSArray class]]) {
                    if([[indexdict objectForKey:kSRTDBmultiEntry] boolValue]) {
                        indexvalue = [indexvalueid objectAtIndex:0];
                    } else {
                        indexvalue = [self getStringFromObject:indexvalueid];
                    }
                } else {
                    indexvalue = [NSString stringWithString:indexvalueid];
                }
                
                if([indexdict valueForKeyIsNull:kSRTDBindexkeyList]) {
                    [indexdict setObject:[NSArray arrayWithObject:key] forKey:kSRTDBindexkeyList];
                    [indexdict setObject:[NSArray arrayWithObject:indexvalue] forKey:kSRTDBindexvalueList];
                    [storeDB putObject:indexdict forKey:[self getSRTIndexName:indexname]];
                } else {
                    NSMutableArray *indexkeylist = [NSMutableArray arrayWithArray:[indexdict objectForKey:kSRTDBindexkeyList]];
                    NSMutableArray *indexvaluelist = [NSMutableArray arrayWithArray:[indexdict objectForKey:kSRTDBindexvalueList]];
                    
                    if([[indexdict objectForKey:kSRTDBunique] boolValue]) {
                        if([indexvaluelist containsObject:indexvalue]) {
                            [self doFailWithError:@"unique is setted. already exist"];
                            return;
                        }
                        
                    }
                    if(![indexkeylist containsObject:key]) {
                        int i = 0;
                        for(; i<indexkeylist.count; i++) {
                            NSString *value = [indexvaluelist objectAtIndex:i];
                            if([indexvalue compare:value options:NSCaseInsensitiveSearch] == NSOrderedAscending) {
                                break;
                            }
                        }
                        [indexvaluelist insertObject:indexvalue atIndex:i];
                        [indexkeylist insertObject:key atIndex:i];
                        [indexdict setObject:indexkeylist forKey:kSRTDBindexkeyList];
                        [indexdict setObject:indexvaluelist forKey:kSRTDBindexvalueList];
                        [storeDB putObject:indexdict forKey:[self getSRTIndexName:indexname]];
                    }
                }
            }
        }
    }
    
    
    [storeDB putObject:options forKey:key];
    
    [self showDB:storeDB];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsString:key];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)add:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    [options setObject:[NSNumber numberWithBool:NO] forKey:kSRTDBModifyEnable];
    [self put:arguments withDict:options];
    
}

- (void)delete:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if([[storeDB getObject:kSRTDBmode] integerValue] == kSRTDBmode_ReadOnly) {
        [self doFailWithError:@"ReadOnlyError"];
        return;
    }
    
    NSString *keyValue = nil;
    BOOL result = NO;
    if(options == nil) {
        keyValue = [self getStringFromObject:[arguments objectAtIndex:2]];
        result = [storeDB deleteObject:keyValue];
        [self deleteIndexKeyValueList:keyValue];

    } else {
        [keyRange setKeyRange:options];
        [storeDB setKeyRange:keyRange];
        NSArray *keyArray = [storeDB allKeysInKeyRange];
        for(NSString *keyValue in keyArray) {
            result = [storeDB deleteObject:keyValue];
            if(result == NO)
                break;
            [self deleteIndexKeyValueList:keyValue];
        }
    }
    
    if(result) {
        RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK];
        [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    } else {
        RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_ERROR];
        [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    }
}

- (void)get:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSString *keyValue = nil;
    if(options == nil) {
        keyValue = [self getStringFromObject:[arguments objectAtIndex:2]];
    } else {
        [keyRange setKeyRange:options];
        [storeDB setKeyRange:keyRange];
        NSArray *keyArray = [storeDB allKeysInKeyRange];
        if(keyArray.count > 0)
            keyValue = [keyArray objectAtIndex:0];
    }
    
    NSDictionary *resultdict = [storeDB getDictionary:keyValue];
    if([resultdict isKindOfClass:[NSNull class]]){
        [self doFailWithError:@"Not found"];
        return;
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:resultdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)clear:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if([[storeDB getObject:kSRTDBmode] integerValue] == kSRTDBmode_ReadOnly) {
        [self doFailWithError:@"ReadOnlyError"];
        return;
    }

    [storeDB clearData];
    
    NSArray *indexes = [storeDB getArray:kSRTDBindexNames];
    for(NSString *index in indexes) {
        NSString *srtindex = [self getSRTIndexName:index];
        NSMutableDictionary *indexdict = [storeDB getDictionary:srtindex];
        if(indexdict != nil && ![indexdict isKindOfClass:[NSNull class]]) {
            [indexdict removeObjectForKey:kSRTDBindexkeyList];
            [indexdict removeObjectForKey:kSRTDBindexvalueList];
            [storeDB putObject:indexdict forKey:srtindex];
        }
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
    
}

- (void)count:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if(options == nil) {
        [storeDB setKeyRange:nil];
    } else {
        [keyRange setKeyRange:options];
        [storeDB setKeyRange:keyRange];
    }
    NSArray *keyArray = [storeDB allKeysInKeyRange];

    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsInt:keyArray.count];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)openCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if(arguments.count >2) {
        [self setDirection:[arguments objectAtIndex:2] db:storeDB];
    } else {
        [self setDirection:nil db:storeDB];
    }

    
    if(options != nil) {
        [keyRange setKeyRange:options];
        [storeDB setKeyRange:keyRange];
    } else {
        [storeDB setKeyRange:nil];
    }
    
    [storeDB openCursor:^BOOL(NSString *key, id value) {
        [self doSuccessWithKey:key value:value];
        return TRUE;
    }];
}

- (void)continue:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSString *keyValue = nil;
    if(arguments.count > 2) {
        keyValue = [self getStringFromObject:[arguments objectAtIndex:2]];
    }
    
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if(keyValue == nil) {
        [storeDB advance:^BOOL(NSString *key, id value) {
            [self doSuccessWithKey:key value:value];
            return TRUE;
        } count:1];
        
    } else {
        [storeDB iterate:^BOOL(NSString *key, id value) {
            if([key isEqualToString:keyValue]) {
                [self doSuccessWithKey:key value:value];
                return FALSE;
            }
            return TRUE;
        }];
    }
}

- (void)update:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSString* currentKey = [storeDB getCurrentKey];
    [arguments addObject:currentKey];
    [self put:arguments withDict:options];
    [storeDB openCursor:^BOOL(NSString *key, id value) {
        return TRUE;
    }];
    
    [storeDB iterate:^BOOL(NSString *key, id value) {
        if([key isEqualToString:currentKey]) {
            return FALSE;
        }
        return TRUE;
    }];
}


- (void)advance:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSInteger count = 0;
    if([arguments count] > 2)
        count = [[arguments objectAtIndex:2] integerValue];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if(count <= 0) {
        [self doFailWithError:@"TypeError"];
        return;
    }
    
    [storeDB advance:^BOOL(NSString *key, id value) {
        [self doSuccessWithKey:key value:value];
        return TRUE;
    } count:count];
}

- (void)deleteCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSString* currentKey = [storeDB getCurrentKey];
    if(currentKey == nil) {
        [self doFailWithError:@"cursor is invalid"];
        return;
    }
    [arguments addObject:currentKey];
    [self delete:arguments withDict:options];
}

- (void)createIndex:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSString *indexname = [arguments objectAtIndex:2];
    NSString *indexkeypath = [arguments objectAtIndex:3];
    
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    if([[storeDB getArray:kSRTDBindexNames] isKindOfClass:[NSNull class]]){
        [storeDB putObject:[NSArray arrayWithObject:indexname] forKey:kSRTDBindexNames];
    } else {
        NSMutableArray *indexNames = [NSMutableArray arrayWithArray:[storeDB getArray:kSRTDBindexNames]];
        if([indexNames containsObject:indexname]) {
            [self doFailWithError:@"already exist"];
            return;
        }
        
        [indexNames addObject:indexname];
        [storeDB putObject:indexNames forKey:kSRTDBindexNames];
    }
    
    NSNumber *unique = [NSNumber numberWithBool:NO];
    NSNumber *multientry = [NSNumber numberWithBool:NO];
    
    
    if(options != nil && ![options valueForKeyIsNull:kSRTDBunique]) {
        unique = [options valueForKey:kSRTDBunique];        
    }
    
    if(options != nil && ![options valueForKeyIsNull:kSRTDBmultiEntry]) {
        multientry = [options valueForKey:kSRTDBmultiEntry];        
    }
    
    NSMutableDictionary *indexdict = [NSMutableDictionary dictionaryWithCapacity:4];
    [indexdict setObject:indexname forKey:kSRTDBName];
    [indexdict setObject:indexkeypath forKey:kSRTDBindexkeyPath];
    [indexdict setObject:unique forKey:kSRTDBunique];
    [indexdict setObject:multientry forKey:kSRTDBmultiEntry];
    
    [storeDB putObject:indexdict forKey:[self getSRTIndexName:indexname]];
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:indexdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)index:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    
}

- (void)deleteIndex:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSString *indexname = [arguments objectAtIndex:2];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return;
    }
    
    NSMutableArray *indexNames = [NSMutableArray arrayWithArray:[storeDB getArray:kSRTDBindexNames]];
    
    if([indexNames containsObject:  indexname]) {
        [indexNames removeObject:indexname];
        [storeDB putObject:indexNames forKey:kSRTDBindexNames];
        [storeDB deleteObject:[self getSRTIndexName:indexname]];
    } else {
        NSLog(@"Not found");
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (BOOL)indexnextInKeyRange:(NSInteger)count{
    
    NSInteger checkcount = 0;
    if(![keyRange isEnable]) {
        if([self isUniqueDirection]) {
            for(;currentindexcount < currentindexvaluelist.count;currentindexcount++) {
                NSString *value = [currentindexvaluelist objectAtIndex:currentindexcount];
                NSString *nextvalue = nil;
                if(currentindexcount+1 < currentindexvaluelist.count) {
                    nextvalue = [currentindexvaluelist objectAtIndex:currentindexcount+1];
                }
                
                if(![value isEqualToString:nextvalue]) {
                    if(count == checkcount++) {
                        return TRUE;
                    }
                }
            }
            return FALSE;
        } else {
            currentindexcount += count;
            return TRUE;
        }
    }

    for(;currentindexcount < currentindexvaluelist.count;currentindexcount++) {
        NSString *value = [currentindexvaluelist objectAtIndex:currentindexcount];

        if([keyRange isKeyInRange:value]) {
            
            if([self isUniqueDirection]) {
                NSString *nextvalue = nil;
                if(currentindexcount+1 < currentindexvaluelist.count) {
                    nextvalue = [currentindexvaluelist objectAtIndex:currentindexcount+1];
                }

                if(![value isEqualToString:nextvalue]) {
                    if(count == checkcount++) {
                        return TRUE;  
                    }
                }
            } else {
                if(count == checkcount++) {
                    return TRUE;  
                }
            }
        }
    }
    return FALSE;
}

- (BOOL)indexprevInKeyRange:(NSInteger)count{
    NSInteger checkcount = 0;
    
    if(![keyRange isEnable]) {
        if([self isUniqueDirection]) {
            for(;currentindexcount >= 0 ;currentindexcount--) {
                NSString *value = [currentindexvaluelist objectAtIndex:currentindexcount];
                NSString *nextvalue = nil;
                if(currentindexcount-1 >= 0) {
                    nextvalue = [currentindexvaluelist objectAtIndex:currentindexcount-1];
                }
                
                if(![value isEqualToString:nextvalue]) {
                    if(count == checkcount++) {
                        return TRUE;
                    }
                }
            }
            return FALSE;
        } else {
            currentindexcount -= count;
            return TRUE;
        }
    }

    for(;currentindexcount >= 0 ;currentindexcount--) {
        NSString *value = [currentindexvaluelist objectAtIndex:currentindexcount];
        if([keyRange isKeyInRange:value]) {
            if([self isUniqueDirection]) {
                NSString *prevvalue = nil;
                if(currentindexcount-1 >= 0) {
                    prevvalue = [currentindexvaluelist objectAtIndex:currentindexcount-1];
                }
                if(![value isEqualToString:prevvalue]) {
                    if(count == checkcount++) {
                        return TRUE;  
                    }
                }
            } else {
                if(count == checkcount++) {
                    return TRUE;  
                }
            }
        }
    }
    return FALSE;
}

- (void)indexopenCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSMutableDictionary *indexdict = [self getIndexDict:arguments];
    if(indexdict == nil || [indexdict isKindOfClass:[NSNull class]]) {
        [self doFailWithError:@"index was not opened"];
        return;
    }
    
    if(arguments.count > 3) {
        [self setDirection:[arguments objectAtIndex:3] db:storeDB];
    } else {
        [self setDirection:nil db:storeDB];
    }

    
    currentindexkeylist = [indexdict objectForKey:kSRTDBindexkeyList];
    currentindexvaluelist = [indexdict valueForKey:kSRTDBindexvalueList];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    if([self isNextDirection]) {
        currentindexcount = 0;
    } else {
        currentindexcount = currentindexkeylist.count - 1;
    }
    
    if(options != nil) {
        [keyRange setKeyRange:options];
        if([self isNextDirection]) {
            if(![self indexnextInKeyRange:0]) {
                [self doFailWithError:@"Not found"];
                return;
            }
        } else {
            if(![self indexprevInKeyRange:0]) {
                [self doFailWithError:@"Not found"];
                return;
            }
        }

    } else {
        [keyRange setIsEnable:NO];
    }
    
    isKeyOnly = NO;
    
    [self sendCurrentIndexKeyValue];
}

- (void)indexopenKeyCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSMutableDictionary *indexdict = [self getIndexDict:arguments];
    if(indexdict == nil || [indexdict isKindOfClass:[NSNull class]]) {
        [self doFailWithError:@"index was not opened"];
        return;
    }
    
    if(arguments.count > 3) {
        [self setDirection:[arguments objectAtIndex:3] db:storeDB];
    } else {
        [self setDirection:nil db:storeDB];
    }
    
    currentindexkeylist = [indexdict objectForKey:kSRTDBindexkeyList];
    currentindexvaluelist = [indexdict valueForKey:kSRTDBindexvalueList];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    if([self isNextDirection]) {
        currentindexcount = 0;
    } else {
        currentindexcount = currentindexkeylist.count - 1;
    }
    
    if(options != nil) {
        [keyRange setKeyRange:options];
        if([self isNextDirection]) {
            if(![self indexnextInKeyRange:0]) {
                [self doFailWithError:@"Not found"];
                return;
            }
        } else {
            if(![self indexprevInKeyRange:0]) {
                [self doFailWithError:@"Not found"];
                return;
            }
        }
    } else {
        [keyRange setIsEnable:NO];
    }
    isKeyOnly = YES;
    
    [self sendCurrentIndexKeyValue];
}

- (void)indexupdate:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    [self indexdeleteCursor:arguments withDict:nil];
    [self put:arguments withDict:options];
}
- (void)indexadvance:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    NSInteger count = -1;
    if(arguments.count > 3) {
        count = [[arguments objectAtIndex:3] integerValue];
    }
    
    if(count <= 0) {
        [self doFailWithError:@"TypeError"];
        return;
    }
    
    if([self isNextDirection]) {
        if(currentindexkeylist.count <= currentindexcount + count) {
            [self doFailWithError:@"InvalidStateError"];
        } else {
            if(![self indexnextInKeyRange:count]) {
                [self doFailWithError:@"Not found"];
                return;
            }
            [self sendCurrentIndexKeyValue];
        }
    } else {
        if(0 > currentindexcount - count) {
            [self doFailWithError:@"InvalidStateError"];
        } else {
            if(![self indexprevInKeyRange:count]) {
                [self doFailWithError:@"Not found"];
                return;
            }
            [self sendCurrentIndexKeyValue];
        }
    }
    
}

- (void)indexcontinue:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options {
    self.callbackId = [arguments objectAtIndex:0];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    NSString *keyValue = nil;
    if(arguments.count > 3) {
        keyValue = [self getStringFromObject:[arguments objectAtIndex:3]];
    }
    
    if(keyValue == nil) {
        if([self isNextDirection]) {
            if(currentindexkeylist.count <= currentindexcount + 1) {
                [self doFailWithError:@"InvalidStateError"];
            } else {
                if(![self indexnextInKeyRange:1]) {
                    [self doFailWithError:@"Not found"];
                    return;
                }
                [self sendCurrentIndexKeyValue];
            }
        } else {
            if(0 > currentindexcount - 1) {
                [self doFailWithError:@"InvalidStateError"];
            } else {
                if(![self indexprevInKeyRange:1]) {
                    [self doFailWithError:@"Not found"];
                    return;
                }
                [self sendCurrentIndexKeyValue];
            }
        }
    } else {
        if([currentindexvaluelist containsObject:keyValue]) {
            currentindexcount = [currentindexvaluelist indexOfObject:keyValue];
            [self sendCurrentIndexKeyValue];
        } else {
            [self doFailWithError:@"DataError"];
        }
    }
}

- (void)indexdeleteCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    NSString *key = [currentindexkeylist objectAtIndex:currentindexcount];
    [arguments replaceObjectAtIndex:2 withObject:key];
    [self delete:arguments withDict:options];
}



- (void)indexget:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSMutableDictionary *indexdict = [self getIndexDict:arguments];
    if(indexdict == nil || [indexdict isKindOfClass:[NSNull class]]) {
        [self doFailWithError:@"index was not opened"];
        return;
    }
    
    currentindexkeylist = [indexdict objectForKey:kSRTDBindexkeyList];
    currentindexvaluelist = [indexdict valueForKey:kSRTDBindexvalueList];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    NSString *indexvalue = nil;
    if(options == nil) {
        indexvalue = [self getStringFromObject:[arguments objectAtIndex:3]];
    } else {
        [keyRange setKeyRange:options];
        for(NSString *value in currentindexvaluelist) {
            if([keyRange isKeyInRange:value]) {
                indexvalue = value;
                break;
            }
        }
    }
    
    if(indexvalue == nil) {
        [self doFailWithError:@"Not found"];
        return;
    }
    
    if([currentindexvaluelist containsObject:indexvalue]) {
        currentindexcount = [currentindexvaluelist indexOfObject:indexvalue];
        [self sendCurrentIndexKeyValue];
    } else {
        [self doFailWithError:@"Not found"];
        return;
    }
}

- (void)indexgetKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSMutableDictionary *indexdict = [self getIndexDict:arguments];
    if(indexdict == nil || [indexdict isKindOfClass:[NSNull class]]) {
        [self doFailWithError:@"index was not opened"];
        return;
    }
    
    currentindexkeylist = [indexdict objectForKey:kSRTDBindexkeyList];
    currentindexvaluelist = [indexdict valueForKey:kSRTDBindexvalueList];
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    
    NSString *indexvalue = nil;
    if(options == nil) {
        indexvalue = [self getStringFromObject:[arguments objectAtIndex:3]];
    } else {
        [keyRange setKeyRange:options];
        for(NSString *value in currentindexvaluelist) {
            if([keyRange isKeyInRange:value]) {
                indexvalue = value;
                break;
            }
        }
    }
    
    if([currentindexvaluelist containsObject:indexvalue]) {
        currentindexcount = [currentindexvaluelist indexOfObject:indexvalue];
        NSString *key = [currentindexkeylist objectAtIndex:currentindexcount];
        [self doSuccessWithKey:key value:nil];
    } else {
        [self doFailWithError:@"Not found"];
        return;
    }
}

- (void)indexcount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options{
    NSMutableDictionary *indexdict = [self getIndexDict:arguments];
    if(indexdict == nil || [indexdict isKindOfClass:[NSNull class]]) {
        [self doFailWithError:@"index was not opened"];
        return;
    }
    
    currentindexvaluelist = [indexdict valueForKey:kSRTDBindexvalueList];
    NSInteger count = 0;
    if(options == nil) {
        count = currentindexvaluelist.count;
    } else {
        [keyRange setKeyRange:options];
        for(NSString *value in currentindexvaluelist) {
            if([keyRange isKeyInRange:value]) {
                count++;
            }
        }
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsInt:count];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (void)showDB:(LevelDB*)db {
    [db iterateDebug:^BOOL(NSString *key, id value) {   
        NSLog(@"%@: %@", key, value);
        return TRUE;
    }];
    
}

- (void)doFailWithError:(NSString*)message {
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_ERROR messageAsString:message];
    [self writeJavascript:[result toErrorCallbackString:self.callbackId]]; 
}

- (void)sendCurrentIndexKeyValue {
    [self fixIndexCountRange];
    NSString *indexkey = [currentindexvaluelist objectAtIndex:currentindexcount];
    
    if(isKeyOnly) {
        [self doSuccessWithKey:indexkey value:nil];
    } else {
        NSString *key = [currentindexkeylist objectAtIndex:currentindexcount];
        NSDictionary *value = [storeDB getDictionary:key];
        [self doSuccessWithKey:indexkey value:value];
    }
}

- (void)doSuccessWithKey:(NSString*)key value:(NSDictionary*)value {
    NSLog(@"%@: %@", key, value);
    if(key == nil && value == nil){
        [self doFailWithError:@"Not found"];
        return;
    }
    
    NSMutableDictionary *resultdict = [NSMutableDictionary dictionaryWithCapacity:2];
    if(key != nil) {
        [resultdict setObject:key forKey:kSRTDBkey];
    }
    
    if(value != nil) {
        [resultdict setObject:value forKey:kSRTDBvalue];
    }
    
    RTPluginResult* result = [RTPluginResult resultWithStatus:RTCommandStatus_OK messageAsDictionary:resultdict];
    [self writeJavascript:[result toSuccessCallbackString:self.callbackId]];
}

- (NSMutableDictionary*)getIndexDict:(NSMutableArray*)arguments {
    self.callbackId = [arguments objectAtIndex:0];
    NSString *storename = [arguments objectAtIndex:1];
    NSString *indexname = [arguments objectAtIndex:2];
    storeDB = [self getObejctStoreDB:storename];
    if(storeDB == nil) {
        [self doFailWithError:@"DB was not opened"];
        return nil;
    }
    
    return [storeDB getDictionary:[self getSRTIndexName:indexname]];
}

- (void)fixIndexCountRange {
    if(currentindexkeylist == nil || currentindexvaluelist == nil) {
        [self doFailWithError:@"TransactionInactiveError"];
        return;
    }
    if(currentindexcount >= currentindexkeylist.count) {
        currentindexcount = currentindexkeylist.count - 1;
    }
    
    if(currentindexcount < 0) {
        currentindexcount = 0;
    }
    
}

- (LevelDB*)getObejctStoreDB:(NSString*)storename {
    if(ldb == nil) {
        return nil;
    }
    NSString *storeDBname = [NSString stringWithFormat:@"SRT_%@_%@",[ldb getString:kSRTDBName],storename];
    
    if(storeDB != nil) {
        if([[storeDB getDBName] isEqualToString:storeDBname]) {
            return storeDB;
        }
    }
    
    return [LevelDB databaseInLibraryWithName:storeDBname];
}

- (NSString*)getSRTIndexName:(NSString*)indexname {
    return [NSString stringWithFormat:@"SRT_index_%@",indexname];
}

- (NSString*)getStringFromObject:(id)obj {
    NSString* result;
    if([obj isKindOfClass:[NSString class]]) {
        result = [NSString stringWithString:obj];
    } else if([obj isKindOfClass:[NSNumber class]]) {
        result = [NSString stringWithFormat:@"%d",[obj integerValue]];
    } else if([obj isKindOfClass:[NSArray class]]) {
        result = [obj componentsJoinedByString:@","];
    } else {
        result = nil;
    }
    return result;
}



- (void)deleteIndexKeyValueList:(NSString*)key {
    NSArray *indexNames = [storeDB getArray:kSRTDBindexNames];
    if(indexNames == nil || [indexNames isKindOfClass:[NSNull class]]) {
        return;
    }
    
    for(NSString *indexname in indexNames) {
        NSString *srtindex = [self getSRTIndexName:indexname];
        NSMutableDictionary *indexdict = [storeDB getDictionary:srtindex];
        if(![indexdict valueForKeyIsNull:kSRTDBindexkeyList]) {
            NSMutableArray *indexkeylist = [NSMutableArray arrayWithArray:[indexdict objectForKey:kSRTDBindexkeyList]];            
            if([indexkeylist containsObject:key]) {
                NSInteger count = [indexkeylist indexOfObject:key];
                NSMutableArray *indexvaluelist = [NSMutableArray arrayWithArray:[indexdict objectForKey:kSRTDBindexvalueList]];
                [indexkeylist removeObjectAtIndex:count];
                [indexvaluelist removeObjectAtIndex:count];
                [indexdict setObject:indexkeylist forKey:kSRTDBindexkeyList];
                [indexdict setObject:indexvaluelist forKey:kSRTDBindexvalueList];
                [storeDB putObject:indexdict forKey:srtindex];
            }
        }
    }
}

- (void)setDirection:(NSString*)direction db:(LevelDB*)db {
    [self setIsNextDirection:TRUE];
    [self setIsUniqueDirection:FALSE];
    
    if(direction != nil && ![direction isKindOfClass:[NSNull class]]) {
        if([direction hasPrefix:kSRTDBprev]) {
            [self setIsNextDirection:FALSE];
        }
        
        if([direction hasSuffix:kSRTDBunique]) {
            [self setIsUniqueDirection:TRUE];
        }
    }
    
    if(db != nil) {
        [db setIsNextDirection:self.isNextDirection];
    }
}

@end

