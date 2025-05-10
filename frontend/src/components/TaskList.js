import { useEffect, useState } from 'react';
import './TaskList.css';

function TaskList({ tasks, onStart, onPause, onResume, onCancel, onDelete }) {
  const [tick, setTick] = useState(0);
  const [sortOption, setSortOption] = useState('created-newest');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const hasRunningTasks = tasks.some(task => task.status === 'In Progress');
    if (!hasRunningTasks) return;

    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, [tasks]);

  const getProgress = (task) => {
    if (!task || !task.duration) return 0;
    if (task.status === 'Completed') return 100;
    if (task.status === 'Paused' || task.status === 'Cancelled') {
      const done = task.duration - task.remaining;
      return Math.min(100, (done / task.duration) * 100);
    }
    if (task.status === 'In Progress' && task.startedAt && task.remaining) {
      const elapsed = Date.now() - task.startedAt;
      const previouslyCompleted = task.duration - task.remaining;
      const totalCompleted = previouslyCompleted + elapsed;
      return Math.min(100, (totalCompleted / task.duration) * 100);
    }
    return 0;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const sortTasks = (taskList) => {
    switch (sortOption) {
      case 'created-oldest':
        return [...taskList].sort((a, b) => a.createdAt - b.createdAt);
      case 'title-az':
        return [...taskList].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-za':
        return [...taskList].sort((a, b) => b.title.localeCompare(a.title));
      case 'created-newest':
      default:
        return [...taskList].sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const filterTasks = (list) =>
    filterStatus === 'all' ? list : list.filter(task => task.status === filterStatus);

  const activeStatuses = ['Pending', 'In Progress', 'Paused'];
  const completedStatuses = ['Completed', 'Cancelled'];

  const pendingTasks = sortTasks(filterTasks(tasks.filter(t => activeStatuses.includes(t.status))));
  const completedTasks = sortTasks(filterTasks(tasks.filter(t => completedStatuses.includes(t.status))));

  const renderTask = (task) => (
    <div className="task-card" key={task.id}>
      <button className="delete-button" onClick={() => onDelete(task.id)}>×</button>

      <div className="task-header">
        <h3>{task.title}</h3>
        <p>
          Status: <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>
            {task.status}
          </span>
        </p>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      {(task.status === 'In Progress' || task.status === 'Paused') && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${getProgress(task)}%` }}
          ></div>
        </div>
      )}

      <div className="task-timestamps">
        <div>
          <span className="timestamp-label">Created:</span> {formatDate(task.createdAt)}
        </div>
        {task.status === 'Completed' && task.completedAt && (
          <div>
            <span className="timestamp-label">Completed:</span> {formatDate(task.completedAt)}
          </div>
        )}
        {task.status === 'Cancelled' && task.cancelledAt && (
          <div>
            <span className="timestamp-label">Cancelled:</span> {formatDate(task.cancelledAt)}
          </div>
        )}
      </div>

      <div className="task-actions">
        {task.status === 'Pending' && (
          <button onClick={() => onStart(task.id)}>Run</button>
        )}
        {task.status === 'In Progress' && (
          <button onClick={() => onPause(task.id)}>Pause</button>
        )}
        {task.status === 'Paused' && (
          <button onClick={() => onResume(task.id)}>Resume</button>
        )}
        {['Pending', 'In Progress', 'Paused'].includes(task.status) && (
          <button className="cancel-button" onClick={() => onCancel(task.id)}>Cancel</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="task-sections-wrapper">
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

      <div className="task-sections">
        <div className="task-section">
          <h2>Active / Paused Tasks</h2>
          <div className="task-list">
            {pendingTasks.length ? pendingTasks.map(renderTask) : <p>No matching active tasks</p>}
          </div>
        </div>

        <div className="task-section">
          <h2>Completed / Cancelled Tasks</h2>
          <div className="task-list">
            {completedTasks.length ? completedTasks.map(renderTask) : <p>No matching completed tasks</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
