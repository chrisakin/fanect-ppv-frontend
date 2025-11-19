import { useEffect, useRef, useState, useCallback } from 'react';
import axios from '../lib/axios';

/**
 * Options for useStreampassSession
 * - streampassId: ID of the streampass to start/end sessions for
 * - enabled: whether session management should be active
 * - onVideoPlaying: boolean indicating whether to auto-start when playback begins
 */
interface UseStreampassSessionOptions {
  streampassId: string | null;
  enabled?: boolean;
  onVideoPlaying?: boolean;
}

/**
 * SessionData
 * Minimal shape describing an active streampass session
 */
interface SessionData {
  sessionToken: string | null;
  isActive: boolean;
}

/**
 * useStreampassSession
 * Hook to manage server-side streampass sessions. Responsibilities:
 *  - startSession(id): requests server to start a session and stores token
 *  - endSession(id, token): ends session on server
 *  - auto-start when video playback begins (controlled by onVideoPlaying)
 *  - ensure session is ended on page unload (sendBeacon)
 *
 * Returns: { sessionData, sessionError, isSessionActive, sessionToken, startSession, endSession, clearError }
 */
export const useStreampassSession = ({
  streampassId,
  enabled = true,
  onVideoPlaying = false
}: UseStreampassSessionOptions) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    sessionToken: null,
    isActive: false
  });
  const [sessionError, setSessionError] = useState<string | null>(null);
  const streampassIdRef = useRef<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const isStartingSessionRef = useRef(false);
  const hasCalledStartRef = useRef(false);

  useEffect(() => {
    streampassIdRef.current = streampassId;
  }, [streampassId]);

  const startSession = useCallback(async (id: string): Promise<string | null> => {
    if (isStartingSessionRef.current) {
      console.log('Session start already in progress, skipping...');
      return sessionTokenRef.current;
    }

    if (hasCalledStartRef.current) {
      console.log('Session already started, skipping...');
      return sessionTokenRef.current;
    }

    try {
      isStartingSessionRef.current = true;
      hasCalledStartRef.current = true;
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
      hasCalledStartRef.current = false;
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
  }, []);

  const endSession = useCallback(async (id: string, sessionToken: string | null) => {
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
      hasCalledStartRef.current = false;
      setSessionData({
        sessionToken: null,
        isActive: false
      });

      console.log('✅ Session ended successfully');
    } catch (error: any) {
      console.error('❌ Failed to end streampass session:', error);
    }
  }, []);

  useEffect(() => {
    if (!enabled || !streampassId) {
      console.log('Session management disabled or no streampass ID');
      return;
    }

    if (!onVideoPlaying) {
      console.log('Waiting for video to start playing before starting session');
      return;
    }

    const id = streampassId;

    const initializeSession = async () => {
      try {
        const token = await startSession(id);
        console.log('✅ Session started when video started playing');
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();

    const handleBeforeUnload = () => {
      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;

      if (currentId && currentToken) {
        console.log('🔒 Ending session on page unload');
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

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      console.log('🧹 Cleaning up streampass session on unmount');

      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);

      const currentId = streampassIdRef.current;
      const currentToken = sessionTokenRef.current;
      if (currentId && currentToken) {
        console.log('🔒 Ending session on page leave');
        endSession(currentId, currentToken);
      }
    };
  }, [streampassId, enabled, onVideoPlaying, startSession, endSession]);

  return {
    sessionData,
    sessionError,
    isSessionActive: sessionData.isActive,
    sessionToken: sessionData.sessionToken,
    startSession,
    endSession,
    clearError: () => setSessionError(null)
  };
};