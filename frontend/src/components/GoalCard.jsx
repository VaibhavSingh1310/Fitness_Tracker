import { Trash2 } from 'lucide-react';
import { fmtDate } from '../utils/helpers.js';

export const GOAL_UNITS = { workouts: 'workouts', minutes: 'min', calories: 'kcal' };

export default function GoalCard({ goal, onDelete }) {
  const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
  const done = goal.currentValue >= goal.targetValue;
  const expired = !done && new Date(goal.deadline) < new Date();
  const unit = GOAL_UNITS[goal.metric];

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold">{goal.title}</h3>
          <p className="text-sm text-ink/60">
            {done ? 'Completed' : expired ? 'Missed' : 'Due'} · {fmtDate(goal.deadline)}
          </p>
        </div>
        {onDelete && (
          <button className="btn-ghost text-red-600" onClick={() => onDelete(goal)} aria-label={`Delete goal ${goal.title}`}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-black/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${goal.title} progress`}
      >
        <div
          className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : expired ? 'bg-red-400' : 'bg-brand'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm">
        <span className="font-semibold">{goal.currentValue}</span> / {goal.targetValue} {unit}
        <span className="text-ink/60"> · {pct}%</span>
      </p>
    </div>
  );
}
