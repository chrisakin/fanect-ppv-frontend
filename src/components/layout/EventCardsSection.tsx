import { isAuthenticated } from "@/lib/auth";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    date: string;
    image: string;
    hasStreamPass: boolean;
  }
  
  interface EventCardsSectionProps {
    events: Event[];
    eventType: 'live' | 'upcoming' | 'past' 
  }

export const EventCardsSection = ( { events, eventType }: EventCardsSectionProps ) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {events.map((event, index) => (
                      <Link to={event.hasStreamPass && isAuthenticated() && eventType == 'live' ? `/dashboard/tickets/watch-event/live/${event.id}` : event.hasStreamPass && isAuthenticated() && eventType == 'upcoming' ? `/dashboard/tickets/event/paid/${event.id}` : `/event/${event.id}?eventType=${eventType}`} key={index}>
                        <Card
                          className="w-full h-[300px] lg:h-[270px] rounded-lg overflow-hidden border border-solid border-[#d5d7da] hover:shadow-lg transition-shadow"
                        >
                          <img
                            className="w-full h-[160px] object-cover"
                            alt={event.title}
                            src={event.image}
                          />
                          <CardContent className="p-3">
                            <div className="flex flex-col gap-1">
                              <h3 className="text-base font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap" title={event.title}>
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
    );
}