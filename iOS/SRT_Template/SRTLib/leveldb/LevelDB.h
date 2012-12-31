//
//  LevelDB.h
//
//  Copyright 2011 Pave Labs. 
//  See LICENCE for details.
//

#import <Foundation/Foundation.h>
#import "db.h"
#import "RTKeyRange.h"

using namespace leveldb;

typedef BOOL (^KeyBlock)(NSString *key);
typedef BOOL (^KeyValueBlock)(NSString *key, id value);

@interface LevelDB : NSObject {
    DB *db;
    ReadOptions readOptions;
    WriteOptions writeOptions;
    Iterator* iterator;
}

@property (nonatomic, retain) NSString *path;
@property (nonatomic, retain) NSString *dbname;
@property (nonatomic, retain) RTKeyRange *keyRange;
@property (nonatomic) BOOL isNextDirection;

+ (id)libraryPath;
+ (LevelDB *)databaseInLibraryWithName:(NSString *)name;

- (id) initWithPath:(NSString *)path;

- (void) putObject:(id)value forKey:(NSString *)key;

- (id) getObject:(NSString *)key;
- (id) getString:(NSString *)key;
- (id) getDictionary:(NSString *)key;
- (id) getArray:(NSString *)key;

- (NSString*) getDBName;

//iteration methods
- (NSArray *)allKeys;
- (NSArray *)allKeysInKeyRange;
- (void) iterateKeys:(KeyBlock)block;
- (void) iterate:(KeyValueBlock)block;
- (void) iterateDebug:(KeyValueBlock)block;

- (void) openCursor:(KeyValueBlock)block;
- (void) advance:(KeyValueBlock)block count:(NSInteger)count;
- (NSString*) getCurrentKey;

- (void) seekIteratorNextInKeyRange;
- (void) seekIteratorPrevInKeyRange;
- (void) seekIteratorStartInKeyRange;
- (void) seekIteratorLastInKeyRange;
- (BOOL) isSystemKey:(NSString*)k;


//clear methods
- (BOOL) deleteObject:(NSString *)key;
- (void) clear;
- (void) clearData;
- (void) deleteDatabase;
- (void) closeDatabase;

@end
