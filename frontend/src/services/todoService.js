import api from './api';

export const todoService = {
  // Get all todos
  getTodos: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Add a new todo
  addTodo: async (title, date) => {
    const response = await api.post('/tasks', { title, date });
    return response.data;
  },

  // Toggle todo completion status
  toggleTodo: async (id) => {
    const response = await api.put(`/tasks/${id}`);
    return response.data;
  },

  // Delete a todo
  deleteTodo: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
