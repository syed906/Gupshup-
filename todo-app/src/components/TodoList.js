import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
  onAddTag,
  onRemoveTag
}) => {
  if (todos.length === 0) {
    return (
      <div className="todo-list-empty">
        <div className="empty-icon">📝</div>
        <h3>No tasks yet</h3>
        <p>Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          onAddTag={onAddTag}
          onRemoveTag={onRemoveTag}
        />
      ))}
    </div>
  );
};

export default TodoList;
