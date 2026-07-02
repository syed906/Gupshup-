import React from 'react';
import { FaCheckDouble } from 'react-icons/fa';
import './TodoHeader.css';

const TodoHeader = () => {
  return (
    <header className="todo-header">
      <div className="header-content">
        <div className="header-icon">
          <FaCheckDouble />
        </div>
        <div className="header-text">
          <h1>My Todo List</h1>
          <p>Stay organized and productive</p>
        </div>
      </div>
    </header>
  );
};

export default TodoHeader;
