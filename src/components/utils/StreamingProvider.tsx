import { AWSIVSPlayer } from "./AWSIVSPlayer";
import { PastEventPlayer } from "./PastEventPlayer";
import { LiveEventPlayer } from "./LiveEventPlayer";
import { ErrorBoundary } from "./ErrorBoundary";

interface StreamingProviderProps {
  eventData?: {
    playbackUrl?: string;
    chatRoomArn?: string;
    chatToken?: string;
  };
  eventType?: 'live' | 'past' | 'upcoming';
  eventId?: string;
  eventName?: string;
  sessionToken?: string | null;
  isSessionActive?: boolean;
  enableRecordingProtection?: boolean;
  strictRecordingProtection?: boolean;
  streampassId: string | null;
}

export const StreamingProvider = ({
  eventData,
  eventType = 'live',
  eventId,
  eventName,
  streampassId,
  sessionToken,
  isSessionActive,
  enableRecordingProtection = true,
  strictRecordingProtection = false,
}: StreamingProviderProps): JSX.Element => {
  console.log(streampassId, "Streampass ID in StreamingProvider2");

  const renderPlayer = () => {
    if (eventType === 'past' && eventId) {
      return (
        <PastEventPlayer
          eventId={eventId}
          eventName={eventName}
        />
      );
    }

    if ((eventType === 'live' || eventType === 'upcoming') && eventId) {
      return (
        <ErrorBoundary fallback={<p className="text-red-500">Unable to load livestream. Please refresh.</p>}>
          <LiveEventPlayer
            eventId={eventId}
            eventName={eventName}
            eventType={eventType}
            streampassId={streampassId}
            sessionToken={sessionToken}
            isSessionActive={isSessionActive}
          />
        </ErrorBoundary>
      );
    }

    return (
      <AWSIVSPlayer
        playbackUrl={eventData?.playbackUrl}
        chatRoomArn={eventData?.chatRoomArn}
        chatToken={eventData?.chatToken}
        eventId={eventId}
        eventName={eventName}
        sessionToken={sessionToken}
        isSessionActive={isSessionActive}
      />
    );
  };

  const player = renderPlayer();

  return player;
};