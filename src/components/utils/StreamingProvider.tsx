import { VideoPlayer } from "../layout/VideoPlayer";
import { AWSIVSPlayer } from "./AWSIVSPlayer";

interface StreamingProviderProps {
  eventData?: {
    playbackUrl?: string;
    chatRoomArn?: string;
    chatToken?: string;
  };
}

export const StreamingProvider = ({ eventData }: StreamingProviderProps): JSX.Element => {
  // Get streaming provider from environment variable
  const streamingProvider = import.meta.env.VITE_STREAMING_PROVIDER?.toLowerCase() || 'aws-ivs';
  
  // Default to AWS IVS if not specified or invalid provider
  const useAWSIVS = streamingProvider !== 'agora';

  if (useAWSIVS) {
    return (
      <AWSIVSPlayer 
        playbackUrl={eventData?.playbackUrl}
        chatRoomArn={eventData?.chatRoomArn}
        chatToken={eventData?.chatToken}
      />
    );
  } else {
    return <VideoPlayer />;
  }
};