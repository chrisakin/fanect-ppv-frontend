import { VideoPlayer } from "../layout/VideoPlayer";
import { AWSIVSPlayer } from "./AWSIVSPlayer";
import { PastEventPlayer } from "./PastEventPlayer";
import { LiveEventPlayer } from "./LiveEventPlayer";

interface StreamingProviderProps {
  eventData?: {
    playbackUrl?: string;
    chatRoomArn?: string;
    chatToken?: string;
  };
  eventType?: 'live' | 'past' | 'upcoming';
  eventId?: string;
  eventName?: string;
}

export const StreamingProvider = ({ 
  eventData, 
  eventType = 'live',
  eventId,
  eventName 
}: StreamingProviderProps): JSX.Element => {
  // Get streaming provider from environment variable
  const streamingProvider = import.meta.env.VITE_STREAMING_PROVIDER?.toLowerCase() || 'aws-ivs';
  
  // Default to AWS IVS if not specified or invalid provider
  const useAWSIVS = streamingProvider !== 'agora';

  // For past events, use the specialized PastEventPlayer
  if (eventType === 'past' && eventId) {
    return (
      <PastEventPlayer 
        eventId={eventId}
        eventName={eventName}
      />
    );
  }

  // For live events, use the LiveEventPlayer that fetches data
  if ((eventType === 'live' || eventType === 'upcoming') && eventId) {
    if (useAWSIVS) {
      return (
        <LiveEventPlayer 
          eventId={eventId}
          eventName={eventName}
          eventType={eventType}
        />
      );
    } else {
      return (
        <VideoPlayer 
          eventId={eventId}
          eventName={eventName}
        />
      );
    }
  }

  // Fallback to static data if no eventId
  if (useAWSIVS) {
    return (
      <AWSIVSPlayer 
        playbackUrl={eventData?.playbackUrl}
        chatRoomArn={eventData?.chatRoomArn}
        chatToken={eventData?.chatToken}
        eventId={eventId}
        eventName={eventName}
      />
    );
  } else {
    return (
      <VideoPlayer 
        eventId={eventId}
        eventName={eventName}
      />
    );
  }
};