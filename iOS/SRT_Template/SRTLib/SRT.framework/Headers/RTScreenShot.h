//
//  RTScreenShot.h
//  c3
//
//  Created by INFRA dev1 on 12. 8. 27..
//  Copyright (c) 2012년 INFRAWARE. All rights reserved.
//

#import "RTPlugin.h"
#import <QuartzCore/QuartzCore.h>

@interface RTScreenShot : RTPlugin {

}

- (void)captureScreenshot:(NSArray*)arguments withDict:(NSDictionary*)options;
- (void)processImage:(UIImage*)image path:(NSString*)filePath forCallbackId:(NSString*)callbackId;

@end
