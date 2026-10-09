# 💬 Web Chat App — Real-Time Messaging Platform

> Sign up, find people, and chat instantly. Share images, customise your profile, and see who's online.

![Stack](https://img.shields.io/badge/MERN-Stack-green)
![Realtime](https://img.shields.io/badge/Realtime-Messaging-blue)
![Auth](https://img.shields.io/badge/Auth-JWT-orange)
![Status](https://img.shields.io/badge/Status-Hackathon%20Build-purple)

**🔗 Live Demo:** `<add-link>` | **🎥 Demo Video:** `<add-link>` | **📊 Pitch Deck:** `<add-link>`

---

## 📌 Table of Contents
1. [The Problem](#-the-problem)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [Demo Credentials](#-demo-credentials)
5. [Tech Stack](#-tech-stack)
6. [Architecture](#-architecture)
7. [Data Model](#-data-model)
8. [API Reference](#-api-reference)
9. [Folder Structure](#-folder-structure)
10. [Getting Started](#-getting-started)
11. [Deployment](#-deployment)
12. [Security Design](#-security-design)
13. [Challenges & Learnings](#-challenges--learnings)
14. [Roadmap](#-roadmap)
15. [Team](#-team)

---

## 🚨 The Problem
- Many chat tools are heavy, ad-driven, or locked to a platform.
- Small teams, classes, and communities want a simple, self-hostable chat they fully control.
- Developers need a clean reference for building real-time apps with authentication and media sharing.

## 💡 Our Solution
A lightweight, full-stack chat platform with secure auth, instant messaging, image sharing, and customisable profiles, built on a modular React + Express codebase that is easy to extend.

---

## ✨ Key Features
- **Real-time messaging** — instant one-to-one conversations
- **Secure authentication** — sign-up, login, JWT-protected routes (`AuthContext`)
- **Interactive chat UI** — conversation sidebar, message container, right-side profile panel (`ChatContext`, `ChatContainer`)
- **Profile management** — update name, bio, and avatar
- **Media sharing** — send images via Cloudinary (gallery view in the right sidebar)
- **Responsive design** — works across desktop and mobile

---

## 🔑 Demo Credentials
> Add throwaway accounts so judges can test two users side by side.

| User | Email | Password |
| --- | --- | --- |
| Demo User 1 | `user1@demo.com` | `demo1234` |
| Demo User 2 | `user2@demo.com` | `demo1234` |

**Tip for judges:** open the app in two different browsers (or one normal and one incognito window) to see messages arrive live.

---

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React, Vite, React Router, Tailwind CSS, Context API |
| **Backend** | Node.js, Express.js, REST controllers |
| **Realtime** | Socket.io (or equivalent WebSocket layer) |
| **Database** | MongoDB, Mongoose |
| **Media** | Cloudinary |
| **Security** | JWT, bcrypt, CORS, dotenv |
| **Deploy** | Vercel (client; `vercel.json` included), Render / Railway (server) |

---

## 🏗 Architecture

```text
[ Browser (React SPA) ]
        │
        ▼
┌─────────────────────────────┐
│ Client                      │
│  AuthContext  ChatContext   │
│  Sidebar · ChatContainer ·  │
│  RightSidebar               │
└──────────────┬──────────────┘
               │ REST + JWT   │ WebSocket events
               ▼              ▼
┌─────────────────────────────┐
│ Server (Node + Express)     │
│  auth middleware            │
│  userRoutes · messageRoutes │
│  controllers                │
└──────┬───────────────┬──────┘
       ▼               ▼
┌────────────┐   ┌────────────┐
│  MongoDB   │   │ Cloudinary │
│ User / Msg │   │  (images)  │
└────────────┘   └────────────┘
```

**Message flow:** `Type message → ChatContext sends → server verifies JWT → saves Message → (uploads image to Cloudinary if attached) → emits to recipient → recipient UI updates`

---

## 🗄 Data Model

```text
User    { fullName, email, password(hash), profilePic, bio, createdAt }
Message { senderId→User, receiverId→User, text, image(url), seen, createdAt }
```

> Adjust fields to match `User.js` and `Message.js`.

---

## 📡 API Reference
> Align paths with `userRoutes.js` and `messageRoutes.js`.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/check` | ✅ | Validate session |
| PUT | `/api/auth/update-profile` | ✅ | Update name, bio, avatar |
| GET | `/api/messages/users` | ✅ | Users for the sidebar |
| GET | `/api/messages/:id` | ✅ | Conversation with a user |
| POST | `/api/messages/send/:id` | ✅ | Send text or image |
| PUT | `/api/messages/mark/:id` | ✅ | Mark message as seen |

Token header: `Authorization: Bearer <token>` (or `token: <jwt>`, depending on your `auth.js`).

---

## 📁 Folder Structure

```text
Web-Chat-App
├─ client
│  ├─ context/            # AuthContext, ChatContext
│  ├─ public/             # favicon, bgImage
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets/          # icons, logos, sample avatars
│  │  ├─ components/      # ChatContainer, Sidebar, RightSidebar
│  │  ├─ lib/utils.js
│  │  ├─ pages/           # HomePage, LoginPage, ProfilePage
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ vercel.json
│  └─ vite.config.js
└─ server
   ├─ controllers/        # messageController, userController
   ├─ lib/                # cloudinary, db, utils
   ├─ middleware/auth.js
   ├─ models/             # Message, User
   ├─ routes/             # messageRoutes, userRoutes
   └─ server.js
```

---

## 🚀 Getting Started

**Prerequisites:** Node.js v18+, a MongoDB URI (Atlas or local), a Cloudinary account.

### 1. Clone
```bash
git clone https://github.com/your-username/Web-Chat-App.git
cd Web-Chat-App
```

### 2. Server
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
```bash
npm run server
```

### 3. Client
```bash
cd ../client
npm install
npm run dev
```
If your client reads the backend URL from an env var, add `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Troubleshooting
| Problem | Fix |
| --- | --- |
| Mongo connection error | Check `MONGODB_URI` and whitelist your IP in Atlas |
| Image upload fails | Verify Cloudinary keys; large base64 payloads may need a higher body-size limit (`express.json({ limit: "10mb" })`) |
| CORS error | Allow the client origin in the server's CORS config |
| Messages don't arrive live | Confirm the socket connects with the user's id and uses the right server URL |
| Logged out on refresh | Persist the token (localStorage) and re-validate with the check endpoint |

---

## ☁️ Deployment
- **Client:** Vercel. The included `vercel.json` handles SPA route rewrites.
- **Server:** Render or Railway. If you use WebSockets, choose a host with persistent connections; Vercel serverless functions generally do not keep them open.
- Set all server env vars on the host, update the client's backend URL, and add the deployed client origin to CORS.

---

## 🔒 Security Design
- Passwords hashed with **bcrypt**; never returned in API responses
- **JWT** checked by `auth.js` middleware on protected routes
- Secrets stored in `.env` (gitignored)
- Media stored on Cloudinary, not on the server

**Hardening checklist:**
- [ ] `helmet` and `express-rate-limit` on login/signup
- [ ] Input validation (Zod / Joi)
- [ ] Image type and size limits before upload
- [ ] Short-lived tokens or httpOnly cookies instead of localStorage
- [ ] Sanitise message text to avoid XSS

---

## 🧠 Challenges & Learnings
- **Context architecture:** splitting state into `AuthContext` (who you are) and `ChatContext` (who you're talking to, messages) keeps components simple and avoids prop drilling.
- **Real-time consistency:** the sender's UI updates optimistically while the receiver updates via socket events; handle both so messages are never duplicated.
- **Media flow:** uploading to Cloudinary on the server and storing only the URL keeps the database small and fast.
- **Unread/seen state:** tracking `seen` per message enables unread badges with little extra code.

---

## 🗺 Roadmap
- [ ] Online/offline presence and typing indicators
- [ ] Group chats and channels
- [ ] Read receipts and unread counters
- [ ] Message edit, delete, and reactions
- [ ] File, voice-note, and emoji support
- [ ] Push / email notifications
- [ ] End-to-end encryption
- [ ] Dark/light themes
- [ ] AI features: smart replies, chat summaries
- [ ] Tests (Jest, Supertest) and CI via GitHub Actions

---

## 🌍 Impact
A simple, self-hostable chat foundation for classrooms, clubs, and small teams, and a clean starter for learning real-time full-stack development.

---

## 👥 Team

| Name | Role | Links |
| --- | --- | --- |
| Prem Sharma | Full-stack developer | [GitHub](https://github.com/premmsharma122) · [LinkedIn](https://www.linkedin.com/in/prem-sharma-0a4b62291/) |

---

## 📜 License
MIT. See `LICENSE`.

⭐ If you like this project, star the repo!
