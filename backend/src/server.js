import express from "express";
import path from "path";
import cors from "cors";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import {clerkMiddleware} from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";


const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());

app.use(cors({ origin: ENV.CLIENT_URL,credentials: true,
  })
);
app.use(clerkMiddleware()); // this adds auth fiels to req object: req.auth 

// Inngest endpoint (VERY IMPORTANT)
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

// test routes
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});


// start server
app.listen(ENV.PORT, async () => {
  console.log(`Server running on port ${ENV.PORT}`);
  await connectDB();
});
