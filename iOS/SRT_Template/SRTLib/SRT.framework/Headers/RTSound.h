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


#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioServices.h>
#import <AVFoundation/AVFoundation.h>

#import "RTPlugin.h"




enum RTMediaError {
	MEDIA_ERR_ABORTED = 1,
	MEDIA_ERR_NETWORK = 2,
	MEDIA_ERR_DECODE = 3,
	MEDIA_ERR_NONE_SUPPORTED = 4
};
typedef NSUInteger RTMediaError;

enum RTMediaStates {
	MEDIA_NONE = 0,
	MEDIA_STARTING = 1,
	MEDIA_RUNNING = 2,
	MEDIA_PAUSED = 3,
	MEDIA_STOPPED = 4
};
typedef NSUInteger RTMediaStates;

enum RTMediaMsg {
	MEDIA_STATE = 1,
	MEDIA_DURATION = 2,
    MEDIA_POSITION = 3,
	MEDIA_ERROR = 9
};
typedef NSUInteger RTMediaMsg;

@interface RTAudioPlayer : AVAudioPlayer
{
	NSString* mediaId;
}
@property (nonatomic,copy) NSString* mediaId;
@end

#ifdef __IPHONE_3_0
@interface RTAudioRecorder : AVAudioRecorder
{
	NSString* mediaId;
}
@property (nonatomic,copy) NSString* mediaId;
@end
#endif
	
@interface RTAudioFile : NSObject
{
	NSString* resourcePath;
	NSURL* resourceURL;
	RTAudioPlayer* player;
#ifdef __IPHONE_3_0
	RTAudioRecorder* recorder;
#endif
}

@property (nonatomic, retain) NSString* resourcePath;
@property (nonatomic, retain) NSURL* resourceURL;
@property (nonatomic, retain) RTAudioPlayer* player;

#ifdef __IPHONE_3_0
@property (nonatomic, retain) RTAudioRecorder* recorder;
#endif

@end

@interface RTSound : RTPlugin <AVAudioPlayerDelegate, AVAudioRecorderDelegate>
{
	NSMutableDictionary* soundCache;
    AVAudioSession* avSession;
}
@property (nonatomic, retain) NSMutableDictionary* soundCache;
@property (nonatomic, retain) AVAudioSession* avSession;

- (void) startPlayingAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) pausePlayingAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) stopPlayingAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) seekToAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) release:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) getCurrentPositionAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) setVolume:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

- (BOOL) hasAudioSession;

// helper methods
- (RTAudioFile*) audioFileForResource:(NSString*) resourcePath withId: (NSString*)mediaId;
- (BOOL) prepareToPlay: (RTAudioFile*) audioFile withId: (NSString*)mediaId;
- (NSString*) createMediaErrorWithCode: (RTMediaError) code message: (NSString*) message;

- (void) startRecordingAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) stopRecordingAudio:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
