//
//  RTKeyRange.m
//  c3
//
//  Created by INFRA dev1 on 12. 8. 1..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTKeyRange.h"
#import "RTIndexedDB.h"

@implementation RTKeyRange

@synthesize lowerBound,upperBound,lower,upper,isEnable;

-(void)setKeyRange:(NSMutableDictionary*)options {
    
    [self setLower:[self getStringFromObject:[options valueForKey:kSRTDBlower]]];
    [self setUpper:[self getStringFromObject:[options valueForKey:kSRTDBupper]]];
    
    if([options valueForKeyIsNull:kSRTDBupperOpen]) {
        [self setUpperBound:FALSE];
    } else {
        [self setUpperBound:[[options objectForKey:kSRTDBupperOpen] boolValue]];
    }
    
    if([options valueForKeyIsNull:kSRTDBupperOpen]) {
        [self setLowerBound:FALSE];
    } else {
        [self setLowerBound:[[options objectForKey:kSRTDBlowerOpen] boolValue]];
    }
    
    NSLog(@"lower : %@", [self lower]);
    NSLog(@"upper : %@", [self upper]);
    NSLog(@"lowerBound : %d", [self lowerBound]);
    NSLog(@"upperBound : %d", [self upperBound]);
    [self setIsEnable:TRUE];
}

-(BOOL)isKeyInRange:(NSString*)key {
    if(![self isEnable]) {
        return TRUE;
    }
    
    BOOL lowerCheck = FALSE;
    BOOL upperCheck = FALSE;
    
    if([self lower] != nil) {
        if([key compare:[self lower] options:NSNumericSearch] == NSOrderedDescending) {
            lowerCheck = TRUE;
        } else if(![self lowerBound]) {
            lowerCheck = ([key compare:[self lower] options:NSNumericSearch] == NSOrderedSame);
        }
    } else {
        lowerCheck = TRUE;
    }
    
    if([self upper] != nil) {
        if([key compare:[self upper] options:NSNumericSearch] == NSOrderedAscending) {
            upperCheck = TRUE;
        } else if(![self upperBound]) {
            upperCheck = ([key compare:[self upper] options:NSNumericSearch] == NSOrderedSame);
        }
    } else {
        upperCheck = TRUE;
    }
    
    return (lowerCheck && upperCheck);
}

-(NSString*)getStringFromObject:(id) obj {
    NSString* result;
    if([obj isKindOfClass:[NSString class]]) {
        result = [NSString stringWithString:obj];
    } else if([obj isKindOfClass:[NSNumber class]]) {
        result = [NSString stringWithFormat:@"%d",[obj integerValue]];
    } else {
        result = nil;
    }
    return result;
}

@end