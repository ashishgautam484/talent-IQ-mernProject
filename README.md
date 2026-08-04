# 🚀 Talent IQ — Real-time Technical Interview & Collaborative Coding Platform

[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/ashishgautam484/talent-IQ-mernProject)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933.svg?logo=nodedotjs)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

**Talent IQ** is a modern, full-stack collaborative technical interviewing platform built with the MERN stack. It empowers developers and interviewers to host real-time mock interviews with integrated video calling, live chat, multi-language code editing, instant code execution, and practice coding problem sets.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Overview](#-api-overview)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Key Features

- 📹 **Real-time Video & Audio Calls**: Built-in high-quality video and voice conferencing using **GetStream Video SDK**.
- 💬 **Live Session Chat**: Dedicated real-time text chat using **GetStream Chat SDK** during interview sessions.
- 💻 **Monaco Code Editor**: Professional code editor experience with syntax highlighting, custom themes, and language selection (JavaScript, Python, Java).
- ⚡ **Instant Code Execution**: Execute code directly from the browser via backend proxy integration with the **Piston Code Execution Engine**.
- 🧩 **Practice Problem Bank**: Explore coding problems across varying difficulty levels (Easy, Medium, Hard) complete with descriptions, starter code, and test cases.
- 📊 **Interactive Dashboard**: View active sessions, stats, past interview history, and quick session launchers.
- 🔒 **Secure Authentication**: User sign-in, sign-up, and session security powered by **Clerk**.
- 🔄 **Event-Driven Workflows**: Asynchronous background workflows and user sync handled via **Inngest**.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4, DaisyUI
- **State & Data Fetching**: TanStack Query (`@tanstack/react-query`)
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Real-Time Communication**: Stream Video React SDK (`@stream-io/video-react-sdk`), Stream Chat (`stream-chat-react`)
- **Authentication**: Clerk (`@clerk/clerk-react`)
- **Routing**: React Router v7
- **UI Components & Icons**: Lucide React, React Resizable Panels, React Hot Toast, Canvas Confetti

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ORM
- **Auth Middleware**: Clerk Express (`@clerk/express`)
- **Real-Time SDKs**: Stream Node SDK (`@stream-io/node-sdk`, `stream-chat`)
- **Background Event Handler**: Inngest (`inngest`)
- **Utilities**: CORS, Morgan, Dotenv, Nodemon

---

## 🏗️ Project Architecture

```
                                  ┌───────────────────────────┐
                                  │      Client (Browser)     │
                                  │  React 19 + Monaco + Vite │
                                  └─────────────┬─────────────┘
                                                │
                                    HTTP / REST │ WebSockets
                                                ▼
┌───────────────────────────┐     ┌───────────────────────────┐     ┌───────────────────────────┐
│     Stream API (Video)    │◄───►│      Express Backend      │◄───►│     MongoDB Database      │
│     Stream Chat API       │     │     (Auth & Controllers)  │     │     (Users & Sessions)    │
└───────────────────────────┘     └─────────────┬─────────────┘     └───────────────────────────┘
                                                │
                                       Piston   │   Inngest
                                       Proxy    ▼   Events
                                  ┌───────────────────────────┐
                                  │   Piston Execution Engine │
                                  └───────────────────────────┘
```

---

## 📂 Repository Structure

```
talent-IQ-mernProject/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handler logic (chat, code execution, sessions)
│   │   ├── lib/              # Database connection, Inngest client, Stream client & env config
│   │   ├── middleware/       # Clerk auth & express middlewares
│   │   ├── models/           # Mongoose schemas (Session, User, Problem)
│   │   ├── routes/           # API endpoints routing
│   │   └── server.js         # Entry point for backend Express server
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/              # API caller functions
│   │   ├── components/       # Reusable UI components (Navbar, Editor, VideoCall, etc.)
│   │   ├── data/             # Static data & problem definitions
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Axios instance, Piston client, Stream helpers
│   │   ├── Pages/            # Page components (HomePage, Dashboard, Session, Problems)
│   │   ├── App.jsx           # Application route definitions
│   │   └── main.jsx          # React app entry point with providers
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json              # Root scripts for monorepo operations
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local development machine:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster URI)
- Accounts for third-party services:
  - [Clerk Account](https://clerk.com/) (for authentication keys)
  - [GetStream Account](https://getstream.io/) (for Video and Chat API keys)

---

### Environment Setup

#### 1. Backend Environment (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/talent-iq
CLIENT_URL=http://localhost:5173

CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

#### 2. Frontend Environment (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STREAM_API_KEY=your_stream_api_key
```

---

### Installation

Clone the repository and install all dependencies for both backend and frontend:

```bash
git clone https://github.com/ashishgautam484/talent-IQ-mernProject.git
cd talent-IQ-mernProject

# Install dependencies for both backend and frontend from root
npm run build
```

Alternatively, install dependencies manually:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

### Running the Application

#### Run Backend Dev Server
```bash
cd backend
npm run dev
# Starts server on http://localhost:5000 with Nodemon live reload
```

#### Run Frontend Dev Server
```bash
cd frontend
npm run dev
# Starts Vite dev server on http://localhost:5173
```

#### Run via Root Scripts
- **Install & Build**: `npm run build`
- **Start Backend**: `npm start`

---

## 📡 API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/code/execute` | Proxy request to execute code (JavaScript, Python, Java) via Piston Engine |
| `GET` | `/api/chat/token` | Generate & retrieve Stream Chat auth token |
| `GET` | `/api/sessions` | Fetch interview sessions list |
| `POST` | `/api/sessions` | Create a new interview session |
| `GET` | `/api/sessions/:id` | Fetch specific session details |
| `POST` | `/api/inngest` | Inngest event webhook handler |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [ISC License](LICENSE).
