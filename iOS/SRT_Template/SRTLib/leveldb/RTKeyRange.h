//
//  RTKeyRange.h
//  c3
//
//  Created by INFRA dev1 on 12. 8. 1..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import <SRT/RTPlugin.h>

@interface RTKeyRange : NSObject
{
}

@property (readwrite, assign) BOOL lowerBound;
@property (readwrite, assign) BOOL upperBound;
@property (nonatomic, retain) NSString *lower;
@property (nonatomic, retain) NSString *upper;
@property (readwrite, assign) BOOL isEnable;

-(void)setKeyRange:(NSMutableDictionary*)options;
-(BOOL)isKeyInRange:(NSString*)key;

@end