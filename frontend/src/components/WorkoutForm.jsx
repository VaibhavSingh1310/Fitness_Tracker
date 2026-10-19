import { useState } from 'react';
import api from '../api/axios.js';
import { dateKey, fromInputDate, errMsg } from '../utils/helpers.js';

export const WORKOUT_TYPES = ['Running', 'Cycling', 'Walking', 'Swimming', 'Weightlifting', 'Yoga', 'HIIT', 'Other'];

// LoggerForm: creates a workout, or edits one when `initial` is passed
export default function WorkoutForm({ initial, onSaved, onCancel }) {
  const editing = Boolean(initial?._id);
  const [form, setForm] = useState({
    type: initial?.type || 'Running',
    duration: initial?.duration ?? '',
    calories: initial?.calories ?? '',
    date: dateKey(initial?.date || new Date()),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const payload = {
      type: form.type,
      duration: Number(form.duration),
      // null asks the server to estimate calories from type and duration
      calories: form.calories === '' ? null : Number(form.calories),
      date: fromInputDate(form.date),
    };
    try {
      const { data } = editing
        ? await api.put(`/workouts/${initial._id}`, payload)
        : await api.post('/workouts', payload);
      onSaved?.(data);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <p className="error" role="alert">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="type">Activity</label>
          <select id="type" className="input" value={form.type} onChange={set('type')}>
            {WORKOUT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input id="date" type="date" className="input" value={form.date} onChange={set('date')} max={dateKey(new Date())} required />
        </div>
        <div>
          <label className="label" htmlFor="duration">Duration (minutes)</label>
          <input id="duration" type="number" min="1" max="1440" className="input" value={form.duration} onChange={set('duration')} required />
        </div>
        <div>
          <label className="label" htmlFor="calories">Calories burned</label>
          <input id="calories" type="number" min="0" className="input" placeholder="Leave blank to estimate" value={form.calories} onChange={set('calories')} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        )}
        <button className="btn" disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save changes' : 'Log workout'}
        </button>
      </div>
    </form>
  );
}
