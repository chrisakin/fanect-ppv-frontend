import { StreampassPurchaseCard } from "@/components/layout/StreampassPurchase";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../components/ui/breadcrumb";
import { GiftFriend } from "@/components/layout/GiftFriendForm";
import { RegisteredCard } from "@/components/layout/RegisteredCard";
import { useParams } from "react-router-dom";
import { useEventStore } from "@/store/eventStore";
import { useEffect, useState } from "react";
import { Loader2, PlayCircle } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GiftCard } from "@/components/layout/GiftCard";

export const DashboardSingleEvent = (): JSX.Element => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { singleEvent, isLoading, fetchSingleEvent } = useEventStore();
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSingleEvent(id);
    }
  }, [id, fetchSingleEvent]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!singleEvent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-500">Event not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-start gap-[30px]">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="flex items-center">
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-medium text-gray-400">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
         /
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-text-lg-semibold text-gray-800">
            Event Details
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-[50px] w-full">
        {/* Event banner image with watermark */}
        <div className="relative w-full">
          <img
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg"
            alt="Event banner"
            src={singleEvent.bannerUrl}
          />
          
          {/* Watermark overlay */}
          {singleEvent.watermarkUrl && (
            <div className="absolute bottom-4 right-4 opacity-70">
              <img
                className="h-8 sm:h-12 md:h-16 w-auto object-contain"
                alt="Event watermark"
                src={singleEvent.watermarkUrl}
              />
            </div>
          )}
        </div>

        {/* Event Trailer Section */}
        {singleEvent.trailerUrl && (
          <div className="w-full">
            {!showTrailer ? (
              <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {/* Trailer thumbnail with play button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                  >
                    <PlayCircle className="w-6 h-6" />
                    <span className="text-lg font-medium">Watch Trailer</span>
                  </Button>
                </div>
                
                {/* Background image or placeholder */}
                <img
                  className="w-full h-full object-cover"
                  alt="Event trailer thumbnail"
                  src={singleEvent.bannerUrl}
                />
              </div>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Event Trailer
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowTrailer(false)}
                    className="text-sm"
                  >
                    Close Trailer
                  </Button>
                </div>
                <video
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] object-cover rounded-lg"
                  controls
                  autoPlay
                  preload="metadata"
                >
                  <source src={singleEvent.trailerUrl} type="video/mp4" />
                  <source src={singleEvent.trailerUrl} type="video/webm" />
                  <source src={singleEvent.trailerUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-6">
          {/* Left column - Event details */}
          <div className="flex flex-col items-start gap-[30px] flex-1 w-full lg:w-auto">
            {/* Event title and price */}
            <div className="flex flex-col items-start gap-2 w-full">
              <h1 className="font-display-lg-semibold text-gray-900 dark:text-[#FFFFFF] text-2xl md:text-3xl lg:text-4xl">
                {singleEvent.name}
              </h1>
              <h2 className="font-display-sm-medium  text-gray-900 dark:text-[#FFFFFF] text-xl md:text-2xl">
               {singleEvent.price?.currency} {Number(singleEvent.price?.amount).toLocaleString()}
              </h2>
            </div>

            <div className="md:hidden block w-full lg:w-auto">
            {type === 'streampass' && <StreampassPurchaseCard event={singleEvent} />}
            {type === 'gift' && <GiftFriend event={singleEvent}/>}
            {type === 'paid' && <RegisteredCard event={singleEvent} />}
            {type === 'giftpaid' && <GiftCard />}
          </div>

            {/* About this event section */}
            <div className="flex flex-col w-full items-start gap-2.5">
              <h3 className="font-display-md-bold text-2xl md:text-[30px] text-black dark:text-white">
                About this event
              </h3>
              <div className="flex flex-col items-start gap-[18px] w-full">
                <p className="font-text-lg-regular text-black dark:text-white whitespace-pre-line">
                  {singleEvent.description}
                </p>
               <p className="font-text-lg-regular text-black dark:text-white">
              Date: {new Date(singleEvent.date).toLocaleDateString('en-US', {
               weekday: 'long',
               year: 'numeric',
               month: 'long',
               day: 'numeric'
              })}
              </p>
              <p className="font-text-lg-regular text-black dark:text-white">
                Time: {formatTime(singleEvent.time)}
              </p>
              </div>
            </div>
          </div>

          {/* Right column - Purchase card */}
          <div className="hidden md:block w-full lg:w-auto">
            {type === 'streampass' && <StreampassPurchaseCard event={singleEvent}/>}
            {type === 'gift' && <GiftFriend  event={singleEvent}/>}
            {type === 'paid' && <RegisteredCard  event={singleEvent}/>}
            {type === 'giftpaid' && <GiftCard/>}
          </div>
        </div>
      </div>
    </div>
  );
};