import { useEffect, useState } from "react";
import { BellIcon, CheckIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNotificationStore } from "../../store/notificationStore";
import { PaginationIndex } from "../../components/utils/Pagination";
import { EmptyState } from "../../components/layout/EmptyState";
import { useToast } from "../../components/ui/use-toast";

export const DashboardNotifications = () => {
  const { 
    notifications, 
    isLoading, 
    pagination, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  } = useNotificationStore();
  const { toast } = useToast();
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handlePageChange = (page: number) => {
    fetchNotifications(page);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark notification as read",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllAsRead(true);
    try {
      await markAllAsRead();
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark all notifications as read",
      });
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 mb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-semibold">Notifications</h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            View your notifications {unreadCount > 0 && `(${unreadCount} unread)`}
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllAsRead}
            disabled={markingAllAsRead}
            className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
          >
            {markingAllAsRead ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CheckIcon className="h-4 w-4 mr-2" />
            )}
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col items-center gap-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          </div>
        ) : notifications.length > 0 ? (
          <>
            <div className="flex flex-col items-start gap-0 w-full max-w-4xl">
              {notifications.map((notification, index) => (
                <Card
                  key={notification._id}
                  className={`w-full border-0 rounded-none border-b dark:border-[#2e483a] border-[#535862] shadow-shadow-xs cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    index === 0 ? "mt-[-1.00px]" : ""
                  } ${index === notifications.length - 1 ? "mb-[-1.00px]" : ""}`}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification._id)}
                >
                  <CardContent className="flex items-start gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-4 min-h-[82px]">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className={`flex items-center justify-center p-2 sm:p-2.5 rounded-[20px] ${
                        notification.isRead 
                          ? 'bg-gray-200 dark:bg-gray-700' 
                          : 'bg-green-100 dark:bg-green-900'
                      }`}>
                        <BellIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          notification.isRead 
                            ? 'text-gray-400 dark:text-gray-500' 
                            : 'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm sm:text-base leading-relaxed break-words ${
                            notification.isRead 
                              ? 'text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-gray-100 font-medium'
                          }`}>
                            <span className="font-semibold">{notification.title}</span>
                            {notification.message && (
                              <span className="font-normal"> {notification.message}</span>
                            )}
                          </p>
                        </div>
                        
                        {/* Time and Read Status */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="w-full max-w-4xl">
                <PaginationIndex 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-4xl">
            <EmptyState 
              primaryText="No notifications yet" 
              secondaryText="When you have notifications, they will appear here" 
            />
          </div>
        )}
      </div>
    </div>
  );
};