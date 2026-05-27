# Resume Analyzer - Electron Architecture

## System Architecture Diagrams

### Development Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Terminal                                 │
│                   npm run electron:dev                           │
└────┬────────────────────────────────────────────────────────────┘
     │
     └─── Concurrently Runs:
         │
         ├─ Process 1: Express Backend
         │   ├─ File: server/index.js
         │   ├─ Port: 5000
         │   ├─ Loads: server/.env
         │   ├─ Database: MongoDB Atlas
         │   └─ APIs: /api/auth, /api/resume, /api/interview
         │
         ├─ Process 2: Vite Dev Server
         │   ├─ File: client/src/
         │   ├─ Port: 5173
         │   └─ Features: Hot reload, source maps
         │
         └─ Process 3: Electron Main
             ├─ File: main.js
             ├─ Waits for servers ready
             ├─ Creates BrowserWindow
             ├─ Loads: http://localhost:5173
             └─ User sees React app
                   ↓
             ┌─────────────────────┐
             │   Electron Window   │
             │  Resume Analyzer    │
             │  (React App)        │
             │                     │
             │  ├─ Login/Register  │
             │  ├─ Upload Resume   │
             │  ├─ View Analysis   │
             │  └─ Interview Coach │
             └──────────┬──────────┘
                        │
                        ↓
            ┌────────────────────────┐
            │  Express API Server    │
            │   localhost:5000       │
            │  (API calls here)      │
            └──────────┬─────────────┘
                       │
                       ↓
            ┌────────────────────────┐
            │  MongoDB Atlas         │
            │  (Store resumes, etc)  │
            └────────────────────────┘
```

### Production Flow (After Building)

```
┌─────────────────────────────────────┐
│    npm run electron:build           │
├─────────────────────────────────────┤
│ 1. Builds React (client/dist)       │
│ 2. Packs with electron-builder      │
│ 3. Creates Windows installer        │
└──────────────┬──────────────────────┘
               │
               ↓
    ┌──────────────────────────────┐
    │ dist_electron/               │
    │ ├─ installer.exe (250MB)     │
    │ └─ portable.exe (250MB)      │
    └──────────────┬───────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ↓                     ↓
  ┌────────────┐      ┌──────────────┐
  │ User runs  │      │ User extracts│
  │ installer  │      │ portable exe │
  └──────┬─────┘      └──────┬───────┘
         │                   │
         ↓                   ↓
  ┌────────────────────────────────┐
  │ C:\Users\<User>\AppData\Local\ │
  │ Programs\Resume Analyzer\      │
  └──────────────┬─────────────────┘
                 │
                 ↓
    ┌────────────────────────────────┐
    │  Electron App Running          │
    │  (With bundled Node.js server) │
    │                                │
    │  ┌──────────────────────────┐  │
    │  │ main.js                  │  │
    │  ├─ Spawns server process   │  │
    │  ├─ Loads .env from res.    │  │
    │  └─ Opens window            │  │
    │      │                       │  │
    │      ├─ /app/server/        │  │
    │      │  ├─ index.js         │  │
    │      │  ├─ routes/          │  │
    │      │  ├─ models/          │  │
    │      │  └─ node_modules/    │  │
    │      │                       │  │
    │      └─ /app/client/dist/   │  │
    │         ├─ index.html       │  │
    │         ├─ js/              │  │
    │         └─ css/             │  │
    │                                │
    │  ┌──────────────────────────┐  │
    │  │ Express Server           │  │
    │  │ (localhost:5000)         │  │
    │  │ ├─ /api/health ✓         │  │
    │  │ ├─ /api/auth             │  │
    │  │ ├─ /api/resume           │  │
    │  │ └─ /api/interview        │  │
    │  └──────────────────────────┘  │
    │                                │
    │  ┌──────────────────────────┐  │
    │  │ React Frontend           │  │
    │  │ (Loaded in Electron)     │  │
    │  │ ├─ Login/Register        │  │
    │  │ ├─ Upload Resume         │  │
    │  │ ├─ View Analysis         │  │
    │  │ └─ Interview Coach       │  │
    │  └──────────────────────────┘  │
    └────────────┬────────────────────┘
                 │
                 ↓
    ┌────────────────────────────────┐
    │ MongoDB Atlas (Cloud)          │
    │ Gemini API (Google Cloud)      │
    │ (Internet required)            │
    └────────────────────────────────┘
