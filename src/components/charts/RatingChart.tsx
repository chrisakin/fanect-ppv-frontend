import { StarIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const RatingChart = (): JSX.Element => {
  // Viewer data for mapping
  const viewerData = [
    { label: "Total Viewers", value: "2,341", progress: 80 },
    { label: "Watch Replay Views", value: "879", progress: 50 },
  ];

  // Rating data for mapping
  const ratingData = [
    { stars: 5, count: "849" },
    { stars: 4, count: "849" },
    { stars: 3, count: "849" },
    { stars: 2, count: "849" },
    { stars: 1, count: "849" },
  ];

  return (
    <Card className="flex items-start p-4 gap-6 dark:bg-[#04311a] rounded-[10px] shadow-shadow-shadow-xs lg:w-full">
      <div className="lg:flex items-start gap-6 relative flex-1 grow">
        <Card className="lg:w-[70%] flex-1 grow dark:bg-[#062013] p-4 flex flex-col gap-6 rounded-[10px]">
          <div className="inline-flex items-center gap-1.5">
            <div className="font-text-lg-semibold text-[#828b86] text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
              Viewers
            </div>
          </div>

          <CardContent className="flex flex-col items-start gap-6 p-0 w-full">
            {viewerData.map((item, index) => (
              <div key={index} className="flex items-center gap-6 w-full">
                <div className="flex flex-col items-start justify-center gap-1 w-full">
                  <div className="relative w-full h-[5px] dark:bg-[#04311a] bg-[#CFEFDF] rounded-[10px] overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-[#1aaa65]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-[#828b86] text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
                      {item.label}
                    </div>

                    <div className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-[#828b86] text-sm tracking-[0.01px] leading-5 whitespace-nowrap">
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:w-[30%] dark:bg-[#062013] p-4 flex flex-col gap-6 rounded-[10px]">
          <div className="inline-flex items-center gap-1.5">
            <div className="font-text-lg-semibold text-[#828b86] text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
              Rating
            </div>
          </div>

          <CardContent className="p-0 w-full">
            <div className="flex items-start gap-6 w-full">
              <div className="flex flex-col w-[234px] items-start gap-2.5">
                {ratingData.map((rating, index) => (
                  <div key={index} className="flex items-center gap-6 w-full">
                    <div className="w-[140px] flex flex-col items-start justify-center gap-1">
                      <div className="flex items-center justify-between w-full">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`w-6 h-6 ${star <= rating.stars ? "fill-[#CDA61B] text-[#CDA61B]" : "fill-none text-[#828b86]"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="[font-family:'Sofia_Pro-Medium',Helvetica] text-sm tracking-[0.01px] whitespace-nowrap font-medium text-[#828b86] leading-5">
                      ({rating.count})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
};
