import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Timer, Flame, Plus } from 'lucide-react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressCharts from '../components/ProgressCharts.jsx';
import GoalCard from '../components/GoalCard.jsx';
import { addDays, dateKey, errMsg, startOfDay } from '../utils/helpers.js';

function Stat({ icon: Icon, label, value, sub }) {
  return (
    <div className="card flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
        <Icon size={22} />
      </span>
      <div>
        <p className="text-sm text-ink/60">{label}</p>
        <p className="font-display text-2xl font-extrabold leading-tight">{value}</p>
        <p className="text-xs text-ink/50">{sub}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const from = startOfDay(addDays(new Date(), -6)).toISOString();
        const [w, g] = await Promise.all([
          api.get('/workouts', { params: { from, limit: 500 } }),
          api.get('/goals'),
        ]);
        setWorkouts(w.data.workouts);
        setGoals(g.data);
      } catch (err) {
        setError(errMsg(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const today = dateKey(new Date());
    const sum = (list, k) => list.reduce((n, w) => n + w[k], 0);
    const todays = workouts.filter((w) => dateKey(w.date) === today);
    return {
      workouts: workouts.length,
      minutes: sum(workouts, 'duration'),
      calories: sum(workouts, 'calories'),
      todayLine: `Today: ${todays.length} workout${todays.length === 1 ? '' : 's'}, ${sum(todays, 'duration')} min`,
    };
  }, [workouts]);

  const activeGoals = goals
    .filter((g) => g.currentValue < g.targetValue && new Date(g.deadline) >= new Date())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Hi, {user.name.split(' ')[0]}</h1>
          <p className="text-ink/60">{stats.todayLine}</p>
        </div>
        <Link to="/log" className="btn"><Plus size={16} /> Log workout</Link>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink/60">Loading your week…</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat icon={Dumbbell} label="Workouts" value={stats.workouts} sub="last 7 days" />
            <Stat icon={Timer} label="Active minutes" value={stats.minutes} sub="last 7 days" />
            <Stat icon={Flame} label="Calories burned" value={stats.calories.toLocaleString()} sub="last 7 days" />
          </div>

          <ProgressCharts workouts={workouts} />

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Active goals</h2>
              <Link to="/goals" className="text-sm font-semibold text-brand">Manage goals</Link>
            </div>
            {activeGoals.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {activeGoals.map((g) => <GoalCard key={g._id} goal={g} />)}
              </div>
            ) : (
              <p className="card text-sm text-ink/60">
                No active goals. <Link to="/goals" className="font-semibold text-brand">Set a weekly goal</Link> to track your progress here.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
