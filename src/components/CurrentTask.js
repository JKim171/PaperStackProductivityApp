import React from 'react';

const CurrentTask = ({ 
  tasks, 
  isCompleting, 
  isSlidingIn, 
  stickyNoteSize, 
  titleInputRef, 
  handleTitleChange, 
  handleNotesChange, 
  handleMarkDone 
}) => {
  return (
    <main className="current-task-area">
      <h2>Current Task</h2>
      {tasks.length > 0 ? (
        <div 
          className={`current-task-note${isCompleting ? ' completing' : ''}${isSlidingIn ? ' sliding-in' : ''}`}
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
              placeholder="Task title..."
              className="task-title-input"
              style={{ height: 'auto' }}
            />
          </div>
          <div className="task-notes">
            <textarea
              value={tasks[0].notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add notes..."
              className="task-notes-input"
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
  );
};

export default CurrentTask; 