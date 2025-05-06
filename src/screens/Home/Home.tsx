
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { PaginationIndex } from "@/components/utils/Pagination";
import { HeroSection } from "@/components/layout/HeroSection";
import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { EmptyState } from "@/components/layout/EmptyState";

export const Home = (): JSX.Element => {
  // Event data for mapping
  const events:any = [
    {
      id: "1",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: "2",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: "3",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: "4",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: "5",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
    {
      id: "6",
      title: "Fido Live in Atlanta",
      date: "Saturday, 26th December, 2025",
      image: "/image-6.png",
    },
  ];

  return (
    <main className="bg-background text-foreground max-w-[1440px] mx-auto">
      <div className="relative">
        <Header />

        {/* Main Content */}
        <div className="flex flex-col items-center mt-16 mx-3 md:mx-4">
          {/* Hero Banner */}
          <HeroSection />

          <div className="flex flex-col w-full max-w-[1280px] items-center gap-16">
            {/* Events Section */}
            <section className="flex flex-col items-start gap-8 w-full">
             { events.length > 0 ? (
                <div className="flex flex-col items-start gap-6 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h2 className="text-lg font-medium text-foreground">
                    Upcoming Events
                  </h2>

                  <EventCardsSection events={events} />
                </div>

                {/* Pagination */}
                <PaginationIndex />
              </div>
              ) : (
                <EmptyState primaryText={'No upcoming event yet'} secondaryText={'When there is a future event, you will see it here'} />)}
            </section>

            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
};