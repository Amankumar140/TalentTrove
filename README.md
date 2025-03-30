<![CDATA[<div align="center">

# 🏆 TalentTrove

**A modern freelance marketplace connecting professionals with clients.**

Built with **React + Vite** · **Node.js + Express** · **MongoDB** · **Socket.IO**

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-FB015B?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🖥️ **Role-Based Dashboards** | Separate views for freelancers, clients, and admins |
| 💰 **Secure Bidding System** | Submit proposals with bid amounts and estimated timelines |
| � **JWT Authentication** | Token-based auth with bcrypt password hashing |
| 💬 **Real-Time Chat** | Socket.IO powered messaging between clients and freelancers |
| 📦 **Project Delivery** | Submit and review project deliverables with approval workflow |
| 📁 **Portfolio Management** | Freelancers can showcase their skills and work description |
| ⭐ **Reputation & Reviews** | Rating system for completed projects |

---

## 🏗️ Project Structure

```
TalentTrove/
│
├── server/                          # ── Backend (Node.js + Express) ──
│   ├── index.js                     # Server bootstrap & Socket.IO setup
│   ├── app.js                       # Express app, middleware & route mounting
│   │
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/
│   │   ├── User.js                  # User schema (username, email, password, role)
│   │   ├── Freelancer.js            # Freelancer profile, skills, funds, portfolio
│   │   ├── Project.js               # Project listing, status, submissions
│   │   ├── Application.js           # Bid/application with proposal details
│   │   └── Chat.js                  # Chat room messages
│   │
│   ├── controllers/
│   │   ├── authController.js        # Register & login (JWT + bcrypt)
│   │   ├── freelancerController.js  # Freelancer profile CRUD
│   │   ├── projectController.js     # Project CRUD & submission management
│   │   ├── applicationController.js # Bidding & application approval
│   │   ├── userController.js        # User listing
│   │   └── chatController.js        # Chat history retrieval
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # POST /register, /login
│   │   ├── freelancerRoutes.js      # GET/POST freelancer endpoints
│   │   ├── projectRoutes.js         # GET/POST project endpoints
│   │   ├── applicationRoutes.js     # GET/POST application endpoints
│   │   ├── userRoutes.js            # GET /fetch-users
│   │   └── chatRoutes.js            # GET /fetch-chats/:id
│   │
│   ├── middleware/
│   │   ├── verifyToken.js           # JWT Bearer token verification
│   │   └── errorHandler.js          # Global error handler
│   │
│   ├── socket/
│   │   └── socketHandler.js         # Real-time chat event handlers
│   │
│   ├── .env.example                 # Environment variable template
│   └── package.json
│
└── frontend/
    └── client/                      # ── Frontend (React + Vite) ──
        ├── src/
        │   ├── pages/               # Freelancer, Client & Admin pages
        │   ├── components/          # Navbar, Login, Register
        │   └── context/             # Global state (GeneralContext)
        ├── .env                     # Frontend env vars
        └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** account (or local MongoDB instance)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/TalentTrove.git
cd TalentTrove
```

### 2. Setup the Backend

```bash
cd server

# Create environment file from template
cp .env.example .env       # macOS/Linux
copy .env.example .env     # Windows

# Fill in your values in .env (see Environment Variables below)

npm install
npm run dev                # Starts with nodemon on port 6001
```

### 3. Setup the Frontend

```bash
cd frontend/client

# Create .env file
echo VITE_API_BASE_URL=http://localhost:6001 > .env

npm install
npm run dev                # Starts Vite dev server on port 5173
```

### 4. Open in browser

```
http://localhost:5173
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/TalentTrove` |
| `PORT` | Server port | `6001` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_strong_secret_key_here` |
| `FRONTEND_URL` | Deployed frontend URL (for CORS) | `https://your-app.vercel.app` |

### Frontend (`frontend/client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:6001` |

---

## 🔐 Authentication Flow

```
┌─────────┐     POST /register or /login      ┌─────────┐
│         │ ──────────────────────────────────► │         │
│ Client  │                                    │ Server  │
│  (React)│ ◄────────────────────────────────── │(Express)│
│         │     { user, token }                │         │
└─────────┘                                    └─────────┘
     │                                              ▲
     │  Authorization: Bearer <token>               │
     └──────────────────────────────────────────────┘
              All subsequent requests
```

- **Register/Login** returns `{ user, token }` — token is a JWT (7-day expiry)
- **Protected routes** require `Authorization: Bearer <token>` header
- Passwords are hashed with **bcrypt** (salt rounds: 10) and never returned in responses

---

## 📡 API Endpoints

### Auth (Public)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login with email & password |

### Freelancers (Protected 🔒)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/fetch-freelancer/:id` | Get freelancer profile by user ID |
| `POST` | `/update-freelancer` | Update skills & description |

### Projects (Protected 🔒)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/fetch-projects` | List all projects |
| `GET` | `/fetch-project/:id` | Get single project |
| `POST` | `/new-project` | Create a new project |
| `POST` | `/submit-project` | Submit project deliverables |
| `GET` | `/approve-submission/:id` | Approve a submission |
| `GET` | `/reject-submission/:id` | Reject a submission |

### Applications (Protected 🔒)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/make-bid` | Place a bid on a project |
| `GET` | `/fetch-applications` | List all applications |
| `GET` | `/approve-application/:id` | Approve an application |
| `GET` | `/reject-application/:id` | Reject an application |

### Users (Protected 🔒)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/fetch-users` | List all users (no passwords) |

### Chat (Protected 🔒)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/fetch-chats/:id` | Get chat messages by project ID |

### Real-Time Events (Socket.IO)
| Event | Direction | Description |
|---|---|---|
| `join-chat-room` | Client → Server | Freelancer joins a project chat |
| `join-chat-room-client` | Client → Server | Client joins a project chat |
| `new-message` | Client → Server | Send a new message |
| `messages-updated` | Server → Client | Updated chat messages broadcast |

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Freelancer** | Browse & bid on projects, chat with clients, submit work, manage profile & portfolio |
| **Client** | Post projects, review bids, approve/reject submissions, chat with freelancers |
| **Admin** | View all users, projects, and applications |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router |
| **Backend** | Node.js, Express 4 |
| **Database** | MongoDB Atlas, Mongoose 8 |
| **Auth** | JWT (jsonwebtoken), bcrypt |
| **Real-Time** | Socket.IO 4 |
| **Deployment** | Render (backend), Vercel (frontend) |

---

## 📝 License

This project is licensed under the ISC License.
]]>
