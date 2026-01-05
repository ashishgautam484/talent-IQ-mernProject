import {streamChat} from "stream-chat";

import {ENV} from "./env.js";


const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_KEY;

if(!apiKey || !apiSecret) {
    console.error(" STREAM_API_KEY and STREAM_API_KEY is missing")

}

export const chatClient = streamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try{
        await chatClient.upsertUser(userData);  
        console.log("Stream user upserted successfully :", userData);
    } catch(error) {
        console.error("Error upserting Stream user:", error);
    }
}

export const deleteStreamUser = async(userData) => {
    try{
        await chatClient.deleteUser(userId);  
        console.log("Stream user deleted successfully :", userId);
    } catch(error) {
        console.error("Error deleting Stream user:", error);
    }
}