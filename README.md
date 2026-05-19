# Project Management Platform

A full-stack MERN application for managing team projects, tasks, and real-time collaboration.

**GitHub Repository:** [https://github.com/Rustem-Smakov/Final-fullstack.git](https://github.com/Rustem-Smakov/Final-fullstack.git)

## Description

PM helps users register, create projects, manage tasks, build teams, upload files, and collaborate with real-time notifications and online presence via WebSockets.

## Technologies Used

| Layer | Stack |
|-------|--------|
| Frontend | Next.js 14 (App Router), React, CSS Modules |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Uploads | UploadThing |
| Real-time | `ws` (WebSocket) |
| Testing | Jest, Supertest, React Testing Library |

## Main Features

- User registration, login, JWT authentication
- CRUD for Projects, Tasks, and Teams
- Role-based authorization (owner, member, assignee)
- Search and filter projects and tasks
- User avatar, project cover, and task attachment uploads (UploadThing)
- Real-time online users, notifications, and task updates (WebSocket)
- Responsive minimalist UI

## Folder Structure

```
FullStackFinal/
├── backend/          # Express API + WebSocket
├── frontend/         # Next.js App Router client
├── README.md
├── TESTING_REPORT.md
└── .gitignore
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB Atlas or local MongoDB
- UploadThing account ([uploadthing.com](https://uploadthing.com))

### Environment Variables

**backend/.env**

| Variable | Description |
|----------|-------------|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `CLIENT_URL` | Frontend URL (http://localhost:3000) |
| `UPLOADTHING_TOKEN` | UploadThing token |
| `UPLOADTHING_SECRET` | UploadThing secret |

**frontend/.env.local**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL |
| `UPLOADTHING_TOKEN` | UploadThing token |
| `UPLOADTHING_SECRET` | UploadThing secret |

Copy `.env.example` files and fill in your values.

## How to Run Backend

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:5000`  
WebSocket: `ws://localhost:5000/ws?token=YOUR_JWT`

## How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`

## How to Run Tests

```bash
cd backend
npm test

cd frontend
npm test
```

## Deployment

### Vercel (Frontend)

1. Push code to GitHub (do not commit `.env.local`).
2. Import project in [Vercel](https://vercel.com).
3. Set root directory to `frontend`.
4. Add environment variables from `frontend/.env.example`.
5. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL` to your production backend URLs.
6. Deploy.

### Render (Backend)

1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repo; set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.example`.
6. Use MongoDB Atlas for `MONGODB_URI`.
7. Set `CLIENT_URL` to your Vercel frontend URL.

## Live URLs (placeholders)

- **Frontend:** `https://fullstack-final-alpha.vercel.app/`
- **Backend:** `https://fullstack-final-2udw.onrender.com/`
- **Demo Video:** `https://youtu.be/your-demo-video` 