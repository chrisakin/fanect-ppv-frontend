import React, { useState, useEffect, useCallback } from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { useAWSIVSService } from "./AWSIVS";
import { Loader2, AlertCircle, Wifi } from "lucide-react";
import { eventStreamingService, StreamingData } from "../../services/eventStreamingService";
import { useToast } from "../ui/use-toast";
import { FeedbackModal } from "../modals/FeedbackModal";
import { getUser } from "@/lib/auth";

interface LiveEventPlayerProps {
  eventId: string;
  eventName?: string;
  eventType: 'live' | 'upcoming';
}

export const LiveEventPlayer = ({ eventId, eventName, eventType }: LiveEventPlayerProps): JSX.Element => {
  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { toast } = useToast();

  // Define the callback before using it in useAWSIVSService
  const handlePlayerStateChange = useCallback((state: string) => {
    console.log('Player state changed to:', state);
    if (state === "ENDED" && eventId) {
      console.log('Stream ended, showing feedback modal');
      setShowFeedbackModal(true);
    }
  }, [eventId]);

  const {
    videoContainerRef,
    messages,
    isConnected,
    playerState,
    playerError,
    isPlayerLoaded,
    sendMessage,
    play,
    pause,
    setMuted,
    setVolume,
  } = useAWSIVSService({
    playbackUrl: streamingData?.playbackUrl || '',
    chatApiEndpoint: import.meta.env.VITE_CHAT_API_ENDPOINT || '',
    chatToken: streamingData?.chatToken,
    username: getUser()?.firstName || 'Anonymous',
    onPlayerStateChange: handlePlayerStateChange,
  });

  const [messageInput, setMessageInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);

  // Fetch streaming data for live event
  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        setIsLoadingStream(true);
        setStreamError(null);
        
        const data = await eventStreamingService.getStreamingData(eventId, eventType);
        setStreamingData(data);
        
        if (!data.playbackUrl) {
          setStreamError("Playback URL not available for this event");
        }
      } catch (error: any) {
        console.error('Error fetching streaming data:', error);
        setStreamError(error.message || "Failed to load event stream");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event stream. Please try again later.",
        });
      } finally {
        setIsLoadingStream(false);
      }
    };

    if (eventId) {
      fetchStreamingData();
    }
  }, [eventId, eventType, toast]);

  // Additional check for stream end based on player state
  useEffect(() => {
    if (playerState === "ENDED" && eventId && eventType === 'live') {
      console.log('Player state is ENDED, showing feedback modal');
      setShowFeedbackModal(true);
    }
  }, [playerState, eventId, eventType]);

  const handleSendMessage = async () => {
    if (messageInput.trim() && isConnected) {
      const success = await sendMessage(messageInput.trim());
      if (success) {
        setMessageInput("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setVolumeState(newVolume);
  };

  const toggleFullscreen = () => {
    if (videoContainerRef.current) {
      const videoElement = videoContainerRef.current.querySelector('video');
      if (videoElement) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoElement.requestFullscreen();
        }
      }
    }
  };

  const MessageList = () => (
    <div className="flex flex-col gap-4">
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="flex items-start gap-2">
            <Avatar className="w-[22px] h-[22px]">
              <div className="w-full h-full bg-green-600 rounded-full flex items-center justify-center text-white text-xs">
                {message.sender.charAt(0).toUpperCase()}
              </div>
            </Avatar>

            <div className="flex flex-col w-[180px] gap-1">
              <div className="text-[#111111] text-[10px] tracking-[-0.20px] [font-family:'Sofia_Pro-Regular',Helvetica]">
                {message.sender}
              </div>
              <div className="w-full min-h-8 bg-white rounded-[10px] flex items-center px-[11px] py-1">
                <span className="text-[#444444] text-xs tracking-[-0.24px] [font-family:'Sofia_Pro-Regular',Helvetica] break-words">
                  {message.content}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 text-sm py-4">
          {eventType === 'upcoming' ? 'Chat will be available when the event starts' : 'No chat messages yet'}
        </div>
      )}
    </div>
  );

  // Show loading state while fetching streaming data
  if (isLoadingStream) {
    return (
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-white text-sm">Loading live stream...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state if streaming data couldn't be loaded
  if (streamError) {
    return (
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="space-y-2">
                  <p className="text-white text-lg font-medium">
                    {eventType === 'upcoming' ? 'Event Not Started' : 'Stream Not Available'}
                  </p>
                  <p className="text-gray-400 text-sm max-w-md">
                    {streamError}
                  </p>
                  {eventType === 'upcoming' && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs mt-4">
                      <Wifi className="h-4 w-4" />
                      <span>The live stream will be available when the event starts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black">
              {/* Live indicator */}
              {eventType === 'live' && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">LIVE</span>
                  </div>
                </div>
              )}

              {/* Upcoming indicator */}
              {eventType === 'upcoming' && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-lg">
                    <Wifi className="h-4 w-4" />
                    <span className="text-sm font-medium">UPCOMING</span>
                  </div>
                </div>
              )}

              {/* Loading state */}
              {!isPlayerLoaded && !playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <p className="text-white text-sm">Loading stream...</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-4 text-center p-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                    <p className="text-white text-sm">{playerError}</p>
                    <p className="text-gray-400 text-xs">Please try refreshing the page</p>
                  </div>
                </div>
              )}

              {/* AWS IVS Player container */}
              <div
                ref={videoContainerRef}
                className="w-full h-full"
              />
              
              {/* Player state indicator */}
              {isPlayerLoaded && !playerError && (
                <div className="absolute bottom-4 right-4 z-10">
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    {playerState} • {eventType.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat section */}
        <div className="w-full lg:w-[260px]">
          {/* Mobile Accordion */}
          <div className="lg:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="messages" className="border-none">
                <AccordionTrigger className="py-2 px-4 bg-[#edf0f5] rounded-t-[10px]">
                  <h3 className="font-medium text-[#111111] text-base tracking-[-0.32px] [font-family:'Sofia_Pro-Medium',Helvetica]">
                    Messages {!isConnected && "(Disconnected)"}
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="bg-[#edf0f5]">
                  <div className="px-4 pb-4">
                    <ScrollArea className="h-[200px] pr-2">
                      <MessageList />
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                    
                    {/* Message input */}
                    <div className="flex h-[42px] items-center gap-2.5 p-2.5 mt-2 bg-white rounded-[10px] border border-solid border-[#828b8633]">
                      <Input
                        className="flex-1 border-0 p-0 h-auto text-xs [font-family:'Sofia_Pro-Regular',Helvetica] text-[#828b86] placeholder:text-[#828b86] focus-visible:ring-0"
                        placeholder={isConnected ? "Write here" : "Chat not available"}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!isConnected || eventType === 'upcoming'}
                      />
                      <Button 
                        className="w-8 h-8 p-1 bg-green-700 rounded-lg disabled:opacity-50"
                        onClick={handleSendMessage}
                        disabled={!isConnected || !messageInput.trim() || eventType === 'upcoming'}
                      >
                        <img
                          className="w-5 h-5"
                          alt="Send message"
                          src="/icon-video-audio-image-microphone-slash.svg"
                        />
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Chat */}
          <Card className="relative h-[455px] bg-[#edf0f5] rounded-[10px] overflow-hidden border-0 hidden lg:block pb-4">
            <CardContent className="p-0">
              <div className="flex flex-col w-full h-full p-4">
                <h3 className="font-medium text-[#111111] text-base tracking-[-0.32px] mb-[18px] [font-family:'Sofia_Pro-Medium',Helvetica]">
                  Messages {!isConnected && "(Disconnected)"}
                </h3>

                <ScrollArea className="h-[350px] pr-2">
                  <MessageList />
                  <ScrollBar orientation="vertical" />
                </ScrollArea>

                {/* Message input */}
                <div className="flex h-[42px] mb-4 items-center gap-2.5 p-2.5 mt-2 bg-white rounded-[10px] border border-solid border-[#828b8633]">
                  <Input
                    className="flex-1 border-0 p-0 h-auto text-xs [font-family:'Sofia_Pro-Regular',Helvetica] text-[#828b86] placeholder:text-[#828b86] focus-visible:ring-0"
                    placeholder={isConnected ? "Write here" : "Chat not available"}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected || eventType === 'upcoming'}
                  />
                  <Button 
                    className="w-8 h-8 p-1 bg-green-700 rounded-lg disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={!isConnected || !messageInput.trim() || eventType === 'upcoming'}
                  >
                    <img
                      className="w-5 h-5"
                      alt="Send message"
                      src="/icon-video-audio-image-microphone-slash.svg"
                    />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Modal */}
      {eventId && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          eventId={eventId}
          eventName={eventName}
        />
      )}
    </>
  );
};