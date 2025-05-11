# Task Manager App

This full-stack web app allows users to create, start, pause, resume, cancel, and delete long-running tasks. Tasks simulate background operations with progress tracking via a progress bar, timestamps, and filtering / sorting features.

---

## 1. Setup & Run Instructions

You can get the project either by cloning this repo or downloading it as a zip file. Once the code is on your machine, navigate to the root directory 'task-manager'.

To run the app, from the root directory, run

```bash
docker-compose up --build
```

To restart a running container, use

```bash
docker-compose down -v && docker-compose up --build
```

- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:5050`

---

## Technical Decisions

- **React** used for dynamic frontend UI with progress bars and task controls.
- **Express** server simulates long-running background jobs with timers.
- **Docker** is used to containerize frontend and backend for simple deployment.
- **Framer Motion** provides smooth animations when tasks are added/removed (I did this for fun because the animation adds a better feel to the app).
- Tasks are stored in memory (not persisted) for demo purposes.
- Task simulation assumes a default duration of ~30 seconds unless paused.

I chose to use React and Express because of their simplicity and my familiarity with these tools, other technologies could be used depending on specific use cases / constraints.

AI was used for assistance with CSS styling and generating tests.

---

**Assumptions:**

- The user interacts with a simulated task lifecycle (no actual job is run).
- Tasks do not persist across backend restarts (no DB used).
- CORS is enabled to allow cross-origin communication in local/dev setups.

---

## 2. Testing Instructions

### Run Frontend Tests:
From the root directory, run:

```bash
cd frontend
npm test
```

### Run Backend Tests:
From the root directory, run:

```bash
cd backend
npm test
```

- Tests include: task creation, lifecycle (start/pause/resume/cancel/delete), and error handling
- If prompted that 0 files have changed since last testing, enter 'a' to run all tests
