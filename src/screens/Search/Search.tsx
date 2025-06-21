import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { PaginationIndex } from "../../components/utils/Pagination";
import { EmptyState } from "../../components/layout/EmptyState";
import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { Loader2 } from "lucide-react";

export const Search = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { events, isLoading, pagination, searchEvents } = useEventStore();
  const [currentPage, setCurrentPage] = useState(1);
  
  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      searchEvents(query, currentPage);
    }
  }, [query, currentPage, searchEvents]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBuyStreampass = (eventId: string) => {
    if (isAuthenticated) {
      navigate(`/dashboard/tickets/event/streampass/${eventId}`);
    } else {
      navigate(`/event/${eventId}`);
    }
  };

  const SearchContent = () => (
    <main className="flex flex-col items-start gap-10 w-full max-w-7xl mx-auto px-2 md:px-8">
      <header className="flex flex-col w-full items-start justify-center gap-5">
        <Button
          variant="ghost"
          className="mb-2 hover:bg-transparent p-0 h-auto text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm">Back</span>
        </Button>
        
        <h1 className="font-display-xs-semibold text-gray-400 dark:text-gray-400 text-xl md:text-2xl tracking-[var(--display-xs-semibold-letter-spacing)] leading-[var(--display-xs-semibold-line-height)]">
          Search result for &apos;{query}&apos;
        </h1>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 w-full">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : events.length > 0 ? (
        <div className="flex flex-col gap-6 w-full">
          {events.map((event) => (
            <Card
              key={event._id}
              className="w-full h-auto md:h-[122px] dark:bg-[#062013] bg-white rounded-lg overflow-hidden border border-solid dark:border-[#2e483a] border-gray-200 p-0"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row w-full items-start md:items-center justify-between p-4 md:px-7 md:py-2.5 gap-4">
                  <div className="flex flex-col md:flex-row w-full md:w-[770px] items-start md:items-center justify-between gap-4 md:gap-6">
                    <img
                      className="w-full md:w-[175px] h-[120px] md:h-[99px] object-cover rounded-md"
                      alt="Event thumbnail"
                      src={event.bannerUrl}
                    />

                    <div className="flex flex-col md:flex-row flex-1 gap-1 md:gap-6 w-full">
                      <div className="flex-1 md:w-[249px]">
                        <Link 
                          to={isAuthenticated ? `/dashboard/tickets/event/streampass/${event._id}` : `/event/${event._id}`}
                          className="font-display-sm-medium dark:text-[#828b86] text-gray-800 text-lg md:text-xl hover:text-green-600 transition-colors tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)]"
                        >
                          {event.name}
                        </Link>
                      </div>

                      <div className="flex-1 md:w-[260px] font-text-lg-regular dark:text-[#828b86] text-gray-600 text-sm md:text-base tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)]">
                        {new Date(event.eventDateTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full md:w-[205px] h-[50px] md:h-[62px] rounded-[10px] border border-solid border-[#1aaa65] bg-transparent hover:bg-[#1aaa6510] dark:hover:bg-[#1aaa6510]"
                    onClick={() => handleBuyStreampass(event._id)}
                  >
                    <span className="font-text-xl-semibold text-green-600 text-sm md:text-base tracking-[var(--text-xl-semibold-letter-spacing)] leading-[var(--text-xl-semibold-line-height)]">
                      Buy Streampass
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationIndex 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      ) : (
        <div className="w-full">
          <EmptyState 
            primaryText={`No events found for "${query}"`}
            secondaryText="Try searching with different keywords or browse our upcoming events"
          />
        </div>
      )}
    </main>
  );

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <SearchContent />
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mt-[160px] mb-8">
        <SearchContent />
      </main>
      <Footer />
    </div>
  );
};