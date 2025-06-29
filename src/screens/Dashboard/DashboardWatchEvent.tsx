import { StreamingProvider } from "@/components/utils/StreamingProvider";
import { WatchEventDetails } from "@/components/layout/WatchEventDetails";
import { BreadcrumbNavigation } from "@/components/layout/BreadcrumbNavigation";
import { useEventStore } from "@/store/eventStore";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const DashboardWatchEvent = (): JSX.Element => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { singleEvent, isLoading, fetchPurchasedEvent } = useEventStore();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id || !type) {
        navigate('/not-found');
        return;
      }

      try {
        await fetchPurchasedEvent(id);
      } catch (error) {
        navigate('/not-found');
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

  if (!singleEvent) {
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
      <div className="flex flex-col w-full lg:px-8 md:px-6 px-0 mx-auto items-start py-6 md:py-8 lg:py-10">
        <div className="flex flex-col w-full items-start gap-8 md:gap-10 lg:gap-14">
          <StreamingProvider 
          eventData={{playbackUrl: singleEvent.playbackUrl, chatRoomArn:singleEvent.chatRoomArn, chatToken: singleEvent.chatToken}}
            eventType={eventType}
            eventId={singleEvent._id}
            eventName={singleEvent.name}
          />
          <div className="lg:px-0 md:px-0 px-4">
            <WatchEventDetails event={singleEvent} />
          </div>
        </div>
      </div>
    </div>
  );
};