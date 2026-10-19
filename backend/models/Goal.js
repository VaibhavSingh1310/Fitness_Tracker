import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
    targetValue: { type: Number, required: true, min: [1, 'Target must be at least 1'] },
    currentValue: { type: Number, default: 0 },
    metric: { type: String, enum: ['workouts', 'minutes', 'calories'], required: true },
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: [true, 'Deadline is required'] },
  },
  { timestamps: true }
);

export default mongoose.model('Goal', goalSchema);
