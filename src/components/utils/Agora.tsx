import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";

// Define RemoteUser type based on the client
type RemoteUser = ReturnType<typeof AgoraRTC.createClient>['remoteUsers'][number];

interface AgoraViewerServiceProps {
    appId: string;
    channel: string;
    token: string | null;
    uid?: string | number;
    onUserJoined?: (user: RemoteUser) => void;
    onUserLeft?: (user: RemoteUser) => void;
}

export function useAgoraViewerService({
    appId,
    channel,
    token,
    uid,
    onUserJoined,
    onUserLeft,
}: AgoraViewerServiceProps) {
    const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const videoContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        clientRef.current = client;

        let mounted = true;

        async function join() {
            await client.setClientRole("audience");
            await client.join(appId, channel, token || null, uid || null);

            client.on("user-published", async (user: RemoteUser, mediaType: "audio" | "video") => {
                await client.subscribe(user, mediaType);
                if (mediaType === "video" && videoContainerRef.current) {
                    user.videoTrack?.play(videoContainerRef.current);
                }
                if (mediaType === "audio") {
                    user.audioTrack?.play();
                }
                if (mounted) setRemoteUsers(Array.from(client.remoteUsers));
                onUserJoined?.(user);
            });

            client.on("user-unpublished", (user: RemoteUser, mediaType: "audio" | "video") => {
                if (mediaType === "video" && videoContainerRef.current) {
                    user.videoTrack?.stop();
                }
                if (mounted) setRemoteUsers(Array.from(client.remoteUsers));
            });

            client.on("user-left", (user: RemoteUser) => {
                if (mounted) setRemoteUsers(Array.from(client.remoteUsers));
                onUserLeft?.(user);
            });
        }

        join();

        return () => {
            mounted = false;
            client.leave();
            client.removeAllListeners();
            setRemoteUsers([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appId, channel, token, uid]);

    return {
        remoteUsers,
        videoContainerRef,
        client: clientRef.current,
    };
}