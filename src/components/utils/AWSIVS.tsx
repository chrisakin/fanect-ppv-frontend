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
}

export function useAWSIVSService({
  playbackUrl,
  chatToken,
  chatApiEndpoint,
  username,
  onPlayerStateChange,
  onChatMessage,
}: AWSIVSServiceProps) {
  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerState, setPlayerState] = useState<string>("IDLE");
  const [isConnected, setIsConnected] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const loadIVSPlayer = useCallback(async () => {
    if (window.IVSPlayer) return window.IVSPlayer;

    const script = document.createElement("script");
    script.src = "https://player.live-video.net/1.29.0/amazon-ivs-player.min.js";
    script.async = true;

    return new Promise((resolve, reject) => {
      script.onload = () => {
        if (window.IVSPlayer) {
          console.log("IVS Player loaded successfully");
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

    const initializePlayer = async () => {
      if (!videoContainerRef.current || !playbackUrl) {
        console.log("Cannot initialize player: missing container or playback URL");
        return;
      }

      try {
        console.log("Initializing IVS Player with URL:", playbackUrl);
        const IVSPlayer = await loadIVSPlayer();
        
        if (!mounted) return;

        if (!IVSPlayer.isPlayerSupported) {
          setPlayerError("IVS Player not supported in this browser");
          console.error("IVS Player not supported");
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

        // Set up event listeners
        player.addEventListener(IVSPlayer.PlayerEventType.INITIALIZED, () => {
          console.log("Player initialized");
          setPlayerState("READY");
          setIsPlayerLoaded(true);
          onPlayerStateChange?.("READY");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.READY, () => {
          console.log("Player ready");
          setPlayerState("READY");
          setIsPlayerLoaded(true);
        });

        player.addEventListener(IVSPlayer.PlayerEventType.PLAYING, () => {
          console.log("Player playing");
          setPlayerState("PLAYING");
          onPlayerStateChange?.("PLAYING");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.BUFFERING, () => {
          console.log("Player buffering");
          setPlayerState("BUFFERING");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.IDLE, () => {
          console.log("Player idle");
          setPlayerState("IDLE");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ENDED, () => {
          console.log("Player ended");
          setPlayerState("ENDED");
          onPlayerStateChange?.("ENDED");
        });

        player.addEventListener(IVSPlayer.PlayerEventType.ERROR, (error: any) => {
          console.error("IVS Player error:", error);
          setPlayerError(`Player error: ${error.type || 'Unknown error'}`);
          setPlayerState("ERROR");
          onPlayerStateChange?.("ERROR");
        });

        // Load the stream
        try {
          console.log("Loading stream:", playbackUrl);
          player.load(playbackUrl);
          
          // Set player properties
          player.setAutoplay(true);
          player.setMuted(false);
          player.setVolume(1.0);
          
          setPlayerError(null);
        } catch (loadError) {
          console.error("Error loading stream:", loadError);
          setPlayerError("Failed to load stream");
        }

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
          console.log("Cleaning up player");
          playerRef.current.delete();
          playerRef.current = null;
        } catch (err) {
          console.error("Error cleaning up player:", err);
        }
      }
      setIsPlayerLoaded(false);
    };
  }, [playbackUrl, loadIVSPlayer, onPlayerStateChange]);

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
        // Clean up existing connection
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }

        // Construct proper WebSocket URL for AWS IVS Chat
        let wsUrl = chatApiEndpoint;
        
        // AWS IVS Chat typically uses wss://edge.ivschat.{region}.amazonaws.com/
        if (!wsUrl.startsWith('ws://') && !wsUrl.startsWith('wss://')) {
          wsUrl = `wss://${wsUrl}`;
        }

        // For AWS IVS Chat, the token should be passed as a query parameter
        const finalUrl = `${wsUrl}?token=${encodeURIComponent(chatToken)}`;

        console.log("Connecting to AWS IVS Chat WebSocket...");

        const socket = new WebSocket(finalUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          console.log("WebSocket connected successfully to AWS IVS Chat");
          setIsConnected(true);
          reconnectAttempts = 0;
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Received chat message:", data);
            
            // Handle different AWS IVS Chat message formats
            if (data.Type === "MESSAGE" || data.type === "MESSAGE") {
              const messageData = data.Data || data.data || data;
              const newMessage = {
                id: messageData.Id || messageData.id || Date.now().toString(),
                sender: messageData.Sender?.UserId || 
                        messageData.sender?.userId || 
                        messageData.Sender?.Attributes?.displayName ||
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
            console.error("Error parsing chat message:", err, event.data);
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

        socket.onclose = (event) => {
          console.log("WebSocket closed:", event.code, event.reason);
          setIsConnected(false);
          
          // Attempt reconnection with exponential backoff
          if (reconnectAttempts < maxReconnectAttempts && event.code !== 1000) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
            reconnectAttempts++;
            console.log(`Reconnecting to chat in ${delay}ms (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
            setTimeout(connectWebSocket, delay);
          } else if (reconnectAttempts >= maxReconnectAttempts) {
            console.error("Max chat reconnection attempts reached");
          }
        };

      } catch (error) {
        console.error("Error creating WebSocket connection:", error);
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
      console.log("Cannot send message: socket not ready or empty content");
      return false;
    }

    try {
      // AWS IVS Chat message format
      const messagePayload = {
        Action: "SEND_MESSAGE",
        Content: content.trim(),
      };

      console.log("Sending chat message:", messagePayload);
      socket.send(JSON.stringify(messagePayload));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }, []);

  const play = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("Attempting to play video");
        playerRef.current.play();
      } catch (error) {
        console.error("Error playing video:", error);
      }
    } else {
      console.log("Cannot play: player not ready");
    }
  }, [isPlayerLoaded]);

  const pause = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("Pausing video");
        playerRef.current.pause();
      } catch (error) {
        console.error("Error pausing video:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setMuted = useCallback((muted: boolean) => {
    if (playerRef.current && isPlayerLoaded) {
      try {
        console.log("Setting muted:", muted);
        playerRef.current.setMuted(muted);
      } catch (error) {
        console.error("Error setting muted:", error);
      }
    }
  }, [isPlayerLoaded]);

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current && isPlayerLoaded && volume >= 0 && volume <= 1) {
      try {
        console.log("Setting volume:", volume);
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