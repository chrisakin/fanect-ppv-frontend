import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { PaginationIndex } from "@/components/utils/Pagination";
import { HeroSection } from "@/components/layout/HeroSection";
import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { EmptyState } from "@/components/layout/EmptyState";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useEventStore } from "@/store/eventStore";
import { useEffect } from "react";

export const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { events, isLoading, pagination, fetchUpcomingEvents } = useEventStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  const handlePageChange = (page: number) => {
    fetchUpcomingEvents(page);
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
              {isLoading ? (
                <div className="w-full text-center py-8">Loading...</div>
              ) : transformedEvents.length > 0 ? (
                <div className="flex flex-col items-start gap-6 w-full">
                  <div className="flex flex-col items-start gap-4 w-full">
                    <h2 className="text-lg font-medium text-foreground">
                      Upcoming Events
                    </h2>

                    <EventCardsSection events={transformedEvents} />
                  </div>

                  {/* Pagination */}
                  <PaginationIndex 
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <EmptyState 
                  primaryText="No upcoming event yet" 
                  secondaryText="When there is a future event, you will see it here" 
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