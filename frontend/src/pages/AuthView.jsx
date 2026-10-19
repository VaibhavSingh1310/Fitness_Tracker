import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../utils/helpers.js';

export default function AuthView({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isRegister) await register(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm space-y-4 p-7">
        <div>
          <span className="mb-4 flex items-center gap-2 font-display text-xl font-extrabold">
            <Activity className="text-brand" size={22} /> Stride
          </span>
          <h1 className="text-2xl font-extrabold">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        </div>

        {error && <p className="error" role="alert">{error}</p>}

        {isRegister && (
          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" className="input" value={form.name} onChange={set('name')} required autoComplete="name" />
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" className="input" value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="input"
            value={form.password}
            onChange={set('password')}
            required
            minLength={isRegister ? 8 : undefined}
            autoComplete={isRegister ? 'new-password' : 'current-password'}
          />
          {isRegister && <p className="mt-1 text-xs text-ink/60">At least 8 characters.</p>}
        </div>

        <button className="btn w-full" disabled={busy}>
          {busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}
        </button>

        <p className="text-center text-sm text-ink/70">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <Link className="font-semibold text-brand" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Log in' : 'Create an account'}
          </Link>
        </p>
      </form>
    </div>
  );
}
