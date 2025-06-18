import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

interface EarningsChartProps {
  stats: any;
  selectedMonth: string;
  selectedCurrency: string;
  onMonthChange: (month: string) => void;
  onCurrencyChange: (currency: string) => void;
}

export const EarningsChart = ({ 
  stats, 
  selectedMonth, 
  selectedCurrency, 
  onMonthChange, 
  onCurrencyChange 
}: EarningsChartProps): JSX.Element => {
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // Generate month options for the last 12 months
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
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

  // Get available currencies from stats
  const availableCurrencies = Object.keys(stats.earnings.totalRevenue || {});
  
  // Get total revenue for selected currency and month
  const totalRevenue = stats.earnings.monthlyRevenue[selectedCurrency]?.[selectedMonth] || 0;
  
  // Get recent transactions for selected currency
  const recentTransactions = stats.earnings.transactions
    .filter((t: any) => t.currency === selectedCurrency)
    .slice(0, 5);

  // Prepare drop-off chart data
  const dropOffData = stats.viewers.dropOff || [];

  const textColor = 'dark:#828b86 #333333';
  const chartColor = 'dark:#1aaa65 #22c55e';

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
                <SelectTrigger className="w-20 h-8 text-xs dark:bg-[#062013] border-[#2e483a] bg-gray-50 border-gray-200">
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
                <SelectTrigger className="w-32 h-8 text-xs dark:bg-[#062013] border-[#2e483a] bg-gray-50 border-gray-200">
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

          <div className="flex flex-col items-center justify-center gap-3 p-2.5 w-full">
            <div className="flex flex-col items-center gap-[5px]">
              <div className="[font-family:'Sofia_Pro-Medium',Helvetica] text-3xl tracking-[0.03px] font-medium dark:text-[#828b86] text-gray-900 leading-5 text-ellipsis">
                {formatCurrency(totalRevenue, selectedCurrency)}
              </div>
              <div className="mt-2 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                Total Revenue ({currentMonthLabel})
              </div>
            </div>

            <Button className="h-[26px] w-[138px] dark:bg-green-600 bg-green-500 rounded hover:bg-green-700">
              <span className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-white text-xs tracking-[-0.24px]">
                Withdraw Funds
              </span>
            </Button>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between w-full">
                  <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-600 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium dark:text-[#828b86] text-gray-700 text-sm tracking-[0.01px] leading-5 whitespace-nowrap">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm">
                No transactions for this period
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Drop Off Chart Card */}
      <Card className="flex-1 min-w-[300px] dark:bg-[#04311a] bg-gray-50 p-4 rounded-lg">
        <CardContent className="p-4 dark:bg-[#062013] bg-white rounded-lg h-full flex flex-col gap-2.5">
          <div className="flex items-center px-5 py-2.5 w-full">
            <div className="inline-flex items-center gap-1.5">
              <span className="font-text-lg-semibold dark:text-[#828b86] text-gray-700 whitespace-nowrap">
                Drop Off
              </span>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dropOffData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke={textColor}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <YAxis 
                  stroke={textColor}
                  tick={{ fill: textColor, fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'dark:#062013 #fff',
                    border: `1px solid dark:#2e483a #e5e7eb`,
                    borderRadius: '8px',
                    color: textColor,
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="viewers" 
                  stroke={chartColor}
                  fillOpacity={1}
                  fill="url(#colorViewers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex h-16 items-end gap-4 px-5 py-0 w-full">
            <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 dark:bg-[#062013] border-[#828b86] bg-white border-gray-200 rounded-[100px] border border-solid">
              <div className="w-1.5 h-1.5 bg-[#ff8642] rounded-[3px]" />
              <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-xs tracking-[-0.24px] leading-4 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                {dropOffData.length > 0 ? 
                  `Lowest point: ${Math.min(...dropOffData.map((d: { viewers: any; }) => d.viewers))} viewers` :
                  'No drop-off data available'
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};