import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'paperStackTasks';
const COMPLETED_STORAGE_KEY = 'paperStackCompletedTasks';

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [stickyNoteSize, setStickyNoteSize] = useState({ width: 500, height: 500 });
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSlidingIn, setIsSlidingIn] = useState(false);
  const stackListRef = useRef(null);
  const titleInputRef = useRef(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    const savedCompletedTasks = localStorage.getItem(COMPLETED_STORAGE_KEY);
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }, []);

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
        setIsOverflowing(scrollHeight > clientHeight + 5);
      }
    };

    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 100);
    
    return () => clearTimeout(timeoutId);
  }, [tasks]);

  // Auto-resize sticky note based on title content
  useEffect(() => {
    const resizeStickyNote = () => {
      if (titleInputRef.current && tasks.length > 0) {
        titleInputRef.current.style.height = 'auto';
        const titleHeight = titleInputRef.current.scrollHeight;
        const titleWidth = titleInputRef.current.scrollWidth;
        
        titleInputRef.current.style.height = `${titleHeight}px`;
        
        const baseWidth = 500;
        const baseHeight = 500;
        const headerPadding = 140;
        const notesSection = 300;
        const sidePadding = 80;
        
        const newHeight = Math.max(baseHeight, headerPadding + titleHeight + notesSection + 20);
        const newWidth = Math.max(baseWidth, titleWidth + sidePadding);
        
        const maxWidth = 700;
        const maxHeight = 900;
        
        setStickyNoteSize({
          width: Math.min(newWidth, maxWidth),
          height: Math.min(newHeight, maxHeight)
        });
      }
    };

    resizeStickyNote();
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
    
    setIsSlidingIn(true);
    setTimeout(() => {
      setIsSlidingIn(false);
    }, 600);
  };

  // Mark task as done with animation
  const handleMarkDone = (index) => {
    if (index === 0) {
      setIsCompleting(true);
      setTimeout(() => {
        const completedTask = {
          ...tasks[index],
          completedAt: new Date().toISOString()
        };
        setCompletedTasks([completedTask, ...completedTasks]);
        
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
        
        setIsCompleting(false);
        
        if (updatedTasks.length > 0) {
          setIsSlidingIn(true);
          setTimeout(() => {
            setIsSlidingIn(false);
          }, 600);
        }
      }, 800);
    } else {
      const completedTask = {
        ...tasks[index],
        completedAt: new Date().toISOString()
      };
      setCompletedTasks([completedTask, ...completedTasks]);
      
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    }
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

  return {
    tasks,
    completedTasks,
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
  };
}; 