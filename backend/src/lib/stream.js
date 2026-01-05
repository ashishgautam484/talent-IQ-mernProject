import StreamChatPkg from "stream-chat";
import { ENV } from "./env.js";

const { StreamChat } = StreamChatPkg;

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("Stream user upserted:", userData.id);
  } catch (err) {
    console.error("Stream upsert error:", err);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("Stream user deleted:", userId);
  } catch (err) {
    console.error("Stream delete error:", err);
  }
};
