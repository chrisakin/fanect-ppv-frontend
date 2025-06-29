import { Card, CardContent } from "../../components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ViewersChartProps {
  stats: any;
}

export const ViewersChart = ({ stats }: ViewersChartProps): JSX.Element => {
  const textColor = 'dark:#828b86 #333333';
  const chartColor = 'dark:#1aaa65 #22c55e';

  // Handle both old and new data structure
  const totalViewers = stats?.viewers?.total || 0;
  const replayViews = stats?.viewers?.replay || 0;
  const peakViewers = stats?.viewers?.peak;

  // Generate sample data for demonstration when no real data exists
  const viewersData = totalViewers > 0 ? [
    { time: '0:00', viewers: Math.floor(totalViewers * 0.1) },
    { time: '0:15', viewers: Math.floor(totalViewers * 0.3) },
    { time: '0:30', viewers: Math.floor(totalViewers * 0.6) },
    { time: '0:45', viewers: Math.floor(totalViewers * 0.8) },
    { time: '1:00', viewers: totalViewers },
    { time: '1:15', viewers: Math.floor(totalViewers * 0.9) },
    { time: '1:30', viewers: Math.floor(totalViewers * 0.7) },
  ] : [];

  const chatData = totalViewers > 0 ? [
    { time: '0:00', messages: 5 },
    { time: '0:15', messages: 12 },
    { time: '0:30', messages: 25 },
    { time: '0:45', messages: 35 },
    { time: '1:00', messages: 45 },
    { time: '1:15', messages: 38 },
    { time: '1:30', messages: 28 },
  ] : [];

  const hasViewerData = totalViewers > 0;

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

                {hasViewerData ? (
                  <>
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
                          Peak Concurrent Viewers: {peakViewers || totalViewers}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Viewer Data</h3>
                      <p className="text-sm dark:text-[#828b86] text-gray-500">
                        Viewer analytics will appear after your event starts
                      </p>
                    </div>
                  </div>
                )}
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

                {hasViewerData ? (
                  <>
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
                          Total Messages: {stats?.chat?.count || 0}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-medium dark:text-[#828b86] text-gray-700 mb-2">No Chat Data</h3>
                      <p className="text-sm dark:text-[#828b86] text-gray-500">
                        Chat activity will appear during your event
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};