import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import db from './config/database.js';
import { Activity, Leaderboard, Team, User, Workout } from './models.js';
const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

app.use(cors());
app.use(express.json());

app.get('/api/users/', async (_req, res, next) => {
  try {
    const users = await User.find().populate('team').lean();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/teams/', async (_req, res, next) => {
  try {
    const teams = await Team.find().populate('members').lean();
    res.json(teams);
  } catch (error) {
    next(error);
  }
});

app.get('/api/activities/', async (_req, res, next) => {
  try {
    const activities = await Activity.find().populate('user').sort({ activityDate: -1 }).lean();
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

app.get('/api/leaderboard/', async (_req, res, next) => {
  try {
    const leaderboard = await Leaderboard.find().populate('user').sort({ rank: 1 }).lean();
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

app.get('/api/workouts/', async (_req, res, next) => {
  try {
    const workouts = await Workout.find().lean();
    res.json(workouts);
  } catch (error) {
    next(error);
  }
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    service: 'octofit-tracker-backend',
    status: 'ok',
    apiBaseUrl,
    mongoConnectionReadyState: db.readyState,
  });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`OctoFit backend is running at ${apiBaseUrl}`);
});
