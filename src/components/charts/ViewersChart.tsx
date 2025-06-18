import { Card, CardContent } from "../../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ViewersChartProps {
  stats: any;
}

export const ViewersChart = ({ stats }: ViewersChartProps): JSX.Element => {
  const textColor = 'dark:#828b86 #333333';
  const chartColor = 'dark:#1aaa65 #22c55e';

  const viewersData = stats.viewers.concurrentViewers || [];
  const chatData = stats.chat.chatActivity || [];

  return (
    <div className="lg:flex items-start gap-4 w-full">
      {/* Concurrent Viewers Card */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center gap-4">
        <Card className="w-full h-[495px] dark:bg-[#04311a] bg-gray-50 rounded-lg shadow-shadow-shadow-xs overflow-hidden">
          <CardContent className="p-4">
            <Card className="w-full h-[464px] dark:bg-[#062013] bg-white rounded-lg shadow-shadow-shadow-xs overflow-hidden">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center px-5 py-2.5 w-full">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="font-text-lg-semibold dark:text-[#828b86] text-gray-700 whitespace-nowrap">
                      Concurrent Viewers
                    </div>
                  </div>
                </div>

                <div className="w-full h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={viewersData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViewersConcurrent" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#colorViewersConcurrent)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex h-16 items-end gap-4 px-5 py-0 w-full mt-4">
                  <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 dark:bg-[#062013] border-[#828b86] bg-white border-gray-200 rounded-[100px] border border-solid">
                    <div className="w-1.5 h-1.5 bg-[#ff8642] rounded-[3px]" />
                    <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-xs tracking-[-0.24px] leading-4 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                      Peak Concurrent Viewers: {stats.viewers.peakViewers?.count || 0} at {stats.viewers.peakViewers?.time || 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Chat Activity Card */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center gap-4">
        <Card className="w-full h-[495px] dark:bg-[#04311a] bg-gray-50 rounded-lg shadow-shadow-shadow-xs overflow-hidden">
          <CardContent className="p-4">
            <Card className="w-full h-[464px] dark:bg-[#062013] bg-white rounded-lg shadow-shadow-shadow-xs overflow-hidden">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center px-5 py-2.5 w-full">
                  <div className="inline-flex items-center gap-1.5">
                    <div className="font-text-lg-semibold dark:text-[#828b86] text-gray-700 whitespace-nowrap">
                      Chat Activity
                    </div>
                  </div>
                </div>

                <div className="w-full h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chatData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
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
                        dataKey="messages" 
                        stroke={chartColor}
                        fillOpacity={1}
                        fill="url(#colorChat)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex h-16 items-end gap-4 px-5 py-0 w-full mt-4">
                  <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 dark:bg-[#062013] border-[#828b86] bg-white border-gray-200 rounded-[100px] border border-solid">
                    <div className="w-1.5 h-1.5 bg-[#ff8642] rounded-[3px]" />
                    <div className="[font-family:'Sofia_Pro-Regular',Helvetica] font-normal text-xs tracking-[-0.24px] leading-4 dark:text-[#828b86] text-gray-600 whitespace-nowrap">
                      Total Messages: {stats.chat.totalMessages || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};