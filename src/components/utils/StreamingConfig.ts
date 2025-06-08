export interface StreamingConfig {
  provider: 'agora' | 'aws-ivs';
  agora?: {
    appId: string;
    channel: string;
    token?: string;
    uid?: string | number;
  };
  awsIvs?: {
    playbackUrl: string;
    chatRoomArn: string;
    chatToken: string;
    region: string;
    chatRegion: string;
  };
}

export const getStreamingConfig = (): StreamingConfig => {
  const provider = (import.meta.env.VITE_STREAMING_PROVIDER?.toLowerCase() || 'aws-ivs') as 'agora' | 'aws-ivs';
  
  const config: StreamingConfig = {
    provider: provider === 'agora' ? 'agora' : 'aws-ivs',
  };

  if (config.provider === 'agora') {
    config.agora = {
      appId: import.meta.env.VITE_AGORA_APP_ID || '',
      channel: 'default-channel', // This should come from your event data
      token: null, // This should come from your backend
      uid: undefined,
    };
  } else {
    config.awsIvs = {
      playbackUrl: '', // This should come from your event data
      chatRoomArn: '', // This should come from your event data
      chatToken: '', // This should come from your backend
      region: import.meta.env.VITE_AWS_IVS_REGION || 'us-east-1',
      chatRegion: import.meta.env.VITE_AWS_IVS_CHAT_REGION || 'us-east-1',
    };
  }

  return config;
};

export const isAgoraProvider = (): boolean => {
  return getStreamingConfig().provider === 'agora';
};

export const isAWSIVSProvider = (): boolean => {
  return getStreamingConfig().provider === 'aws-ivs';
};