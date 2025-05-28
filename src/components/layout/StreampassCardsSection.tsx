import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Event } from "@/store/eventStore";

interface EventCardsSectionProps {
  events: Event[];
  type: 'upcoming' | 'live' | 'past';
}

export const StreampassCardsSection = ({ events, type }: EventCardsSectionProps) => {
  // Store countdowns for each event
  const [countdowns, setCountdowns] = useState<{ [id: string]: string }>({});

  // Helper to calculate countdown string
  const getCountdown = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = eventDate.getTime() - now.getTime();
    if (diff <= 0) return "Event started";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
  };

  // Update countdowns every second for upcoming events
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

  // For past/live events, show how long ago
  const calculateTimeStatus = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    if (type === 'upcoming') {
      return countdowns[dateString] || getCountdown(dateString);
    } else {
      const diff = now.getTime() - eventDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `${days} days ago`;
    }
  };

  const isReplayAvailable = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - eventDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days <= 30;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <Card
          key={event._id}
          className="w-full dark:bg-[#062013] rounded-lg overflow-hidden border border-solid dark:border-[#2e483a] border-[#D5D7DA] relative flex flex-col"
        >
          <div className="flex flex-col md:flex-row flex-1">
            <img
              className="w-full md:w-[246px] h-[200px] md:h-[270px] object-cover"
              alt="Event Image"
              src={event.bannerUrl}
            />
            <CardContent className="flex flex-col h-full justify-between py-[35px] px-4 md:pl-6 md:pr-0 flex-1">
              <div className="flex flex-col w-full md:w-[250px] items-start">
                <h3 className="text-xl md:text-2xl font-medium dark:text-[#828b86] mb-2">
                  {event.name}
                </h3>
                <p className="text-base md:text-lg text-[#828b86]">
                  {new Date(event.eventDateTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {type == 'past' && (
                  <>
                    <p className="font-medium text-red-600">
                      {calculateTimeStatus(event.eventDateTime)}
                    </p>
                    {isReplayAvailable(event.eventDateTime) ? (
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
                      <p className="text-red-600">Replay no longer available</p>
                    )}
                    <div className="flex items-center gap-2">
                      <InfoIcon className="w-5 h-5 text-[#828b86]" />
                      <span className="font-normal text-[#828b86] text-xs tracking-[-0.24px]">
                        Replay becomes unavailable after 30 days
                      </span>
                    </div>
                  </>
                )}
              </div>
              {type == 'live' && (
                  <>
                    <Link to={`/dashboard/tickets/watch-event/live/${event._id}`}>
                        <Button
                          variant="outline"
                          className="w-full md:w-[167px] h-10 rounded-[10px] border border-solid border-[#1aaa65] bg-transparent p-2.5"
                        >
                          <span className="font-medium text-green-600">
                            Watch Live Event
                          </span>
                        </Button>
                      </Link>
                  </>
                )}
              {type === "upcoming" && (
            <div className="flex w-full h-[54px] items-center justify-center px-2.5 py-0 dark:bg-[#0b331f] bg-[#D5D7DA] mt-auto">
              <div className="flex-1 font-medium dark:text-[#baebd3] text-dark">
                {countdowns[event._id] || getCountdown(event.eventDateTime)}
              </div>
            </div>
          )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};