import { Card, CardContent } from "../../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

/**
 * Props for the EarningsChart component.
 *
 * stats: object containing earnings summary and transaction list. Expected shape (commonly):
 *   {
 *     earnings: {
 *       totalRevenue: number,
 *       totalTransactions: number,
 *       transactions: Array<{ date: string, amount: number }>
 *     }
 *   }
 *
 * selectedMonth: currently selected month key in the format YYYY-MM.
 * selectedCurrency: ISO currency code (e.g. 'USD', 'NGN') used to format amounts.
 * onMonthChange: callback invoked when the month selector changes (receives month key).
 * onCurrencyChange: callback invoked when the currency selector changes (receives currency code).
 */
interface EarningsChartProps {
  stats: any;
  selectedMonth: string;
  selectedCurrency: string;
  onMonthChange: (month: string) => void;
  onCurrencyChange: (currency: string) => void;
}

/**
 * EarningsChart
 *
 * This React component renders two main cards:
 *  - A summary card showing total revenue, total transactions and a short list of recent transactions.
 *  - A revenue-over-time chart (area chart) that visualizes daily revenue for the selected month.
 *
 * It accepts the `EarningsChartProps` described above. Internally it derives month options, groups
 * transactions by date, and formats currency amounts for display. If there is no earnings data, it
 * displays friendly empty-state UI instead of charts.
 *
 * Returns: JSX.Element
 */
