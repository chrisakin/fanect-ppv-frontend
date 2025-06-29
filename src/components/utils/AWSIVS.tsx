import { useEffect, useRef, useState, useCallback } from "react";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface AWSIVSServiceProps {
  playbackUrl: string;
  chatRoomArn?: string;
  chatToken?: string;
  username?: string;
  chatApiEndpoint: string;
  onPlayerStateChange?: (state: string) => void;
  onChatMessage?: (message: ChatMessage) => void;
  onStreamEnd?: () => void;
}

export function useAWSIVSService({
  playbackUrl,
  chatToken,
  chatApiEndpoint,
  username,
  onPlayerStateChange,
  onChatMessage,
  onStreamEnd,
}: AWSIVSServiceProps) {
  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamEndedRef = useRef<boolean>(false);
  const hasStartedPlayingRef = useRef<boolean>(false);
  const streamEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stallCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastProgressTimeRef = useRef<number>(0);

  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerState, setPlayerState] = useState<string>("IDLE");
  const [isConnected, setIsConnected] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // Centralized stream end handler
  const handleStreamEnd = useCallback(() => {
    if (streamEndedRef.current) {
      console.log('🔄 Stream end already handled, skipping duplicate call');
      return;
    }
    
    if (!hasStartedPlayingRef.current) {
      console.log('⚠️ Stream has not started playing yet, ignoring end event');
      return;
    }
    
    streamEndedRef.current = true;
    console.log('🎬 STREAM ENDED - Triggering feedback modal');
    setPlayerState("ENDED");
    onPlayerStateChange?.("ENDED");
    onStreamEnd?.();
  }, [onPlayerStateChange, onStreamEnd]);

  // Enhanced stream monitoring
  const startStreamMonitoring = useCallback(() => {
    if (!hasStartedPlayingRef.current || streamEndedRef.current) return;

    const checkStreamHealth = () => {
      if (!playerRef.current || streamEndedRef.current) return;

      try {
        const videoElement = videoContainerRef.current?.querySelector('video');
        if (!videoElement) return;

        const currentTime = videoElement.currentTime;
        const readyState = videoElement.readyState;
        const networkState = videoElement.networkState;
        const paused = videoElement.paused;
        const ended = videoElement.ended;

        console.log('📊 Stream health check:', {
          currentTime,
          readyState,
          networkState,
          paused,
          ended,
          lastProgress: lastProgressTimeRef.current
        });

        // Check if video has ended
        if (ended) {
          console.log('🔚 Video ended detected in health check');
          handleStreamEnd();
          return;
        }

        // Check for network issues
        if (networkState === 3) { // NETWORK_NO_SOURCE
          console.log('🔚 No source detected - stream likely ended');
          handleStreamEnd();
          return;
        }

        // Check for stalled playback (no progress for 15 seconds)
        if (currentTime === lastProgressTimeRef.current && !paused) {
          console.log('🔚 Stream stalled - no progress detected');
          handleStreamEnd();
          return;
        }

        lastProgressTimeRef.current = currentTime;

        // Continue monitoring if stream is still active
        if (!streamEndedRef.current) {
          stallCheckTimeoutRef.current = setTimeout(checkStreamHealth, 5000);
        }
      } catch (error) {
        console.error('❌ Error in stream health check:', error);
      }
    };

    // Start monitoring
    stallCheckTimeoutRef.current = setTimeout(checkStreamHealth, 5000);
  }, [handleStreamEnd]);

  const loadIVSPlayer = useCallback(async () => {
    if (window.IVSPlayer) return window.IVSPlayer;

    const script = document.createElement("script");
    script.src = "https://player.live-video.net/1.29.0/amazon-ivs-player.min.js";
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        if (window.IVSPlayer) {
          console.log("✅ IVS Player loaded successfully");
          resolve(window.IVSPlayer);
        } else {
          reject(new Error("IVS Player failed to load"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load IVS Player script"));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let mounted = true;
    streamEndedRef.current = false;
    hasStartedPlayingRef.current = false;
    lastProgressTimeRef.current = 0;

    const initializePlayer = async () => {
      if (!videoContainerRef.current || !playbackUrl) {
        console.log("⚠️ Cannot initialize player: missing container or playback URL");
        return;
      }

      try {
        console.log("🎥 Initializing IVS Player with URL:", playbackUrl);
        const IVSPlayer = await loadIVSPlayer();
        
        if (!mounted) return;

        if (!IVSPlayer.isPlayerSupported) {
          setPlayerError("IVS Player not supported in this browser");
          console.error("❌ IVS Player not supported");
          return;
        }

        // Create player with configuration
        const player = IVSPlayer.create();
        playerRef.current = player;

        // Create video element and attach to player
        const videoElement = document.createElement("video");
        videoElement.setAttribute("playsinline", "true");
        videoElement.setAttribute("controls", "true");
        videoElement.style.width = "100%";
        videoElement.style.height = "100%";
        videoElement.style.objectFit = "cover";
        videoElement.style.backgroundColor = "#000";

        if (videoContainerRef.current) {
          videoContainerRef.current.innerHTML = "";
          videoContainerRef.current.appendChild(videoElement);
          player.attachHTMLVideoElement(videoElement);
        }

        // Set up IVS Player event listeners
        player.addEventListener(IVSPlayer.PlayerEventType.INITIALIZED, () => {
          console.log("🎬 Player initialized");
          setPlayerState("READY");
          setIsPlayerLoaded(true);
          onPlayerStateChange?.("READY");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.READY, () => {
          console.log("🎬 Player ready");
          setPlayerState("READY");
          setIsPlayerLoaded(true);
        });

        player.addEventListener(IVSPlayer.PlayerEventType.PLAYING, () => {
          console.log("▶️ Player playing - stream has started");
          hasStartedPlayingRef.current = true;
          lastProgressTimeRef.current = videoElement.currentTime;
          setPlayerState("PLAYING");
          onPlayerStateChange?.("PLAYING");
          
          // Start monitoring stream health
          startStreamMonitoring();
        });

        player.addEventListener(IVSPlayer.PlayerEventType.BUFFERING, () => {
          console.log("⏳ Player buffering");
          setPlayerState("BUFFERING");
          onPlayerStateChange?.("BUFFERING");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.IDLE, () => {
          console.log("⏸️ Player idle");
          setPlayerState("IDLE");
          onPlayerStateChange?.("IDLE");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ENDED, () => {
          console.log("🔚 IVS Player ENDED event - Stream finished");
          handleStreamEnd();
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ERROR, (error: any) => {
          console.error("❌ IVS Player error:", error);
          setPlayerError(`Player error: ${error.type || 'Unknown error'}`);
          setPlayerState("ERROR");
          onPlayerStateChange?.("ERROR");
          
          // Treat certain errors as stream end if stream was playing
          if (hasStartedPlayingRef.current && (
            error.type === 'ErrorNotAvailable' || 
            error.type === 'ErrorStreamOffline' ||
            error.type === 'ErrorNetwork' ||
            error.type === 'ErrorDecoder'
          )) {
            console.log("🔚 Stream error indicates stream ended:", error.type);
            handleStreamEnd();
          }
        });

        // Enhanced video element event listeners
        videoElement.addEventListener('ended', () => {
          console.log("🔚 Video element ENDED event");
          handleStreamEnd();
        });

        videoElement.addEventListener('loadedmetadata', () => {
          console.log("📊 Video metadata loaded, duration:", videoElement.duration);
          streamEndedRef.current = false;
          hasStartedPlayingRef.current = false;
          lastProgressTimeRef.current = 0;
        });

        // Progress tracking for live streams
        videoElement.addEventListener('timeupdate', () => {
          if (hasStartedPlayingRef.current && !streamEndedRef.current) {
            lastProgressTimeRef.current = videoElement.currentTime;
            
            // For VOD content with known duration
            if (videoElement.duration && videoElement.duration > 0) {
              const timeRemaining = videoElement.duration - videoElement.currentTime;
              if (timeRemaining < 0.5 && timeRemaining > 0 && videoElement.currentTime > 10) {
                console.log("🔚 Video reached end via timeupdate (VOD)");
                handleStreamEnd();
              }
            }
          }
        });

        // Network and loading error handling
        videoElement.addEventListener('error', (e) => {
          console.error("❌ Video element error:", e);
          if (videoElement.error && hasStartedPlayingRef.current) {
            const errorCode = videoElement.error.code;
            console.log("Video error code:", errorCode);
            
            // Network errors that indicate stream end
            if (errorCode === 2 || errorCode === 4) {
              console.log("🔚 Video error suggests stream ended");
              if (streamEndTimeoutRef.current) {
                clearTimeout(streamEndTimeoutRef.current);
              }
              streamEndTimeoutRef.current = setTimeout(() => {
                if (!streamEndedRef.current && hasStartedPlayingRef.current) {
                  handleStreamEnd();
                }
              }, 3000);
            }
          }
        });

        // Stalled event - enhanced detection
        videoElement.addEventListener('stalled', () => {
          if (hasStartedPlayingRef.current && !streamEndedRef.current) {
            console.log("⚠️ Video stalled - checking if stream ended");
            if (streamEndTimeoutRef.current) {
              clearTimeout(streamEndTimeoutRef.current);
            }
            streamEndTimeoutRef.current = setTimeout(() => {
              if (!streamEndedRef.current && hasStartedPlayingRef.current) {
                // Double-check if we're really stalled
                if (videoElement.readyState < 3 && videoElement.networkState !== 1) {
                  console.log("🔚 Stream appears to have ended due to prolonged stalling");
                  handleStreamEnd();
                }
              }
            }, 8000);
          }
        });

        // Waiting event - clear stall timeout if we start loading again
        videoElement.addEventListener('waiting', () => {
          if (streamEndTimeoutRef.current) {
            clearTimeout(streamEndTimeoutRef.current);
            streamEndTimeoutRef.current = null;
          }
        });

        // Playing event - clear any pending timeouts
        videoElement.addEventListener('playing', () => {
          if (streamEndTimeoutRef.current) {
            clearTimeout(streamEndTimeoutRef.current);
            streamEndTimeoutRef.current = null;
          }
        });

        // Pause event - don't treat as stream end for user-initiated pauses
        videoElement.addEventListener('pause', () => {
          console.log("⏸️ Video paused");
          // Don't trigger stream end for user pauses
        });

        // Load the stream
        try {
          console.log("📡 Loading stream:", playbackUrl);
          player.load(playbackUrl);
          
          // Set player properties
          player.setAutoplay(true);
          player.setMuted(false);
          player.setVolume(1.0);
          
          setPlayerError(null);
        } catch (loadError) {
          console.error("❌ Error loading stream:", loadError);
          setPlayerError("Failed to load stream");
        }

      } catch (error) {
        console.error("❌ Error initializing IVS player:", error);
        setPlayerError("Failed to initialize player");
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      
      // Clear all timeouts
      if (streamEndTimeoutRef.current) {
        clearTimeout(streamEndTimeoutRef.current);
      }
      if (stallCheckTimeoutRef.current) {
        clearTimeout(stallCheckTimeoutRef.current);
      }
      
      if (playerRef.current) {
        try {
          console.log("🧹 Cleaning up player");
          playerRef.current.delete();
          playerRef.current = null;
        } catch (err) {
          console.error("Error cleaning up player:", err);
        }
      }
      
      setIsPlayerLoaded(false);
      streamEndedRef.current = false;
      hasStartedPlayingRef.current = false;
      lastProgressTimeRef.current = 0;
    };
  }, [playbackUrl, loadIVSPlayer, onPlayerStateChange, handleStreamEnd, startStreamMonitoring]);

  useEffect(() => {
    if (!chatToken || !chatApiEndpoint) {
      console.log("Chat not available: missing token or endpoint");
      setIsConnected(false);
      return;
    }

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const baseReconnectDelay = 1000;

    const connectWebSocket = () => {
      try {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }

        let wsUrl = chatApiEndpoint;
        
        if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
          wsUrl = `wss://${wsUrl}`;
        }
        wsUrl.replace(/\/+$/, '');
        const finalUrl = `${wsUrl}`;
        console.log("🔗 Connecting to AWS IVS Chat WebSocket...");

        const socket = new WebSocket(finalUrl, chatToken);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("✅ WebSocket connected successfully to AWS IVS Chat");
          setIsConnected(true);
          reconnectAttempts = 0;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("💬 Received chat message:", data);
            
            if (data.Type === "MESSAGE" || data.type === "MESSAGE") {
              const messageData = data.Data || data.data || data;
              const newMessage = {
                id: messageData.Id || messageData.id || Date.now().toString(),
                sender: messageData.Sender?.Attributes?.displayName ||
                        messageData.sender?.attributes?.displayName ||
                        messageData.username || 
                        username || 'Anonymous',
                content: messageData.Content || messageData.content || "",
                timestamp: new Date(messageData.SendTime || messageData.sendTime || Date.now()),
              };
              
              if (newMessage.content) {
                setMessages((prev) => [...prev, newMessage]);
                onChatMessage?.(newMessage);
              }
            }
          } catch (err) {
            console.error("❌ Error parsing chat message:", err, event.data);
          }
        };

        socket.onerror = (error) => {
          console.error("❌ WebSocket error:", error);
          setIsConnected(false);
        };

        socket.onclose = (event) => {
          console.log("🔌 WebSocket closed:", event.code, event.reason);
          setIsConnected(false);
          
          if (reconnectAttempts < maxReconnectAttempts && event.code !== 1000) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
            reconnectAttempts++;
            console.log(`🔄 Reconnecting to chat in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            setTimeout(connectWebSocket, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.error("❌ Max chat reconnection attempts reached");
          }
        };

      } catch (error) {
        console.error("❌ Error creating WebSocket connection:", error);
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [chatToken, chatApiEndpoint, onChatMessage, username]);

  const sendMessage = useCallback(async (content: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || !content.trim()) {
      console.log("❌ Cannot send message: socket not ready or empty content");
      return false;
    }

    try {
      const messagePayload = {
        Action: "SEND_MESSAGE",
        Content: content.trim(),
      };

      console.log("📤 Sending chat message:", messagePayload);
      socket.send(JSON.stringify(messagePayload));
      return true;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      return false;
    }
  }, []);

  const play = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("▶️ Attempting to play video");
        playerRef.current.play();
      } catch (error) {
        console.error("❌ Error playing video:", error);
      }
    } else {
      console.log("⚠️ Cannot play: player not ready");
    }
  }, [isPlayerLoaded]);

  const pause = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("⏸️ Pausing video");
        playerRef.current.pause();
      } catch (error) {
        console.error("❌ Error pausing video:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setMuted = useCallback((muted: boolean) => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("🔇 Setting muted:", muted);
        playerRef.current.setMuted(muted);
      } catch (error) {
        console.error("❌ Error setting muted:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current && isPlayerLoaded && volume >= 0 && volume <= 1) {
      try {
        console.log("🔊 Setting volume:", volume);
        playerRef.current.setVolume(volume);
      } catch (error) {
        console.error("❌ Error setting volume:", error);
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