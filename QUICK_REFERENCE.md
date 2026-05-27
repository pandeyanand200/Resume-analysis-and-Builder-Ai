# Resume Analyzer - Electron Desktop App

## Quick Reference Card

### 🔧 Installation & Setup

```bash
# Install all dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 🚀 Run in Development

```bash
npm run electron:dev
```

**What happens:**

- Backend starts on `localhost:5000`
- Frontend dev server starts on `localhost:5173`
- Electron window opens automatically
- Changes to code reload instantly (hot reload)
- Full DevTools access for debugging

**Time to launch:** 10-15 seconds (first time may take longer)

### 🏗️ Build for Windows

```bash
npm run electron:build
```

**What happens:**

- React app optimized for production
- Everything bundled with Electron
- Creates installer: `dist_electron/Resume Analyzer Setup 1.0.0.exe`
- Also creates portable: `dist_electron/Resume Analyzer 1.0.0.exe`

**Time to build:** 2-5 minutes

### ⚙️ Configuration

Edit `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-api-key
```

### 📦 What's in the Package

**Development Build:**

- Loads frontend from dev server (localhost:5173)
- Backend runs in separate process
- All source code visible (for debugging)

**Production Build:**

- Frontend precompiled and optimized
- Backend bundled in executable
- All dependencies included
- Runs completely standalone

### 🧪 Testing Checklist

**Development:**

- [ ] App launches without errors
- [ ] Frontend loads
- [ ] Can log in
- [ ] Resume upload works
- [ ] Analysis completes
- [ ] Results save to database

**Production:**

- [ ] Installer runs
- [ ] App installs successfully
- [ ] Desktop shortcut works
- [ ] Installed app launches
- [ ] All features work same as dev

### 🛠️ Troubleshooting

| Problem                    | Solution                                                                    |
| -------------------------- | --------------------------------------------------------------------------- |
| "Server failed to start"   | Check MongoDB connection in `.env`                                          |
| "Port 5000 already in use" | Kill process: `netstat -ano \| findstr :5000` then `taskkill /PID <PID> /F` |
| Vite won't start           | Reinstall: `cd client && npm install`                                       |
| Blank white window         | Check browser console (Ctrl+Shift+I) for errors                             |
| `.env` not found           | Verify `server/.env` exists with all required fields                        |

### 📂 Important Files

- `main.js` - Electron entry point
- `server/.env` - Configuration (DO NOT COMMIT)
- `server/index.js` - Backend API
- `client/src/` - React frontend code
- `package.json` - Root dependencies and build config

### 🔐 Security Reminder

- `.env` is protected by `.gitignore` (won't be committed to git)
- Never share your MongoDB URI or API keys
- In production, consider environment-based configuration

### 📊 App Specifications

- **Language:** JavaScript/React
- **Framework:** Electron, Express
- **Database:** MongoDB
- **AI:** Google Gemini API
- **Auth:** JWT tokens
- **Platform:** Windows (via NSIS installer)
- **Typical Size:** ~250 MB (installer)

### 🎯 Key Commands

```bash
npm run electron:dev          # Run development version
npm run electron:build        # Build production installer
npm run start                 # Start packaged app
npm run dev:server            # Run only backend
npm run dev:client            # Run only frontend
```

### 📚 For More Info

- **Setup Details:** Read `SETUP.bat` (Windows) or `SETUP.sh` (Unix)
- **Testing Guide:** See `TESTING_GUIDE.md`
- **Implementation:** See `IMPLEMENTATION_SUMMARY.md`
- **Development:** See `README.md`

---

**Version:** 1.0.0  
**Status:** ✅ Ready for Testing and Distribution
