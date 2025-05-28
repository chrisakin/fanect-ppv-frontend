import React, { useRef, useState } from "react";
import { Avatar } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { useAgoraViewerService } from "../utils/Agora";

export const VideoPlayer = (): JSX.Element => {
  // Agora integration
  const {
    remoteUsers,
    videoContainerRef,
    client,
  } = useAgoraViewerService({
    appId: "YOUR_AGORA_APP_ID", // <-- Replace with your Agora App ID
    channel: "YOUR_CHANNEL_NAME", // <-- Replace with your channel name
    token: "YOUR_TOKEN", // <-- Replace with your token or null
    uid: undefined,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Message data for mapping
  const messages = Array(6).fill({
    name: "Feyisayo Helen",
    message: "Omg! This is so so good, yayy",
    avatar: "/image-6.png",
  });

  // Watermark text data for mapping
  const watermarkTexts = [
    { top: "10", left: "-1.5", rotate: "-38.08deg", opacity: "20" },
    { top: "9", left: "149", rotate: "-38.08deg", opacity: "20" },
    { top: "180", left: "41", rotate: "-38.08deg", opacity: "20" },
  ];

  // Background watermark text data
  const backgroundWatermarks = [
    { top: "165", left: "7", rotate: "-38.08deg" },
    { top: "58", left: "138", rotate: "-38.08deg" },
    { top: "180", left: "184", rotate: "-38.08deg" },
    { top: "202", left: "360", rotate: "-38.08deg" },
    { top: "231", left: "505", rotate: "-38.08deg" },
    { top: "248", left: "660", rotate: "-38.08deg" },
    { top: "336", left: "-1.5", rotate: "-38.08deg" },
    { top: "358", left: "170", rotate: "-38.08deg" },
    { top: "387", left: "315", rotate: "-38.08deg" },
    { top: "404", left: "470", rotate: "-38.08deg" },
    { top: "9", left: "366", rotate: "-38.08deg" },
    { top: "58", left: "542", rotate: "-38.08deg" },
    { top: "87", left: "687", rotate: "-38.08deg" },
    { top: "104", left: "842", rotate: "-38.08deg" },
  ];

  // Video control icons (these will not control Agora streams, but you can adapt as needed)
  const videoControls = [
    {
      src: "/ico-play.svg",
      alt: isPlaying ? "Pause" : "Play",
      className:
        "relative w-[15.91px] h-[19.58px] mt-[-1.79px] mb-[-1.79px] ml-[-1.00px] cursor-pointer",
      onClick: () => {},
    },
    {
      src: "/ico-sound.svg",
      alt: isMuted ? "Unmute" : "Mute",
      className: "relative w-[15.25px] h-[20.83px] mt-[-2.41px] mb-[-2.41px] cursor-pointer",
      onClick: () => {},
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
      onClick: () => {},
    },
  ];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const MessageList = () => (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <div key={index} className="flex items-start gap-2">
          <Avatar className="w-[22px] h-[22px]">
            <img
              className="w-full h-full object-cover"
              alt="User avatar"
              src={message.avatar}
            />
          </Avatar>

          <div className="flex flex-col w-[180px] gap-1">
            <div className="text-[#111111] text-[10px] tracking-[-0.20px] [font-family:'Sofia_Pro-Regular',Helvetica]">
              {message.name}
            </div>
            <div className="w-full h-8 bg-white rounded-[10px] flex items-center px-[11px]">
              <span className="text-[#444444] text-xs tracking-[-0.24px] [font-family:'Sofia_Pro-Regular',Helvetica]">
                {message.message}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-2.5 w-full bg-white rounded-[10px] p-4 lg:p-0">
      <Card className="relative w-full lg:w-[calc(100%-280px)] h-[300px] sm:h-[400px] lg:h-[460px] bg-white rounded-[10px] overflow-hidden border-0">
        <CardContent className="p-0">
          <div className="relative w-full h-full">
            {/* Agora video container */}
            <div
              ref={videoContainerRef}
              className="w-full h-full object-cover"
              style={{ width: "100%", height: "100%" }}
            />
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
                  Messages
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
                      placeholder="Write here"
                    />
                    <Button className="w-8 h-8 p-1 bg-green-700 rounded-lg">
                      <img
                        className="w-5 h-5"
                        alt="Microphone icon"
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
                Messages
              </h3>

              <ScrollArea className="h-[350px] pr-2">
                <MessageList />
                <ScrollBar orientation="vertical" />
              </ScrollArea>

              {/* Message input */}
              <div className="flex h-[42px] mb-4 items-center gap-2.5 p-2.5 mt-2 bg-white rounded-[10px] border border-solid border-[#828b8633]">
                <Input
                  className="flex-1 border-0 p-0 h-auto text-xs [font-family:'Sofia_Pro-Regular',Helvetica] text-[#828b86] placeholder:text-[#828b86] focus-visible:ring-0"
                  placeholder="Write here"
                />
                <Button className="w-8 h-8 p-1 bg-green-700 rounded-lg">
                  <img
                    className="w-5 h-5"
                    alt="Microphone icon"
                    src="/icon-video-audio-image-microphone-slash.svg"
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};