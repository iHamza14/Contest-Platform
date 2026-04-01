import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/auth.routes';
import contestRoutes from './routes/contest.routes';
import submissionRoutes from './routes/submission.routes';

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/execute', submissionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});