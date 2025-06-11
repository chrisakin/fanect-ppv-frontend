import { useEffect, useRef, useState, useCallback } from "react";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface AWSIVSServiceProps {
  playbackUrl: string;
  chatApiEndpoint?: string;
  chatRoomArn?: string;
  chatToken?: string;
  username?: string;
  onPlayerStateChange?: (state: string) => void;
  onChatMessage?: (message: ChatMessage) => void;
}

interface ChatApiResponse {
  id: string;
  sender?: string;
  content: string;
  timestamp: string;
}

export function useAWSIVSService({
  playbackUrl,
  chatApiEndpoint,
  chatRoomArn,
  chatToken,
  username,
  onPlayerStateChange,
  onChatMessage,
}: AWSIVSServiceProps) {
  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerState, setPlayerState] = useState<string>("IDLE");
  const [isConnected, setIsConnected] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Dynamically load Amazon IVS Player
  const loadIVSPlayer = useCallback(async () => {
    try {
      // Check if already loaded
      if (window.IVSPlayer) {
        return window.IVSPlayer;
      }

      // Load the script dynamically
      const script = document.createElement('script');
      script.src = 'https://player.live-video.net/1.29.0/amazon-ivs-player.min.js';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.IVSPlayer) {
            resolve(window.IVSPlayer);
          } else {
            reject(new Error('IVS Player failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load IVS Player script'));
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error loading IVS Player:', error);
      throw error;
    }
  }, []);

  // Initialize IVS Player
  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      if (!videoContainerRef.current || !playbackUrl) return;

      try {
        const IVSPlayer = await loadIVSPlayer();
        
        if (!mounted) return;

        if (!IVSPlayer.isPlayerSupported) {
          setPlayerError("IVS Player is not supported in this browser");
          return;
        }

        // Create player instance
        const player = IVSPlayer.create();
        playerRef.current = player;

        // Get video element and append to container
        const videoElement = player.videoElement;
        if (videoContainerRef.current && videoElement) {
          // Clear any existing content
          videoContainerRef.current.innerHTML = '';
          videoContainerRef.current.appendChild(videoElement);
          
          // Style the video element
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
        }

        // Set up event listeners
        player.addEventListener(IVSPlayer.PlayerEventType.INITIALIZED, () => {
          setPlayerState("READY");
          onPlayerStateChange?.("READY");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.PLAYING, () => {
          setPlayerState("PLAYING");
          onPlayerStateChange?.("PLAYING");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ENDED, () => {
          setPlayerState("ENDED");
          onPlayerStateChange?.("ENDED");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ERROR, (error: any) => {
          console.error("IVS Player error:", error);
          setPlayerError("Player encountered an error");
          setPlayerState("ERROR");
          onPlayerStateChange?.("ERROR");
        });

        // Load the stream
        player.load(playbackUrl);
        player.setAutoplay(true);
        
        setIsPlayerLoaded(true);
        setPlayerError(null);

      } catch (error) {
        console.error("Error initializing IVS player:", error);
        setPlayerError("Failed to initialize player");
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.delete();
        } catch (error) {
          console.error("Error cleaning up player:", error);
        }
        playerRef.current = null;
      }
      setIsPlayerLoaded(false);
    };
  }, [playbackUrl, loadIVSPlayer, onPlayerStateChange]);

  // Chat functionality (REST API polling)
  const fetchMessages = useCallback(async () => {
    if (!chatApiEndpoint || !chatRoomArn || !chatToken) return;

    try {
      const res = await fetch(
        `${chatApiEndpoint}/messages?chatRoomArn=${encodeURIComponent(chatRoomArn)}`,
        {
          headers: {
            Authorization: `Bearer ${chatToken}`,
          },
        }
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: ChatApiResponse[] = await res.json();
      const formatted: ChatMessage[] = data.map((msg) => ({
        id: msg.id,
        sender: msg.sender || "Unknown",
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      }));

      setMessages((prev) => {
        if (formatted.length !== prev.length || 
            formatted.some((msg, i) => msg.id !== prev[i]?.id)) {
          return formatted;
        }
        return prev;
      });

      if (onChatMessage && formatted.length > 0) {
        formatted.forEach((msg) => onChatMessage(msg));
      }
      
      setIsConnected(true);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setIsConnected(false);
    }
  }, [chatApiEndpoint, chatRoomArn, chatToken, onChatMessage]);

  // Set up chat polling
  useEffect(() => {
    if (!chatApiEndpoint || !chatRoomArn || !chatToken) return;

    // Initial fetch
    fetchMessages();
    
    // Set up polling
    pollingIntervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [fetchMessages]);

  // Send message function
  const sendMessage = useCallback(async (content: string) => {
    if (!chatApiEndpoint || !chatRoomArn || !chatToken || !content.trim()) {
      return false;
    }
    
    try {
      const res = await fetch(`${chatApiEndpoint}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatToken}`,
        },
        body: JSON.stringify({
          chatRoomArn,
          sender: username || "Anonymous",
          content: content.trim(),
        }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }
      
      // Immediately fetch new messages after sending
      await fetchMessages();
      return true;
    } catch (err) {
      console.error("Error sending chat message:", err);
      return false;
    }
  }, [chatApiEndpoint, chatRoomArn, chatToken, username, fetchMessages]);

  // Player control functions
  const play = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        playerRef.current.play();
      } catch (error) {
        console.error("Error playing:", error);
      }
    }
  }, [isPlayerLoaded]);

  const pause = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        playerRef.current.pause();
      } catch (error) {
        console.error("Error pausing:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setMuted = useCallback((muted: boolean) => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        playerRef.current.setMuted(muted);
      } catch (error) {
        console.error("Error setting mute:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current && isPlayerLoaded && volume >= 0 && volume <= 1) {
      try {
        playerRef.current.setVolume(volume);
      } catch (error) {
        console.error("Error setting volume:", error);
      }
    }
  }, [isPlayerLoaded]);

  return {
    playerRef,
    videoContainerRef,
    messages,
    isConnected,
    playerState,
    playerError,
    isPlayerLoaded,
    sendMessage,
    play,
    pause,
    setMuted,
    setVolume,
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    IVSPlayer: any;
  }
}