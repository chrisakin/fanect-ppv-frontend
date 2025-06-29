import { StarIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface RatingChartProps {
  stats: any;
}

export const RatingChart = ({ stats }: RatingChartProps): JSX.Element => {
  // Handle both old and new data structure
  const totalViewers = stats?.viewers?.total || 0;
  const replayViews = stats?.viewers?.replay || 0;
  const ratings = stats?.ratings || [];
  
  // Calculate viewer progress percentages
  const viewerData = [
    { 
      label: "Total Viewers", 
      value: totalViewers.toLocaleString(), 
      progress: totalViewers > 0 ? 80 : 0 // You might want to calculate this based on expected vs actual
    },
    { 
      label: "Watch Replay Views", 
      value: replayViews.toLocaleString(), 
      progress: totalViewers > 0 ? (replayViews / totalViewers) * 100 : 0
    },
  ];

  // Calculate rating breakdown from ratings array
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRatings = 0;
  let totalRatingSum = 0;

  if (ratings && Array.isArray(ratings)) {
    ratings.forEach((rating: any) => {
      const ratingValue = rating.rating || rating.stars || 0;
      if (ratingValue >= 1 && ratingValue <= 5) {
        ratingBreakdown[ratingValue as keyof typeof ratingBreakdown]++;
        totalRatings++;
        totalRatingSum += ratingValue;
      }
    });
  }

  const averageRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;

  const ratingData = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: ratingBreakdown[stars as keyof typeof ratingBreakdown] || 0
  }));

  const hasData = totalViewers > 0 || totalRatings > 0;

  return (
    <Card className="flex items-start p-4 gap-6 dark:bg-[#04311a] rounded-[10px] shadow-shadow-shadow-xs lg:w-full">
      <div className="lg:flex items-start gap-6 relative flex-1 grow">
        <Card className="lg:w-[70%] flex-1 grow dark:bg-[#062013] p-4 flex flex-col gap-6 rounded-[10px]">
          <div className="inline-flex items-center gap-1.5">
            <div className="font-text-lg-semibold text-[#828b86] text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
              Viewers
            </div>
          </div>

          {hasData ? (
            <CardContent className="flex flex-col items-start gap-6 p-0 w-full">
              {viewerData.map((item, index) => (
                <div key={index} className="flex items-center gap-6 w-full">
                  <div className="flex flex-col items-start justify-center gap-1 w-full">
                    <div className="relative w-full h-[5px] dark:bg-[#04311a] bg-[#CFEFDF] rounded-[10px] overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-[#1aaa65]"
                        style={{ width: `${Math.min(item.progress, 100)}%` }}
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
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 w-full">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Viewer Data</h3>
                <p className="text-sm dark:text-[#828b86] text-gray-500">
                  Viewer statistics will appear after your event
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="lg:w-[30%] dark:bg-[#062013] p-4 flex flex-col gap-6 rounded-[10px]">
          <div className="inline-flex items-center gap-1.5">
            <div className="font-text-lg-semibold text-[#828b86] text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)] whitespace-nowrap [font-style:var(--text-lg-semibold-font-style)]">
              Rating ({averageRating.toFixed(1)}/5)
            </div>
          </div>

          {totalRatings > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-4 w-full">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium dark:text-[#828b86] text-gray-700 mb-1">No Ratings Yet</h3>
                <p className="text-xs dark:text-[#828b86] text-gray-500">
                  Ratings will appear after your event
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Card>
  );
};