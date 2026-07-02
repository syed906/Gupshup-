import React, { useState } from 'react';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import './TodoItem.css';

const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onAddTag,
  onRemoveTag
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate);
  const [tagInput, setTagInput] = useState('');

  const handleEdit = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, {
        title: editTitle.trim(),
        priority: editPriority,
        dueDate: editDueDate
      });
      setIsEditing(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !todo.tags.includes(tagInput.trim())) {
      onAddTag(todo.id, tagInput.trim());
      setTagInput('');
    }
  };

  const handleDueDate = () => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'overdue';
    } else if (date.toDateString() === today.toDateString()) {
      return 'today';
    }
    return 'upcoming';
  };

  const dueStatus = handleDueDate();

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
        />
        
        {!isEditing ? (
          <div className="todo-text">
            <p className="todo-title">{todo.title}</p>
            <div className="todo-meta">
              <span className={`priority-badge priority-${todo.priority}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
              </span>
              {todo.dueDate && (
                <span className={`due-date-badge due-${dueStatus}`}>
                  📅 {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            {todo.tags.length > 0 && (
              <div className="tags-container">
                {todo.tags.map(tag => (
                  <span key={tag} className="tag">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(todo.id, tag)}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="todo-edit">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="edit-input"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="edit-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="edit-date"
            />
          </div>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="btn-edit"
              title="Edit task"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="btn-delete"
              title="Delete task"
            >
              <FaTrash />
            </button>
          </>
        )}
        {isEditing && (
          <>
            <button
              onClick={handleEdit}
              className="btn-save"
              title="Save changes"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="btn-cancel"
              title="Cancel editing"
            >
              <FaTimes />
            </button>
          </>
        )}
      </div>

      {isEditing && (
        <div className="tag-input-section">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add a tag (press Enter)"
            className="tag-input"
          />
          <button onClick={handleAddTag} className="btn-tag">Add Tag</button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
