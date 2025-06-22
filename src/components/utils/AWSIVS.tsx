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
  chatRoomArn,
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
      script.onload = () => window.IVSPlayer ? resolve(window.IVSPlayer) : reject(new Error("IVS Player failed to load"));
      script.onerror = () => reject(new Error("Failed to load IVS Player script"));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializePlayer = async () => {
      if (!videoContainerRef.current || !playbackUrl) return;

      try {
        const IVSPlayer = await loadIVSPlayer();
        if (!mounted || !IVSPlayer.isPlayerSupported) {
          setPlayerError("IVS Player not supported");
          return;
        }

        const player = IVSPlayer.create();
        playerRef.current = player;

        const videoElement = player.videoElement;
        if (videoContainerRef.current && videoElement) {
          videoContainerRef.current.innerHTML = '';
          videoContainerRef.current.appendChild(videoElement);
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
        }

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
          setPlayerError("Player error");
          setPlayerState("ERROR");
          onPlayerStateChange?.("ERROR");
          console.error("IVS Player error:", error);
        });

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
        } catch (err) {
          console.error("Error cleaning up player:", err);
        }
      }
      setIsPlayerLoaded(false);
    };
  }, [playbackUrl, loadIVSPlayer, onPlayerStateChange]);

  useEffect(() => {
    if (!chatToken || !chatRoomArn) return;
    const baseUrl = chatApiEndpoint.split('#')[0]; // remove any fragment
      const wsUrl = `${baseUrl}?token=${encodeURIComponent(chatToken)}`; // IVS chat WebSocket endpoint
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      socket.send(JSON.stringify({ action: "CONNECT", token: chatToken }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.event === "MESSAGE") {
          const newMessage = {
            id: data.messageId,
            sender: data.sender?.attributes?.displayName || data.sender.userId,
            content: data.content,
            timestamp: new Date(data.sendTime),
          };
          setMessages((prev) => [...prev, newMessage]);
          onChatMessage?.(newMessage);
        }
      } catch (err) {
        console.error("Error parsing IVS chat message", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [chatToken, chatRoomArn, onChatMessage]);

      useEffect(() => {
  return () => {
    if (playerRef.current) {
      playerRef.current.delete?.();
      playerRef.current = null;
    }
  };
}, []);

  const sendMessage = useCallback(async (content: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || !content.trim()) return false;

    socket.send(
      JSON.stringify({
        username,
        action: "SEND_MESSAGE",
        content: content.trim(),
      })
    );

    return true;
  }, []);

  const play = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) playerRef.current.play();
  }, [isPlayerLoaded]);

  const pause = useCallback(() => {
    if (playerRef.current && isPlayerLoaded) playerRef.current.pause();
  }, [isPlayerLoaded]);

  const setMuted = useCallback((muted: boolean) => {
    if (playerRef.current && isPlayerLoaded) playerRef.current.setMuted(muted);
  }, [isPlayerLoaded]);

  const setVolume = useCallback((volume: number) => {
    if (playerRef.current && isPlayerLoaded && volume >= 0 && volume <= 1) {
      playerRef.current.setVolume(volume);
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