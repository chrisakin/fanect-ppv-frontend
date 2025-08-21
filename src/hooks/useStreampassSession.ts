import { useEffect, useRef, useState } from 'react';
import axios from '../lib/axios';

interface UseStreampassSessionOptions {
  streampassId: string | null;
  enabled?: boolean;
}

export const useStreampassSession = ({ streampassId, enabled = true }: UseStreampassSessionOptions) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const streampassIdRef = useRef<string | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    streampassIdRef.current = streampassId;
  }, [streampassId]);

  const startSession = async (id: string) => {
    try {
      await axios.post('/streampass/stream-session', { streampassId: id, inSession: true });
      setIsSessionActive(true);
    } catch (error) {
      console.error('❌ Failed to start streampass session:', error);
    }
  };

  const endSession = async (id: string) => {
    try {
      await axios.post('/streampass/stream-session', { streampassId: id, inSession: false });
      setIsSessionActive(false);
    } catch (error) {
      console.error('❌ Failed to end streampass session:', error);
    }
  };

  const sendHeartbeat = async (id: string) => {
    try {
      await axios.post('/streampass/heartbeat', { streampassId: id });
    } catch (error) {
      console.error('❌ Heartbeat failed:', error);
    }
  };

  useEffect(() => {
    if (!enabled || !streampassId) return;

    const id = streampassId;

    // Start session immediately
    startSession(id);

      heartbeatRef.current = setInterval(() => {
        if (!document.hidden) sendHeartbeat(id);
      }, 15000);

    const handleBeforeUnload = () => {
      if (streampassIdRef.current) {
        navigator.sendBeacon(
          '/streampass/stream-session',
          JSON.stringify({ streampassId: streampassIdRef.current, inSession: false })
        );
      }
    };

    const handleVisibilityChange = async () => {
      const currentId = streampassIdRef.current;
      if (!currentId) return;

      if (document.hidden) {
        await endSession(currentId);
      } else {
        await startSession(currentId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    //document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      //document.removeEventListener('visibilitychange', handleVisibilityChange);
      endSession(id);
    };
  }, [streampassId, enabled]);

  return { isSessionActive };
};
