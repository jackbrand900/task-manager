import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5050/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const createTask = async () => {
    await fetch('http://localhost:5050/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const startTask = async (id) => {
    await fetch(`http://localhost:5050/tasks/${id}/start`, { method: 'POST' });
    fetchTasks();
  };

  const cancelTask = async (id) => {
    await fetch(`http://localhost:5050/tasks/${id}/cancel`, { method: 'POST' });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
      <button onClick={createTask}>Add Task</button>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <strong>{t.title}</strong>: {t.status}
            <button onClick={() => startTask(t.id)}>Run</button>
            <button onClick={() => cancelTask(t.id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
