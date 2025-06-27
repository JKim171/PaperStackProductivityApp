import React from 'react';
import './App.css';
import TaskStack from './components/TaskStack';
import CurrentTask from './components/CurrentTask';
import Statistics from './components/Statistics';
import { useTaskManager } from './hooks/useTaskManager';

function App() {
  const {
    tasks,
    newTask,
    setNewTask,
    isOverflowing,
    stickyNoteSize,
    isCompleting,
    isSlidingIn,
    stackListRef,
    titleInputRef,
    getStatistics,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleAddTask,
    handleMarkDone,
    handleTitleChange,
    handleNotesChange
  } = useTaskManager();

  const stats = getStatistics();

  return (
    <div className="App layout">
      <TaskStack
        tasks={tasks}
        newTask={newTask}
        setNewTask={setNewTask}
        handleAddTask={handleAddTask}
        handleMarkDone={handleMarkDone}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDragEnd={handleDragEnd}
        isOverflowing={isOverflowing}
        stackListRef={stackListRef}
      />
      <CurrentTask
        tasks={tasks}
        isCompleting={isCompleting}
        isSlidingIn={isSlidingIn}
        stickyNoteSize={stickyNoteSize}
        titleInputRef={titleInputRef}
        handleTitleChange={handleTitleChange}
        handleNotesChange={handleNotesChange}
        handleMarkDone={handleMarkDone}
      />
      <Statistics
        stats={stats}
        tasks={tasks}
      />
    </div>
  );
}

export default App; 