import express from 'express';
import {ENV} from './lib/env.js';

const app = express();

console.log("Environment Variables:", ENV.PORT);

app.get('/', (req,res) => {
    res.status(200).json({ msg : "success from backkend"});   
});

app.listen(ENV.PORT, () => console.log("server is running on port 3000"));