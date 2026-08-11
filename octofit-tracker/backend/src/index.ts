import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import db from './config/database.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    service: 'octofit-tracker-backend',
    status: 'ok',
    mongoConnectionReadyState: db.readyState,
  });
});

app.listen(port, () => {
  console.log(`OctoFit backend is running on port ${port}`);
});
