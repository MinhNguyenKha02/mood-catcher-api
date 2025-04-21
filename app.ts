// we will start here, I call a main code flow

import express from 'express';
import dotenv from 'dotenv';
// Load .env variables
dotenv.config();
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import routes from './routes/index.route'; // Ensure routes/index.ts exists

// Initialize Express
const app = express();


// Global middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded/converted audio files if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api', routes);

// Health check
app.get('/', (_req, res) => {
    res.send('🎧 Mood Catcher API is up and running');
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
    console.error('❗ Unexpected error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
