import { EmptyState } from "@/components/layout/EmptyState";
import { StreampassCardsSection } from "@/components/layout/StreampassCardsSection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { PaginationIndex } from "@/components/utils/Pagination";
import { useEventStore } from "@/store/eventStore";
import { useNavigate } from "react-router-dom";

export const DashboardTickets = () => {
  const [eventType, setEventType] = useState<'upcoming' | 'live' | 'past'>('upcoming');
const nav = useNavigate()
  const { 
      events, 
      isLoading,
      pagination,
      fetchStreampassEvents, 
    } = useEventStore();

  useEffect(() => {
    fetchStreampassEvents(eventType);
  }, [eventType]);

  const handlePageChange = (page: number) => {
    fetchStreampassEvents(eventType, page);
  };

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Streampass</h1>
        <p className="text-gray-500 dark:text-gray-400">
          See the events you bought ticket and registered for
        </p>
      </div>

      <div className="mt-10">
        <div className="flex flex-col items-start gap-5 w-full mb-4">
          <ToggleGroup
            type="single"
            value={eventType}
            onValueChange={(value) => value && setEventType(value as 'upcoming' | 'past')}
            className="flex md:w-[335px] w-[320px] items-center gap-[11px] px-2.5 py-1 dark:bg-[#062013] rounded-[20px] border dark:!border-[#2E483A] !border-[#1AAA6580]"
          >
            <ToggleGroupItem
              value="upcoming"
              className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
                eventType === 'upcoming' ? "!bg-[#1AAA65]" : " dark:!bg-[#062013] hover:!bg-transparent"
              }`}
            >
              <span className={`font-text-lg-regular ${
                eventType === 'upcoming' ? "!text-gray-50" : "dark:!text-[#828B86] !text-[#44D48F]"
              }`}>
                Upcoming
              </span>
            </ToggleGroupItem>
             <ToggleGroupItem
              value="live"
              className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
              eventType === 'live' ? "!bg-[#1AAA65]" : " dark:!bg-[#062013] hover:!bg-transparent"
              }`}
            >
              <span className={`font-text-lg-regular ${
               eventType === 'live' ? "!text-gray-50" : "dark:!text-[#828B86] !text-[#44D48F]"
              }`}>
                Live
              </span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="past"
              className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
                eventType === 'past' ? "!bg-[#1AAA65]" : " dark:!bg-[#062013] hover:!bg-transparent"
              }`}
            >
              <span className={`font-text-lg-regular ${
                eventType === 'past' ? "!text-gray-50" : "dark:!text-[#828B86] !text-[#44D48F]"
              }`}>
                Past
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="mt-5">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : events.length > 0 ? (
            <div>
              <StreampassCardsSection events={events} type={eventType} />
              <PaginationIndex 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <EmptyState 
              primaryText={`No ${eventType} streampass yet`} 
              secondaryText={`When you purchase an event ticket, it will show up here`} 
              hasButton={true} 
              buttonText={'Buy Streampass'}
              onClickButton={() => {nav('/dashboard/home')}}
            />
          )}
        </div>
      </div>
    </div>
  );
};