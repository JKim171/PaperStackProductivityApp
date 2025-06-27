import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'paperstack_tasks';
const initialTasks = [
  'Finish React project',
  'Buy groceries',
  'Read a book',
  'Go for a walk',
  'Call a friend',
];

function App() {
  // Initialize from localStorage or fallback to initialTasks
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTasks;
  });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newTask, setNewTask] = useState('');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(index, 0, removed);
    setTasks(updatedTasks);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === '') return;
    setTasks([newTask.trim(), ...tasks]);
    setNewTask('');
  };

  // Mark task as done (remove from stack)
  const handleMarkDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  return (
    <div className="App layout">
      <aside className="stack-column">
        <h2>Task Stack</h2>
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            className="add-task-input"
            maxLength={100}
          />
          <button type="submit" className="add-task-btn">Add</button>
        </form>
        <div className="stack-list">
          {tasks.map((task, idx) => (
            <div
              key={task + idx}
              className={`sticky-note${idx === 0 ? ' top' : ''}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOver(idx);
              }}
              onDragEnd={handleDragEnd}
            >
              <span>{task}</span>
              <button
                className="done-btn"
                title="Mark as done"
                onClick={() => handleMarkDone(idx)}
              >✓</button>
            </div>
          ))}
        </div>
      </aside>
      <main className="current-task-area">
        <h2>Current Task</h2>
        {tasks.length > 0 ? (
          <div className="sticky-note top large">
            <span>{tasks[0]}</span>
            <button
              className="done-btn large"
              title="Mark as done"
              onClick={() => handleMarkDone(0)}
            >✓</button>
          </div>
        ) : (
          <div className="no-task">No tasks in the stack!</div>
        )}
      </main>
    </div>
  );
}

export default App; 