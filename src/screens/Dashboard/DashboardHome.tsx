import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { PaginationIndex } from "@/components/utils/Pagination";
import { EmptyState } from "@/components/layout/EmptyState";
import { HeroSection } from "@/components/layout/HeroSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/eventStore";
import { useEffect, useState } from "react";

export const DashboardHome = (): JSX.Element => {
  const [eventType, setEventType] = useState<'upcoming' | 'live'>('upcoming');
  const { events, isLoading, pagination, fetchUpcomingEvents, fetchLiveEvents } = useEventStore();

  useEffect(() => {
    if (eventType === 'upcoming') {
      fetchUpcomingEvents();
    } else {
      fetchLiveEvents();
    }
  }, [eventType, fetchUpcomingEvents, fetchLiveEvents]);

  const handlePageChange = (page: number) => {
    if (eventType === 'upcoming') {
      fetchUpcomingEvents(page);
    } else {
      fetchLiveEvents(page);
    }
  };

  // Transform events for EventCardsSection
  const transformedEvents = events.map(event => ({
    id: event._id,
    title: event.name,
    date: new Date(event.eventDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    image: event.bannerUrl
  }));

  return (
    <div>
      <div>
        <HeroSection />
      </div>
      <div className="flex-col items-start gap-20 mt-7">
        <ToggleGroup
          type="single"
          value={eventType}
          onValueChange={(value) => value && setEventType(value as 'upcoming' | 'live')}
          className="flex w-[265px] items-center gap-[11px] px-2.5 py-1 bg-[#E8FFF4] dark:bg-[#062013] rounded-[40px]"
        >
          <ToggleGroupItem
            value="upcoming"
            className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
              eventType === 'upcoming' ? "bg-[#1AAA65]" : "bg-[#E8FFF4] dark:bg-[#062013]"
            }`}
          >
            <span className={`font-text-lg-regular ${
              eventType === 'upcoming' ? "text-gray-50" : "dark:text-[#828B86] text-[#44D48F]"
            }`}>
              Upcoming
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="live"
            className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
              eventType === 'live' ? "bg-[#1AAA65]" : "bg-[#E8FFF4] dark:bg-[#062013]"
            }`}
          >
            <span className={`font-text-lg-regular ${
              eventType === 'live' ? "text-gray-50" : "dark:text-[#828B86] text-[#44D48F]"
            }`}>
              Live
            </span>
          </ToggleGroupItem>
        </ToggleGroup>

        <Alert className="relative w-full h-[72px] bg-green-900 rounded overflow-hidden p-0 mt-5">
          <div className="w-full flex items-start gap-2.5 p-4">
            <div className="flex items-center gap-2.5 w-full">
              <InfoIcon className="w-7 h-7 text-gray-100" />
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-[15px]">
                  <AlertDescription className="text-gray-100 font-text-sm-regular">
                    Fido live in lagos live streaming has begun
                  </AlertDescription>
                  <Button
                    variant="outline"
                    className="h-9 bg-gray-50 rounded text-green-600 [font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-base tracking-[-0.32px]"
                  >
                    Start Streaming
                  </Button>
                </div>
                <XCircleIcon className="w-[18px] h-[18px] text-gray-100" />
              </div>
            </div>
          </div>
        </Alert>

        <div className="mt-5">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : transformedEvents.length > 0 ? (
            <div>
              <EventCardsSection events={transformedEvents} />
              <PaginationIndex 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <EmptyState 
              primaryText={`No ${eventType} event yet`} 
              secondaryText={`When an event is ${eventType}, you will see it here`}
            />
          )}
        </div>
      </div>
    </div>
  );
};