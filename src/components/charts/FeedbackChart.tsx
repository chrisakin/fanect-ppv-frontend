import { StarIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";

interface FeedbackChartProps {
  stats: any;
}

export const FeedbackChart = ({ stats }: FeedbackChartProps): JSX.Element => {
  // Use feedback data from stats
  const feedbackData = stats.feedback || [];

  return (
    <Card className="w-full h-60 dark:bg-[#04311a] bg-gray-50 overflow-hidden shadow-shadow-shadow-xs rounded-[10px] p-4 relative">
      <CardContent className="p-0 h-full">
        <div className="h-full flex items-start gap-6 overflow-hidden">
          <Card className="flex-1 h-full dark:bg-[#062013] bg-white rounded-[10px] p-4 flex flex-col gap-6">
            <div className="inline-flex items-center gap-1.5">
              <div className="font-text-lg-semibold dark:text-[#828b86] text-gray-700 text-[length:var(--text-lg-semibold-font-size)] tracking-[var(--text-lg-semibold-letter-spacing)] leading-[var(--text-lg-semibold-line-height)]">
                Feedback
              </div>
            </div>

            <ScrollArea className="w-full flex-1 overflow-x-auto">
              <div className="flex items-start gap-4 pb-4">
                {feedbackData.length > 0 ? (
                  feedbackData.map((feedback: any) => (
                    <Card
                      key={feedback.id}
                      className="w-[339px] h-[104px] flex-shrink-0 dark:bg-[#062013] bg-white border border-solid dark:border-[#1aaa654c] border-gray-200 rounded-[10px]"
                    >
                      <CardContent className="p-4 flex flex-col gap-2.5 h-full">
                        <div className="flex flex-col items-start justify-center gap-[5px]">
                          <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-700 text-sm tracking-[-0.28px] leading-5 line-clamp-2">
                            "{feedback.comment}"
                          </div>
                          <div className="[font-family:'Sofia_Pro-MediumItalic',Helvetica] italic font-medium dark:text-[#828b86] text-gray-600 text-sm tracking-[0.01px] leading-5">
                            - {feedback.author}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              size={12}
                              className={
                                index < feedback.rating
                                  ? "fill-[#CDA61B] text-[#CDA61B]"
                                  : "text-[#828b86]"
                              }
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No feedback available yet
                    </p>
                  </div>
                )}
              </div>
              <ScrollBar orientation="horizontal" className="h-2" />
            </ScrollArea>
          </Card>
        </div>
      </CardContent>
      
      {feedbackData.length > 0 && (
        <Button
          className="absolute right-8 top-1/2 -translate-y-1/2 p-2 dark:bg-[#04311a] dark:hover:bg-[#054525] bg-green-600 hover:bg-green-700 rounded-full shadow-lg"
          size="icon"
          variant="default"
        >
          <ArrowRightIcon className="w-4 h-4 text-white" />
        </Button>
      )}
    </Card>
  );
};