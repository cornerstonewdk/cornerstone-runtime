//
//  LevelDB.m
//
//  Copyright 2011 Pave Labs. All rights reserved. 
//  See LICENCE for details.
//

#import "LevelDB.h"

#import "db.h"
#import "options.h"
#import "RTIndexedDB_Constant.h"
#import <SRT/NSDictionary+Extensions.h>

#define SliceFromString(_string_) (Slice((char *)[_string_ UTF8String], [_string_ lengthOfBytesUsingEncoding:NSUTF8StringEncoding]))
#define StringFromSlice(_slice_) ([[[NSString alloc] initWithBytes:_slice_.data() length:_slice_.size() encoding:NSUTF8StringEncoding] autorelease])


using namespace leveldb;

static Slice SliceFromObject(id object) {
    NSMutableData *d = [[[NSMutableData alloc] init] autorelease];
    NSKeyedArchiver *archiver = [[NSKeyedArchiver alloc] initForWritingWithMutableData:d];
    [archiver encodeObject:object forKey:@"object"];
    [archiver finishEncoding];
    [archiver release];
    return Slice((const char *)[d bytes], (size_t)[d length]);
}

static id ObjectFromSlice(Slice v) {
    NSData *data = [NSData dataWithBytes:v.data() length:v.size()];
    NSKeyedUnarchiver *unarchiver = [[NSKeyedUnarchiver alloc] initForReadingWithData:data];
    id object = [[unarchiver decodeObjectForKey:@"object"] retain];
    [unarchiver finishDecoding];
    [unarchiver release];
    return object;
}

@implementation LevelDB 

@synthesize path=_path,dbname,keyRange,isNextDirection;

- (id)init
{
    self = [super init];
    if (self) {
        // Initialization code here. 
    }
    
    return self;
}

- (id) initWithPath:(NSString *)path {
    self = [super init];
    if (self) {
        _path = path;
        Options options;
        options.create_if_missing = true;
        Status status = leveldb::DB::Open(options, [_path UTF8String], &db);
        
        readOptions.fill_cache = false;
        writeOptions.sync = false;
        
        if(!status.ok()) {
            NSLog(@"Problem creating LevelDB database: %s", status.ToString().c_str());
        }
        
    }
    
    return self;
}

+ (NSString *)libraryPath {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
    return [paths objectAtIndex:0];
}

+ (LevelDB *)databaseInLibraryWithName:(NSString *)name {
    NSString *path = [[LevelDB libraryPath] stringByAppendingPathComponent:name];
    LevelDB *ldb = [[LevelDB alloc] initWithPath:path];
    [ldb setDbname:name];
    return ldb;
}

- (void) putObject:(id)value forKey:(NSString *)key {
    Slice k = SliceFromString(key);
    Slice v = SliceFromObject(value);
    Status status = db->Put(writeOptions, k, v);
    
    if(!status.ok()) {
        NSLog(@"Problem storing key/value pair in database: %s", status.ToString().c_str());
    }
}

- (id) getObject:(NSString *)key {
    if(key == nil) {
        return nil;
    }
    
    std::string v_string;
    
    Slice k = SliceFromString(key);
    Status status = db->Get(readOptions, k, &v_string);
    
    if(!status.ok()) {
        if(!status.IsNotFound())
            NSLog(@"Problem retrieving value for key '%@' from database: %s", key, status.ToString().c_str());
        return nil;
    }
    
    return ObjectFromSlice(v_string);
}

- (id) getString:(NSString *)key {
    NSString *result = [self getObject:key];
    return (result == nil) ? [NSNull null] : result;
}

- (id) getDictionary:(NSString *)key {
    NSDictionary *result = [self getObject:key];
    return (result == nil) ? [NSNull null] : result;
}

- (id) getArray:(NSString *)key {
    NSArray *result = [self getObject:key];
    return (result == nil) ? [NSNull null] : result;
}

- (NSString*) getDBName {
    return [self dbname];
}

- (BOOL)deleteObject:(NSString *)key {
    
    Slice k = SliceFromString(key);
    Status status = db->Delete(writeOptions, k);
    
    if(!status.ok()) {
        NSLog(@"Problem deleting key/value pair in database: %s", status.ToString().c_str());
        return NO;
    }
    return YES;
}

- (void) clear {
    NSArray *keys = [self allKeys];
    for (NSString *k in keys) {
        [self deleteObject:k];
    }
}

- (void) clearData {
    NSArray *keys = [self allKeysInKeyRange];
    for (NSString *k in keys) {
        if(![self isSystemKey:k]) {
            [self deleteObject:k];   
        }
    }
}

- (NSArray *)allKeysInKeyRange {
    NSMutableArray *keys = [[[NSMutableArray alloc] init] autorelease];
    //test iteration
    [self iterateKeys:^BOOL(NSString *key) {
        if(![self isSystemKey:key]) {
            if(keyRange == nil) {
                [keys addObject:key];
            } else if([keyRange isKeyInRange:key]) {
                [keys addObject:key];
            }
        }
        return TRUE;
    }];
    return keys;
}

- (NSArray *)allKeys {
    NSMutableArray *keys = [[[NSMutableArray alloc] init] autorelease];
    //test iteration
    [self iterateDebug:^BOOL(NSString *key,id value) {
        [keys addObject:key];
        return TRUE;
    }];
    return keys;
}

