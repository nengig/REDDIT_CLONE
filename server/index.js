import dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as mongoose from "mongoose";
import postRouter from './routes/post_router.js';

import comment_router from './routes/comment_router.js';
import user_router from './routes/user_router.js'
import router from './routes/post_router.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());
app.use('/api/posts', postRouter);

const startServer = async () => {
  try {
    await connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit process if DB fails to connect
  }
};

startServer();
