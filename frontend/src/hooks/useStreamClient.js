import { useState, useEffect, useRef } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";
import { initializeStreamClient, disconnectStreamClient } from "../lib/stream";
import { sessionApi } from "../api/sessions";

function useStreamClient(session, loadingSession, isHost, isParticipant) {
  const [streamClient, setStreamClient] = useState(null);
  const [call, setCall] = useState(null);
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isInitializingCall, setIsInitializingCall] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  // Prevent duplicate initialization and track cleanup references
  const hasInitializedRef = useRef(false);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (loadingSession || !session || !user) return;
    if (!isHost && !isParticipant) return;
    if (session.status === "completed") return;

    // Don't re-initialize if already connected for this session
    if (hasInitializedRef.current) return;

    let cancelled = false;

    const initCall = async () => {
      setIsInitializingCall(true);
      let videoCall;
      let chatClientInstance;

      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const streamTokenData = await sessionApi.getStreamToken(token);
        if (cancelled) return;

        const { token: streamToken, userId, userName, userImage } = streamTokenData;

        const client = await initializeStreamClient(
          { id: userId, name: userName, image: userImage },
          streamToken
        );
        if (cancelled) return;

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        if (cancelled) return;
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          { id: userId, name: userName, image: userImage },
          streamToken
        );
        if (cancelled) return;
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        if (cancelled) return;
        setChannel(chatChannel);

        hasInitializedRef.current = true;

        // Store references for cleanup on unmount
        cleanupRef.current = { videoCall, chatClientInstance };
      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to join video call");
          console.error("Error init call", error);
        }
      } finally {
        if (!cancelled) setIsInitializingCall(false);
      }
    };

    initCall();

    return () => {
      cancelled = true;
    };
    // Use stable dependencies - NOT the full `session` object which changes every 5s on refetch
  }, [session?.callId, session?.status, loadingSession, user?.id, isHost, isParticipant]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      (async () => {
        try {
          const refs = cleanupRef.current;
          if (refs?.videoCall) await refs.videoCall.leave();
          if (refs?.chatClientInstance) await refs.chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
      hasInitializedRef.current = false;
      cleanupRef.current = null;
    };
  }, []);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;