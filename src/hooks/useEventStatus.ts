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

    // Prevent multiple connections
    if (eventSourceRef.current) {
      console.log('⚠️ SSE connection already exists for event:', eventId);
      return;
    }

    let eventSource: EventSource | null = null;

    const createConnection = () => {
      if (!mountedRef.current) return;
      
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
            
            const data: EventStatusMessage = JSON.parse(event.data).data;
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

    // Cleanup function
    return () => {
      console.log('🧹 Effect cleanup for event:', eventId);
      mountedRef.current = false;
      
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