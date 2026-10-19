import { useNavigate } from 'react-router-dom';
import WorkoutForm from '../components/WorkoutForm.jsx';

export default function LogWorkout() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-4 text-3xl font-extrabold">Log a workout</h1>
      <div className="card">
        <WorkoutForm onSaved={() => navigate('/')} />
      </div>
    </div>
  );
}
