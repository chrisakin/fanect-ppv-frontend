import { getUser } from "@/lib/auth";
import { Card, CardContent } from "../ui/card";
import { Event } from "@/store/eventStore";

type GiftFriendProps = {
  event: Event;
};

export const RegisteredCard = ({ event }: GiftFriendProps): JSX.Element => {
  return (
    <div className="w-full h-[593px] bg-[#d6ece1] rounded-[10px] overflow-hidden border border-dashed border-[#1aaa65]">
      <div className="w-[500px] gap-[31px] top-[53px] left-2 flex flex-col items-center relative">
        <h1 className="relative w-[452px] mt-[-1.00px] font-display-sm-semibold font-[number:var(--display-sm-semibold-font-weight)] text-gray-800 text-[length:var(--display-sm-semibold-font-size)] text-center tracking-[var(--display-sm-semibold-letter-spacing)] leading-[var(--display-sm-semibold-line-height)] [font-style:var(--display-sm-semibold-font-style)]">
          Hi {getUser()?.firstName}, you&apos;ve successfully registered 🎉🎉
        </h1>

        <div className="gap-[30px] self-stretch w-full flex-[0_0_auto] flex flex-col items-center relative">
          <div className="relative w-[300px] h-[479px] bg-[url(/subtract.svg)] bg-[100%_100%]">
            <Card className="flex w-[262px] h-[305px] items-center p-3.5 absolute top-[19px] left-[19px] bg-[#031d211a] rounded-2xl border border-solid border-[#1aaa65] backdrop-blur-[2px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(2px)_brightness(100%)]">
              <CardContent className="flex flex-col w-[232px] items-center gap-5 relative p-0">
                <div className="flex flex-col w-[175px] items-center relative flex-[0_0_auto]">
                  <div className="relative w-[280px] mt-[-1.00px] ml-[-52.50px] mr-[-52.50px] [font-family:'Road_Rage',Helvetica] font-normal text-white text-[34px] text-center tracking-[0] leading-[34px]">
                   {event?.name}
                  </div>

                  <div className="inline-flex flex-col items-center justify-center gap-1.5 p-1 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-white text-xs tracking-[-0.24px] leading-[normal] whitespace-nowrap">
                      📍 Victoria Island, Lagos
                    </div>

                    <div className="relative w-fit [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-white text-xs tracking-[-0.24px] leading-[normal] whitespace-nowrap">
                      📅 April 17, 2025 | 9:00 PM
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
