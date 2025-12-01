// Vercel serverless function wrapper for Express app
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import from server directory
import { connectDB } from '../server/src/utils/db.js';
import authRoutes from '../server/src/routes/authRoutes.js';
import postRoutes from '../server/src/routes/postRoutes.js';
import aiRoutes from '../server/src/routes/aiRoutes.js';

// Environment variables (Vercel provides these directly)
const envKeys = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV || 'production',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: envKeys.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// Connect to MongoDB (reuse connections)
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await connectDB(envKeys.MONGO_URI);
  } catch (err) {
    console.error('MongoDB connect error:', err);
    throw err;
  }
};

// Serverless function handler
export default async (req, res) => {
  try {
    // Log request for debugging
    console.log(`${req.method} ${req.url}`);
    
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    });
  }
};
