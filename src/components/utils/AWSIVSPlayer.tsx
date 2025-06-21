import React, { useState } from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { useAWSIVSService } from "./AWSIVS";
import { Loader2, AlertCircle } from "lucide-react";
import { FeedbackModal } from "../modals/FeedbackModal";

interface AWSIVSPlayerProps {
  playbackUrl?: string;
  chatApiEndpoint?: string;
  chatRoomArn?: string;
  chatToken?: string;
  username?: string;
  eventId?: string;
  eventName?: string;
}

export const AWSIVSPlayer = ({
  playbackUrl = "https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8", // Demo stream
  chatApiEndpoint,
  chatRoomArn = "arn:aws:ivs:eu-west-1:408768385908:channel/pm4NBDHAKHzm",
  chatToken,
  username = "viewer",
  eventId,
  eventName
}: AWSIVSPlayerProps): JSX.Element => {
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
    playbackUrl,
    chatApiEndpoint,
    chatRoomArn,
    chatToken,
    username,
    onPlayerStateChange: (state) => {
      // Show feedback modal when stream ends
      if (state === "ENDED" && eventId) {
        setShowFeedbackModal(true);
      }
    },
  });

  const [messageInput, setMessageInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
      {messages.map((message, index) => (
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
      ))}
    </div>
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
        <Card className="relative w-full lg:w-[calc(100%-280px)] h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
          <CardContent className="p-0">
            <div className="relative w-full h-full bg-black">
              {/* Loading state */}
              {!isPlayerLoaded && !playerError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <p className="text-white text-sm">Loading player...</p>
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
                      {playerState}
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
                        disabled={!isConnected}
                      />
                      <Button 
                        className="w-8 h-8 p-1 bg-green-700 rounded-lg disabled:opacity-50"
                        onClick={handleSendMessage}
                        disabled={!isConnected || !messageInput.trim()}
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
                    disabled={!isConnected}
                  />
                  <Button 
                    className="w-8 h-8 p-1 bg-green-700 rounded-lg disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={!isConnected || !messageInput.trim()}
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