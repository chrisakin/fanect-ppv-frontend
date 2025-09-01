import { StreamingProvider } from "@/components/utils/StreamingProvider";
import { WatchEventDetails } from "@/components/layout/WatchEventDetails";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useEventStore } from "@/store/eventStore";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useStreampassSession } from "@/hooks/useStreampassSession";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardWatchEvent = (): JSX.Element => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { singleEvent, singleStreampass, isLoading, fetchPurchasedEvent } = useEventStore();
  
  // Initialize streampass session tracking with enhanced error handling
  const { 
    sessionData, 
    sessionError, 
    isSessionActive, 
    sessionToken,
    clearError 
  } = useStreampassSession({
    streampassId: singleStreampass,
    enabled: !!singleStreampass && (type === 'live' || type === 'upcoming')
  });

  // Handle session errors
  useEffect(() => {
    if (sessionError) {
      toast({
        variant: "destructive",
        title: "Session Error",
        description: sessionError,
      });
      
      // If it's a multiple device error, redirect back to tickets
      if (sessionError.includes('already streaming')) {
        setTimeout(() => {
          navigate('/dashboard/tickets');
        }, 3000);
      }
    }
  }, [sessionError, toast, navigate]);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !type) {
        return;
      }

      try {
        await fetchPurchasedEvent(id);
        console.log(singleStreampass, 'Single Streampass ID fetched:', singleStreampass);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      }
    };

    fetchEvent();
  }, [id, type, fetchPurchasedEvent, navigate]);

  // Generate breadcrumb items based on watch type
  const getBreadcrumbItems = () => {
    const typeLabels: { [key: string]: string } = {
      'live': 'Live Event',
      'past': 'Event Replay',
      'upcoming': 'Upcoming Event'
    };

    return [
      {
        label: 'Home',
        href: '/dashboard/home'
      },
      {
        label: 'Streampass',
        href: '/dashboard/tickets'
      },
      {
        label: typeLabels[type || ''] || 'Watch Event',
        isCurrentPage: true
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!singleEvent || !singleStreampass) {
    return <></>;
  }

  // Determine event type based on URL parameter and event date
  const getEventType = (): 'live' | 'past' | 'upcoming' => {
    if (type === 'past') return 'past';
    if (type === 'live') return 'live';
    
    // For other cases, determine based on event date
    const eventDate = new Date(singleEvent.eventDateTime);
    const now = new Date();
    
    if (eventDate < now) return 'past';
    if (eventDate > now) return 'upcoming';
    return 'live';
  };

  const eventType = getEventType();

  return (
    <div>
      <BreadcrumbNavigation items={getBreadcrumbItems()} />
      
      {/* Session Error Alert */}
      {sessionError && (
        <Alert className="mb-4 border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <div className="flex items-center justify-between">
              <span>{sessionError}</span>
              <Button
                variant="link"
                size="sm"
                onClick={clearError}
                className="ml-2 p-0 h-auto text-red-600 hover:text-red-700"
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col w-full lg:px-8 md:px-6 px-0 mx-auto items-start py-6 md:py-8 lg:py-10">
        <div className="flex flex-col w-full items-start gap-8 md:gap-10 lg:gap-14">
          <StreamingProvider 
            eventData={{
              playbackUrl: singleEvent.playbackUrl, 
              chatRoomArn: singleEvent.chatRoomArn, 
              chatToken: singleEvent.chatToken
            }}
            eventType={eventType}
            eventId={singleEvent._id}
            eventName={singleEvent.name}
            streampassId={singleStreampass}
            sessionToken={sessionToken}
            isSessionActive={isSessionActive}
          />
          <div className="lg:px-0 md:px-0 px-4">
            <WatchEventDetails event={singleEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};