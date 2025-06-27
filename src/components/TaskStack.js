import React from 'react';

const TaskStack = ({ 
  tasks, 
  newTask, 
  setNewTask, 
  handleAddTask, 
  handleMarkDone, 
  handleDragStart, 
  handleDragOver, 
  handleDragEnd, 
  isOverflowing, 
  stackListRef 
}) => {
  return (
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
  );
};

export default TaskStack; 