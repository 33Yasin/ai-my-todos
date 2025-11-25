import { getTodosFromDB, addTodoToDB, toggleTodoInDB, deleteTodoFromDB } from '../models/todoModel.js';

export const getTodos = async (req, res) => {
  try {
    const todos = await getTodosFromDB();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addTodo = async (req, res) => {
  try {
    const { title, date } = req.body;
    const newTodo = await addTodoToDB(title, date);
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await toggleTodoInDB(id);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTodoFromDB(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
