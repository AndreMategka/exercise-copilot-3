import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
    try {
        await mongoose.connect(connectionString);
        console.log('Connected to octofit_db');
        console.log('Seed the octofit_db database with test data');
        await Promise.all([
            Activity.deleteMany({}),
            Leaderboard.deleteMany({}),
            Team.deleteMany({}),
            User.deleteMany({}),
            Workout.deleteMany({}),
        ]);
        const [trailblazers, coreCrew] = await Team.create([
            {
                name: 'Trailblazers',
                description: 'Outdoor runners and hikers focused on endurance goals.',
            },
            {
                name: 'Core Crew',
                description: 'Strength and mobility group building consistent weekly habits.',
            },
        ]);
        const [maya, jordan, priya, leo] = await User.create([
            {
                username: 'maya_runner',
                email: 'maya.runner@example.com',
                displayName: 'Maya Chen',
                team: trailblazers._id,
            },
            {
                username: 'jordan_lifts',
                email: 'jordan.lifts@example.com',
                displayName: 'Jordan Rivera',
                team: coreCrew._id,
            },
            {
                username: 'priya_cycles',
                email: 'priya.cycles@example.com',
                displayName: 'Priya Shah',
                team: trailblazers._id,
            },
            {
                username: 'leo_moves',
                email: 'leo.moves@example.com',
                displayName: 'Leo Martins',
                team: coreCrew._id,
            },
        ]);
        await Promise.all([
            Team.findByIdAndUpdate(trailblazers._id, { members: [maya._id, priya._id] }),
            Team.findByIdAndUpdate(coreCrew._id, { members: [jordan._id, leo._id] }),
        ]);
        await Activity.create([
            {
                user: maya._id,
                type: 'Trail Run',
                durationMinutes: 52,
                caloriesBurned: 540,
                activityDate: new Date('2026-08-05T07:30:00Z'),
            },
            {
                user: jordan._id,
                type: 'Strength Training',
                durationMinutes: 45,
                caloriesBurned: 390,
                activityDate: new Date('2026-08-06T18:00:00Z'),
            },
            {
                user: priya._id,
                type: 'Cycling',
                durationMinutes: 70,
                caloriesBurned: 610,
                activityDate: new Date('2026-08-07T12:15:00Z'),
            },
            {
                user: leo._id,
                type: 'Yoga',
                durationMinutes: 35,
                caloriesBurned: 180,
                activityDate: new Date('2026-08-08T06:45:00Z'),
            },
        ]);
        await Leaderboard.create([
            { user: priya._id, points: 1840, rank: 1 },
            { user: maya._id, points: 1715, rank: 2 },
            { user: jordan._id, points: 1490, rank: 3 },
            { user: leo._id, points: 1260, rank: 4 },
        ]);
        await Workout.create([
            {
                title: 'Morning Endurance Builder',
                description: 'A steady cardio session with intervals for runners and cyclists.',
                difficulty: 'intermediate',
                estimatedMinutes: 45,
                activityTypes: ['Running', 'Cycling'],
            },
            {
                title: 'Total Body Strength Circuit',
                description: 'Compound lifts and bodyweight movements for full-body strength.',
                difficulty: 'intermediate',
                estimatedMinutes: 40,
                activityTypes: ['Strength Training'],
            },
            {
                title: 'Recovery Mobility Flow',
                description: 'Low-impact flexibility and breath work for active recovery days.',
                difficulty: 'beginner',
                estimatedMinutes: 25,
                activityTypes: ['Yoga', 'Mobility'],
            },
        ]);
        console.log('Database seeding complete');
        await mongoose.disconnect();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
