import axios from '../lib/axios';

export interface StreamingData {
  streamKey?: string;
  liveStreamUrl?: string;  // For live events - the URL viewers use to watch live
  playbackUrl?: string;    // For past events - the URL for recorded content
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
      const response = await axios.get(`/events/streamkey/${eventId}`);
      return {
        streamKey: response.data.streamKey,
        chatToken: response.data.chatToken,
        playbackUrl: response.data.playbackUrl,
        chatRoomArn: response.data.chatRoomArn,
        liveStreamUrl: response.data.playbackUrl
      };
    } catch (error) {
      console.error('Error fetching stream key:', error);
      throw new Error('Failed to get stream key');
    }
  }


  // Get playback URL for past events (for recorded content)
  public async getPlaybackUrl(eventId: string): Promise<StreamingData> {
    try {
      const response = await axios.get(`/events/playbackurl/${eventId}`);
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
        // For past events, get the recorded content URL
        return await this.getPlaybackUrl(eventId);
      } else if (eventType === 'live' || eventType === 'upcoming') {
        // For live/upcoming events, get the live stream URL
        return await this.getStreamKey(eventId);
      }
      
      throw new Error('Invalid event type');
    } catch (error) {
      console.error('Error getting streaming data:', error);
      throw error;
    }
  }

  // Get stream key specifically for organizers
  public async getOrganizerStreamData(eventId: string): Promise<StreamingData> {
    try {
      return await this.getStreamKey(eventId);
    } catch (error) {
      console.error('Error getting organizer stream data:', error);
      throw error;
    }
  }
}

export const eventStreamingService = EventStreamingService.getInstance();