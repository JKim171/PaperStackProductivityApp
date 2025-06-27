import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>📝 Paper Stack Productivity App</h1>
        <p>
          Organize your tasks like sticky notes in a stack!
        </p>
        <div className="stack-preview">
          <div className="sticky-note top">Current Task</div>
          <div className="sticky-note">Next Task</div>
          <div className="sticky-note">Another Task</div>
        </div>
      </header>
    </div>
  );
}

export default App; 