import { EventCardsSection } from "@/components/layout/EventCardsSection";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { PaginationIndex } from "@/components/utils/Pagination";
import { EmptyState } from "@/components/layout/EmptyState";
import { HeroSection } from "@/components/layout/HeroSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventStore } from "@/store/eventStore";
import { useEffect, useState } from "react";
import { fcmService } from "@/services/fcmService";
import { useNavigate } from "react-router-dom";

export const DashboardHome = (): JSX.Element => {
  const [eventType, setEventType] = useState<'upcoming' | 'live'>('upcoming');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [fcmStreamNotification, setFcmStreamNotification] = useState<any>(null);
  const { events, isLoading, pagination, fetchUpcomingEvents, fetchLiveEvents } = useEventStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (eventType === 'upcoming') {
      fetchUpcomingEvents();
    } else {
      fetchLiveEvents();
    }
  }, [eventType, fetchUpcomingEvents, fetchLiveEvents]);

  // Listen for FCM notifications
  useEffect(() => {
    const handleFCMMessage = (event: CustomEvent) => {
      const notification = event.detail;
      console.log('FCM notification received in DashboardHome:', notification);
      
      // Check if this is a "Live Stream Started" notification
      if (notification.notification?.title === 'Live Stream Started' || 
          notification.title === 'Live Stream Started') {
        console.log('Stream started notification detected:', notification);
        
        // Extract eventId from notification data
        const eventId = notification.data?.eventId || notification.eventId;
        
        if (eventId && !dismissedAlerts.has(notification.notificationId || notification.id)) {
          setFcmStreamNotification({
            id: notification.notificationId || notification.id || Date.now().toString(),
            title: notification.notification?.title || notification.title,
            message: notification.notification?.body || notification.body || notification.message,
            eventId: eventId
          });
        }
      }
    };

    // Listen for FCM messages
    window.addEventListener('fcm-message', handleFCMMessage as EventListener);

    // Check for existing unread FCM notifications on mount
    if (fcmService.isReady()) {
      const unreadFCMNotifications = fcmService.getUnreadFCMNotifications();
      const streamNotification = unreadFCMNotifications.find(notification => 
        notification.title === 'Live Stream Started' && 
        !dismissedAlerts.has(notification.id)
      );
      
      if (streamNotification) {
        // Try to extract eventId from the notification body/title
        // Since FCM notifications might not have the data field, we need to parse it
        console.log('Found existing stream notification:', streamNotification);
        setFcmStreamNotification({
          id: streamNotification.id,
          title: streamNotification.title,
          message: streamNotification.body,
          eventId: null // We'll need to handle this case
        });
      }
    }

    return () => {
      window.removeEventListener('fcm-message', handleFCMMessage as EventListener);
    };
  }, [dismissedAlerts]);

  const handlePageChange = (page: number) => {
    if (eventType === 'upcoming') {
      fetchUpcomingEvents(page);
    } else {
      fetchLiveEvents(page);
    }
  };

  const handleStartStreaming = () => {
    if (fcmStreamNotification) {
      const eventId = fcmStreamNotification.eventId;
      
      if (eventId) {
        console.log('Navigating to live event:', eventId);
        navigate(`/dashboard/tickets/watch-event/live/${eventId}`);
      } else {
        console.log('No eventId found, switching to live events tab');
        setEventType('live');
      }
      
      // Mark FCM notification as read
      if (fcmService.isReady()) {
        fcmService.markNotificationAsRead(fcmStreamNotification.id);
      }
      
      // Dismiss the alert
      handleDismissAlert();
    }
  };

  const handleDismissAlert = () => {
    if (fcmStreamNotification) {
      setDismissedAlerts(prev => new Set([...prev, fcmStreamNotification.id]));
      setFcmStreamNotification(null);
      
      // Mark FCM notification as read
      if (fcmService.isReady()) {
        fcmService.markNotificationAsRead(fcmStreamNotification.id);
      }
    }
  };

  // Transform events for EventCardsSection
  const transformedEvents = events.map(event => ({
    id: event._id,
    title: event.name,
    date: new Date(event.eventDateTime).toLocaleString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true // set false if you want 24-hour format
  }),
    image: event.bannerUrl,
    hasStreamPass: event.hasStreamPass
  }));

  return (
    <div>
      <div>
        <HeroSection />
      </div>
      <div className="flex-col items-start gap-20 mt-7">
        <ToggleGroup
          type="single"
          value={eventType}
          onValueChange={(value) => value && setEventType(value as 'upcoming' | 'live')}
          className="flex w-[265px] items-center gap-[11px] px-2.5 py-1  dark:bg-[#062013] rounded-[20px] border dark:!border-[#2E483A] !border-[#1AAA6580]"
        >
          <ToggleGroupItem
            value="upcoming"
            className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
              eventType === 'upcoming' ? "!bg-[#1AAA65]" : " dark:!bg-[#062013] hover:!bg-transparent"
            }`}
          >
            <span className={`font-text-lg-regular ${
              eventType === 'upcoming' ? "!text-gray-50" : "dark:!text-[#828B86] !text-[#44D48F]"
            }`}>
              Upcoming
            </span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="live"
            className={`flex w-[117px] items-center justify-center gap-2.5 p-2.5 rounded-[20px] ${
              eventType === 'live' ? "!bg-[#1AAA65]" : " dark:!bg-[#062013] hover:!bg-transparent"
            }`}
          >
            <span className={`font-text-lg-regular ${
              eventType === 'live' ? "!text-gray-50" : "dark:!text-[#828B86] !text-[#44D48F]"
            }`}>
              Live
            </span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* FCM Stream Started Alert */}
        {fcmStreamNotification && (
          <Alert className="relative w-full md:h-[72px] h-[100px] bg-green-900 rounded overflow-hidden p-0 mt-5">
            <div className="w-full flex items-start gap-2.5 p-4">
              <div className="flex items-center gap-2.5 w-full">
                <InfoIcon className="w-7 h-7 text-gray-100" />
                <div className="flex w-full items-center gap-3 justify-between">
                  <div className="flex items-center gap-[15px]">
                    <AlertDescription className="text-gray-100 font-text-sm-regular">
                      {fcmStreamNotification.message}
                    </AlertDescription>
                    <Button
                      variant="outline"
                      className="h-9 bg-gray-50 rounded text-green-600 [font-family:'Sofia_Pro-Medium',Helvetica] font-medium text-base tracking-[-0.32px]"
                      onClick={handleStartStreaming}
                    >
                      Start Streaming
                    </Button>
                  </div>
                  <button onClick={handleDismissAlert}>
                    <XCircleIcon className="w-[18px] h-[18px] text-gray-100 cursor-pointer hover:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </Alert>
        )}

        <div className="mt-5">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : transformedEvents.length > 0 ? (
            <div>
              <EventCardsSection events={transformedEvents}  eventType={eventType}/>
              <PaginationIndex 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            <EmptyState 
              primaryText={`No ${eventType} event yet`} 
              secondaryText={`When an event is ${eventType}, you will see it here`}
            />
          )}
        </div>
      </div>
    </div>
  );
};