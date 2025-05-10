import { useState, useEffect } from 'react';
import './TaskManager.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

function TaskManager({ apiBase = 'http://localhost:5050' }) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch(`${apiBase}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  const createTask = async (title, description) => {
    await fetch(`${apiBase}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    fetchTasks();
  };

  const startTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/start`, { method: 'POST' });
    fetchTasks();
  };

  const pauseTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/pause`, { method: 'POST' });
    fetchTasks();
  };

  const resumeTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/resume`, { method: 'POST' });
    fetchTasks();
  };

  const cancelTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/cancel`, { method: 'POST' });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="task-header-wrapper">
        <h1>Task Manager</h1>
        <TaskForm onCreate={createTask} />
      </div>

      <div className="task-manager-container">
        <TaskList
          tasks={tasks}
          onStart={startTask}
          onPause={pauseTask}
          onResume={resumeTask}
          onCancel={cancelTask}
          onDelete={deleteTask}
        />
      </div>
    </>
  );
}

export default TaskManager;
