/**
 * StreamingConfig interface
 * @interface StreamingConfig
 * @property {string} provider - Streaming provider (aws-ivs)
 * @property {Object} awsIvs - AWS IVS configuration
 *   @property {string} playbackUrl - Video stream URL
 *   @property {string} chatRoomArn - Chat room ARN
 *   @property {string} chatToken - Chat authentication token
 *   @property {string} region - AWS region
 *   @property {string} chatRegion - AWS chat region
 */
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

/**
 * Get streaming configuration from environment variables
 * @function getStreamingConfig
 * @returns {StreamingConfig} Streaming configuration object with AWS IVS defaults
 */
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

/**
 * Check if AWS IVS is the current streaming provider
 * @function isAWSIVSProvider
 * @returns {boolean} Always returns true (only AWS IVS supported)
 */
export const isAWSIVSProvider = (): boolean => {
  return true;
};
