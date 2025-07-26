import { useEffect, useRef } from 'react';
import axios from '../lib/axios';

interface UseStreampassSessionOptions {
  streampassId: string | null;
  enabled?: boolean;
}

export const useStreampassSession = ({ streampassId, enabled = true }: UseStreampassSessionOptions) => {
  const sessionActiveRef = useRef(false);
  const streampassIdRef = useRef<string | null>(null);

  // Update refs when props change
  useEffect(() => {
    streampassIdRef.current = streampassId;
  }, [streampassId]);

  // Function to start session
  const startSession = async (id: string) => {
    try {
      await axios.post('/streampass/stream-session', {
        streampassId: id,
        inSession: true
      });
      sessionActiveRef.current = true;
    } catch (error) {
      console.error('❌ Failed to start streampass session:', error);
      throw error;
    }
  };

  // Function to end session
  const endSession = async (id: string) => {
    try {
      await axios.post('/streampass/stream-session', {
        streampassId: id,
        inSession: false
      });
      console.log('✅ Streampass session ended successfully');
      sessionActiveRef.current = false;
      console.log('✅ Streampass session ended successfully');
    } catch (error) {
      console.error('❌ Failed to end streampass session:', error);
      // Don't throw error on session end to avoid blocking navigation
    }
  };

  // Main effect to manage session lifecycle
  useEffect(() => {
    if (!enabled || !streampassId) {
      return;
    }

    let mounted = true;

    // Start session when component mounts
    const initializeSession = async () => {
      try {
        await startSession(streampassId);
      } catch (error) {
        console.error('Failed to initialize streampass session:', error);
      }
    };

    initializeSession();

    // Cleanup function to end session
    const cleanup = async () => {
      console.log('Cleaning up streampass session...');
      const currentStreampassId = streampassIdRef.current;
      if (sessionActiveRef.current && currentStreampassId) {
        await endSession(currentStreampassId);
      }
    };

    // Handle page visibility changes (tab switching, minimizing)
    const handleVisibilityChange = async () => {
      const currentStreampassId = streampassIdRef.current;
      if (!currentStreampassId) return;

      if (document.hidden) {
        // Page is hidden - end session
        if (sessionActiveRef.current) {
          await endSession(currentStreampassId);
        }
      } else {
        // Page is visible again - restart session
        if (!sessionActiveRef.current && mounted) {
          try {
            await startSession(currentStreampassId);
          } catch (error) {
            console.error('Failed to restart session on visibility change:', error);
          }
        }
      }
    };

    // Handle beforeunload (page refresh, close, navigation)
    const handleBeforeUnload = () => {
      const currentStreampassId = streampassIdRef.current;
      if (sessionActiveRef.current && currentStreampassId) {
        // Use sendBeacon for reliable delivery during page unload
        const data = JSON.stringify({
          streampassId: currentStreampassId,
          inSession: false
        });
        
        navigator.sendBeacon('/streampass/stream-session', data);
        sessionActiveRef.current = false;
      }
    };

    // Handle pagehide (more reliable than beforeunload on mobile)
    const handlePageHide = () => {
      const currentStreampassId = streampassIdRef.current;
      if (sessionActiveRef.current && currentStreampassId) {
        const data = JSON.stringify({
          streampassId: currentStreampassId,
          inSession: false
        });
        
        navigator.sendBeacon('/streampass/stream-session', data);
        sessionActiveRef.current = false;
      }
    };

    // Handle focus/blur events as additional protection
    const handleFocus = async () => {
      const currentStreampassId = streampassIdRef.current;
      if (!sessionActiveRef.current && currentStreampassId && mounted && !document.hidden) {
        try {
          await startSession(currentStreampassId);
        } catch (error) {
          console.error('Failed to restart session on focus:', error);
        }
      }
    };

    const handleBlur = async () => {
      // Optional: You can choose to end session on blur for stricter control
      // Uncomment the lines below if you want to end session when user switches tabs/apps
      /*
      const currentStreampassId = streampassIdRef.current;
      if (sessionActiveRef.current && currentStreampassId) {
        await endSession(currentStreampassId);
      }
      */
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup function
    return () => {
      mounted = false;
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      // End session
      cleanup();
    };
  }, [streampassId, enabled]);

  // Heartbeat to maintain session (optional - sends periodic updates)
  // useEffect(() => {
  //   if (!enabled || !streampassId || !sessionActiveRef.current) {
  //     return;
  //   }

  //   const heartbeatInterval = setInterval(async () => {
  //     const currentStreampassId = streampassIdRef.current;
  //     if (sessionActiveRef.current && currentStreampassId && !document.hidden) {
  //       try {
  //         await axios.post('/streampass/stream-session', {
  //           streampassId: currentStreampassId,
  //           inSession: true
  //         });
  //         console.log('💓 Streampass session heartbeat sent');
  //       } catch (error) {
  //         console.error('❌ Streampass session heartbeat failed:', error);
  //       }
  //     }
  //   }, 30000); // Send heartbeat every 30 seconds

  //   return () => {
  //     clearInterval(heartbeatInterval);
  //   };
  // }, [streampassId, enabled]);

  return {
    isSessionActive: sessionActiveRef.current,
    startSession: () => streampassId && startSession(streampassId),
    endSession: () => streampassId && endSession(streampassId)
  };
};