const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const tasks = {};

app.post('/tasks', (req, res) => {
  const id = uuidv4();
  const { title, description } = req.body;
  tasks[id] = { id, title, description, status: 'Pending' };
  res.status(201).json(tasks[id]);
});

app.get('/tasks', (req, res) => {
  res.json(Object.values(tasks));
});

app.post('/tasks/:id/start', (req, res) => {
  const task = tasks[req.params.id];
  if (task) {
    task.status = 'In Progress';
    setTimeout(() => {
      if (task.status === 'In Progress') {
        task.status = 'Completed';
      }
    }, 30000);
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

app.post('/tasks/:id/cancel', (req, res) => {
  const task = tasks[req.params.id];
  if (task && task.status === 'In Progress') {
    task.status = 'Cancelled';
    res.json(task);
  } else {
    res.status(404).send('Task not found or not in progress');
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
