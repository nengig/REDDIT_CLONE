import express, { json } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/post_router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use('/posts', router);

console.log(process.env.MONGODB_URI);

// Connect to MongoDB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('DB connection failed', err);
    process.exit(1);
  }
};

// Start server
startServer();

// Catch-all
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});
