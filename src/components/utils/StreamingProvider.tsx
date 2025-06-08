import { VideoPlayer } from "../layout/VideoPlayer";
import { AWSIVSPlayer } from "./AWSIVSPlayer";

export const StreamingProvider = (): JSX.Element => {
  // Get streaming provider from environment variable
  const streamingProvider = import.meta.env.VITE_STREAMING_PROVIDER?.toLowerCase() || 'aws-ivs';
  
  // Default to AWS IVS if not specified or invalid provider
  const useAWSIVS = streamingProvider !== 'agora';

  if (useAWSIVS) {
    return <AWSIVSPlayer />;
  } else {
    return <VideoPlayer />;
  }
};