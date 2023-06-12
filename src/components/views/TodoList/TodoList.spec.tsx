import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ToDoList from './TodoList';

describe('ToDoList', () => {
  test('renders todos correctly', () => {
    render(<ToDoList />);
    
    // Mock todos
    const todos = [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
    ];

    // Mock localStorage
    const mockLocalStorage = {
      todos: JSON.stringify(todos),
    };
    global.localStorage = {
      getItem: (key: string) => mockLocalStorage['todos'],
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: todos.length,
      clear: jest.fn(),
      key: (index:number) => '',

    };

    // Assertions
    const todoElements = screen.getAllByTestId('todo-item');
    expect(todoElements.length).toBe(todos.length);

    todoElements.forEach((todoElement, index) => {
      expect(todoElement).toHaveTextContent(todos[index].text);
      expect(todoElement).toHaveClass(todos[index].completed ? 'completed' : '');
    });
  });

  test('adds a new todo', () => {
    render(<ToDoList />);

    const todoText = 'New Todo';

    // Mock localStorage
    const mockLocalStorage = {
      todos: '[]',
    };
    global.localStorage = {
      getItem: (key) => mockLocalStorage['todos'],
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: 0,
      clear: jest.fn(),
      key: (index:number) => '',
    };

    // Type new todo text
    fireEvent.change(screen.getByLabelText('New Todo'), { target: { value: todoText } });

    // Click "Add Todo" button
    fireEvent.click(screen.getByText('Add Todo'));

    // Assertions
    expect(screen.getByLabelText('New Todo')).toHaveValue('');
    expect(screen.getByText(todoText)).toBeInTheDocument();
  });

  test('toggles a todo', () => {
    render(<ToDoList />);

    // Mock todos
    const todos = [
      { id: 1, text: 'Todo 1', completed: false },
    ];

    // Mock localStorage
    const mockLocalStorage = {
      todos: JSON.stringify(todos),
    };
    global.localStorage = {
      getItem: (key) => mockLocalStorage['todos'],
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: todos.length,
      clear: jest.fn(),
      key: (index:number) => '',
    };

    // Click checkbox to toggle todo
    fireEvent.click(screen.getByTestId('todo-checkbox'));

    // Assertions
    expect(screen.getByTestId('todo-item')).toHaveClass('completed');
  });

  test('deletes a todo', () => {
    render(<ToDoList />);

    // Mock todos
    const todos = [
      { id: 1, text: 'Todo 1', completed: false },
    ];

    // Mock localStorage
    const mockLocalStorage = {
      todos: JSON.stringify(todos),
    };
    global.localStorage = {
      getItem: (key) => mockLocalStorage['todos'],
      setItem: jest.fn(),
      removeItem: jest.fn(),
      length: todos.length,
      clear: jest.fn(),
      key: (index:number) => '',
    };

    // Click "Delete" button
    fireEvent.click(screen.getByText('Delete'));

    // Assertions
    expect(screen.queryByTestId('todo-item')).toBeNull();
  });
});