import { useEffect, useRef, useState } from 'react';
import axios from '../lib/axios';

interface UseStreampassSessionOptions {
  streampassId: string | null;
  enabled?: boolean;
}

interface SessionData {
  sessionToken: string | null;
  isActive: boolean;
}

export const useStreampassSession = ({ streampassId, enabled = true }: UseStreampassSessionOptions) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionToken: null,
    isActive: false
  });
  const [sessionError, setSessionError] = useState<string | null>(null);
  const streampassIdRef = useRef<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);
  const isStartingSessionRef = useRef(false);

  useEffect(() => {
    streampassIdRef.current = streampassId;
  }, [streampassId]);

  const startSession = async (id: string): Promise<string | null> => {
    if (isStartingSessionRef.current) {
      console.log('Session start already in progress, skipping...');
      return sessionTokenRef.current;
    }

    try {
      isStartingSessionRef.current = true;
      setSessionError(null);
      
      console.log('🔐 Starting streampass session for:', id);
      const response = await axios.post('/streampass/stream-session', { 
        streampassId: id, 
        startSession: true 
      });
      
      const { sessionToken } = response.data;
      sessionTokenRef.current = sessionToken;
      
      setSessionData({
        sessionToken,
        isActive: true
      });
      
      console.log('✅ Session started successfully with token:', sessionToken);
      return sessionToken;
    } catch (error: any) {
      console.error('❌ Failed to start streampass session:', error);
      const errorMessage = error.response?.data?.message || `The live stream hasn't started yet.
You'll be notified once the host goes live.`;
      setSessionError(errorMessage);
      
      setSessionData({
        sessionToken: null,
        isActive: false
      });
      
      throw new Error(errorMessage);
    } finally {
      isStartingSessionRef.current = false;
    }
  };

  const endSession = async (id: string, sessionToken: string | null) => {
    if (!sessionToken) {
      console.log('No session token available, skipping end session');
      return;
    }

    try {
      console.log('🔒 Ending streampass session for:', id);
      await axios.post('/streampass/stream-session', { 
        streampassId: id, 
        startSession: false,
        clientSessionToken: sessionToken
      });
      
      sessionTokenRef.current = null;
      setSessionData({
        sessionToken: null,
        isActive: false
      });
      
      console.log('✅ Session ended successfully');
    } catch (error: any) {
      console.error('❌ Failed to end streampass session:', error);
      // Don't throw error for end session failures to avoid blocking cleanup
    }
  };

  const sendHeartbeat = async (id: string, sessionToken: string | null) => {
    if (!sessionToken) {
      console.log('No session token available for heartbeat');
      return;
    }

    try {
      await axios.post('/streampass/heartbeat', { 
        streampassId: id,
        clientSessionToken: sessionToken
      });
      console.log('💓 Heartbeat sent successfully');
    } catch (error: any) {
      console.error('❌ Heartbeat failed:', error);
      
      // If heartbeat fails due to invalid session, clear local session
      if (error.response?.status === 403) {
        console.log('Session invalidated by server, clearing local session');
        sessionTokenRef.current = null;
        setSessionData({
          sessionToken: null,
          isActive: false
        });
        setSessionError('Session expired or invalid');
      }
    }
  };

  useEffect(() => {
    if (!enabled || !streampassId) {
      console.log('Session management disabled or no streampass ID');
      return;
    }

    const id = streampassId;
    let sessionToken: string | null = null;

    // Start session immediately
    const initializeSession = async () => {
      try {
        sessionToken = await startSession(id);
        
        // Set up heartbeat interval only if session started successfully
        if (sessionToken) {
          heartbeatRef.current = setInterval(() => {
            if (!document.hidden && sessionTokenRef.current) {
              sendHeartbeat(id, sessionTokenRef.current);
            }
          }, 60000); // Send heartbeat every 60 seconds
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();

    // Handle page unload/close
    const handleBeforeUnload = () => {
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;
      
      if (currentId && currentToken) {
        // Use sendBeacon for reliable cleanup on page unload
        const payload = JSON.stringify({ 
          streampassId: currentId, 
          startSession: false,
          clientSessionToken: currentToken
        });
        
        navigator.sendBeacon(
          `${axios.defaults.baseURL}/streampass/stream-session`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    // Handle visibility change (tab switching, minimizing)
    const handleVisibilityChange = async () => {
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;
      
      if (!currentId || !currentToken) return;

      if (document.hidden) {
        console.log('Page hidden, ending session');
        await endSession(currentId, currentToken);
      } else {
        console.log('Page visible, restarting session');
        try {
          const newToken = await startSession(currentId);
          if (newToken && heartbeatRef.current) {
            // Restart heartbeat with new token
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = setInterval(() => {
              if (!document.hidden && sessionTokenRef.current) {
                sendHeartbeat(currentId, sessionTokenRef.current);
              }
            }, 60000);
          }
        } catch (error) {
          console.error('Failed to restart session:', error);
        }
      }
    };

    // Set up event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up streampass session');
      
      // Clear heartbeat interval
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // End session
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;
      if (currentId && currentToken) {
        endSession(currentId, currentToken);
      }
    };
  }, [streampassId, enabled]);

  // Return session data and utilities
  return { 
    sessionData,
    sessionError,
    isSessionActive: sessionData.isActive,
    sessionToken: sessionData.sessionToken,
    // Manual session control methods
    startSession: (id: string) => startSession(id),
    endSession: (id: string, token: string) => endSession(id, token),
    clearError: () => setSessionError(null)
  };
};