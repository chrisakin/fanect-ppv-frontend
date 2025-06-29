import React, { useState, useEffect } from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { useAWSIVSService } from "./AWSIVS";
import { Loader2, AlertCircle, PlayCircle, Clock } from "lucide-react";
import { eventStreamingService, StreamingData } from "../../services/eventStreamingService";
import { useToast } from "../ui/use-toast";

interface PastEventPlayerProps {
  eventId: string;
  eventName?: string;
}

export const PastEventPlayer = ({ eventId, eventName }: PastEventPlayerProps): JSX.Element => {
  const [streamingData, setStreamingData] = useState<StreamingData | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const { toast } = useToast();

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
    playbackUrl: streamingData?.playbackUrl || streamingData?.savedBroadcastUrl || "",
    chatApiEndpoint: import.meta.env.REACT_APP_CHAT_API_ENDPOINT as string,
    chatRoomArn: streamingData?.chatRoomArn,
    chatToken: streamingData?.chatToken,
    username: "viewer"
  });

  const [messageInput, setMessageInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);

  // Fetch streaming data for past event
  useEffect(() => {
    const fetchStreamingData = async () => {
      try {
        setIsLoadingStream(true);
        setStreamError(null);
        
        const data = await eventStreamingService.getStreamingData(eventId, 'past');
        setStreamingData(data);
        
        if (!data.playbackUrl && !data.savedBroadcastUrl) {
          setStreamError("Replay URL not available for this event");
        }
      } catch (error: any) {
        console.error('Error fetching streaming data:', error);
        setStreamError(error.message || "Failed to load event replay");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event replay. The replay may no longer be available.",
        });
      } finally {
        setIsLoadingStream(false);
      }
    };

    if (eventId) {
      fetchStreamingData();
    }
  }, [eventId, toast]);

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

  // Video control icons
  const videoControls = [
    {
      src: "/ico-play.svg",
      alt: isPlaying ? "Pause" : "Play",
      className: "relative w-[15.91px] h-[19.58px] mt-[-1.79px] mb-[-1.79px] ml-[-1.00px] cursor-pointer",
      onClick: togglePlayPause,
    },
    {
      src: "/ico-sound.svg",
      alt: isMuted ? "Unmute" : "Mute",
      className: "relative w-[15.25px] h-[20.83px] mt-[-2.41px] mb-[-2.41px] cursor-pointer",
      onClick: toggleMute,
    },
  ];

  // Video settings icons
  const videoSettings = [
    {
      src: "/icon-essential-happyemoji.svg",
      alt: "Icon essential",
      className: "relative w-4 h-4 cursor-pointer",
      onClick: () => console.log("Reactions clicked"),
    },
    {
      src: "/ico-titles.svg",
      alt: "Ico titles",
      className: "relative w-5 h-4 cursor-pointer",
      onClick: () => console.log("Subtitles clicked"),
    },
    {
      src: "/ico-theater.svg",
      alt: "Ico theater",
      className: "relative w-[22px] h-4 cursor-pointer",
      onClick: () => console.log("Theater mode clicked"),
    },
    {
      src: "/ico-tv.svg",
      alt: "Ico tv",
      className: "relative w-6 h-5 mt-[-1.00px] mb-[-1.00px] cursor-pointer",
      onClick: () => console.log("Picture-in-Picture clicked"),
    },
    {
      src: "/ico-fullscreen.svg",
      alt: "Ico fullscreen",
      className: "relative w-[18px] h-[18px] mr-[-1.00px] cursor-pointer",
      onClick: toggleFullscreen,
    },
  ];

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
          No chat messages available for this replay
        </div>
      )}
    </div>
  );

  // Show loading state while fetching streaming data
  if (isLoadingStream) {
    return (
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] lg:p-4 p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[250px] sm:h-[300px] lg:h-[460px] bg-white lg:rounded-[10px] rounded-none overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <p className="text-white text-sm">Loading event replay...</p>
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] lg:p-4 p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[250px] sm:h-[300px] lg:h-[460px] bg-white lg:rounded-[10px] rounded-none overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <div className="space-y-2">
                  <p className="text-white text-lg font-medium">Replay Not Available</p>
                  <p className="text-gray-400 text-sm max-w-md">
                    {streamError}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-4">
                    <Clock className="h-4 w-4" />
                    <span>Event replays are available for 30 days after the live event</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" w-full bg-white dark:bg-[#062013] rounded-[10px] lg:p-4 p-0">
      <Card className="relative w-full bg-white dark:bg-[#062013] lg:rounded-[10px] rounded-none overflow-hidden border-0">
        <CardContent className="p-0">
          <div className="relative w-full h-full bg-black">
            {/* Replay indicator */}
            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-lg">
                <PlayCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Event Replay</span>
              </div>
            </div>

            {/* Loading state */}
            {!isPlayerLoaded && !playerError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                  <p className="text-white text-sm">Loading replay...</p>
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
              style={{ width: "100%", height: "100%" }}
            />
            
            {/* Video controls overlay */}
            {isPlayerLoaded && !playerError && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  {videoControls.map((control, index) => (
                    <button
                      key={index}
                      onClick={control.onClick}
                      className={control.className}
                      title={control.alt}
                    >
                      <img src={control.src} alt={control.alt} className="w-full h-full" />
                    </button>
                  ))}
                  
                  {/* Volume control */}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    {playerState} • REPLAY
                  </div>
                  {videoSettings.map((setting, index) => (
                    <button
                      key={index}
                      onClick={setting.onClick}
                      className={setting.className}
                      title={setting.alt}
                    >
                      <img src={setting.src} alt={setting.alt} className="w-full h-full" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat section */}
      {/* <div className="w-full lg:w-[260px] lg:px-0 px-4"> */}
        {/* Mobile Accordion */}
        {/* <div className="lg:hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="messages" className="border-none">
              <AccordionTrigger className="py-2 px-4 bg-[#edf0f5] rounded-t-[10px]">
                <h3 className="font-medium text-[#111111] text-base tracking-[-0.32px] [font-family:'Sofia_Pro-Medium',Helvetica]">
                  Chat Replay {!isConnected && "(Unavailable)"}
                </h3>
              </AccordionTrigger>
              <AccordionContent className="bg-[#edf0f5]">
                <div className="px-4 pb-4">
                  <ScrollArea className="h-[200px] pr-2">
                    <MessageList />
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                  <div className="flex h-[42px] items-center gap-2.5 p-2.5 mt-2 bg-gray-200 rounded-[10px] border border-solid border-[#828b8633]">
                    <Input
                      className="flex-1 border-0 p-0 h-auto text-xs [font-family:'Sofia_Pro-Regular',Helvetica] text-gray-500 placeholder:text-gray-500 focus-visible:ring-0"
                      placeholder="Chat not available in replay"
                      disabled
                    />
                    <Button 
                      className="w-8 h-8 p-1 bg-gray-400 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      <img
                        className="w-5 h-5 opacity-50"
                        alt="Send message"
                        src="/icon-video-audio-image-microphone-slash.svg"
                      />
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div> */}

        {/* Desktop Chat */}
        {/* <Card className="relative h-[455px] bg-[#edf0f5] rounded-[10px] overflow-hidden border-0 hidden lg:block pb-4">
          <CardContent className="p-0">
            <div className="flex flex-col w-full h-full p-4">
              <h3 className="font-medium text-[#111111] text-base tracking-[-0.32px] mb-[18px] [font-family:'Sofia_Pro-Medium',Helvetica]">
                Chat Replay {!isConnected && "(Unavailable)"}
              </h3>

              <ScrollArea className="h-[350px] pr-2">
                <MessageList />
                <ScrollBar orientation="vertical" />
              </ScrollArea>
              <div className="flex h-[42px] mb-4 items-center gap-2.5 p-2.5 mt-2 bg-gray-200 rounded-[10px] border border-solid border-[#828b8633]">
                <Input
                  className="flex-1 border-0 p-0 h-auto text-xs [font-family:'Sofia_Pro-Regular',Helvetica] text-gray-500 placeholder:text-gray-500 focus-visible:ring-0"
                  placeholder="Chat not available in replay"
                  disabled
                />
                <Button 
                  className="w-8 h-8 p-1 bg-gray-400 rounded-lg cursor-not-allowed"
                  disabled
                >
                  <img
                    className="w-5 h-5 opacity-50"
                    alt="Send message"
                    src="/icon-video-audio-image-microphone-slash.svg"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}
      {/* </div> */}
    </div>
  );
};