```

### File Organization

```
resume-analyzer-desktop/
│
├── main.js ⭐ MODIFIED
│   └─ Electron main process
│      ├─ Spawns Express backend
│      ├─ Health checks server
│      ├─ Creates BrowserWindow
│      └─ Cleanup on exit
│
├── package.json ⭐ MODIFIED
│   └─ Root dependencies
│      ├─ electron
│      ├─ electron-builder
│      ├─ dotenv (NEW)
│      ├─ concurrently
│      └─ wait-on
│
├── .gitignore ✨ NEW
│   └─ Protects secrets:
│      ├─ .env
│      ├─ node_modules/
│      └─ dist_electron/
│
├── client/ (React Frontend)
│   ├── package.json
│   ├── vite.config.js ✓ ALREADY CORRECT
│   ├── src/
│   │   ├── services/
│   │   │   └─ api.js ✓ ALREADY CORRECT
│   │   ├── pages/
│   │   ├── components/
│   │   └─ App.jsx
│   └── dist/ (Generated by build)
│       ├── index.html
│       ├── js/ (Bundled React code)
│       └─ css/ (Bundled styles)
│
├── server/ (Express Backend)
│   ├── package.json
│   ├── index.js ⭐ MODIFIED
│   │   └─ CORS updated
│   ├── .env ✓ VERIFIED
│   │   ├─ MONGODB_URI
│   │   ├─ GEMINI_API_KEY
│   │   ├─ JWT_SECRET
│   │   └─ PORT
│   ├── routes/
│   │   ├─ auth.js
│   │   ├─ resume.js
│   │   └─ interview.js
│   ├── models/
│   │   ├─ User.js
│   │   ├─ Resume.js
│   │   └─ Interview.js
│   └── services/
│       └─ (AI analysis, PDF parsing)
│
├── dist_electron/ (Generated by build)
│   ├── Resume Analyzer Setup 1.0.0.exe
│   └─ Resume Analyzer 1.0.0.exe
│
└── Documentation Files ✨ NEW
    ├─ README.md ⭐ UPDATED
    ├─ ELECTRON_CONVERSION.md ✨ NEW
    ├─ IMPLEMENTATION_SUMMARY.md ✨ NEW
    ├─ TESTING_GUIDE.md ✨ NEW
    ├─ QUICK_REFERENCE.md ✨ NEW
    ├─ SETUP.bat ✨ NEW
    └─ SETUP.sh ✨ NEW
```

### Data Flow - Resume Analysis

```
┌──────────────────┐
│  User Browser    │
│  (Electron App)  │
│                  │
│  Upload PDF File │
└────────┬─────────┘
         │ POST /api/resume/upload
         │ (multipart/form-data)
         ↓
┌──────────────────────────┐
│  Express API Server      │
│  (localhost:5000)        │
│  ├─ routes/resume.js     │
│  ├─ Parse PDF file       │
│  ├─ Extract text         │
│  └─ Call Gemini AI       │
└────────┬─────────────────┘
         │ Gemini API Request
         ↓
┌──────────────────────────┐
│  Google Gemini API       │
│  (Cloud, requires API key)
│  ├─ Analyze resume       │
│  ├─ Score components     │
│  ├─ Check ATS compat.    │
│  └─ Return analysis      │
└────────┬─────────────────┘
         │ API Response
         ↓
┌──────────────────────────┐
│  Express Server          │
│  ├─ Format response      │
│  ├─ Save to MongoDB      │
│  └─ Return to frontend   │
└────────┬─────────────────┘
         │ JSON response
         ↓
┌──────────────────┐
│  React Frontend  │
│  Display Results │
│  - Overall Score │
│  - ATS Compat    │
│  - Skill Gaps    │
│  - Suggestions   │
└──────────────────┘
```

### Server Startup Sequence

```
User runs: npm run electron:dev
│
├─ Start: npm run dev:server
│  └─ Express on port 5000
│     ├─ Load .env
│     ├─ Connect MongoDB
│     └─ Listen on :5000
│
├─ Start: npm run dev:client
│  └─ Vite on port 5173
│     └─ Serve hot-reload dev server
│
└─ Run: wait-on http://localhost:5000/api/health
   └─ Poll server health endpoint
      ├─ If responsive → continue
      └─ If not ready → wait, retry
         │
         └─ Start: electron .
            │
            ├─ main.js loads
            ├─ Read .env variables
            ├─ Spawn server (if packaged)
            ├─ Check /api/health
            │  ├─ 30 attempts
            │  ├─ 500ms between retries
            │  └─ 15 second total timeout
            │
            ├─ Server ready → createWindow()
            ├─ Create BrowserWindow
            ├─ Load http://localhost:5173
            │
            └─ User sees React app!
```

### Process Management

```
npm run electron:dev (Main Process)
│
├─ Child Process 1: node ./server/index.js
│  │   (only in packaged mode)
│  ├─ stdin: ignored
│  ├─ stdout: piped to console
│  └─ stderr: piped to console
│
├─ Child Process 2: npm run dev:server
│  │   (dev mode only)
│  └─ nodemon ./server/index.js
│
└─ Electron Window
   └─ React App (loads from localhost)

On app close:
├─ Window closes
├─ serverProcess.kill() called
├─ Node server terminated
└─ App quits
```

## Key Technical Details

### Environment Loading

```
Development:
  → main.js loads: server/.env (local file)
  → Available to server immediately
  → Can edit .env and restart

Production (Packaged):
  → electron-builder copies server/.env → resources/.env
  → main.js loads: resources/.env (bundled file)
  → Passed to spawned server subprocess
```

### CORS Configuration

```
Allowed Origins:
  ├─ http://localhost:5173 (Vite dev server)
  ├─ http://localhost:3000 (Alternative dev)
  └─ http://localhost:5000 (API calls from same origin)

Not needed:
  └─ file:// protocol (not used in this setup)
```

### API Communication

```
Frontend (React):
  ├─ Base URL: http://localhost:5000/api
  ├─ Methods: GET, POST, PUT, DELETE
  ├─ Auth: JWT in Authorization header
  └─ Interceptors: Token refresh, 401 handling

Backend (Express):
  ├─ PORT: 5000
  ├─ Routes: /auth, /resume, /interview
  ├─ Database: MongoDB connection (MONGODB_URI)
  └─ AI: Gemini API calls (GEMINI_API_KEY)
```

---

## Legend

- ⭐ = Modified (code change)
- ✅ = Verified (no change needed)
- ✨ = New (created)
- ⚠️ = Important

This architecture diagram helps understand how all components interact in both development and production modes.
