import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import GoalCard from '../components/GoalCard.jsx';
import { addDays, dateKey, endOfInputDate, errMsg, startOfDay } from '../utils/helpers.js';

const blank = () => ({
  title: '',
  metric: 'workouts',
  targetValue: '',
  deadline: dateKey(addDays(new Date(), 6)), // default: a 7-day goal starting today
});

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(blank());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.get('/goals').then((r) => setGoals(r.data)).catch((e) => setError(errMsg(e)));

  useEffect(() => {
    load();
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/goals', {
        title: form.title,
        metric: form.metric,
        targetValue: Number(form.targetValue),
        startDate: startOfDay().toISOString(),
        deadline: endOfInputDate(form.deadline),
      });
      setForm(blank());
      await load();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (goal) => {
    if (!window.confirm(`Delete goal "${goal.title}"?`)) return;
    try {
      await api.delete(`/goals/${goal._id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Goals</h1>

      <form onSubmit={submit} className="card grid gap-4 sm:grid-cols-2">
        <h2 className="text-lg font-extrabold sm:col-span-2">New goal</h2>
        {error && <p className="error sm:col-span-2" role="alert">{error}</p>}
        <div className="sm:col-span-2">
          <label className="label" htmlFor="title">Title</label>
          <input id="title" className="input" placeholder="Workout 4 times this week" value={form.title} onChange={set('title')} required />
        </div>
        <div>
          <label className="label" htmlFor="metric">Measure</label>
          <select id="metric" className="input" value={form.metric} onChange={set('metric')}>
            <option value="workouts">Number of workouts</option>
            <option value="minutes">Active minutes</option>
            <option value="calories">Calories burned</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="target">Target</label>
          <input id="target" type="number" min="1" className="input" value={form.targetValue} onChange={set('targetValue')} required />
        </div>
        <div>
          <label className="label" htmlFor="deadline">Deadline</label>
          <input id="deadline" type="date" className="input" value={form.deadline} min={dateKey(new Date())} onChange={set('deadline')} required />
        </div>
        <div className="flex items-end justify-end">
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Add goal'}</button>
        </div>
      </form>

      {goals.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((g) => <GoalCard key={g._id} goal={g} onDelete={remove} />)}
        </div>
      ) : (
        <p className="text-sm text-ink/60">No goals yet. Add one above and your progress will update as you log workouts.</p>
      )}
    </div>
  );
}
