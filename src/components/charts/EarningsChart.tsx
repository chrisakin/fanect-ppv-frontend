import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const transactions = [
  { date: "03 -Oct - 2024", amount: "NGN 45,000" },
  { date: "03 -Oct - 2024", amount: "NGN 45,000" },
  { date: "03 -Oct - 2024", amount: "NGN 45,000" },
  { date: "03 -Oct - 2024", amount: "NGN 45,000" },
  { date: "03 -Oct - 2024", amount: "NGN 45,000" },
];

const dropOffData = [
  { time: '6pm', viewers: 100 },
  { time: '9pm', viewers: 1500 },
  { time: '12am', viewers: 2200 },
  { time: '3am', viewers: 1800 },
  { time: '6am', viewers: 1000 },
  { time: '9am', viewers: 500 },
  { time: '12pm', viewers: 200 },
  { time: '3pm', viewers: 50 },
];

export const EarningsChart = (): JSX.Element => {
    const textColor = 'dark:#828b86 #333333';
    const chartColor = 'dark:#1aaa65 #22c55e';
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {/* Earnings Card */}
      <Card className={`flex-1 min-w-[300px] dark:bg-[#04311a] bg-gray-50 p-4 rounded-[10px]`}>
        <CardContent className={`p-4 dark:bg-[#062013] bg-white rounded-[10px] h-full flex flex-col gap-6`}>
          <div className="flex items-center justify-between w-full">
            <div className="inline-flex items-center gap-1.5">
              <span className={`font-input-small-semi-bold dark:text-[#828b86] text-gray-700`}>
                Earnings
              </span>
            </div>

            <div className={`inline-flex items-center justify-center gap-2 px-3 py-2.5 dark:bg-[#062013] border-[#2e483a] bg-gray-50 border-gray-200 rounded-lg border border-solid shadow-drop-shadow-sm`}>
              <CalendarIcon className={`w-3.5 h-3.5 dark:text-[#828b86] text-gray-600`} />
              <span className={`font-input-medium-semi-bold dark:text-[#828b86] text-gray-700 text-center whitespace-nowrap`}>
                Oct 2024
              </span>
              <ChevronDownIcon className={`w-3.5 h-3.5 dark:text-[#828b86] text-gray-600`} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 p-2.5 w-full">
            <div className="flex flex-col items-center gap-[5px]">
              <div className={`[font-family:'Sofia_Pro-Medium',Helvetica] text-3xl tracking-[0.03px] font-medium dark:text-[#828b86] text-gray-900 leading-5 text-ellipsis`}>
                NGN 5,897,986
              </div>
              <div className={`mt-2 [font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-sm tracking-[-0.28px] leading-5 dark:text-[#828b86] text-gray-600 whitespace-nowrap`}>
                Total Revenue
              </div>
            </div>

            <Button className={`h-[26px] w-[138px] dark:bg-green-600 bg-green-500 rounded hover:bg-green-700`}>
              <span className="[font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-white text-xs tracking-[-0.24px]">
                Withdraw Funds
              </span>
            </Button>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between w-full">
                <div className={`[font-family:'Sofia_Pro-Regular',Helvetica] font-normal dark:text-[#828b86] text-gray-600 text-sm tracking-[-0.28px] leading-5 whitespace-nowrap`}>
                  {transaction.date}
                </div>
                <div className={`[font-family:'Sofia_Pro-Medium',Helvetica] font-medium dark:text-[#828b86] text-gray-700 text-sm tracking-[0.01px] leading-5 whitespace-nowrap`}>
                  {transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop Off Chart Card */}
      <Card className={`flex-1 min-w-[300px] dark:bg-[#04311a] bg-gray-50 p-4 rounded-lg`}>
        <CardContent className={`p-4 dark:bg-[#062013] bg-white rounded-lg h-full flex flex-col gap-2.5`}>
          <div className="flex items-center px-5 py-2.5 w-full">
            <div className="inline-flex items-center gap-1.5">
              <span className={`font-text-lg-semibold dark:text-[#828b86] text-gray-700 whitespace-nowrap`}>
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
            <div className={`flex items-center justify-center gap-2.5 px-4 py-2.5 dark:bg-[#062013] border-[#828b86] bg-white border-gray-200 rounded-[100px] border border-solid`}>
              <div className="w-1.5 h-1.5 bg-[#ff8642] rounded-[3px]" />
              <div className={`[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-xs tracking-[-0.24px] leading-4 dark:text-[#828b86] text-gray-600 whitespace-nowrap`}>
                At 00:40: Lost approximately 150 viewers.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};