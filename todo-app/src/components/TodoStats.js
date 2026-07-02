import React from 'react';
import { FaListCheck, FaCheckCircle, FaClock, FaFire } from 'react-icons/fa';
import './TodoStats.css';

const TodoStats = ({ stats }) => {
  return (
    <div className="todo-stats">
      <div className="stat-card">
        <div className="stat-icon total">
          <FaListCheck />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon completed">
          <FaCheckCircle />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active">
          <FaClock />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon priority">
          <FaFire />
        </div>
        <div className="stat-info">
          <div className="stat-value">{stats.highPriority}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
    </div>
  );
};

export default TodoStats;
