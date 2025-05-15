import { InfoIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../ui/button";

interface Event {
    id: string;
    title: string;
    date: string;
    image: string;
    countdown: string;
  }
  
  interface EventCardsSectionProps {
    events: Event[];
  }

export const StreampassCardsSection = ( { events }: EventCardsSectionProps ) => {
    return (
        <div>
            {/* Event Cards */}
          <div className="grid grid-cols-2 w-full items-start gap-8 flex-wrap">
            {events.map((event) => (
              <Card
                key={event.id}
                className="w-full h-[272px] bg-[#062013] rounded-lg overflow-hidden border border-solid dark:border-[#2e483a] relative flex"
              >
                <img
                  className="w-[246px] h-[270px] object-cover"
                  alt="Event Image"
                  src={event.image}
                />
                <CardContent className="flex flex-col h-full justify-between py-[35px] pl-6 pr-0 flex-1">
                  <div className="flex flex-col w-[250px] items-start">
                    <h3 className="self-stretch font-display-sm-medium font-[number:var(--display-sm-medium-font-weight)] text-[#828b86] text-[length:var(--display-sm-medium-font-size)] tracking-[var(--display-sm-medium-letter-spacing)] leading-[var(--display-sm-medium-line-height)] [font-style:var(--display-sm-medium-font-style)]">
                      {event.title}
                    </h3>
                    <p className="self-stretch -mt-0.5 font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[#828b86] text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
                      {event.date}
                    </p>
                  </div>
                  <div className="flex w-[250px] h-[54px] items-center justify-center px-2.5 py-0 bg-[#0b331f]">
                    <div className="flex-1 font-text-lg-medium font-[number:var(--text-lg-medium-font-weight)] text-[#baebd3] text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)] [font-style:var(--text-lg-medium-font-style)]">
                      {event.countdown}
                    </div>
                  </div>
                   {/* Time Indicator */}
                   <p className="font-text-lg-medium text-red-600 text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                    16 days ago
                    </p>
                    <Button
                        variant="outline"
                        className="w-[167px] h-10 rounded-[10px] border border-solid border-[#1aaa65] bg-transparent p-2.5"
                         >
                        <span className="font-text-lg-medium text-green-600 text-[length:var(--text-lg-medium-font-size)] tracking-[var(--text-lg-medium-letter-spacing)] leading-[var(--text-lg-medium-line-height)]">
                            Watch Replay
                        </span>
                    </Button>
                    <div className="flex items-center gap-2">
                    <InfoIcon className="w-5 h-5 text-[#828b86]" />
                    <span className="font-normal text-[#828b86] text-xs tracking-[-0.24px]">
                        Replay becomes unavailable after 30 days
                    </span>
            </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
    )}