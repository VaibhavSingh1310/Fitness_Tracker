import { useMemo, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { addDays, dateKey } from '../utils/helpers.js';

const METRICS = [
  { key: 'minutes', label: 'Minutes' },
  { key: 'calories', label: 'Calories' },
  { key: 'workouts', label: 'Workouts' },
];

// Last 7 days of activity, switchable between minutes, calories and workout count
export default function ProgressCharts({ workouts }) {
  const [metric, setMetric] = useState('minutes');

  const data = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i - 6));
    const rows = Object.fromEntries(
      days.map((d) => [
        dateKey(d),
        { day: d.toLocaleDateString(undefined, { weekday: 'short' }), workouts: 0, minutes: 0, calories: 0 },
      ])
    );
    workouts.forEach((w) => {
      const row = rows[dateKey(w.date)];
      if (row) {
        row.workouts += 1;
        row.minutes += w.duration;
        row.calories += w.calories;
      }
    });
    return days.map((d) => rows[dateKey(d)]);
  }, [workouts]);

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold">Last 7 days</h2>
        <div className="flex rounded-xl bg-black/5 p-1" role="group" aria-label="Chart metric">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              aria-pressed={metric === m.key}
              className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                metric === m.key ? 'bg-white shadow-sm' : 'text-ink/60'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000012" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip cursor={{ fill: '#2447f510' }} />
            <Bar dataKey={metric} fill="#2447f5" radius={[6, 6, 0, 0]} maxBarSize={44} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
