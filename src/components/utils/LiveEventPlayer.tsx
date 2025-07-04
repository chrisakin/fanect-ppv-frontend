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
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [hasStreamStarted, setHasStreamStarted] = useState(false);
  const { toast } = useToast();

  const handlePlayerStateChange = useCallback((state: string) => {
    console.log('🎬 Player state changed to:', state);
    
    if (state === "PLAYING") {
      setHasStreamStarted(true);
      console.log('✅ Stream has started playing');
    }
    
    // Show feedback modal when stream ends (only for live events)
    if (state === "ENDED" && eventId && eventType === 'live' && hasStreamStarted && !feedbackShown) {
      console.log('🎯 Stream ended - showing feedback modal');
      setFeedbackShown(true);
      // Small delay to ensure state is properly set
      setTimeout(() => {
        setShowFeedbackModal(true);
      }, 500);
    }
  }, [eventId, eventType, feedbackShown, hasStreamStarted]);

  const handleChatMessage = useCallback((message: any) => {
    console.log('💬 Chat message received:', message);
  }, []);

  const handleStreamEnd = useCallback(() => {
    console.log('🔚 Stream ended callback triggered');
    
    // Only show feedback modal for live events that have actually started
    if (eventId && eventType === 'live' && hasStreamStarted && !feedbackShown) {
      console.log('🎯 Showing feedback modal for live stream end');
      setFeedbackShown(true);
      setShowFeedbackModal(true);
    } else {
      console.log('ℹ️ Not showing feedback modal:', {
        eventId: !!eventId,
        eventType,
        hasStreamStarted,
        feedbackShown
      });
    }
  }, [eventId, eventType, feedbackShown, hasStreamStarted]);

  const {
    videoContainerRef,
    messages,
    isConnected,
    playerState,
    playerError,
    isPlayerLoaded,
    sendMessage,
  } = useAWSIVSService({
    playbackUrl: streamingData?.playbackUrl || '',
    chatApiEndpoint: import.meta.env.VITE_CHAT_API_ENDPOINT || '',
    chatToken: streamingData?.chatToken,
    username: getUser()?.firstName || 'Anonymous',
    onPlayerStateChange: handlePlayerStateChange,
    onChatMessage: handleChatMessage,
    onStreamEnd: handleStreamEnd,
  });

  const [messageInput, setMessageInput] = useState("");

  // Fetch streaming data for live event
  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        setIsLoadingStream(true);
        setStreamError(null);
        setFeedbackShown(false);
        setHasStreamStarted(false);
        
        console.log(`📡 Fetching streaming data for ${eventType} event:`, eventId);
        const data = await eventStreamingService.getStreamingData(eventId, eventType);
        setStreamingData(data);
        
        if (!data.playbackUrl) {
          setStreamError("Playback URL not available for this event");
        } else {
          console.log('✅ Streaming data loaded:', data);
        }
      } catch (error: any) {
        console.error('❌ Error fetching streaming data:', error);
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

  const handleFeedbackModalClose = useCallback(() => {
    setShowFeedbackModal(false);
  }, []);

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
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 w-full">
        <Card className="relative w-full lg:w-[70%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white dark:bg-[#062013] rounded-[10px] overflow-hidden border-0">
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
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 w-full">
        <Card className="relative w-full lg:w-[70%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-white dark:bg-[#062013] rounded-[10px] overflow-hidden border-0">
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
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 w-full">
        {/* Video Player - Full width on mobile/tablet, 70% on desktop */}
        <Card className="relative w-full lg:w-[70%] h-[200px] sm:h-[200px] md:h-[400px] lg:h-[400px] bg-white dark:bg-[#062013] rounded-[10px] overflow-hidden border-0">
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
                    {hasStreamStarted && <span className="ml-1">🎬</span>}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat section - Full width on mobile/tablet, 30% on desktop */}
        <div className="w-full lg:w-[30%]">
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
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="21" height="21" rx="4" fill="#158851"/>
                      <path d="M9.04594 5.9677L14.0393 8.46437C16.2793 9.58437 16.2793 11.416 14.0393 12.536L9.04594 15.0327C5.68594 16.7127 4.31511 15.336 5.99511 11.9819L6.50261 10.9727C6.63094 10.716 6.63094 10.2902 6.50261 10.0335L5.99511 9.01853C4.31511 5.66437 5.69178 4.2877 9.04594 5.9677Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6.67188 10.5H9.82187" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Desktop Chat */}
          <Card className="relative h-full bg-[#edf0f5] rounded-[10px] overflow-hidden border-0 hidden lg:block">
            <CardContent className="p-0">
              <div className="flex flex-col w-full h-full p-4">
                <h3 className="font-medium text-[#111111] text-base tracking-[-0.32px] mb-[18px] [font-family:'Sofia_Pro-Medium',Helvetica]">
                  Messages {!isConnected && "(Disconnected)"}
                </h3>

                <ScrollArea className="h-[260px] pr-2">
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
                    {/* <img
                      className="w-5 h-5"
                      alt="Send message"
                      src="/icon-video-audio-image-microphone-slash.svg"
                    /> */}
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="21" height="21" rx="4" fill="#158851"/>
                      <path d="M9.04594 5.9677L14.0393 8.46437C16.2793 9.58437 16.2793 11.416 14.0393 12.536L9.04594 15.0327C5.68594 16.7127 4.31511 15.336 5.99511 11.9819L6.50261 10.9727C6.63094 10.716 6.63094 10.2902 6.50261 10.0335L5.99511 9.01853C4.31511 5.66437 5.69178 4.2877 9.04594 5.9677Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6.67188 10.5H9.82187" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feedback Modal - Only show if stream has actually started */}
      {eventId && hasStreamStarted && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={handleFeedbackModalClose}
          eventId={eventId}
          eventName={eventName}
        />
      )}
    </>
  );
};