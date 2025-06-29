import { VideoPlayer } from "../layout/VideoPlayer";
import { AWSIVSPlayer } from "./AWSIVSPlayer";
import { PastEventPlayer } from "./PastEventPlayer";
import { LiveEventPlayer } from "./LiveEventPlayer";
import { ErrorBoundary } from "./ErrorBoundary";
import { ScreenRecordingProtection } from "./ScreenRecordingProtection";
import { VideoProtection } from "./VideoProtection";

interface StreamingProviderProps {
  eventData?: {
    playbackUrl?: string;
    chatRoomArn?: string;
    chatToken?: string;
  };
  eventType?: 'live' | 'past' | 'upcoming';
  eventId?: string;
  eventName?: string;
  enableRecordingProtection?: boolean;
  strictRecordingProtection?: boolean;
}

export const StreamingProvider = ({ 
  eventData, 
  eventType = 'live',
  eventId,
  eventName,
  enableRecordingProtection = true,
  strictRecordingProtection = false
}: StreamingProviderProps): JSX.Element => {
  // Get streaming provider from environment variable
  const streamingProvider = import.meta.env.VITE_STREAMING_PROVIDER?.toLowerCase() || 'aws-ivs';
  
  // Default to AWS IVS if not specified or invalid provider
  const useAWSIVS = streamingProvider !== 'agora';

  // Render the appropriate player
  const renderPlayer = () => {
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
          <ErrorBoundary fallback={<p className="text-red-500">Unable to load livestream. Please refresh.</p>}>
            <LiveEventPlayer 
              eventId={eventId}
              eventName={eventName}
              eventType={eventType}
            />
          </ErrorBoundary>
        );
      } else {
        return (
          <ErrorBoundary fallback={<p className="text-red-500">Unable to load livestream. Please refresh.</p>}>
            <VideoPlayer 
              eventId={eventId}
              eventName={eventName}
            />
          </ErrorBoundary>
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

  const player = renderPlayer();

  // Wrap with protection if enabled
  if (enableRecordingProtection) {
    return (
      <ScreenRecordingProtection
        enableWatermark={true}
        enableBlurOnFocusLoss={true}
        enableDevToolsDetection={true}
        strictMode={strictRecordingProtection}
        onRecordingDetected={() => {
          console.warn('Recording detected on video stream');
          // You can add additional actions here like logging to analytics
        }}
      >
        <VideoProtection
          enableTextSelection={false}
          enableRightClick={false}
          enableDragAndDrop={false}
          enablePrintScreen={false}
        >
          {player}
        </VideoProtection>
      </ScreenRecordingProtection>
    );
  }

  return player;
};