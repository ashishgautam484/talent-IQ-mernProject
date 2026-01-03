import express from 'express';
import {ENV} from './lib/env.js';
import path from 'path';
import cors from "cors";
import {connectDB} from './lib/db.js';


const app = express();

const __dirname = path.resolve();

app.use(express.json());

// credentials : true to allow cookies to be sent
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  })
);


app.get('/health', (req,res) => {
    res.status(200).json({ msg : "success from backend"});   
});

app.get('/books', (req,res) => {
    res.status(200).json({ msg : "This is the books endpoint"});   
});


app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`)
    connectDB();
});