import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const STORAGE_KEY = 'paperstack_tasks';
const COMPLETED_STORAGE_KEY = 'paperstack_completed_tasks';
const initialTasks = [
  { title: 'Finish React project', notes: 'Complete the Paper Stack app' },
  { title: 'Buy groceries', notes: 'Milk, bread, eggs' },
  { title: 'Read a book', notes: 'Start with chapter 1' },
  { title: 'Go for a walk', notes: '30 minutes around the park' },
  { title: 'Call a friend', notes: 'Check in on their week' },
];

function App() {
  // Initialize from localStorage or fallback to initialTasks
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialTasks;
  });
  const [completedTasks, setCompletedTasks] = useState(() => {
    const stored = localStorage.getItem(COMPLETED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [stickyNoteSize, setStickyNoteSize] = useState({ width: 500, height: 500 });
  const stackListRef = useRef(null);
  const titleInputRef = useRef(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Check if stack list is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (stackListRef.current) {
        const { scrollHeight, clientHeight } = stackListRef.current;
        // Add a larger buffer (5px) to prevent small scroll amounts when not needed
        setIsOverflowing(scrollHeight > clientHeight + 5);
      }
    };

    checkOverflow();
    // Check again after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(checkOverflow, 100);
    
    return () => clearTimeout(timeoutId);
  }, [tasks]);

  // Auto-resize sticky note based on title content
  useEffect(() => {
    const resizeStickyNote = () => {
      if (titleInputRef.current && tasks.length > 0) {
        // Reset height to auto to get the true scrollHeight
        titleInputRef.current.style.height = 'auto';
        const titleHeight = titleInputRef.current.scrollHeight;
        const titleWidth = titleInputRef.current.scrollWidth;
        
        // Set the textarea height to match its content
        titleInputRef.current.style.height = `${titleHeight}px`;
        
        // Base dimensions
        const baseWidth = 500;
        const baseHeight = 500;
        const headerPadding = 140; // Account for header padding and border
        const notesSection = 300; // Minimum space for notes
        const sidePadding = 80; // Account for left/right padding
        
        // Calculate new dimensions with extra buffer for text
        const newHeight = Math.max(baseHeight, headerPadding + titleHeight + notesSection + 20);
        const newWidth = Math.max(baseWidth, titleWidth + sidePadding);
        
        // Cap dimensions
        const maxWidth = 700;
        const maxHeight = 900; // Increased max height for longer titles
        
        setStickyNoteSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight)
        });
      }
    };

    resizeStickyNote();
    // Check again after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(resizeStickyNote, 100);
    
    return () => clearTimeout(timeoutId);
  }, [tasks]);

  // Calculate statistics
  const getStatistics = () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const completedToday = completedTasks.filter(task => 
      new Date(task.completedAt) >= oneDayAgo
    ).length;
    
    const completedAllTime = completedTasks.length;
    
    return { completedToday, completedAllTime };
  };

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
    setTasks([{ title: newTask.trim(), notes: '' }, ...tasks]);
    setNewTask('');
  };

  // Mark task as done (remove from stack and add to completed)
  const handleMarkDone = (index) => {
    const completedTask = {
      ...tasks[index],
      completedAt: new Date().toISOString()
    };
    setCompletedTasks([completedTask, ...completedTasks]);
    
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  // Update current task title
  const handleTitleChange = (newTitle) => {
    if (tasks.length > 0) {
      const updatedTasks = [...tasks];
      updatedTasks[0] = { ...updatedTasks[0], title: newTitle };
      setTasks(updatedTasks);
    }
  };

  // Update current task notes
  const handleNotesChange = (newNotes) => {
    if (tasks.length > 0) {
      const updatedTasks = [...tasks];
      updatedTasks[0] = { ...updatedTasks[0], notes: newNotes };
      setTasks(updatedTasks);
    }
  };

  const stats = getStatistics();

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
        <div 
          ref={stackListRef}
          className={`stack-list ${isOverflowing ? 'overflowing' : ''}`}
          style={{ overflowY: isOverflowing ? 'auto' : 'hidden' }}
        >
          {tasks.map((task, idx) => (
            <div
              key={task.title + idx}
              className={`sticky-note${idx === 0 ? ' top' : ''}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOver(idx);
              }}
              onDragEnd={handleDragEnd}
            >
              <span>{task.title}</span>
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
          <div 
            className="current-task-note"
            style={{ 
              width: `${stickyNoteSize.width}px`,
              height: `${stickyNoteSize.height}px`
            }}
          >
            <div className="task-header">
              <textarea
                ref={titleInputRef}
                value={tasks[0].title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="task-title-input"
                placeholder="Task title..."
                rows={1}
              />
            </div>
            <div className="task-notes">
              <textarea
                value={tasks[0].notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="task-notes-input"
                placeholder="Add notes..."
                rows={8}
              />
            </div>
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
      <aside className="stats-column">
        <h2>Statistics</h2>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Completed Today</h3>
            <div className="stat-number">{stats.completedToday}</div>
          </div>
          <div className="stat-card">
            <h3>Completed All Time</h3>
            <div className="stat-number">{stats.completedAllTime}</div>
          </div>
          <div className="stat-card">
            <h3>Current Stack</h3>
            <div className="stat-number">{tasks.length}</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App; 