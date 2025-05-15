import { EmptyState } from "@/components/layout/EmptyState";
import { StreampassCardsSection } from "@/components/layout/StreampassCardsSection";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const DashboardTickets = () => {
  const events: any = [
    {
      id: 1,
      title: "Music Night",
      date: "Saturday, 26th December, 2025",
      countdown: "09d : 03h : 11m : 56s",
      image: "/image-6.png",
    },
    {
      id: 2,
      title: "Music Night",
      date: "Saturday, 26th December, 2025",
      countdown: "09d : 03h : 11m : 56s",
      image: "/image-6.png",
    },
  ];
  const eventTypes = [
    { id: "upcoming", label: "Upcoming" },
    { id: "Past", label: "Past", active: true },
  ];
  return (
    <div>
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Streampass</h1>
      <p className="text-gray-500 dark:text-gray-400">See the events you created and registered for</p>
     
    </div>
    <div>
       <div className="mt-10">
            {/* Events Section */}
            <div className="flex flex-col items-start gap-5 w-full mb-4">
          {/* Tabs */}
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

          
        </div>
    </div>
    <div className="mt-5">
      {events.length > 0 ? (
        <div>
          <StreampassCardsSection events={events} />
        </div>
      ): (
        <div>
      <EmptyState primaryText={'No streampass yet'} secondaryText={'When you purchase an event ticket, it will show up here'} hasButton={true} buttonText={'Buy Streampass'}/>
    </div>
      )}
    </div>
    </div>
    </div>
  );
};