import { useState, useEffect } from 'react';
import './TaskManager.css';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
const baseUrl = 'http://localhost:5050';

function TaskManager({ apiBase = baseUrl }) {
  const [tasks, setTasks] = useState([]);
  const [sortOption, setSortOption] = useState('created-newest');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch the tasks from the API
  const fetchTasks = async () => {
    const res = await fetch(`${apiBase}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  // Create a new task
  const createTask = async (title, description) => {
    await fetch(`${apiBase}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    fetchTasks();
  };

  // Start a task
  const startTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/start`, { method: 'POST' });
    fetchTasks();
  };

  // Pause a task
  const pauseTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/pause`, { method: 'POST' });
    fetchTasks();
  };

  // Resume a task
  const resumeTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/resume`, { method: 'POST' });
    fetchTasks();
  };

  // Cancel a task
  const cancelTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}/cancel`, { method: 'POST' });
    fetchTasks();
  };

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`${apiBase}/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  // Fetch the tasks from the API every 3 seconds to get updated task statuses. 
  // I would use a dedicated polling controller in production environment to optimize API calls
  // to fetch only for running tasks, but this approach doesn't add much server load at the moment
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="task-header-wrapper">
        <h1>Task Manager</h1>
        <div className="task-controls-wrapper">
          <TaskForm onCreate={createTask} />
          <div className="task-sort-controls">
            <div className="task-sort">
              <label htmlFor="sort">Sort tasks:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="created-newest">Created: Newest First</option>
                <option value="created-oldest">Created: Oldest First</option>
                <option value="title-az">Title: A → Z</option>
                <option value="title-za">Title: Z → A</option>
              </select>
            </div>

            <div className="task-filter">
              <label htmlFor="filter">Filter status:</label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Paused">Paused</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="task-manager-container">
        <TaskList
          tasks={tasks}
          onStart={startTask}
          onPause={pauseTask}
          onResume={resumeTask}
          onCancel={cancelTask}
          onDelete={deleteTask}
          sortOption={sortOption}
          filterStatus={filterStatus}
        />
      </div>
    </>
  );
}

export default TaskManager;
