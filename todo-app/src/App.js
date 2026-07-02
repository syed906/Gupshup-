import React, { useState, useEffect } from 'react';
import './App.css';
import TodoHeader from './components/TodoHeader';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import TodoFilter from './components/TodoFilter';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title, priority = 'medium', dueDate = '') => {
    const newTodo = {
      id: Date.now(),
      title,
      completed: false,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
      tags: []
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
  };

  const addTag = (id, tag) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, tags: [...new Set([...todo.tags, tag])] }
        : todo
    ));
  };

  const removeTag = (id, tag) => {
    setTodos(todos.map(todo =>
      todo.id === id
        ? { ...todo, tags: todo.tags.filter(t => t !== tag) }
        : todo
    ));
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    if (searchTerm) {
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredTodos = getFilteredTodos();
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length
  };

  return (
    <div className="App">
      <div className="container">
        <TodoHeader />
        <TodoStats stats={stats} />
        <TodoForm onAddTodo={addTodo} />
        <TodoFilter
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onAddTag={addTag}
          onRemoveTag={removeTag}
        />
      </div>
    </div>
  );
}

export default App;
