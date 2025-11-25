import { useState, useEffect, useRef } from "react";
import "cally";
import "./App.css";
import { todoService } from "./services/todoService";
import Chatbot from "./components/Chatbot";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const calendarRef = useRef(null);

  // Initialize with local date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Handle calendar change event manually to ensure React catches it
  useEffect(() => {
    const calendar = calendarRef.current;
    if (!calendar) return;

    const handleDateChange = (e) => {
      setSelectedDate(e.target.value);
    };

    calendar.addEventListener("change", handleDateChange);
    return () => calendar.removeEventListener("change", handleDateChange);
  }, []);

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };
    fetchTodos();
  }, []);

  const handleNewTodo = (e) => setNewTodo(e.target.value);

  const handleAddTodo = async () => {
    const trimmedTodo = newTodo.trim();
    if (!trimmedTodo) return;

    try {
      const data = await todoService.addTodo(trimmedTodo, selectedDate);
      setTodos([data, ...todos]);
      setNewTodo("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleCompleteTodo = async (id) => {
    try {
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 xl:grid-cols-[350px_1fr_350px] gap-6 items-start">
        {/* LEFT COLUMN: ALL TODOS */}
        <div className="bg-base-100 rounded-2xl shadow-xl p-6 h-96 xl:h-[calc(100vh-3rem)] flex flex-col xl:sticky top-6 order-3 xl:order-1">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-base-200 flex justify-between items-center">
            All Tasks
            <span className="badge badge-neutral">{todos.length}</span>
          </h2>
          <div className="overflow-y-auto flex-1 pr-2 space-y-3 scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`card p-3 flex flex-row justify-between items-center border transition-all ${
                  todo.completed
                    ? "bg-base-200 border-transparent opacity-60"
                    : "bg-base-100 border-base-300 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleCompleteTodo(todo.id)}
                    className={`checkbox checkbox-sm ${
                      todo.completed ? "checkbox-success" : "checkbox-primary"
                    }`}
                  />
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-sm font-medium truncate ${
                        todo.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {todo.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {todo.task_date}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  ✕
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <p>No tasks found.</p>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: SELECTED DATE TODOS */}
        <div className="flex flex-col gap-6 min-h-[50vh] xl:min-h-[calc(100vh-3rem)] order-1 xl:order-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-base-content">
              Daily Focus
            </h1>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="badge badge-primary badge-lg text-lg py-4">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* ADD TODO */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={handleNewTodo}
              onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
              className="input input-bordered flex-1 shadow-sm input-lg text-lg"
              placeholder={`Add a task for ${selectedDate}...`}
            />
            <button
              onClick={handleAddTodo}
              className="btn btn-primary btn-lg text-white shadow-sm aspect-square px-0 w-16"
            >
              +
            </button>
          </div>

          {/* ACTIVE TASKS */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4 opacity-80 flex items-center gap-2">
              Active Tasks
              <span className="badge badge-sm badge-ghost">
                {
                  todos.filter(
                    (t) => !t.completed && t.task_date === selectedDate
                  ).length
                }
              </span>
            </h2>
            <div className="grid gap-3">
              {todos
                .filter((t) => !t.completed && t.task_date === selectedDate)
                .map((todo) => (
                  <div
                    key={todo.id}
                    className="card bg-base-100 shadow-sm hover:shadow-md transition-all p-4 flex flex-row justify-between items-center border border-base-300"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleCompleteTodo(todo.id)}
                        className="checkbox checkbox-primary checkbox-lg"
                      />
                      <span className="text-xl">{todo.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 bg-base-200 px-2 py-1 rounded hidden sm:inline-block">
                        {todo.task_date}
                      </span>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              {todos.filter((t) => !t.completed && t.task_date === selectedDate)
                .length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-base-100/50 rounded-2xl border-2 border-dashed border-base-300">
                  <p className="text-lg">No active tasks for this day.</p>
                  <p className="text-sm opacity-70">Enjoy your free time!</p>
                </div>
              )}
            </div>

            {/* COMPLETED TASKS */}
            {todos.filter((t) => t.completed && t.task_date === selectedDate)
              .length > 0 && (
              <>
                <h2 className="text-xl font-semibold mb-4 mt-8 opacity-80">
                  Completed
                </h2>
                <div className="grid gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  {todos
                    .filter((t) => t.completed && t.task_date === selectedDate)
                    .map((todo) => (
                      <div
                        key={todo.id}
                        className="card bg-base-100 shadow-sm p-4 flex flex-row justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleCompleteTodo(todo.id)}
                            className="checkbox checkbox-success"
                          />
                          <span className="line-through text-gray-600 text-lg">
                            {todo.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 hidden sm:inline-block">
                            {todo.task_date}
                          </span>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="btn btn-ghost btn-sm text-error"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CALENDAR */}
        <div className="flex flex-col gap-6 xl:sticky top-6 order-2 xl:order-3 w-full max-w-md mx-auto xl:max-w-none">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body p-4 sm:p-6">
              <h2 className="card-title text-lg mb-4 justify-center xl:justify-start">
                Calendar
              </h2>
              <calendar-date
                ref={calendarRef}
                value={selectedDate}
                className="w-full block"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <button
                    slot="previous"
                    className="btn btn-circle btn-sm btn-ghost"
                  >
                    ❮
                  </button>
                  <span className="font-bold text-lg capitalize">
                    {/* Displaying the month of the selected date as a fallback */}
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    slot="next"
                    className="btn btn-circle btn-sm btn-ghost"
                  >
                    ❯
                  </button>
                </div>
                <calendar-month></calendar-month>
              </calendar-date>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card bg-primary text-primary-content shadow-xl">
            <div className="card-body p-6">
              <h2 className="card-title text-base">Today's Progress</h2>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold">
                  {Math.round(
                    (todos.filter(
                      (t) => t.completed && t.task_date === selectedDate
                    ).length /
                      (todos.filter((t) => t.task_date === selectedDate)
                        .length || 1)) *
                      100
                  )}
                  %
                </span>
                <span className="mb-1 opacity-80">completed</span>
              </div>
              <progress
                className="progress progress-warning w-full bg-primary-content/20"
                value={
                  todos.filter(
                    (t) => t.completed && t.task_date === selectedDate
                  ).length
                }
                max={
                  todos.filter((t) => t.task_date === selectedDate).length || 1
                }
              ></progress>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}

export default App;
