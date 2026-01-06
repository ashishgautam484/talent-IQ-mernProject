import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try{
        //using clerk id instead of mongodb id - it should match with the user id in stream dasboard which is clerk id
        const token = chatClient.createToken(req.user.clerkId); 

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image,
        });
    } catch (error) {
             console.log(" Error in getStreamToken Controller:", error.message);
                res.status(500).json({ msg: "Internal server error" });
    }
} 