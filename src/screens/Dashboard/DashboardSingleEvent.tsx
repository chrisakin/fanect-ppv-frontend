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
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

export const DashboardSingleEvent = (): JSX.Element => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const { singleEvent, isLoading, fetchSingleEvent } = useEventStore();

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
        {/* Event banner image */}
        <img
          className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg"
          alt="Event banner"
          src={singleEvent.bannerUrl}
        />

        <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-6">
          {/* Left column - Event details */}
          <div className="flex flex-col items-start gap-[30px] flex-1 w-full lg:w-auto">
            {/* Event title and price */}
            <div className="flex flex-col items-start gap-2 w-full">
              <h1 className="font-display-lg-semibold text-gray-900 text-2xl md:text-3xl lg:text-4xl">
                {singleEvent.name}
              </h1>
              <h2 className="font-display-sm-medium text-[#414651] text-xl md:text-2xl">
               {singleEvent.price?.currency} {Number(singleEvent.price?.amount).toLocaleString()}
              </h2>
            </div>

            <div className="md:hidden block w-full lg:w-auto">
            {type === 'streampass' && <StreampassPurchaseCard event={singleEvent} />}
            {type === 'gift' && <GiftFriend event={singleEvent}/>}
            {type === 'paid' && <RegisteredCard />}
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
            {type === 'paid' && <RegisteredCard />}
          </div>
        </div>
      </div>
    </div>
  );
};