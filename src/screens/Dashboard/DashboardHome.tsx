import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { PaginationIndex } from "@/components/utils/Pagination";
import { EmptyState } from "@/components/layout/EmptyState";
import { HeroSection } from "@/components/layout/HeroSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardHome = (): JSX.Element => {
  // Data for the toggle group
  const eventTypes = [
    { id: "upcoming", label: "Upcoming" },
    { id: "live", label: "Live", active: true },
  ];
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
    <div>
      <div>
        <HeroSection />
      </div>
      <div className="flex-col items-start gap-20 mt-7">
     <ToggleGroup
            type="single"
            defaultValue="live"
            className="flex w-[265px] items-center gap-[11px] px-2.5 py-1 bg-[#E8FFF4] dark:bg-[#062013] rounded-[40px]"
          >
            {eventTypes.map((type) => (
              <ToggleGroupItem
                key={type.id}
                value={type.id}
                className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
                  type.active ? "bg-[#1AAA65]" : "bg-[#E8FFF4] dark:bg-[#062013]"
                }`}
              >
                <span
                  className={`font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] whitespace-nowrap [font-style:var(--text-lg-regular-font-style)] ${
                    type.active ? "text-gray-50" : "dark:text-[#828B86] text-[#44D48F]"
                  }`}
                >
                  {type.label}
                </span>
              </ToggleGroupItem>
            ))}
     </ToggleGroup>
     <Alert className="relative w-full h-[72px] bg-green-900 rounded overflow-hidden p-0 mt-5">
      <div className="w-full flex items-start gap-2.5 p-4">
        <div className="flex items-center gap-2.5 w-full">
          <InfoIcon className="w-7 h-7 text-gray-100" />

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-[15px]">
              <AlertDescription className="text-gray-100 font-text-sm-regular text-[length:var(--text-sm-regular-font-size)] tracking-[var(--text-sm-regular-letter-spacing)] leading-[var(--text-sm-regular-line-height)] [font-style:var(--text-sm-regular-font-style)]">
                Fido live in lagos live streaming has begun
              </AlertDescription>

              <Button
                variant="outline"
                className="h-9 bg-gray-50 rounded text-green-600 [font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-base tracking-[-0.32px]"
              >
                Start Streaming
              </Button>
            </div>

            <XCircleIcon className="w-[18px] h-[18px] text-gray-100" />
          </div>
        </div>
      </div>
    </Alert>
            <div className="mt-5">
              {events.length > 0 ? (
                <div>
                  <EventCardsSection events={events} />
                  <PaginationIndex />
                </div>
              ) : (<div>
                <EmptyState primaryText={'No live event yet'} secondaryText={'When an event is ongoing live, you will see it here'}/>
              </div>)}
            </div>
    </div>
    </div>
  );
};