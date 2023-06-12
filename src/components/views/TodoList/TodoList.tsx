import React, { useCallback, useEffect, useState } from 'react';
import { Container, Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import storage from '../../../utils';

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
  

const TodoList: React.FunctionComponent = () => {
    const classes = useStyles();
    const {loadData, saveData} = storage;
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoText, setNewTodoText] = useState('');

    const handleAddTodo = useCallback(() => {
        //const todoText = prompt('Enter a new todo:'); // replace prompt with API Put
        if (newTodoText) {
        const newTodo: Todo = {
            id: Date.now(),
            text: newTodoText,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        saveData('todos', [...todos, newTodo]);
        // clear out todo text
        setNewTodoText('')
        }
    },[newTodoText]);

  const handleToggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
  };

  const handleDeleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
  };

  useEffect(() => {
    // Fetch todos from backend or initialize with static data
    const fetchTodos = async () => {
      try {
        const response =  loadData('todos');  // Replace with your actual API endpoint
        console.log('show data', response)

        setTodos(response);
      } catch (error) {
        console.log('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <Container className={classes.container}>
      <h1>Todo App</h1>
            <ul className={classes.todoList}>
              {todos.map((todo) => (
                <li key={todo.id} className={classes.todoItem}>
                  <FormControlLabel
                    control={
                    <Checkbox
                        checked={todo.completed}
                        onChange={() => handleToggleTodo(todo.id)}
                        />}
                    label={"New Element"}
                    />
                  <span className={classes.todoText}>{todo.text}</span>
                  <Button variant="outlined" onClick={() => handleDeleteTodo(todo.id)}>
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