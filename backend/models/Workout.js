import mongoose from 'mongoose';

export const WORKOUT_TYPES = ['Running', 'Cycling', 'Walking', 'Swimming', 'Weightlifting', 'Yoga', 'HIIT', 'Other'];

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: { values: WORKOUT_TYPES, message: 'Unknown activity type' }, required: true },
  duration: { type: Number, required: [true, 'Duration is required'], min: [1, 'Duration must be at least 1 minute'], max: 1440 },
  calories: { type: Number, min: 0, default: 0 },
  date: { type: Date, default: Date.now },
});

workoutSchema.index({ user: 1, date: -1 });

export default mongoose.model('Workout', workoutSchema);
