const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const tasks = {};
const timers = {};

app.post('/tasks', (req, res) => {
  const id = uuidv4();
  const { title, description } = req.body;
  tasks[id] = {
    id,
    title,
    description,
    status: 'Pending',
    duration: 30000,
    remaining: 30000,
    createdAt: Date.now(),
    completedAt: null,
    cancelledAt: null,
  };
  res.status(201).json({ ...tasks[id], startedAt: null });
});

app.get('/tasks', (req, res) => {
  const response = Object.values(tasks).map((task) => ({
    ...task,
    startedAt: task._startedAt || null,
    duration: task.duration,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    cancelledAt: task.cancelledAt,
  }));
  res.json(response);
});

app.post('/tasks/:id/start', (req, res) => {
  const task = tasks[req.params.id];
  if (!task || task.status !== 'Pending') return res.status(400).send('Invalid start');

  task.status = 'In Progress';
  task._startedAt = Date.now();

  timers[task.id] = setTimeout(() => {
    task.status = 'Completed';
    task.completedAt = Date.now();
    delete timers[task.id];
    delete task._startedAt;
  }, task.remaining);

  res.json({
    ...task,
    startedAt: task._startedAt,
    duration: task.duration,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    cancelledAt: task.cancelledAt,
  });
});

app.post('/tasks/:id/pause', (req, res) => {
  const task = tasks[req.params.id];
  if (!task || task.status !== 'In Progress') return res.status(400).send('Not in progress');

  clearTimeout(timers[task.id]);
  const elapsed = Date.now() - task._startedAt;
  task.remaining = Math.max(0, task.remaining - elapsed);
  task.status = 'Paused';
  delete timers[task.id];
  delete task._startedAt;

  res.json({
    ...task,
    startedAt: null,
    duration: task.duration,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    cancelledAt: task.cancelledAt,
  });
});

app.post('/tasks/:id/resume', (req, res) => {
  const task = tasks[req.params.id];
  if (!task || task.status !== 'Paused') return res.status(400).send('Not paused');

  task.status = 'In Progress';
  task._startedAt = Date.now();

  timers[task.id] = setTimeout(() => {
    task.status = 'Completed';
    task.completedAt = Date.now();
    delete timers[task.id];
    delete task._startedAt;
  }, task.remaining);

  res.json({
    ...task,
    startedAt: task._startedAt,
    duration: task.duration,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    cancelledAt: task.cancelledAt,
  });
});

app.post('/tasks/:id/cancel', (req, res) => {
  const task = tasks[req.params.id];
  if (!task || !['Pending', 'In Progress', 'Paused'].includes(task.status)) {
    return res.status(400).send('Cannot cancel');
  }

  clearTimeout(timers[task.id]);
  task.status = 'Cancelled';
  task.cancelledAt = Date.now();
  delete timers[task.id];
  delete task._startedAt;

  res.json({
    ...task,
    startedAt: null,
    duration: task.duration,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    cancelledAt: task.cancelledAt,
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  if (tasks[id]) {
    clearTimeout(timers[id]);
    delete tasks[id];
    delete timers[id];
    res.status(200).send('Task deleted');
  } else {
    res.status(404).send('Task not found');
  }
});

app.listen(5000, () => {
  console.log('Backend running on port 5000');
});
