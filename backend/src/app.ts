import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './route/authRoutes';
import contestRoutes from './route/contestRoutes';
import submissionRoutes from './route/submissionRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/submissions', submissionRoutes);

export default app;