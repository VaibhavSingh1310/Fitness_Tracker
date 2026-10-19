import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios.js';
import WorkoutForm from './WorkoutForm.jsx';
import { fmtDate, errMsg } from '../utils/helpers.js';

const PAGE_SIZE = 10;

export default function WorkoutList() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ workouts: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/workouts', { params: { page, limit: PAGE_SIZE } });
      // Deleting the last row of a later page should step back one page
      if (res.data.workouts.length === 0 && page > 1) setPage(page - 1);
      else setData(res.data);
      setError('');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (w) => {
    if (!window.confirm(`Delete this ${w.type} workout?`)) return;
    try {
      await api.delete(`/workouts/${w._id}`);
      load();
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <div className="card p-0">
      {error && <p className="error m-4" role="alert">{error}</p>}

      {!loading && data.total === 0 ? (
        <div className="p-10 text-center">
          <p className="font-semibold">No workouts yet</p>
          <p className="mt-1 text-sm text-ink/60">Log your first session to start your history.</p>
          <Link to="/log" className="btn mt-4">Log a workout</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b border-black/5 text-ink/60">
              <tr>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Activity</th>
                <th className="px-5 py-3 font-medium">Minutes</th>
                <th className="px-5 py-3 font-medium">Calories</th>
                <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {data.workouts.map((w) => (
                <tr key={w._id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3">{fmtDate(w.date)}</td>
                  <td className="px-5 py-3 font-medium">{w.type}</td>
                  <td className="px-5 py-3">{w.duration}</td>
                  <td className="px-5 py-3">{w.calories}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button className="btn-ghost" onClick={() => setEditing(w)} aria-label={`Edit ${w.type} workout`}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn-ghost text-red-600" onClick={() => remove(w)} aria-label={`Delete ${w.type} workout`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.pages > 1 && (
        <div className="flex items-center justify-between border-t border-black/5 px-5 py-3 text-sm">
          <span className="text-ink/60">Page {page} of {data.pages} · {data.total} workouts</span>
          <div className="flex gap-1">
            <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
              <ChevronLeft size={16} />
            </button>
            <button className="btn-ghost" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Edit workout">
          <div className="card w-full max-w-lg">
            <h2 className="mb-4 text-xl font-extrabold">Edit workout</h2>
            <WorkoutForm
              initial={editing}
              onCancel={() => setEditing(null)}
              onSaved={() => {
                setEditing(null);
                load();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
