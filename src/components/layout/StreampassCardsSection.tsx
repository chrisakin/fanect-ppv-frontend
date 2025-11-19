import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Event } from "@/store/eventStore";

/**
 * Props for StreampassCardsSection component
 * @interface EventCardsSectionProps
 * @property {Event[]} events - Array of events to display
 * @property {'upcoming' | 'live' | 'past'} type - Event type determines layout and actions
 */
interface EventCardsSectionProps {
  events: Event[];
  type: 'upcoming' | 'live' | 'past';
}

/**
 * StreampassCardsSection Component - Event cards grid with type-specific actions
 * 
 * Displays events in responsive grid (1 col mobile, 2 col desktop) with:
 * - Upcoming: Countdown timer, gift streampass button
 * - Live: Live badge, watch live button
 * - Past: Time since event, replay button (30-day window), replay expiration info
 * 
 * Features:
 * - Real-time countdown updates (every second for upcoming)
 * - Event banners and details (name, date)
 * - Type-specific action buttons and status badges
 * - Replay availability logic (30-day limit)
 * 
 * @param {EventCardsSectionProps} props - Component props
 * @returns {JSX.Element} Grid of event cards with actions
 */
export const StreampassCardsSection = ({ events, type }: EventCardsSectionProps) => {
  /**
   * Store countdown strings by event ID
   * @type {[Object, Function]} - State for countdown display
   */
  const [countdowns, setCountdowns] = useState<{ [id: string]: string }>({});
  const navigate = useNavigate();

  /**
   * Calculates countdown string for upcoming events
   * Format: "Xd : Xh : Xm : Xs"
   * @param {string} dateString - Event date/time string
   * @returns {string} Formatted countdown or "Waiting for event to start..."
   */
  const getCountdown = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    if (diff <= 0) return "Waiting for event to start...";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  /**
   * Navigate to gift streampass page for given event
   * @param {string} eventId - Event ID to gift streampass for
   */
  const handleGiftStreampass = (eventId: string) => {
      navigate(`/dashboard/tickets/event/gift/${eventId}`);
  };

  /**
   * Updates countdown timer every second for upcoming events
   * Refreshes entire countdown map on each interval
   */
  useEffect(() => {
    if (type !== "upcoming") return;
    const interval = setInterval(() => {
      const newCountdowns: { [id: string]: string } = {};
      events.forEach(event => {
        newCountdowns[event._id] = getCountdown(event.eventDateTime);
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [events, type]);

  /**
   * Calculates time status display based on event type
   * Upcoming: Shows countdown from countdowns state
   * Past/Live: Shows "X day(s) ago" format
   * @param {string} dateString - Event date/time string
   * @returns {string} Formatted time status
   */
  const calculateTimeStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    if (type === 'upcoming') {
      return countdowns[dateString] || getCountdown(dateString);
    } else {
      const diff = now.getTime() - eventDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days > 1 ? days : 1} ${days > 1 ? 'days' : 'day'} ago`;
    }
  };

  /**
   * Checks if replay is available (within 30-day window after event)
   * @param {string} dateString - Event date/time string
   * @returns {boolean} True if replay is still available
   */
  const isReplayAvailable = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - eventDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days <= 30;
  };

  return (
    // Responsive grid: 1 column mobile, 2 columns desktop
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {events.map((event) => (
        <Card
          key={event._id}
          className="w-full lg:h-[255px] dark:bg-[#062013] rounded-lg overflow-hidden border border-solid dark:border-[#2e483a] border-[#D5D7DA] relative flex flex-col"
        >
          <div className="flex flex-col md:flex-row flex-1">
            {/* Event banner image */}
            <img
              className="w-full md:w-[246px] h-[200px] md:h-[255px] object-cover"
              alt="Event Image"
              src={event.bannerUrl}
            />
            <CardContent className="flex flex-col h-full justify-between py-[20px] px-4 md:pl-6 md:pr-0 flex-1">
              {/* Event title and date */}
              <div className="flex flex-col w-full md:w-[250px] items-start">
                <h3 className="text-xl md:text-2xl font-medium dark:text-[#828b86] mb-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                  {(type === 'live' || type === 'upcoming') ? (
                  // Clickable link for live/upcoming events
                  <Link
                    to={
                    type === 'live'
                  ? `/dashboard/tickets/watch-event/live/${event._id}`
                  : `/dashboard/tickets/event/paid/${event._id}`
                  }
                    className="overflow-hidden text-ellipsis whitespace-nowrap block"
                    title={event.name}
                >
                  {event.name}
                </Link>
                ) : (
                // Non-clickable text for past events
                <span className="cursor-not-allowed overflow-hidden text-ellipsis whitespace-nowrap block" title={event.name}>
                  {event.name}
                </span>
                  )}
                </h3>
                <p className="text-base md:text-md text-[#828b86]">
                  {new Date(event.eventDateTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,              
                  })}
                </p>
              </div>

            {/* Upcoming events: Countdown + Gift button */}
            {type === "upcoming" && (
               <div className="flex flex-col gap-4">
               {/* Countdown timer display */}
               <div className="flex w-[250px] h-[44px] items-center justify-center gap-5 px-2.5 py-0 relative dark:bg-[#0b331f]">
            <div className="relative flex-1 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] dark:text-[#baebd3] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)]">
               {countdowns[event._id] || getCountdown(event.eventDateTime)}
            </div>
          </div>
           {/* Gift streampass button */}
           <Button
            variant="outline"
            className="flex w-52 h-10 items-center justify-center gap-2.5 p-2.5 relative rounded-[10px] border border-solid border-[#1aaa65] bg-transparent opacity-80 hover:bg-[#0b331f] hover:opacity-100"
            onClick={() => handleGiftStreampass(event._id)}
          >
            <span className="relative w-fit mt-[-5.00px] mb-[-3.00px] [font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-green-600 text-lg tracking-[-0.36px] leading-7 whitespace-nowrap">
              Gift a Streampass
            </span>
          </Button>
             </div>
            )}

              {/* Type-specific actions and info */}
              <div className="flex flex-col gap-4 mt-4">
                {/* Past events: Time since + Replay button/expiration info */}
                {type === 'past' && (
                  <>
                    <p className={`font-medium text-red-600 ${!event.canWatchSavedStream ? "mb-12" : ""}`}>
                      {calculateTimeStatus(event.eventDateTime)}
                    </p>
                    {event.canWatchSavedStream && <div>
                      {isReplayAvailable(event.eventDateTime)  ? (
                      // Replay available: Show watch button
                      <Link to={`/dashboard/tickets/watch-event/past/${event._id}`}>
                        <Button
                          variant="outline"
                          className="w-full md:w-[167px] h-10 rounded-[10px] border border-solid border-[#1aaa65] bg-transparent p-2.5"
                        >
                          <span className="font-medium text-green-600">
                            Watch Replay
                          </span>
                        </Button>
                      </Link>
                    ) : (
                      // Replay expired: Show unavailable message and info
                      <div className="space-y-2">
                        <p className="text-red-600 text-sm font-medium">Replay is not available</p>
                        {!isReplayAvailable(event.eventDateTime) && (<div className="flex items-center gap-2" >
                          <InfoIcon className="w-4 h-4 text-[#828b86]" />
                          <span className="font-normal text-[#828b86] text-xs tracking-[-0.24px]">
                            Replay expired after 30 days
                          </span>
                        </div>)}
                      </div>
                    )}
                    {isReplayAvailable(event.eventDateTime) && (
                      // Replay available: Show expiration warning
                      <div className="flex items-center gap-2 mt-2">
                        <InfoIcon className="w-5 h-5 text-[#828b86]" />
                        <span className="font-normal text-[#828b86] text-xs tracking-[-0.24px]">
                          Replay becomes unavailable after 30 days
                        </span>
                      </div>
                    )}
                    </div>}
                  </>
                )}
                
                {/* Live events: Live badge + Watch button */}
                {type === 'live' && (
                  <>
                    {/* Live indicator with pulsing dot */}
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-red-500 text-sm">LIVE NOW</span>
                    </div>
                    {/* Watch live button */}
                    <Link to={`/dashboard/tickets/watch-event/live/${event._id}`}>
                      <Button
                        variant="outline"
                        className="w-full md:w-[167px] h-10 rounded-[10px] border border-solid border-[#1aaa65] bg-transparent p-2.5"
                      >
                        <span className="font-medium text-green-600 cursor-pointer">
                          Watch Live Event
                        </span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};