export const EarningsChart = ({ 
  stats, 
  selectedMonth, 
  selectedCurrency, 
  onMonthChange, 
  onCurrencyChange 
}: EarningsChartProps): JSX.Element => {

  /**
   * generateMonthOptions
   *
   * Generates an array of month option objects for the past 12 months. Each option has:
   *  - key: string in YYYY-MM format (used as the Select value)
   *  - label: human-readable month label (e.g. "November 2025")
   *
   * Returns: Array<{ key: string, label: string }>
   */
  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() - i;
      const date = new Date(year, month, 1);
      
      // Format as YYYY-MM
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
      months.push({ key: monthKey, label: monthLabel });
    }
    
    return months;
  };

  const monthOptions = generateMonthOptions();
  const currentMonthLabel = monthOptions.find(m => m.key === selectedMonth)?.label || 'Select Month';

  // Available currencies - default to common currencies if not provided
  const availableCurrencies = ['USD', 'NGN', 'EUR', 'GBP', 'CAD', 'GHS'];
  
  // Get earnings data from stats
  const totalRevenue = stats?.earnings?.totalRevenue || 0;
  const totalTransactions = stats?.earnings?.totalTransactions || 0;
  const transactions = stats?.earnings?.transactions || [];
  
  /**
   * processTransactionsForChart
   *
   * Reads the `transactions` array from the `stats` prop and groups items by `date`.
   * For each date it sums the amounts and counts the number of transactions. The result
   * is returned as an array sorted by date (ascending), which is the shape required
   * by the Recharts AreaChart data prop.
   *
   * Returns: Array<{ date: string, amount: number, count: number }>
   */
  // Process transactions for chart display
  const processTransactionsForChart = () => {
    if (!transactions || transactions.length === 0) return [];
    
    // Group transactions by date and sum amounts
    const groupedByDate = transactions.reduce((acc: any, transaction: any) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 };
      }
      acc[date].amount += transaction.amount;
      acc[date].count += 1;
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const chartData = processTransactionsForChart();

  const textColor = '#828b86'; // Use a consistent color that works in both modes
  const chartColor = 'dark:#1aaa65 #22c55e';

  /**
   * formatCurrency
   *
   * Formats a numeric amount to a localized currency string using Intl.NumberFormat.
   * It uses 'en-US' locale for formatting and accepts an ISO currency code.
   *
   * Example: formatCurrency(1200, 'USD') -> "$1,200"
   *
   * Returns: string
   */
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if there's any earnings data
  const hasEarningsData = totalRevenue > 0 || transactions.length > 0;

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {/* Earnings Card */}
      <Card className="flex-1 min-w-[300px] dark:bg-[#04311a] bg-gray-50 p-4 rounded-[10px]">
        <CardContent className="p-4 dark:bg-[#062013] bg-white rounded-[10px] h-full flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <div className="inline-flex items-center gap-1.5">
              <span className="font-input-small-semi-bold dark:text-[#828b86] text-gray-700">
                Earnings
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Currency Selector */}
              <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
                <SelectTrigger className="md:w-32 w-16 h-8 text-xs dark:bg-[#062013] border-[#2e483a] bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Month Selector */}
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="md:w-36 w-28 h-8 text-xs dark:bg-[#062013] border-[#2e483a] bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month.key} value={month.key}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasEarningsData ? (
            <>
              <div className="flex flex-col items-center justify-center gap-3 p-2.5 w-full">
                <div className="flex flex-col items-center gap-[5px]">
                  <div className="[font-family:'Sofia_Pro-Medium',Helvetica] text-3xl tracking-[0.03px] font-medium dark:text-[#828b86] text-gray-900 leading-5 text-ellipsis">
                    {formatCurrency(totalRevenue, selectedCurrency)}
                  </div>
                  <div className="mt-2 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                    Total Revenue ({currentMonthLabel})
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-600 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
                    Total Transactions
                  </div>
                  <div className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium dark:text-[#828b86] text-gray-700 text-sm tracking-[0.01px] leading-5 whitespace-nowrap">
                    {totalTransactions}
                  </div>
                </div>

                {/* Transaction Breakdown */}
                {transactions.length > 0 && (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-600 text-sm tracking-[-0.28px] leading-5">
                      Recent Transactions
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {transactions.slice(0, 5).map((transaction: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="dark:text-[#828b86] text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          <span className="dark:text-[#828b86] text-gray-700 font-medium">
                            {formatCurrency(transaction.amount, selectedCurrency)}
                          </span>
                        </div>
                      ))}
                      {transactions.length > 5 && (
                        <div className="text-xs dark:text-[#828b86] text-gray-500 text-center pt-1">
                          +{transactions.length - 5} more transactions
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 w-full">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Earnings Yet</h3>
                <p className="text-sm dark:text-[#828b86] text-gray-500">
                  Earnings will appear here once your event generates revenue
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drop Off Chart Card */}
      <Card className="flex-1 min-w-[300px] dark:bg-[#04311a] bg-gray-50 p-4 rounded-lg">
        <CardContent className="p-4 dark:bg-[#062013] bg-white rounded-lg h-full flex flex-col gap-2.5">
          <div className="flex items-center px-5 py-2.5 w-full">
            <div className="inline-flex items-center gap-1.5">
              <span className="font-text-lg-semibold dark:text-[#828b86] text-gray-700 whitespace-nowrap">
                Revenue Over Time
              </span>
            </div>
          </div>

          {hasEarningsData && chartData.length > 0 ? (
            <>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke={textColor}
                      tick={{ fill: '#828b86', fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      stroke={textColor}
                      tick={{ fill: '#828b86', fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value, selectedCurrency)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--popover)',
                        border: `1px solid var(--border)`,
                        borderRadius: '8px',
                        color: 'var(--foreground)',
                      }}
                      formatter={(value: any) => [formatCurrency(value, selectedCurrency), 'Revenue']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke={chartColor}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex h-16 items-end gap-4 px-5 py-0 w-full">
                <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 dark:bg-[#062013] border-[#828b86] bg-white border-gray-200 rounded-[100px] border border-solid">
                  <div className="w-1.5 h-1.5 bg-[#ff8642] rounded-[3px]" />
                  <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-xs tracking-[-0.24px] leading-4 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                    Total transactions: {totalTransactions}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 w-full h-[300px]">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Revenue Data</h3>
                <p className="text-sm dark:text-[#828b86] text-gray-500">
                  Revenue analytics will appear after your event generates income
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};