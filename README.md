# My Todos - Advanced Todo App

A modern, responsive, and AI-powered task management application. This project helps you organize your daily tasks while aiming to boost your productivity with an integrated calendar and a local AI assistant.

## 🚀 Features

- **📅 Calendar Integration:** Plan your tasks by date using the `Cally` calendar component. Instantly filter tasks for any selected day directly from the calendar.
- **🎯 Daily Focus:** Concentrate on the work at hand with a dedicated "Daily Focus" area for the selected date.
- **💾 Persistent Storage:** All your data is securely stored in a PostgreSQL database. Your data persists even after page reloads.
- **🤖 Local AI Assistant:** A smart assistant located in the bottom right corner, powered by `@xenova/transformers`, running entirely in your browser (local). You can chat without needing an internet connection (after the initial download).
- **📱 Responsive Design:** A seamless interface that works perfectly on mobile, tablet, and desktop devices.
- **🎨 Modern UI:** A stylish, clean, and user-friendly look designed with Tailwind CSS and DaisyUI.
- **📊 Progress Tracking:** A progress bar showing your daily task completion rate.

## 🛠️ Technologies

### Frontend (Client)

- **React** (powered by Vite)
- **Tailwind CSS** (Utility-first CSS framework)
- **DaisyUI** (Component library for Tailwind)
- **Cally** (Web Component-based calendar)
- **Axios** (HTTP client)
- **@xenova/transformers** (Browser-based AI)

### Backend (Server)

- **Node.js** (JavaScript runtime)
- **Express.js** (Web server framework)
- **PostgreSQL** (Relational database)
- **pg** (PostgreSQL client for Node.js)
- **Cors** (Cross-Origin Resource Sharing)
- **Dotenv** (Environment variable management)

## ⚙️ Setup

Follow these steps to run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)

### 1. Database Preparation

Create a database for your project in PostgreSQL (e.g., `todo_db`). Then, run the following SQL command to create the necessary table:

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Setup

Open your terminal and navigate to the `backend` directory:

```bash
cd backend
npm install
```

Create a file named `.env` inside the `backend` directory and enter your database credentials as follows:

```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_db
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

_(The server will start running on port 5000)_

### 3. Frontend Setup

Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

Start the frontend application:

```bash
npm run dev
```

_(The application will usually open at http://localhost:5173)_

## 🤖 About the AI Chatbot

Clicking the button in the bottom right corner opens the AI assistant.

- **Model:** `Xenova/LaMini-Flan-T5-77M` (A lightweight and fast model).
- **How it works:** The model is downloaded to your browser from Hugging Face upon first use (~100MB). For subsequent uses, it runs from the cache and does not send data to any server. It is privacy-focused.

## 📱 Usage Tips

- **Adding Tasks:** Type your task into the input field in the center panel and press Enter or click the "+" button. The task will be added to the date currently selected on the calendar.
- **Changing Dates:** Click on a different day on the calendar (at the bottom on mobile) to view tasks for that specific day.
- **Resetting Chat:** You can click the "+" (New Chat) icon at the top of the chat window to reset your conversation with the AI assistant.

---

**Developer:** Yasin Atıcı