- (void) iterateDebug:(KeyValueBlock)block {
    if(iterator)
        delete iterator;
    iterator = db->NewIterator(ReadOptions());
    for (iterator->SeekToFirst(); iterator->Valid();iterator->Next()) {
        Slice key = iterator->key(), value = iterator->value();
        NSString *k = StringFromSlice(key);
        id v = ObjectFromSlice(value);
        if (!block(k, v)) {
            break;
        }
    }
}

- (void) iterate:(KeyValueBlock)block {
    if(iterator)
        delete iterator;
    iterator = db->NewIterator(ReadOptions());
    for ([self seekIteratorStartInKeyRange]; iterator->Valid(); [self seekIteratorNextInKeyRange]) {
        Slice key = iterator->key(), value = iterator->value();
        NSString *k = StringFromSlice(key);
        id v = ObjectFromSlice(value);
        if (!block(k, v)) {
            break;
        }
    }
}


- (void) iterateKeys:(KeyBlock)block {
    if(iterator)
        delete iterator;
    iterator = db->NewIterator(ReadOptions());
    for ([self seekIteratorStartInKeyRange]; iterator->Valid(); [self seekIteratorNextInKeyRange]) {
        Slice key = iterator->key();
        NSString *k = StringFromSlice(key);
        if (!block(k)) {
            break;
        }
    }
}

- (void) openCursor:(KeyValueBlock)block {
    if(iterator)
        delete iterator;
    iterator = db->NewIterator(ReadOptions());
    
    if([self isNextDirection]) {
        [self seekIteratorStartInKeyRange];
    } else {
        [self seekIteratorLastInKeyRange];
    }
    
    if(!iterator->Valid()) {
        block(nil,nil);
        return;
    }
    
    Slice key = iterator->key(), value = iterator->value();
    NSString *k = StringFromSlice(key);
    id v = ObjectFromSlice(value);
    block(k, v);
}

- (NSString*) getCurrentKey {
    if(iterator == nil || !iterator->Valid())
        return nil;
    return StringFromSlice(iterator->key());
}

- (void) advance:(KeyValueBlock)block count:(NSInteger)count {
    if(iterator == nil)
        return;
    
    if(count < 0) {
        return;
    }

    for(int i=0; i < count; i++) {
        if(!iterator->Valid()) {
            break;
        }
        
        if([self isNextDirection]) {
            [self seekIteratorNextInKeyRange];
        } else {
            [self seekIteratorPrevInKeyRange];
        }
    }
    
    if(iterator->Valid()) {
        Slice key = iterator->key(), value = iterator->value();
        NSString *k = StringFromSlice(key);
        id v = ObjectFromSlice(value);
        block(k, v);
    } else {
        block(nil,nil);
    }
}

- (void) seekIteratorNextInKeyRange {
    if(iterator == nil)
        return;
    
    iterator->Next();
    while(iterator->Valid() && [self isSystemKey:[self getCurrentKey]]) {
        iterator->Next();
    }
    
    if(keyRange == nil) {
        return;
    } 
    
    while (iterator->Valid()) {
        if([keyRange isKeyInRange:[self getCurrentKey]] && ![self isSystemKey:[self getCurrentKey]]) {
            return;
        } else {
            iterator->Next();
        }
    }
}

- (void) seekIteratorPrevInKeyRange {
    if(iterator == nil)
        return;
    
    iterator->Prev();
    while(iterator->Valid() && [self isSystemKey:[self getCurrentKey]]) {
        iterator->Prev();
    }
    
    if(keyRange == nil) {
        return;
    } 
    
    while (iterator->Valid()) {
        if([keyRange isKeyInRange:[self getCurrentKey]] && ![self isSystemKey:[self getCurrentKey]]) {
            return;
        } else {
            iterator->Prev();
        }
    }
}

- (void) seekIteratorStartInKeyRange {
    if(iterator == nil)
        return;
    
    iterator->SeekToFirst();
    
    while([self isSystemKey:[self getCurrentKey]]) {
        iterator->Next();
    }
    
    if(keyRange == nil) {
        return;
    } else {
        NSLog(@"%@",[self getCurrentKey]);
        if([keyRange isKeyInRange:[self getCurrentKey]]) {
            return;
        } else {
            [self seekIteratorNextInKeyRange];
        }
    }
}

- (void) seekIteratorLastInKeyRange {
    if(iterator == nil)
        return;
    
    iterator->SeekToLast();
    
    while([self isSystemKey:[self getCurrentKey]]) {
        iterator->Prev();
    }
    
    if(keyRange == nil) {
        return;
    } else {
        NSLog(@"%@",[self getCurrentKey]);
        if([keyRange isKeyInRange:[self getCurrentKey]]) {
            return;
        } else {
            [self seekIteratorPrevInKeyRange];
        }
    }
}


- (BOOL) isSystemKey:(NSString*)k {
    if([k isEqualToString:kSRTDBautoIncrement]
       || [k isEqualToString:kSRTDBDefaultkeyPath]
       || [k isEqualToString:kSRTDBindexNames]
       || [k isEqualToString:kSRTDBkeyGenValue]
       || [k isEqualToString:kSRTDBmode]
       || [k isEqualToString:kSRTDBName]
       || [k isEqualToString:kSRTDBobjectStoreNames]
       || [k isEqualToString:kSRTDBVersion]
       || [k hasPrefix:@"SRT_index_"]) {
        return YES;
    } else {
        return NO;
    }
}

- (void) deleteDatabase {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *error;
    [fileManager removeItemAtPath:_path error:&error];
    [self release];
}

- (void) closeDatabase {
    if(iterator) {
        delete iterator;
        iterator = nil;
    }
    
    if(db) {
        delete db;
        db = nil;
    }
    
    [self release];
}

@end
