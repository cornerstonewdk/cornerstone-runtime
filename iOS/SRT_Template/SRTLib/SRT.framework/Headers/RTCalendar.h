//
//  RTCalendar.h
//  c3
//
//  Created by INFRA dev1 on 12. 6. 27..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"
#import <EventKit/EventKit.h>
#import <Foundation/Foundation.h>

enum CalendarError {
    UNKNOWN_ERROR = 0,
    INVALID_ARGUMENT_ERROR = 1,
    TIMEOUT_ERROR = 2,
    PENDING_OPERATION_ERROR = 3,
    IO_ERROR = 4,
    NOT_SUPPORTED_ERROR = 5,
    PERMISSION_DENIED_ERROR = 20
};

@interface RTCalendar : RTPlugin
{
    NSInteger referencount;
}

@property (nonatomic, retain) NSString* callbackId;

- (RTCalendar*) init;
- (void)addEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)findEvents:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void)deleteEvent:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;


- (EKRecurrenceRule*)getRecurrenceRule:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (NSDate*)getDateFromDict:(NSString*)key withDict:(NSMutableDictionary*)options;
- (NSDate*)getDateFromString:(NSString*)key;
- (NSString*)getStringFromDate:(NSDate*)key;

+ (NSDictionary*) defaultW3CtoEK;
+ (NSDictionary*) defaultEKtoW3C;

- (void) dealloc;

@end

#define kW3CalendarId           @"id"
#define kW3CalendarDescription  @"description"
#define kW3CalendarLocation     @"location"
#define kW3CalendarSummary      @"summary"
#define kW3CalendarStart        @"start"
#define kW3CalendarEnd          @"end"
#define kW3CalendarTransparency @"transparency"

#define kW3CalendarRecurrence   @"recurrence"
#define kW3CalendarReminder     @"reminder"

//
#define kW3CalendarStatusEnum   1000
#define kW3CalendarStatus               @"status"
#define kW3CalendarStatusPending        @"pending"
#define kW3CalendarStatusTentative      @"tentative"
#define kW3CalendarStatusConfirmed      @"confirmed"
#define kW3CalendarStatusCancelled      @"cancelled"

//recurrence
#define kW3CalendarRecurrence_Frequency         @"frequency"
#define kW3CalendarRecurrence_FrequencyDaily    @"daily"
#define kW3CalendarRecurrence_FrequencyWeekly   @"weekly"
#define kW3CalendarRecurrence_FrequencyMonthly  @"monthly"
#define kW3CalendarRecurrence_FrequencyYearly   @"yearly"

#define kW3CalendarRecurrence_Interval      @"interval"
#define kW3CalendarRecurrence_Expires       @"expires"
#define kW3CalendarRecurrence_daysInWeek    @"daysInWeek"
#define kW3CalendarRecurrence_daysInMonth   @"daysInMonth"
#define kW3CalendarRecurrence_daysInYear    @"daysInYear"
#define kW3CalendarRecurrence_monthsInYear  @"monthsInYear"


//FindOptions
#define kW3CalendarFindOptions_filter       @"filter"
#define kW3CalendarFindOptions_multiple     @"multiple"
#define kW3CalendarFindOptions_startBefore  @"startBefore"
#define kW3CalendarFindOptions_startAfter   @"startAfter"
#define kW3CalendarFindOptions_endBefore    @"endBefore"
#define kW3CalendarFindOptions_endAfter     @"endAfter"



