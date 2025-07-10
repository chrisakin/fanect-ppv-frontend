import { useEffect, useRef, useState, useCallback } from 'react';

export enum EventStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  PAST = 'Past'
}

interface EventStatusMessage {
  message: string;
  status: EventStatus;
}

interface UseEventStatusOptions {
  eventId: string;
  onEventEnd?: () => void;
  onStatusChange?: (status: EventStatus, message: string) => void;
  enabled?: boolean;
}

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

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      console.log('🔌 Closing SSE connection for event:', eventId);
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

  const connect = useCallback(() => {
    if (!enabled || !eventId) {
      console.log('⚠️ SSE connection disabled or no eventId provided');
      return;
    }

    // Clean up existing connection
    cleanup();

    try {
      console.log('🔗 Establishing SSE connection for event:', eventId);
      
      // Create the SSE connection
      const eventSource = new EventSource(
        `${import.meta.env.VITE_BASE_URL}/streampass/events/${eventId}/stream-status`,
      );

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ SSE connection established for event:', eventId);
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
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
        console.error('❌ SSE connection error:', error);
        setIsConnected(false);
        
        // Only attempt reconnection if we haven't exceeded max attempts
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts.current);
          reconnectAttempts.current++;
          
          console.log(`🔄 Attempting to reconnect SSE in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          setError(`Connection lost. Reconnecting... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error('❌ Max SSE reconnection attempts reached');
          setError('Connection failed. Please refresh the page.');
          cleanup();
        }
      };

    } catch (error) {
      console.error('❌ Failed to create SSE connection:', error);
      setError('Failed to establish connection');
    }
  }, [eventId, enabled, onEventEnd, onStatusChange, cleanup]);

  // Initialize connection
  useEffect(() => {
    if (enabled && eventId) {
      connect();
    }

    return cleanup;
  }, [eventId, enabled, connect, cleanup]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    reconnectAttempts.current = 0;
    connect();
  }, [connect]);

  return {
    status,
    isConnected,
    error,
    reconnect,
    disconnect: cleanup
  };
};