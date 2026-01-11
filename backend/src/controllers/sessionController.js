import Session  from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req, res) {
    try {
        const {problem, difficulty} = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty) {
            return res.status(400).json({msg: "problem and difficulty are required"});
        }

        //generate a unique call id for stream video 
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring (7)}`;

        //create session in db
        const session = await Session.create({problem, difficulty, host: userId, callId});

        //create stream video call
        await streamClient.video.call("default", callId).getOrCreate({
            data:{
                created_by_id: clerkId,
                custom: {problem, difficulty, sessionId: session._id.toString()}
            }
        });

        //chat messaging 

        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            members: [clerkId],
        })

        await channel.create();

        res.status(201).json({session});

    } catch (error) {
        console.log("Error in createSession controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});

    }
}

export async function getActiveSessions(_, res) {
    try {
        const sessions = await Session.find({status: "active"})
        .populate("host", "name profileImage email clerkId")
        .populate("participant", "name profileImage email clerkId")
        .sort({createdAt: -1})
        .limit(20);

        res.status(200).json({sessions});
    } catch (error) {
        console.log("Error in getActiveSessions controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export async function getMyRecentSessions(req, res) {
    try {
       // get session where user is host or participant
       const userId = req.user._id; 
       const session = await Session.find({
        status: "completed",
        $or : [{host: userId}, {participants: userId}]
      })
      .sort({createdAt: -1})
      .limit(20);

      res.status(200).json({session});

    } catch (error) {
        console.log("Error in getMyRecentSessions controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
} 

export async function getSessionById(req, res) {
    try {
        const {id} = req.params

        const session = await Session.findById(id)
        .populate("host", "name profileImage email clerkId")
        .populate("participants", "name profileImage email clerkId");
        
        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }

        res.status(200).json({session});

    } catch (error) {
        console.log("Error in getSessionById controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export async function joinSession(req, res) {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);

        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }

        if(session.status !== "active") {
            return res.status(400).json({msg: "Cannot join a completed session"});
        }

        //if you are the host you cannot join as participant
        if(session.host.toString() === userId.toString()) {
            return res.status(400).json({msg: "Host cannot join as participant"});
        }

        //check if session is already full - has a participant
        if(session.participants) {
            return res.status(409).json({msg: "Session is already full"});
        }

        //add participant to session
        session.participants = userId;
        await session.save();
        
        //add user to stream video call
        const channel = chatClient.channel("messaging", session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session});

    } catch (error) {
        console.log("Error in joinSession controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}

export async function endSession(req, res) {
    try {
        const {id} = req.params;
        const userId = req.user._id;

        const session = await Session.findById(id);

        if(!session) {
            return res.status(404).json({msg: "Session not found"});
        }

        //only host can end session
        if(session.host.toString() !== userId.toString()) {
            return res.status(403).json({msg: "Only host can end the session"});
        }

        //check if session is already completed
        if(session.status === "completed") {
            return res.status(400).json({msg: "Session is already completed"});
        }

        //delete stream video call
        const call = streamClient.video.call("default", session.callId);
        await call.delete({hard: true});

        //delete chat channel  
        const channel = chatClient.channel("messaging", session.callId);
        await channel.delete();

        //end session
        session.status = "completed";
        await session.save();

        res.status(200).json({session, message: "Session ended successfully" });
    } catch (error) {
        console.log("Error in endSession Controller : ", error.message);
        res.status(500).json({message: "Internal Server error"});
    }
}