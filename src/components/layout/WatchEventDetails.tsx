import { Card, CardContent } from "../../components/ui/card";
import { Event } from "@/store/eventStore";

/**
 * Props for WatchEventDetails component
 * @interface WatchEventDetailsProps
 * @property {Event} event - Event object with name and description
 */
interface WatchEventDetailsProps {
  event: Event;
}

/**
 * WatchEventDetails Component - Event information display during streaming
 * 
 * Displays:
 * - Event title with responsive font sizes (text-3xl → text-5xl)
 * - Event description with preserved line breaks
 * - Follow button (commented out)
 * 
 * Features:
 * - Borderless card container
 * - Dark mode text color support
 * - Responsive layout for mobile/tablet/desktop
 * - Typography system using CSS variables
 * 
 * @param {WatchEventDetailsProps} props - Component props
 * @returns {JSX.Element} Event details card
 */
export const WatchEventDetails = ({ event }: WatchEventDetailsProps): JSX.Element => {
  return (
    // Borderless card container
    <Card className="border-none shadow-none w-full">
      <CardContent className="flex flex-col items-start gap-3 p-0 w-full">
        {/* Main content section */}
        <div className="flex flex-col items-start gap-4 w-full">
          {/* Title and follow button section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
            {/* Event title - Responsive font sizes */}
            {/* Mobile: text-3xl, Tablet: text-4xl, Desktop: text-5xl */}
            <h1 className="font-display-lg-bold font-[number:var(--display-lg-semibold-font-weight)] dark:!text-gray-400 !text-[#000000] text-3xl md:text-4xl lg:text-5xl tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)] [font-style:var(--display-lg-semibold-font-style)]">
              {event.name}
            </h1>

            {/* Follow button - Currently commented out */}
            {/* <Button className="h-10 bg-green-600 text-gray-50 rounded-[10px] border border-solid border-[#1aaa65] hover:bg-green-700 w-full sm:w-auto">
              <span className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-lg tracking-[-0.36px] leading-7">
                Follow
              </span>
            </Button> */}
          </div>
        </div>

        {/* Event description section */}
        <div className="flex flex-col items-start gap-2.5 w-full">
          <div className="flex flex-col items-start gap-[18px]">
            {/* Event description - Preserves line breaks */}
            <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-gray-400 text-base md:text-lg text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)] whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};