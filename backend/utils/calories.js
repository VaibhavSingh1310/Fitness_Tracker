// Rough estimate: MET x body weight (kg) x hours. Assumes 70 kg when weight is unknown.
const MET = {
  Running: 9.8,
  Cycling: 7.5,
  Walking: 3.8,
  Swimming: 8,
  Weightlifting: 5,
  Yoga: 3,
  HIIT: 10,
  Other: 5,
};

export const estimateCalories = (type, minutes, weightKg = 70) =>
  Math.round((MET[type] ?? MET.Other) * weightKg * (Number(minutes) / 60));
