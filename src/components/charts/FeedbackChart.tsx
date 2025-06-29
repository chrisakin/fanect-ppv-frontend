import { StarIcon } from "lucide-react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";

interface FeedbackChartProps {
  stats: any;
}

export const FeedbackChart = ({ stats }: FeedbackChartProps): JSX.Element => {
  // Use feedback data from stats - handle both old and new structure
  const feedbackData = stats?.feedback || [];

  const hasFeedback = feedbackData && feedbackData.length > 0;

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

            {hasFeedback ? (
              <ScrollArea className="w-full flex-1 overflow-x-auto">
                <div className="flex items-start gap-4 pb-4">
                  {feedbackData.map((feedback: any, index: number) => (
                    <Card
                      key={feedback.id || index}
                      className="w-[339px] h-[104px] flex-shrink-0 dark:bg-[#062013] bg-white border border-solid dark:border-[#1aaa654c] border-gray-200 rounded-[10px]"
                    >
                      <CardContent className="p-4 flex flex-col gap-2.5 h-full">
                        <div className="flex flex-col items-start justify-center gap-[5px]">
                          <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-700 text-sm tracking-[-0.28px] leading-5 line-clamp-2">
                            "{feedback.comment || feedback.message || 'Great event!'}"
                          </div>
                          <div className="[font-family:'Sofia_Pro-MediumItalic',Helvetica] italic font-medium dark:text-[#828b86] text-gray-600 text-sm tracking-[0.01px] leading-5">
                            - {feedback.author || feedback.user || 'Anonymous'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <StarIcon
                              key={starIndex}
                              size={12}
                              className={
                                starIndex < (feedback.rating || feedback.stars || 5)
                                  ? "fill-[#CDA61B] text-[#CDA61B]"
                                  : "text-[#828b86]"
                              }
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="h-2" />
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Feedback Yet</h3>
                  <p className="text-sm dark:text-[#828b86] text-gray-500">
                    Feedback from viewers will appear here after your event
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </CardContent>
      
      {hasFeedback && (
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