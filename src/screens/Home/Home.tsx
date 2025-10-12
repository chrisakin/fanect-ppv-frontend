import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { PaginationIndex } from "@/components/utils/Pagination";
import { HeroSection } from "@/components/layout/HeroSection";
import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { EmptyState } from "@/components/layout/EmptyState";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import { useEffect, useState } from "react";

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState<'upcoming' | 'live'>('upcoming');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { events, isLoading, pagination, fetchUpcomingEvents, fetchLiveEvents } = useEventStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
    date: new Date(event.eventDateTime).toLocaleString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,    
    }),
    image: event.bannerUrl,
  }));

  return (
    <main className="bg-background text-foreground">
      <div className="relative max-w-7xl mx-auto" >
        <Header />

        {/* Main Content */}
        <div className="flex flex-col items-center mt-[160px] mx-3 md:mx-4">
          {/* Hero Banner */}
          <HeroSection />

          <div className="flex flex-col w-full max-w-[1280px] items-center gap-16">
            {/* Events Section */}
            <section className="flex flex-col items-start gap-8 w-full">
              <ToggleGroup
                type="single"
                value={eventType}
                onValueChange={(value) => value && setEventType(value as 'upcoming' | 'live')}
                className="flex w-[265px] items-center gap-[11px] px-2.5 py-1 dark:bg-[#062013] rounded-[20px] border dark:!border-[#2E483A] !border-[#1AAA6580]"
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
              </ToggleGroup>

              {isLoading ? (
                <div className="w-full text-center py-8">Loading...</div>
              ) : transformedEvents.length > 0 ? (
                <div className="flex flex-col items-start gap-6 w-full">
                  <EventCardsSection events={transformedEvents} eventType={eventType} />

                  {/* Pagination */}
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
            </section>

            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
};