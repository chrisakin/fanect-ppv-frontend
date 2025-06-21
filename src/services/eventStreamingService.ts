import axios from '../lib/axios';

export interface StreamingData {
  streamKey?: string;
  playbackUrl?: string;
  chatRoomArn?: string;
  chatToken?: string;
}

class EventStreamingService {
  private static instance: EventStreamingService;

  private constructor() {}

  public static getInstance(): EventStreamingService {
    if (!EventStreamingService.instance) {
      EventStreamingService.instance = new EventStreamingService();
    }
    return EventStreamingService.instance;
  }

  // Get stream key for upcoming/live events (for organizers)
  public async getStreamKey(eventId: string): Promise<StreamingData> {
    try {
      const response = await axios.get(`/event/streamkey/${eventId}`);
      return {
        streamKey: response.data.streamKey,
        chatToken: response.data.chatToken,
      };
    } catch (error) {
      console.error('Error fetching stream key:', error);
      throw new Error('Failed to get stream key');
    }
  }

  // Get playback URL for past events
  public async getPlaybackUrl(eventId: string): Promise<StreamingData> {
    try {
      const response = await axios.get(`/event/playbackurl/${eventId}`);
      return {
        playbackUrl: response.data.playbackUrl,
      };
    } catch (error) {
      console.error('Error fetching playback URL:', error);
      throw new Error('Failed to get playback URL');
    }
  }

  // Get streaming data based on event type
  public async getStreamingData(eventId: string, eventType: 'live' | 'past' | 'upcoming'): Promise<StreamingData> {
    try {
      if (eventType === 'past') {
        return await this.getPlaybackUrl(eventId);
      } else if (eventType === 'live' || eventType === 'upcoming') {
        const playbackData = await this.getStreamKey(eventId);
        return playbackData;
      }
      
      throw new Error('Invalid event type');
    } catch (error) {
      console.error('Error getting streaming data:', error);
      throw error;
    }
  }
}

export const eventStreamingService = EventStreamingService.getInstance();