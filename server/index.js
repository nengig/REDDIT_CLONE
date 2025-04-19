// server.js
import dotenv from 'dotenv';
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import postsRouter from './routes/post_router.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(json());
app.use('/api/posts', postsRouter);

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
