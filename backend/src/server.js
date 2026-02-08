import express from "express";
import path from "path";
import cors from "cors";
import morgan from 'morgan'

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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://talent-iq-mern-project.vercel.app",
  "https://talent-iq-mern-proj-git-fac931-ashish-gautams-projects-20df5274.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    // ✅ allow server-to-server / no-origin requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(null, true); // TEMP: don’t hard-crash backend
  },
  credentials: true,
}));

app.use(morgan('dev'));


// app.options("/*", cors());
                 1
app.use(clerkMiddleware()); // this adds auth fiels to req object: req.auth 

// Inngest endpoint (VERY IMPORTANT)
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Backend running" });
});


// test routes
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});


// start server
app.listen(ENV.PORT, async () => {
  console.log(`Server running on port ${ENV.PORT}`);
  await connectDB();
});
