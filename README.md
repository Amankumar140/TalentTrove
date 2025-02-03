# TalentTrove

A freelance marketplace connecting professionals with clients. Built with React + Vite (frontend) and Node.js + Express + MongoDB (backend).

## Features
- 🖥️ **Intuitive Dashboard** — role-based dashboards for freelancers, clients, and admins
- 💰 **Secure Bidding System** — submit proposals with bid amounts and estimated timelines
- 📁 **Portfolio Management** — freelancers showcase skills and descriptions
- 💬 **Real-time Chat** — Socket.IO powered messaging between clients and freelancers
- 📦 **Project Delivery** — submit and review project deliverables
- ⭐ **Reputation & Reviews** — rating system for completed projects

## Project Structure

```
TalentTroveNew/
├── server/              # Node.js + Express backend
│   ├── index.js         # App entry point, all routes
│   ├── Schema.js        # Mongoose models
│   ├── SocketHandler.js # Socket.IO event handlers
│   ├── .env             # Your environment variables (create from .env.example)
│   └── .env.example     # Environment variable template
│
└── frontend/
    └── client/          # React + Vite frontend
        ├── src/
        │   ├── pages/
        │   │   ├── freelancer/   # Freelancer pages
        │   │   ├── client/       # Client pages
        │   │   └── admin/        # Admin pages
        │   ├── components/       # Navbar, Login, Register
        │   └── context/          # Global state (GeneralContext)
        └── .env          # Frontend env vars (create from below)
```

## Setup & Running

### 1. Setup the Backend

```bash
cd server
# Copy the example env file and fill in your values
copy .env.example .env
# Edit .env to set your MONGO_URI

npm install
npm run dev        # starts with nodemon on port 6001
```

### 2. Setup the Frontend

```bash
cd frontend/client
# Create .env file
echo VITE_API_BASE_URL=http://localhost:6001 > .env

npm install
npm run dev        # starts Vite dev server on port 5173
```

### 3. Open in browser

Visit: [http://localhost:5173](http://localhost:5173)

## Environment Variables

### Backend (`server/.env`)
```
MONGO_URI=your_mongodb_connection_string
PORT=6001
```

### Frontend (`frontend/client/.env`)
```
VITE_API_BASE_URL=http://localhost:6001
```

## User Roles

| Role       | Capabilities |
|------------|-------------|
| Freelancer | Browse/bid on projects, chat with clients, submit work, manage profile |
| Client     | Post projects, review bids, approve/reject work, chat with freelancers |
| Admin      | View all users, projects, and applications |
