import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-center text-sm text-ink/60">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}
