import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import './TodoForm.css';

const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a task');
      return;
    }

    onAddTodo(title.trim(), priority, dueDate);
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setError('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setError('');
          }}
          placeholder="Add a new task..."
          className="form-input"
        />
      </div>

      <div className="form-row">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="form-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-date"
        />

        <button type="submit" className="btn-add">
          <FaPlus /> Add Task
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}
    </form>
  );
};

export default TodoForm;
