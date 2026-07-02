import React from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './TodoFilter.css';

const TodoFilter = ({ filter, setFilter, searchTerm, setSearchTerm }) => {
  return (
    <div className="todo-filter">
      <div className="search-section">
        <FaSearch className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks or tags..."
          className="search-input"
        />
      </div>

      <div className="filter-buttons">
        <span className="filter-label">
          <FaFilter /> Filter:
        </span>
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default TodoFilter;
