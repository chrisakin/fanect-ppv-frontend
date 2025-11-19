import { isAuthenticated } from "@/lib/auth";
import { Card, CardContent } from "../../components/ui/card";
import { Link } from "react-router-dom";

/**
 * Event
 *
 * Represents a single event in the event cards grid.
 *  - id: string – Unique event identifier (MongoDB/database ID)
 *  - title: string – Event name/title
 *  - date: string – Formatted date/time string (e.g. "Nov 19, 2025 - 2:30 PM")
 *  - image: string – URL to event banner/cover image
 *  - hasStreamPass: boolean – Whether event requires a streampass/subscription to view
 */
interface Event {
    id: string;
    title: string;
    date: string;
    image: string;
    hasStreamPass: boolean;
  }

/**
 * EventCardsSectionProps
 *
 * Props for the EventCardsSection component.
 *  - events: Event[] – Array of Event objects to display in grid
 *  - eventType: 'live' | 'upcoming' | 'past' – Type of events being displayed
 *    (determines routing and filtering behavior)
 */
interface EventCardsSectionProps {
    events: Event[];
    eventType: 'live' | 'upcoming' | 'past' 
  }

/**
 * EventCardsSection
 *
 * Displays a responsive grid of event cards with intelligent routing based on event type and auth status.
 *
 * Grid Layout:
 *  - Mobile: 1 column
 *  - Tablet (md+): 2 columns
 *  - Desktop (lg+): 3 columns
 *
 * Card Features:
 *  - Event banner image (160px height, object-cover)
 *  - Event title (truncated with ellipsis, one line max)
 *  - Event date/time text
 *  - Hover shadow effect for better interactivity
 *  - Rounded corners with subtle border
 *
 * Smart Routing Logic:
 *
 *  For LIVE events with streampass + authenticated users:
 *    → Route to: /dashboard/tickets/watch-event/live/{eventId}
 *       (Allows watching live stream from dashboard)
 *
 *  For UPCOMING events with streampass + authenticated users:
 *    → Route to: /dashboard/tickets/event/paid/{eventId}
 *       (Streampass purchase/payment flow)
 *
 *  For all other cases (public events, past events, unauthenticated):
 *    → Route to: /event/{eventId}?eventType={live|upcoming|past}
 *       (Public event details page)
 *
 * Arguments:
 *  - events: Event[] – Array of events to display
 *  - eventType: 'live' | 'upcoming' | 'past' – Current event type filter
 *
 * Returns: JSX.Element – Responsive grid of clickable event cards
 *
 * Example:
 *   <EventCardsSection
 *     events={liveEvents}
 *     eventType="live"
 *   />
 */
export const EventCardsSection = ( { events, eventType }: EventCardsSectionProps ) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {events.map((event, index) => (
                      <Link 
                        // Intelligent routing based on event type and authentication status
                        to={event.hasStreamPass && isAuthenticated() && eventType == 'live' ? `/dashboard/tickets/watch-event/live/${event.id}` : event.hasStreamPass && isAuthenticated() && eventType == 'upcoming' ? `/dashboard/tickets/event/paid/${event.id}` : `/event/${event.id}?eventType=${eventType}`} 
                        key={index}
                      >
                        <Card
                          className="w-full h-[300px] lg:h-[270px] rounded-lg overflow-hidden border border-solid border-[#d5d7da] hover:shadow-lg transition-shadow"
                        >
                          {/* Event banner image */}
                          <img
                            className="w-full h-[160px] object-cover"
                            alt={event.title}
                            src={event.image}
                          />
                          {/* Event title and date */}
                          <CardContent className="p-3">
                            <div className="flex flex-col gap-1">
                              {/* Event title: Truncated to single line with ellipsis */}
                              <h3 className="text-base font-semibold text-foreground overflow-hidden text-ellipsis whitespace-nowrap" title={event.title}>
                                {event.title}
                              </h3>
                              {/* Event date/time */}
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