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

  useEffect(() => {
    if (!enabled || !streampassId) {
      console.log('Session management disabled or no streampass ID');
      return;
    }

    const id = streampassId;

    // Start session immediately when entering the page
    const initializeSession = async () => {
      try {
        const token = await startSession(id);
        console.log('✅ Session started on page entry');
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();

    // Handle page unload/close - send false
    const handleBeforeUnload = () => {
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;

      if (currentId && currentToken) {
        console.log('🔒 Ending session on page unload');
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

    // Set up event listeners for page close/navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    // Cleanup function - end session when component unmounts
    return () => {
      console.log('🧹 Cleaning up streampass session on unmount');

      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);

      // End session when leaving the page
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;
      if (currentId && currentToken) {
        console.log('🔒 Ending session on page leave');
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