import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (loadingSession || !session || !user) return;

    // Check if user is participant/host only after session is loaded
    const isUserHost = session.host?.clerkId === user.id;
    const isUserParticipant = session.participant?.clerkId === user.id;

    if (!isUserHost && !isUserParticipant) return;
    if (session.status === "completed") return;

    let videoCall;
    let chatClientInstance;

    const initCall = async () => {
      setIsInitializingCall(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Failed to get authentication token");

        const streamTokenData = await sessionApi.getStreamToken(token);
        const { token: streamToken, userId, userName, userImage } = streamTokenData;

        const client = await initializeStreamClient(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          streamToken
        );

        setStreamClient(client);

        videoCall = client.call("default", session.callId);
        await videoCall.join({ create: true });
        setCall(videoCall);

        const apiKey = import.meta.env.VITE_STREAM_API_KEY;
        chatClientInstance = StreamChat.getInstance(apiKey);

        await chatClientInstance.connectUser(
          {
            id: userId,
            name: userName,
            image: userImage,
          },
          streamToken
        );
        setChatClient(chatClientInstance);

        const chatChannel = chatClientInstance.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (error) {
        toast.error("Failed to join video call");
        console.error("Error init call", error);
      } finally {
        setIsInitializingCall(false);
      }
    };

    initCall();

    return () => {
      // iife cleanup
      (async () => {
        try {
          if (videoCall) await videoCall.leave();
          if (chatClientInstance) await chatClientInstance.disconnectUser();
          await disconnectStreamClient();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      })();
    };
  }, [session, loadingSession, user]);

  return {
    streamClient,
    call,
    chatClient,
    channel,
    isInitializingCall,
  };
}

export default useStreamClient;