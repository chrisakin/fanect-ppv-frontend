import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";

interface Event {
    id: string;
    title: string;
    date: string;
    image: string;
  }
  
  interface EventCardsSectionProps {
    events: Event[];
  }

export const EventCardsSection = ( { events }: EventCardsSectionProps ) => {
    return (
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
    );
}