import { Schema, model } from 'mongoose';

/**
 * User schema: Represents fitness app users with team membership
 */
const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true },
);

/**
 * Team schema: Represents groups of users working toward collective fitness goals
 */
const teamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    caloriesBurned: { type: Number, min: 0, default: 0 },
    activityDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true },
  },
  { timestamps: true },
);

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    difficulty: { type: String, trim: true, default: 'beginner' },
    estimatedMinutes: { type: Number, min: 0, default: 30 },
    activityTypes: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
export const Team = model('Team', teamSchema);
export const Activity = model('Activity', activitySchema);
export const Leaderboard = model('Leaderboard', leaderboardSchema);
export const Workout = model('Workout', workoutSchema);