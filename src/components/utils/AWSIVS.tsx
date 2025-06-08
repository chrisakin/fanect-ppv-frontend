import { useEffect, useRef, useState, useCallback } from "react";
import {
  Player,
  PlayerEventType,
  PlayerState,
} from "amazon-ivs-player";

interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
}

interface AWSIVSServiceProps {
  playbackUrl: string;
  chatApiEndpoint: string; // Backend endpoint for chat REST API
  chatRoomArn: string;
  chatToken: string;
  username: string;
  onPlayerStateChange?: (state: PlayerState) => void;
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
  const playerRef = useRef<Player | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerState.IDLE
  );
  const [isConnected, setIsConnected] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  // --- IVS Player ---
  useEffect(() => {
    if (!videoContainerRef.current || !playbackUrl) return;

    if (!Player.isSupported) {
      console.error("AWS IVS Player is not supported in this browser.");
      setPlayerError("Player not supported in this browser");
      return;
    }

    try {
      const player = Player.create();
      playerRef.current = player;

      const videoEl = player.getVideoElement();
      if (videoContainerRef.current) {
        videoContainerRef.current.appendChild(videoEl);
      }

      const handleStateChange = (state: PlayerState) => {
        setPlayerState(state);
        onPlayerStateChange?.(state);
      };

      player.addEventListener(PlayerEventType.INITIALIZED, () => {
        handleStateChange(PlayerState.READY);
      });
      player.addEventListener(PlayerEventType.PLAYING, () => {
        handleStateChange(PlayerState.PLAYING);
      });
      player.addEventListener(PlayerEventType.ENDED, () => {
        handleStateChange(PlayerState.ENDED);
      });
      player.addEventListener(PlayerEventType.ERROR, (error: Event) => {
        console.error("Player error:", error);
        setPlayerError("Player encountered an error");
        handleStateChange(PlayerState.IDLE);
      });

      player.load(playbackUrl);
      player.setAutoplay(true);

      return () => {
        if (playerRef.current) {
          playerRef.current.delete();
          playerRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing IVS player:", error);
      setPlayerError("Failed to initialize player");
    }
  }, [playbackUrl, onPlayerStateChange]);

  // --- IVS Chat (Polling REST API) ---
  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(
        `${chatApiEndpoint}/messages?chatRoomArn=${encodeURIComponent(
          chatRoomArn
        )}`,
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
        // Only update if there are new messages
        if (formatted.length !== prev.length || 
            formatted.some((msg, i) => msg.id !== prev[i]?.id)) {
          return formatted;
        }
        return prev;
      });

      if (onChatMessage && formatted.length > 0) {
        formatted.forEach((msg) => onChatMessage(msg));
      }
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      setIsConnected(false);
    }
  }, [chatApiEndpoint, chatRoomArn, chatToken, onChatMessage]);

  useEffect(() => {
    if (!chatApiEndpoint || !chatRoomArn || !chatToken) return;

    setIsConnected(true);
    
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
  }, [chatApiEndpoint, chatRoomArn, chatToken, fetchMessages]);

  // --- Send Message ---
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
          sender: username,
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

  // --- Player Controls ---
  const play = useCallback(() => {
    playerRef.current?.play();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pause();
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    playerRef.current?.setMuted(muted);
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (volume >= 0 && volume <= 1) {
      playerRef.current?.setVolume(volume);
    }
  }, []);

  return {
    playerRef,
    videoContainerRef,
    messages,
    isConnected,
    playerState,
    playerError,
    sendMessage,
    play,
    pause,
    setMuted,
    setVolume,
  };
}