import { Card, CardContent } from "../../components/ui/card";
import { Event } from "@/store/eventStore";

interface WatchEventDetailsProps {
  event: Event;
}

export const WatchEventDetails = ({ event }: WatchEventDetailsProps): JSX.Element => {
  return (
    <Card className="border-none shadow-none w-full">
      <CardContent className="flex flex-col items-start gap-3 p-0 w-full">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
            <h1 className="font-display-lg-bold font-[number:var(--display-lg-semibold-font-weight)] text-gray-400 text-3xl md:text-4xl lg:text-5xl tracking-[var(--display-lg-semibold-letter-spacing)] leading-[var(--display-lg-semibold-line-height)] [font-style:var(--display-lg-semibold-font-style)]">
              {event.name}
            </h1>

            {/* <Button className="h-10 bg-green-600 text-gray-50 rounded-[10px] border border-solid border-[#1aaa65] hover:bg-green-700 w-full sm:w-auto">
              <span className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-lg tracking-[-0.36px] leading-7">
                Follow
              </span>
            </Button> */}
          </div>
        </div>

        <div className="flex flex-col items-start gap-2.5 w-full">
          <div className="flex flex-col items-start gap-[18px]">
            <p className="font-text-lg-regular font-[number:var(--text-lg-regular-font-weight)] text-gray-400 text-base md:text-lg text-[length:var(--text-lg-regular-font-size)] tracking-[var(--text-lg-regular-letter-spacing)] leading-[var(--text-lg-regular-line-height)] [font-style:var(--text-lg-regular-font-style)]">
              {event.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};