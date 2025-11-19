import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * EventStatus
 *
 * Enum representing the three possible states of an event timeline:
 *  - UPCOMING: Event has not started yet
 *  - LIVE: Event is currently broadcasting
 *  - PAST: Event has finished broadcasting
 */
export enum EventStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  PAST = 'Past'
}

/**
 * EventStatusMessage
 *
 * Structure of SSE (Server-Sent Events) messages from the server containing event updates.
 *  - message: Human-readable status message
 *  - status: Current EventStatus enum value
 */
interface EventStatusMessage {
  message: string;
  status: EventStatus;
}

/**
 * UseEventStatusOptions
 *
 * Configuration options for the useEventStatus hook.
 *  - eventId: (required) Unique identifier of the event to monitor
 *  - onEventEnd: (optional) Callback fired when event status changes to PAST
 *  - onStatusChange: (optional) Callback fired whenever status changes, receives (status, message)
 *  - enabled: (optional, default: true) Whether SSE connection is active
 */
interface UseEventStatusOptions {
  eventId: string;
  onEventEnd?: () => void;
  onStatusChange?: (status: EventStatus, message: string) => void;
  enabled?: boolean;
}

/**
 * useEventStatus
 *
 * React hook for real-time event status monitoring via Server-Sent Events (SSE).
 *
 * Features:
 *  - Establishes persistent SSE connection to monitor event status changes
 *  - Auto-reconnects with exponential backoff (up to 5 attempts)
 *  - Pauses connection when page is hidden and resumes when visible
 *  - Fires callbacks on status changes and event end
 *  - Proper cleanup on unmount to prevent memory leaks
 *
 * Arguments: UseEventStatusOptions
 *
 * Returns: {
 *   status: EventStatus | null - Current event status
 *   isConnected: boolean - Whether SSE connection is active
 *   error: string | null - Error message if connection failed
 *   reconnect: () => void - Manual function to force reconnection
 *   disconnect: () => void - Manual function to close connection
 * }
 */
export const useEventStatus = ({
  eventId,
  onEventEnd,
  onStatusChange,
  enabled = true
}: UseEventStatusOptions) => {
  const [status, setStatus] = useState<EventStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000;
  const mountedRef = useRef(true);

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('🧹 Cleaning up SSE connection for event:', eventId);
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
    setError(null);
  }, [eventId]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    if (!mountedRef.current) return;
    
    reconnectAttempts.current = 0;
    cleanup();
    
    // Small delay before reconnecting
    setTimeout(() => {
      if (mountedRef.current && enabled && eventId) {
        console.log('🔄 Manual reconnect triggered for event:', eventId);
        // The effect will handle creating the new connection
      }
    }, 1000);
  }, [enabled, eventId, cleanup]);

  // Main effect for SSE connection
  useEffect(() => {
    // Reset mounted ref
    mountedRef.current = true;

    if (!enabled || !eventId) {
      console.log('⚠️ SSE connection disabled or no eventId provided');
      return;
    }

    // Only connect when page is visible
    if (document.hidden) {
      console.log('⚠️ Page is hidden, delaying SSE connection');
      return;
    }

    // Prevent multiple connections
    if (eventSourceRef.current) {
      console.log('⚠️ SSE connection already exists for event:', eventId);
      return;
    }

    let eventSource: EventSource | null = null;

    const createConnection = () => {
      if (!mountedRef.current || document.hidden) return;

      try {
        console.log('🔗 Creating SSE connection for event:', eventId, 'at', new Date().toISOString());

        const url = `${import.meta.env.VITE_BASE_URL}/streampass/events/${eventId}/stream-status`;
        eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (!mountedRef.current) return;
          
          console.log('✅ SSE connection established for event:', eventId);
          setIsConnected(true);
          setError(null);
          reconnectAttempts.current = 0;
        };

        eventSource.onmessage = (event) => {
          if (!mountedRef.current) return;
          
          try {
            console.log('📨 SSE message received:', event.data);
            
            const data: EventStatusMessage = JSON.parse(event.data);
            const { message, status: newStatus } = data;
            
            console.log('📊 Event status update:', { message, status: newStatus });
            
            setStatus(newStatus);
            onStatusChange?.(newStatus, message);
            
            // Trigger event end callback when status changes to PAST
            if (newStatus === EventStatus.PAST) {
              console.log('🎬 Event ended - triggering callback');
              onEventEnd?.();
            }
          } catch (parseError) {
            console.error('❌ Error parsing SSE message:', parseError, event.data);
          }
        };

        eventSource.onerror = (error) => {
          if (!mountedRef.current) return;
          
          console.error('❌ SSE connection error for event:', eventId, error);
          setIsConnected(false);
          
          // Check if we should attempt reconnection
          if (eventSource?.readyState === EventSource.CLOSED && reconnectAttempts.current < maxReconnectAttempts) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
            reconnectAttempts.current++;
            
            console.log(`🔄 Attempting to reconnect SSE in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            setError(`Connection lost. Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (mountedRef.current && enabled && eventId) {
                cleanup();
                createConnection();
              }
            }, delay);
          } else if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error('❌ Max SSE reconnection attempts reached for event:', eventId);
            setError('Connection failed. Please refresh the page.');
          }
        };

      } catch (error) {
        console.error('❌ Failed to create SSE connection:', error);
        setError('Failed to establish connection');
      }
    };

    // Create the initial connection
    createConnection();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('📴 Page hidden - closing SSE connection');
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
          setIsConnected(false);
        }
      } else {
        console.log('📱 Page visible - reconnecting SSE');
        if (!eventSourceRef.current && mountedRef.current) {
          createConnection();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      console.log('🧹 Effect cleanup for event:', eventId);
      mountedRef.current = false;

      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (eventSource) {
        eventSource.close();
        eventSourceRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      setIsConnected(false);
      setError(null);
    };
  }, [eventId, enabled]); // Only depend on primitive values

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    isConnected,
    error,
    reconnect,
    disconnect: cleanup
  };
};