import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import AuthView from './pages/AuthView.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LogWorkout from './pages/LogWorkout.jsx';
import History from './pages/History.jsx';
import Goals from './pages/Goals.jsx';

function Shell() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 md:pb-10">
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthView mode="login" />} />
      <Route path="/register" element={<AuthView mode="register" />} />
      <Route
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="log" element={<LogWorkout />} />
        <Route path="history" element={<History />} />
        <Route path="goals" element={<Goals />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
