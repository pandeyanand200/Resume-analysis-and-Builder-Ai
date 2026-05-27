# AI Resume Analyzer & Interview Coach

A full-stack AI-powered web application that analyzes resumes, checks ATS compatibility, detects skill gaps, and generates personalized interview questions.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite, Vanilla CSS, React Router v6
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Auth**: JWT + bcrypt

## ✨ Features

- 📄 **Resume Upload** — Drag & drop PDF upload with text extraction
- 📊 **AI Analysis** — Comprehensive resume scoring across 15+ dimensions
- 🛡️ **ATS Compatibility** — Know how ATS systems will score your resume
- 🎯 **Skill Gap Detection** — Identify missing skills and certifications
- 💬 **Interview Coach** — 12 tailored questions with model answers
- 💡 **Improvement Suggestions** — Prioritized actionable recommendations
- 🔐 **Authentication** — Secure JWT-based login/register

## 📦 Project Structure

```
resume-alyliser/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── server/          # Node.js + Express backend
    ├── models/
    ├── routes/
    ├── middleware/
    └── services/
```

## ⚙️ Setup

### 1. Configure Environment Variables

Copy the server environment template:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and fill in:

- `MONGODB_URI` — Your MongoDB Atlas connection string
- `JWT_SECRET` — Any long random string
- `GEMINI_API_KEY` — From [aistudio.google.com](https://aistudio.google.com) (free)

### 2. Install Dependencies

```bash
# Root (for Electron and build tools)
npm install

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Run Web Version (Development)

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The web app will be available at **http://localhost:5173**

### 4. Run Desktop Version (Electron)

**Development:**

```bash
npm run electron:dev
```

This will:

1. Start the Express backend
2. Start the Vite dev server
3. Launch the Electron app window (loads from `http://localhost:5173` in development)

**Build for Windows:**

```bash
npm run electron:build
```

This will:

1. Build the React app for production (`client/dist`)
2. Create a Windows installer in `dist_electron/`

**Install & Run:**

- Find the `.exe` installer in `dist_electron/`
- Run the installer to install the app on your system
- Launch from Start menu or desktop shortcut

## 🔑 Getting a Gemini API Key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API key" → "Create API key"
4. Paste it in `server/.env` as `GEMINI_API_KEY`

## 🗄️ MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Add a database user and whitelist your IP
4. Copy the connection string and paste in `server/.env` as `MONGODB_URI`
