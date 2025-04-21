import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Link } from "react-router-dom";

export const Home = (): JSX.Element => {
  // Event data for mapping
  const events = [
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
          <section className="flex flex-col items-center justify-center gap-4 pb-6 w-full">
            <img
              className="w-full max-w-[1400px] h-[250px] md:h-[300px] object-cover rounded-lg"
              alt="Hero Banner"
              src="/image.png"
            />

            <div className="flex items-center gap-2">
              <div className="bg-green-600 w-3 h-3 rounded-full" />
              <div className="bg-gray-300 dark:bg-gray-700 w-3 h-3 rounded-full" />
              <div className="bg-gray-300 dark:bg-gray-700 w-3 h-3 rounded-full" />
            </div>
          </section>

          <div className="flex flex-col w-full max-w-[1280px] items-center gap-16">
            {/* Events Section */}
            <section className="flex flex-col items-start gap-8 w-full">
              <div className="flex flex-col items-start gap-6 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
                  <h2 className="text-lg font-medium text-foreground">
                    Upcoming Events
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {events.map((event, index) => (
                      <Link to={`/event/${event.id}`} key={index}>
                        <Card
                          className="w-full h-[250px] rounded-lg overflow-hidden border border-solid border-[#d5d7da] hover:shadow-lg transition-shadow"
                        >
                          <img
                            className="w-full h-[160px] object-cover"
                            alt={event.title}
                            src={event.image}
                          />
                          <CardContent className="p-3">
                            <div className="flex flex-col gap-1">
                              <h3 className="text-base font-semibold text-foreground">
                                {event.title}
                              </h3>
                              <p className="text-sm text-foreground">
                                {event.date}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center w-full py-8">
                  <Pagination>
                    <PaginationContent className="flex items-center gap-2 flex-wrap justify-center">
                      <PaginationItem>
                        <PaginationPrevious
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground"
                        >
                          <ChevronLeftIcon className="w-3 h-3" />
                        </PaginationPrevious>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                          href="#"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                          href="#"
                        >
                          2
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                          href="#"
                        >
                          3
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationEllipsis className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground" />
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationLink
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-sm text-foreground"
                          href="#"
                        >
                          50
                        </PaginationLink>
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md border border-solid border-[#d5d7da] text-foreground"
                        >
                          <ChevronRightIcon className="w-3 h-3" />
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
};