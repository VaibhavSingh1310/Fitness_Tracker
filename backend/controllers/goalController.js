import Goal from '../models/Goal.js';
import Workout from '../models/Workout.js';
import asyncHandler from '../utils/asyncHandler.js';

// Progress is derived from logged workouts inside the goal's window,
// so the stored currentValue never drifts when workouts are edited or deleted.
const progressFor = async (goal) => {
  const [r] = await Workout.aggregate([
    { $match: { user: goal.user, date: { $gte: goal.startDate, $lte: goal.deadline } } },
    {
      $group: {
        _id: null,
        workouts: { $sum: 1 },
        minutes: { $sum: '$duration' },
        calories: { $sum: '$calories' },
      },
    },
  ]);
  return r ? r[goal.metric] : 0;
};

export const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1 });
  await Promise.all(
    goals.map(async (g) => {
      const value = await progressFor(g);
      if (value !== g.currentValue) {
        g.currentValue = value;
        await g.save();
      }
    })
  );
  res.json(goals);
});

export const createGoal = asyncHandler(async (req, res) => {
  const { title, metric, targetValue, deadline, startDate } = req.body;
  const goal = new Goal({ user: req.user._id, title, metric, targetValue, deadline, startDate: startDate || undefined });
  goal.currentValue = deadline ? await progressFor(goal) : 0;
  await goal.save();
  res.status(201).json(goal);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });

  ['title', 'metric', 'targetValue', 'deadline', 'startDate'].forEach((k) => {
    if (req.body[k] !== undefined) goal[k] = req.body[k];
  });
  goal.currentValue = await progressFor(goal);
  await goal.save();
  res.json(goal);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  res.json({ message: 'Goal deleted' });
});
