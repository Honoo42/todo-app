import React, { useCallback, useEffect, useState } from 'react';
import { Container, Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
/* import storage from '../../../utils'; */ // removed for upgrade to API/MongoDB layer

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const useStyles = makeStyles((theme) => ({
    container: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    todoList: {
      listStyleType: 'none',
      padding: 0,
    },
    todoItem: {
      display: 'flex',
      alignItems: 'center',
      marginTop: theme.spacing(1),
    },
    todoText: {
      marginLeft: theme.spacing(2),
    },
  }));
  

const TodoList = (): JSX.Element => {
    const classes = useStyles();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState('');

    const fetchTodos = async () => {
        try {
        const response = await fetch('http://localhost:5000/api/todos');
        const data = await response.json();
        setTodos(data.todos);
        } catch (error) {
        console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (text: string) => {
        try {
        const response = await fetch('http://localhost:5000/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        const data = await response.json();
        setTodos((prevTodos) => {
                if (prevTodos) {
                    return [...prevTodos, data];
                } else {
                    return [data];
                }
        });
        setNewTodoText('');
        } catch (error) {
        console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id: number) => {
        try {
        const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true }), // Assuming you want to toggle it to true
        });
        const data = await response.json();
        setTodos((prevTodos) =>
            prevTodos?.map((todo) => (todo?.id === id ? { ...todo, completed: data.todo?.completed ?? true } : todo))
        );
        } catch (error) {
        console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
        const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'DELETE',
        });
        if (response.status === 204) {
            setTodos((prevTodos) => prevTodos?.filter((todo) => todo?.id !== id));
        } else {
            console.error('Error deleting todo:', response.status);
        }
        } catch (error) {
        console.error('Error deleting todo:', error);
        }
    };

    const handleAddTodo = useCallback(() => {
        addTodo(newTodoText);
    }, [newTodoText]);

    const handleToggleTodo = useCallback((id: number) => {
        toggleTodo(id);
    }, []);

    const handleDeleteTodo = useCallback((id: number) => {
        deleteTodo(id);
    }, []);

    useEffect(() => {
        fetchTodos();
      }, []);

  return (
    <Container className={classes.container}>
      <h1>Todo App</h1>
            <ul className={classes.todoList}>
                {!todos && (
                    <h2>Please add a todo item</h2>
                )}
              {todos?.map((todo) => (
                <li key={todo.id} className={classes.todoItem}>
                  <FormControlLabel
                    control={
                    <Checkbox
                        checked={todo.completed ?? false}
                        onChange={() => handleToggleTodo(todo?.id)}
                        />}
                    label={"New Element"}
                    />
                  <span className={classes.todoText}>{todo.text}</span>
                  <Button variant="outlined" onClick={() => handleDeleteTodo(todo?.id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
            <TextField
              label="New Todo"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddTodo}>
              Add Todo
            </Button>
    </Container>
  );

}

export default TodoList;