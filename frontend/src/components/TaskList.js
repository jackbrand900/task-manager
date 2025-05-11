import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TaskList.css';

function TaskList({ tasks, onStart, onPause, onResume, onCancel, onDelete, sortOption, filterStatus }) {
  const [tick, setTick] = useState(0);

  // Update the tick every 500ms
  useEffect(() => {
    const hasRunningTasks = tasks.some(task => task.status === 'In Progress');
    if (!hasRunningTasks) return;
    const interval = setInterval(() => setTick(t => t + 1), 500);
    return () => clearInterval(interval);
  }, [tasks]);

  // Get the progress of a task 
  const getProgress = (task) => {
    if (!task || !task.duration) return 0;
    if (task.status === 'Completed') return 100;

    // If the task is paused or cancelled, calculate the progress based on the remaining time
    if (task.status === 'Paused' || task.status === 'Cancelled') {
      const done = task.duration - task.remaining;
      return Math.min(100, (done / task.duration) * 100);
    }
    // If the task is in progress, calculate the progress based on the elapsed time
    if (task.status === 'In Progress' && task.startedAt && task.remaining) {
      const elapsed = Date.now() - task.startedAt;
      const previouslyCompleted = task.duration - task.remaining;
      const totalCompleted = previouslyCompleted + elapsed;
      return Math.min(100, (totalCompleted / task.duration) * 100);
    }
    return 0;
  };

  // Format the date to a human readable format
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

  // Sort the tasks
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

  // Filter the tasks
  const filterTasks = (list) =>
    filterStatus === 'all' ? list : list.filter(task => task.status === filterStatus);

  const activeStatuses = ['Pending', 'In Progress', 'Paused'];
  const completedStatuses = ['Completed', 'Cancelled'];

  // Sort and filter the tasks
  const pendingTasks = sortTasks(filterTasks(tasks.filter(t => activeStatuses.includes(t.status))));
  const completedTasks = sortTasks(filterTasks(tasks.filter(t => completedStatuses.includes(t.status))));

  // Render the tasks by status
  const renderTask = (task) => (
    // Render the task card with animation (Claude was used to assist with the animation)
    <motion.div
      layout
      key={task.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.25 }}
    >
      <div className="task-card">
        <button className="delete-button" onClick={() => onDelete(task.id)}>×</button>

        <div className="task-header">
          <h3>{task.title}</h3>
          <p>
            Status:{' '}
            <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>
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
    </motion.div>
  );

  return (
    <div className="task-sections-wrapper">
      <div className="task-sections">
        <div className="task-section">
          <h2>Active / Paused Tasks</h2>
          <motion.div layout className="task-list">
            <AnimatePresence>
              {pendingTasks.length
                ? pendingTasks.map(renderTask)
                : <p>No matching active tasks</p>}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="task-section">
          <h2>Completed / Cancelled Tasks</h2>
          <motion.div layout className="task-list">
            <AnimatePresence>
              {completedTasks.length
                ? completedTasks.map(renderTask)
                : <p>No matching completed tasks</p>}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
