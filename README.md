# DevPulse — AI-Powered Code Review Collaboration Platform

> Submit code, get instant AI feedback, and collaborate with teammates through live threaded comments — all in one workspace.

---

## What is DevPulse?

DevPulse is a developer tool that brings together AI-powered code analysis and real-time human collaboration in a single platform.

A developer pastes a code snippet, triggers an AI review that returns structured feedback — bugs with line numbers, severity levels, and a quality score — and shares a link with teammates. Teammates join a live session and leave threaded comments on specific lines, which appear instantly without page refresh using Socket.io.

Think of it as a lightweight pre-PR review workspace: faster than opening a formal pull request, smarter than pasting code into a chat window.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6, Axios, Socket.io-client |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| AI | Groq API (Llama 3.3 70B) |
| Auth | JSON Web Tokens (JWT), bcrypt |
| Deployment | Vercel (frontend), Railway (backend), MongoDB Atlas |

---

## Key Features

- **Structured AI Review** — Sends code to Groq AI with a prompt engineered to return JSON: bugs with line numbers and severity, a 0–100 quality score, and improvement suggestions. Not a chat response — machine-readable structured data.
- **Real-time Collaboration** — Socket.io rooms scoped to each review. Teammates join via a share link. Comments appear live without polling or page refresh.
- **Line-level Threaded Comments** — Comments attach to specific line numbers, mirroring the GitHub Pull Request review experience.
- **JWT Auth with Ownership Middleware** — Write operations (delete, re-analyze) are protected by a custom `isAuthor` middleware that compares the JWT user ID against the review's author field.
- **Public Share Links** — Review pages are publicly readable without login, like a GitHub PR URL. Commenting requires authentication.
- **Review History** — All reviews, AI feedback, and comments are persisted in MongoDB and accessible at any time.
- **Soft Delete** — Reviews are never hard-deleted from the database, preserving data integrity.

---

## System Architecture

```
React Frontend
     │
     ├── Axios (REST API calls)          ──▶  Express Routes
     │        └── JWT in Authorization          └── Controllers
     │                                                  └── Mongoose ──▶ MongoDB Atlas
     │
     └── Socket.io Client (real-time)    ──▶  Socket.io Server
              └── join-room                       └── broadcasts to room
              └── new-comment                     └── comment-added event
              └── leave-room                      └── user-left event
```

---

## Database Schema

**User**
```
_id, username, email, password (bcrypt), createdAt
```

**Review**
```
_id, author (ref: User), code, language,
status (pending | reviewed), isDeleted,
aiReview { bugs[{ lineNo, severity, message }], score, suggestions[] },
createdAt
```

**Comment**
```
_id, reviewId (ref: Review), author (ref: User),
authorName, text, lineNumber, createdAt
```

> `authorName` is denormalized at write time to avoid repeated User lookups during high-frequency Socket.io events.

---

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Protected |

### Reviews
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews` | Protected |
| GET | `/api/reviews` | Protected |
| GET | `/api/reviews/:id` | Public |
| PATCH | `/api/reviews/:id/status` | Protected + Author |
| DELETE | `/api/reviews/:id` | Protected + Author |

### AI & Comments
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/reviews/:id/aireview` | Protected + Author |
| GET | `/api/reviews/:id/comments` | Public |
| POST | `/api/reviews/:id/comments` | Protected |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Backend

```bash
cd server
npm install
```

Create `.env` in `/server`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://127.0.0.1:27017/devpulse
GROQ_API_KEY=your_groq_api_key_here
```

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Project Structure

```
devpulse/
├── server/
│   ├── src/
│   │   ├── config/          # env, db connection
│   │   ├── controllers/     # authController, reviewController
│   │   ├── middlewares/     # protectMiddleware, isAuthor, errorHandler, validate
│   │   ├── models/          # User, Review, Comment
│   │   ├── routes/          # index, authRoutes, reviewRoutes
│   │   ├── utils/           # jwtToken, generateAiReview
│   │   ├── validations/     # userValidation
│   │   ├── socket.js        # Socket.io initialization
│   │   └── app.js
│   └── server.js
│
└── client/
    ├── src/
    │   ├── api/             # axiosInstance
    │   ├── context/         # AuthContext
    │   ├── pages/           # Login, Register, Dashboard, ReviewPage
    │   ├── components/      # PrivateRoute, shared components
    │   └── App.jsx
    └── index.html
```

---

## Design Decisions

**Why Socket.io over polling?**
Polling hits the server every N seconds per user regardless of activity. Socket.io maintains a persistent connection and pushes events only when they occur — significantly more efficient for a collaborative session with multiple users.

**Why denormalize `authorName` in Comment?**
Comments are fetched frequently during active Socket.io sessions. Running `.populate("author")` on every incoming comment would trigger an additional MongoDB query per event. Storing the name at write time eliminates this lookup entirely.

**Why public GET on reviews but protected POST on comments?**
Mirrors the GitHub PR model — anyone with the link can read the review and feedback, but you must be authenticated to contribute. This keeps sharing frictionless while protecting write operations.

**Why Groq over OpenAI?**
Groq's free tier provides fast inference with Llama 3.3 70B, making it practical for a portfolio project without API costs. The integration is API-compatible and can be swapped for any provider.

---

## Author

**Bharath T**
- GitHub: [@Bharath07T](https://github.com/Bharath07T)
- LinkedIn: [linkedin.com/in/bharatht](https://www.linkedin.com/in/bharath-t-091911299/)
- Email: bharathbharathgokila@gmail.com
