import express from "express";
import path from "path";
import cors from "cors";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());

app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);

// Inngest endpoint (VERY IMPORTANT)
app.use("/api/inngest", serve({ client: inngest, functions }));

// test routes
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ msg: "this is the books endpoint" });
});

// start server
app.listen(ENV.PORT, async () => {
  console.log(`Server running on port ${ENV.PORT}`);
  await connectDB();
});
