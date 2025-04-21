import dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import postRouter from './routes/post_router.js';
import userRouter from './routes/user_router.js'; // 👈 import user routes
import commentRouter from './routes/comment_router.js';
import community_router from "./routes/community_router.js";
import folow_router from "./routes/follow_router.js";

dotenv.config();
const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(json()); // to parse JSON bodies
app.use(cookieParser()); // to handle cookies

// Routes
app.use("/comment", commentRouter); //comment & votes routes
app.use("/user", userRouter); //log and register routes
// app.use('/api/posts', postRouter);
app.use('/posts', postRouter);
app.use("/community", community_router);
app.use("/follow", folow_router);

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
