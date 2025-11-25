import pool from '../config/db.js';

// Tüm todos
export const getTodosFromDB = async () => {
  const result = await pool.query("SELECT id, title, completed, to_char(task_date, 'YYYY-MM-DD') as task_date FROM tasks ORDER BY created_at DESC");
  return result.rows;
};

// Yeni todo ekleme
export const addTodoToDB = async (title, date) => {
  const result = await pool.query(
    "INSERT INTO tasks(title, task_date, completed) VALUES($1, $2, false) RETURNING id, title, completed, to_char(task_date, 'YYYY-MM-DD') as task_date",
    [title, date]
  );
  return result.rows[0];
};

// Todo toggle
export const toggleTodoInDB = async (id) => {
  const result = await pool.query(
    "UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING id, title, completed, to_char(task_date, 'YYYY-MM-DD') as task_date",
    [id]
  );
  return result.rows[0];
};

// Todo silme
export const deleteTodoFromDB = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return { message: 'Deleted successfully' };
};
