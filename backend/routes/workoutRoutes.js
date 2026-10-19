import { Router } from 'express';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from '../controllers/workoutController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.route('/').get(getWorkouts).post(createWorkout);
router.route('/:id').put(updateWorkout).delete(deleteWorkout);
export default router;
