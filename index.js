import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import "dotenv/config.js";

const {PORT} = process.env;

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());



app.listen(PORT, () => {
    console.log("server connected")
})
