import { EarningsChart } from "@/components/charts/EarningsChart";
import { ViewersChart } from "@/components/charts/ViewersChart";
import { RatingChart } from "@/components/charts/RatingChart";
import { FeedbackChart } from "@/components/charts/FeedbackChart";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface EventStats {
  earnings: {
    totalRevenue: { [currency: string]: number };
    monthlyRevenue: { [currency: string]: { [month: string]: number } };
    transactions: Array<{
      date: string;
      amount: number;
      currency: string;
    }>;
  };
  viewers: {
    totalViewers: number;
    watchReplayViews: number;
    concurrentViewers: Array<{
      time: string;
      viewers: number;
    }>;
    dropOff: Array<{
      time: string;
      viewers: number;
    }>;
    peakViewers: {
      count: number;
      time: string;
    };
  };
  chat: {
    totalMessages: number;
    chatActivity: Array<{
      time: string;
      messages: number;
    }>;
  };
  ratings: {
    averageRating: number;
    totalRatings: number;
    ratingBreakdown: { [stars: number]: number };
  };
  feedback: Array<{
    id: string;
    comment: string;
    author: string;
    rating: number;
    createdAt: string;
  }>;
}

export const DashboardEventAnalytics = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month in YYYY-MM format
  );
  const [selectedCurrency, setSelectedCurrency] = useState<string>('NGN');
  const { toast } = useToast();

  const fetchEventStats = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`/events/stats/${id}`, {
        params: {
          month: selectedMonth,
          currency: selectedCurrency
        }
      });
      setStats(response.data);
    } catch (error: any) {
      console.error('Error fetching event stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to fetch event statistics",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventStats();
  }, [id, selectedMonth, selectedCurrency]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-500">No statistics available for this event</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col w-full mx-auto p-4 items-start gap-6">
        <div className="w-full gap-6 md:gap-8 flex flex-col items-start justify-center relative">
          <EarningsChart 
            stats={stats}
            selectedMonth={selectedMonth}
            selectedCurrency={selectedCurrency}
            onMonthChange={setSelectedMonth}
            onCurrencyChange={setSelectedCurrency}
          />
          <ViewersChart stats={stats} />
          <RatingChart stats={stats} />
          <FeedbackChart stats={stats} />
        </div>
      </div>
    </div>
  );
};