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

#import <SRT/RTPlugin.h>
#import "LevelDB.h"
#import "RTKeyRange.h"
#import "RTIndexedDB_Constant.h"
#import <SRT/NSDictionary+Extensions.h>

@interface RTIndexedDB : RTPlugin
{
    LevelDB *ldb;
    LevelDB *storeDB;
    NSInteger currentindexcount;
    NSMutableArray *currentindexkeylist;
    NSMutableArray *currentindexvaluelist;
    BOOL isKeyOnly;
    RTKeyRange *keyRange;
}

@property (nonatomic, retain) NSString* callbackId;
@property (nonatomic) BOOL isNextDirection;
@property (nonatomic) BOOL isUniqueDirection;

- (RTIndexedDB*) init;
- (void)open:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)close:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)deleteDatabase:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)option;
- (void)createObjectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)deleteObjectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)transaction:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)objectStore:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

// objectstore
- (void)put:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)add:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)delete:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)get:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)clear:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)openCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)count:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)createIndex:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)index:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)deleteIndex:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

//cursor
- (void)update:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)advance:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)continue:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)deleteCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

//index
- (void)indexopenCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexopenKeyCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexget:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexgetKey:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexcount:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

//index cursor
- (void)indexupdate:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexadvance:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexcontinue:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)indexdeleteCursor:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (BOOL)indexnextInKeyRange:(NSInteger)count;

- (LevelDB*)getObejctStoreDB:(NSString*)storename;
- (NSMutableDictionary*)getIndexDict:(NSMutableArray*)arguments;
- (void)showDB:(LevelDB*)db;
- (void)doFailWithError:(NSString*)message;
- (void)doSuccessWithKey:(NSString*)key value:(NSDictionary*)value;
- (void)sendCurrentIndexKeyValue;
- (void)fixIndexCountRange;
- (NSString*)getStringFromObject:(id)obj;
- (void)setDirection:(NSString*)direction db:(LevelDB*)db;

@end

