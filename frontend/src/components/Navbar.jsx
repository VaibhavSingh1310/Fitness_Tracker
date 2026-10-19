import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Target, LogOut, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/log', label: 'Log workout', icon: PlusCircle },
  { to: '/history', label: 'History', icon: History },
  { to: '/goals', label: 'Goals', icon: Target },
];

const desktopLink = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-ink text-white' : 'text-ink/70 hover:bg-black/5'
  }`;

const mobileLink = ({ isActive }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${isActive ? 'text-brand' : 'text-ink/60'}`;

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 font-display text-xl font-extrabold">
              <Activity className="text-brand" size={22} /> Stride
            </span>
            <nav className="hidden gap-1 md:flex">
              {links.map(({ to, label, end }) => (
                <NavLink key={to} to={to} end={end} className={desktopLink}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-ink/70 sm:inline">{user?.name}</span>
            <button onClick={logout} className="btn-ghost" aria-label="Log out">
              <LogOut size={16} /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-black/5 bg-white md:hidden">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={mobileLink}>
            <Icon size={20} />
            {label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
