export interface StreamingConfig {
  provider: 'aws-ivs';
  awsIvs: {
    playbackUrl: string;
    chatRoomArn: string;
    chatToken: string;
    region: string;
    chatRegion: string;
  };
}

export const getStreamingConfig = (): StreamingConfig => {
  const config: StreamingConfig = {
    provider: 'aws-ivs',
    awsIvs: {
      playbackUrl: '',
      chatRoomArn: '',
      chatToken: '',
      region: import.meta.env.VITE_AWS_IVS_REGION || 'eu-west-1',
      chatRegion: import.meta.env.VITE_AWS_IVS_CHAT_REGION || 'eu-west-1',
    },
  };

  return config;
};

export const isAWSIVSProvider = (): boolean => {
  return true;
};
