import { EarningsChart } from "@/components/charts/EarningsChart";
import { ViewersChart } from "@/components/charts/ViewersChart";
import { RatingChart } from "@/components/charts/RatingChart";
import { FeedbackChart } from "@/components/charts/FeedbackChart";

export const DashboardEventAnalytics = (): JSX.Element => {

  return (
    <div className={`min-h-screen w-full`}>
      <div className="flex flex-col w-full  mx-auto p-4 items-start gap-6">

        <div className="w-full gap-6 md:gap-8 flex flex-col items-start justify-center relative">
          <EarningsChart />
          <ViewersChart />
          <RatingChart/>
          <FeedbackChart />
        </div>
      </div>
    </div>
  );
};