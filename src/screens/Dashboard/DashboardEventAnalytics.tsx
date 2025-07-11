import { EarningsChart } from "@/components/charts/EarningsChart";
import { ViewersChart } from "@/components/charts/ViewersChart";
import { RatingChart } from "@/components/charts/RatingChart";
import { FeedbackChart } from "@/components/charts/FeedbackChart";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface EventStats {
  _id: string;
  name: string;
  earnings: {
    totalRevenue: number;
    totalTransactions: number;
    transactions: Array<{
      date: string;
      amount: number;
    }>;
  };
  viewers: {
    total: number;
    replay: number;
    peak: number;
  };
  ratings: {
    avg: number;
    count: number;
    breakdown: {
      [key: string]: number;
    };
  };
  chat: {
    count: number;
  };
  feedback: Array<{
    id: string;
    comment: string;
    rating: number;
    userName: string;
    createdAt: string;
  }>;
}

export const DashboardEventAnalytics = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    // Get current month correctly (getMonth() returns 0-11, so we need to add 1)
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Add 1 and pad with zero
    return `${year}-${month}`;
  });
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const { toast } = useToast();

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: 'Home',
      href: '/dashboard/home'
    },
    {
      label: 'Organise Events',
      href: '/dashboard/organise'
    },
    {
      label: 'Event Analytics',
      isCurrentPage: true
    }
  ];

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

  // Handle month change with proper formatting
  const handleMonthChange = (month: string) => {
    console.log('Month changed to:', month); // Debug log
    setSelectedMonth(month);
  };

  // Handle currency change
  const handleCurrencyChange = (currency: string) => {
    console.log('Currency changed to:', currency); // Debug log
    setSelectedCurrency(currency);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BreadcrumbNavigation items={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col gap-6">
        <BreadcrumbNavigation items={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg text-gray-500">No statistics available for this event</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col w-full mx-auto p-4 items-start gap-6">
        <BreadcrumbNavigation items={breadcrumbItems} />
        
        {/* Event Name */}
        <div className="w-full">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            {stats.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Event Analytics Dashboard
          </p>
        </div>
        
        <div className="w-full gap-6 md:gap-8 flex flex-col items-start justify-center relative">
          <EarningsChart 
            stats={stats}
            selectedMonth={selectedMonth}
            selectedCurrency={selectedCurrency}
            onMonthChange={handleMonthChange}
            onCurrencyChange={handleCurrencyChange}
          />
          {/* <ViewersChart stats={stats} /> */}
          <RatingChart stats={stats} />
          <FeedbackChart stats={stats} />
        </div>
      </div>
    </div>
  );
};