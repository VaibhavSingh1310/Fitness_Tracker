import Workout from '../models/Workout.js';
import asyncHandler from '../utils/asyncHandler.js';
import { estimateCalories } from '../utils/calories.js';

// GET /api/workouts?page=1&limit=10&from=ISO&to=ISO
export const getWorkouts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const filter = { user: req.user._id };

  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to) filter.date.$lte = new Date(req.query.to);
  }

  const [total, workouts] = await Promise.all([
    Workout.countDocuments(filter),
    Workout.find(filter).sort({ date: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
  ]);

  res.json({ workouts, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});

export const createWorkout = asyncHandler(async (req, res) => {
  const { type, duration, calories, date } = req.body;
  const workout = await Workout.create({
    user: req.user._id,
    type,
    duration,
    calories: calories ?? estimateCalories(type, duration),
    date: date || undefined,
  });
  res.status(201).json(workout);
});

export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!workout) return res.status(404).json({ message: 'Workout not found' });

  const { type, duration, calories, date } = req.body;
  if (type !== undefined) workout.type = type;
  if (duration !== undefined) workout.duration = duration;
  if (date) workout.date = date;
  // null means "re-estimate"; undefined means "leave as is"
  if (calories === null) workout.calories = estimateCalories(workout.type, workout.duration);
  else if (calories !== undefined) workout.calories = calories;

  await workout.save();
  res.json(workout);
});

export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!workout) return res.status(404).json({ message: 'Workout not found' });
  res.json({ message: 'Workout deleted' });
});
