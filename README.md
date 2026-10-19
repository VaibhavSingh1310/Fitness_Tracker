# Stride – MERN Fitness Tracker

React (Vite) + Tailwind CSS v4 + Recharts on the client; Express + Mongoose + JWT on the server.

```
fitness-tracker/
├── backend/
│   ├── server.js                  # app setup, security middleware, routes
│   ├── config/db.js               # MongoDB connection
│   ├── middleware/auth.js         # AuthMiddleware (JWT guard)
│   ├── middleware/error.js        # 404 + central error handler
│   ├── models/                    # User, Workout, Goal (Mongoose)
│   ├── controllers/               # auth, workouts, goals
│   ├── routes/                    # /api/auth, /api/workouts, /api/goals
│   └── utils/                     # asyncHandler, calorie estimator
└── frontend/
    ├── vite.config.js             # Tailwind plugin + /api dev proxy
    └── src/
        ├── api/axios.js           # Axios instance + JWT interceptors
        ├── context/AuthContext.jsx
        ├── components/            # Navbar, ProtectedRoute, WorkoutForm,
        │                          # WorkoutList, ProgressCharts, GoalCard
        ├── pages/                 # AuthView, Dashboard, LogWorkout, History, Goals
        └── utils/helpers.js
```

## Run it

Requirements: Node 18.11+ and a MongoDB instance (local, or a free MongoDB Atlas cluster).

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env     # then set MONGO_URI and a long random JWT_SECRET
   npm run dev              # http://localhost:5000
   ```
2. **Frontend** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev              # http://localhost:5173
   ```
3. Open http://localhost:5173, create an account, log a workout.

Generate a JWT secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## API

| Method | Endpoint | Notes |
|---|---|---|
| POST | /api/auth/register | `{name,email,password}` → `{token,user}` |
| POST | /api/auth/login | `{email,password}` → `{token,user}` |
| GET | /api/auth/me | current user |
| GET | /api/workouts | `?page&limit&from&to`, newest first |
| POST | /api/workouts | calories optional (estimated if omitted) |
| PUT / DELETE | /api/workouts/:id | owner only |
| GET / POST | /api/goals | progress is recalculated from workouts on GET |
| PUT / DELETE | /api/goals/:id | owner only |

## Design notes

- **Token storage:** the JWT lives in `localStorage` and is attached by an Axios interceptor. It is simple and works across origins, but any XSS bug could read it. For stricter production security, switch to an HTTP-only, SameSite cookie (`cookie-parser`, `credentials: true` in CORS and Axios).
- **Goal progress** is computed from workouts between the goal's `startDate` and `deadline`, so editing or deleting a workout keeps goals accurate.
- **Calories** left blank are estimated from MET values, assuming a 70 kg body weight.
- **Hardening included:** helmet, CORS allow-list, request body limit, auth rate limiting, bcrypt (12 rounds), ownership checks on every query.

 ## Screenshots
   ![Dashboard](screenshots/dashboard.png)

## Deploying

- Build the client with `npm run build` and serve `frontend/dist` from any static host. Set `VITE_API_URL` to your API's `/api` URL and `CLIENT_URL` on the server to the client's origin.
- Run the API with `npm start` and set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` as environment variables.
