import express from 'express';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

router.get('/tasks', getTodos);
router.post('/tasks', addTodo);
router.put('/tasks/:id', toggleTodo);
router.delete('/tasks/:id', deleteTodo);

export default router;
