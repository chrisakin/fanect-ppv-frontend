import axios from '../lib/axios';

interface SessionResponse {
  sessionToken: string;
  message: string;
}

class StreampassSessionService {
  private static instance: StreampassSessionService;
  private activeSessions: Map<string, string> = new Map(); // streampassId -> sessionToken

  private constructor() {}

  public static getInstance(): StreampassSessionService {
    if (!StreampassSessionService.instance) {
      StreampassSessionService.instance = new StreampassSessionService();
    }
    return StreampassSessionService.instance;
  }

  // Start a new session
  public async startSession(streampassId: string): Promise<string> {
    try {
      console.log('🔐 Starting session for streampass:', streampassId);
      
      const response = await axios.post('/streampass/stream-session', {
        streampassId,
        startSession: true
      });

      const { sessionToken } = response.data;
      
      // Store session token
      this.activeSessions.set(streampassId, sessionToken);
      sessionStorage.setItem(`session_${streampassId}`, sessionToken);
      
      console.log('✅ Session started successfully');
      return sessionToken;
    } catch (error: any) {
      console.error('❌ Failed to start session:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error('MULTIPLE_DEVICE_ERROR: ' + error.response.data.message);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to start session');
    }
  }

  // End a session
  public async endSession(streampassId: string): Promise<void> {
    try {
      const sessionToken = this.activeSessions.get(streampassId) || 
                          sessionStorage.getItem(`session_${streampassId}`);
      
      if (!sessionToken) {
        console.log('No session token found for streampass:', streampassId);
        return;
      }

      console.log('🔒 Ending session for streampass:', streampassId);
      
      await axios.post('/streampass/stream-session', {
        streampassId,
        startSession: false,
        clientSessionToken: sessionToken
      });

      // Clean up local storage
      this.activeSessions.delete(streampassId);
      sessionStorage.removeItem(`session_${streampassId}`);
      
      console.log('✅ Session ended successfully');
    } catch (error: any) {
      console.error('❌ Failed to end session:', error);
      // Don't throw error for cleanup operations
    }
  }

  // Send heartbeat
  public async sendHeartbeat(streampassId: string): Promise<void> {
    try {
      const sessionToken = this.activeSessions.get(streampassId) || 
                          sessionStorage.getItem(`session_${streampassId}`);
      
      if (!sessionToken) {
        throw new Error('No active session found');
      }

      await axios.post('/streampass/heartbeat', {
        streampassId,
        clientSessionToken: sessionToken
      });

      console.log('💓 Heartbeat sent successfully');
    } catch (error: any) {
      console.error('❌ Heartbeat failed:', error);
      
      // If session is invalid, clean up
      if (error.response?.status === 403) {
        this.activeSessions.delete(streampassId);
        sessionStorage.removeItem(`session_${streampassId}`);
        throw new Error('Session expired or invalid');
      }
      
      throw error;
    }
  }

  // Get session token
  public getSessionToken(streampassId: string): string | null {
    return this.activeSessions.get(streampassId) || 
           sessionStorage.getItem(`session_${streampassId}`);
  }

  // Check if session is active
  public hasActiveSession(streampassId: string): boolean {
    return this.activeSessions.has(streampassId) || 
           !!sessionStorage.getItem(`session_${streampassId}`);
  }

  // Force start session (for handling multiple device conflicts)
  public async forceStartSession(streampassId: string): Promise<string> {
    try {
      // First try to end any existing session
      await this.endSession(streampassId);
      
      // Then start a new session
      return await this.startSession(streampassId);
    } catch (error) {
      console.error('Failed to force start session:', error);
      throw error;
    }
  }

  // Clean up all sessions (for logout)
  public cleanupAllSessions(): void {
    console.log('🧹 Cleaning up all streampass sessions');
    
    // End all active sessions
    const promises = Array.from(this.activeSessions.keys()).map(streampassId => 
      this.endSession(streampassId)
    );
    
    Promise.allSettled(promises).then(() => {
      console.log('All sessions cleaned up');
    });

    // Clear local storage
    this.activeSessions.clear();
    
    // Remove all session storage items
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key?.startsWith('session_')) {
        sessionStorage.removeItem(key);
      }
    }
  }
}

export const streampassSessionService = StreampassSessionService.getInstance();