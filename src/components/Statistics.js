import React from 'react';

const Statistics = ({ stats, tasks }) => {
  return (
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
  );
};

export default Statistics; 