//  Created by Jesse MacFadyen on 10-05-29.
//  Copyright 2010 Nitobi. All rights reserved.
//  Copyright 2012, Randy McMillan


#import "RTPlugin.h"
#import "ChildBrowserViewController.h"



@interface RTChildBrowserCommand : RTPlugin <ChildBrowserDelegate>  {

    ChildBrowserViewController* childBrowser;
}

@property (nonatomic, retain) ChildBrowserViewController *childBrowser;
@property (nonatomic, retain) NSString* callbackId;


-(void) showWebPage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
-(void) onChildLocationChange:(NSString*)newLoc;
-(void) close:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
