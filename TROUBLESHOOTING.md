# Troubleshooting Guide - Decision Tree

## Quick Diagnosis

Start here when something doesn't work:

### Problem: App Won't Start

**Does the command run at all?**

```
├─ NO - Command not recognized
│  ├─ Check: npm not installed? → Install Node.js from nodejs.org
│  ├─ Check: In wrong directory? → cd d:\resume alyliser
│  ├─ Check: Typo in command? → Copy from QUICK_REFERENCE.md
│  └─ Try: npx electron .
│
└─ YES - Command runs but app fails
   │
   ├─ Error in console mentions "dotenv"?
   │  └─ Fix: npm install (in root directory)
   │
   ├─ Error mentions "cannot find module"?
   │  ├─ npm install (install missing dependencies)
   │  └─ Reinstall specific package if needed
   │
   └─ Window opens but shows blank/white screen?
      └─ See: "Blank Window" section below
```

### Problem: Server Won't Start

**What does the error message say?**

```
├─ "EADDRINUSE" or "Port 5000 already in use"
│  ├─ Windows:
│  │  ├─ netstat -ano | findstr :5000
│  │  ├─ Note the PID number
│  │  └─ taskkill /PID <number> /F
│  │
│  ├─ Or edit server/.env: PORT=5001
│  │  └─ Remember to update api.js base URL
│  │
│  └─ Or restart your computer
│
├─ "Cannot find module 'mongoose'" or similar
│  ├─ Fix: cd server && npm install
│  └─ Verify: node_modules folder exists in server/
│
├─ "MONGODB_URI not found" or connection error
│  ├─ Check: server/.env exists? → Create it
│  ├─ Check: MONGODB_URI= is set?
│  ├─ Check: Connection string is valid
│  ├─ Check: MongoDB Atlas allows your IP
│  │  └─ Atlas Dashboard → Network Access → Add your IP
│  │
│  └─ Try test connection:
│     mongosh "<your-connection-string>"
│
├─ "Health check failed"
│  ├─ Server didn't start → Check above errors
│  ├─ Server crashed → Check server/index.js errors
│  ├─ Port wrong → Check server/.env: PORT=
│  └─ Give it more time → Wait 20+ seconds
│
└─ No error, just takes forever
   ├─ MongoDB connection slow
   │  └─ Try different network or proxy
   │
   └─ Vite dev server slow
      └─ Check hard drive space, close other apps
```

### Problem: API Calls Fail

**What's the error?**

```
├─ CORS error
│  ├─ Check: server/index.js line 15-17
│  ├─ Add your origin to cors() list
│  └─ Restart server
│
├─ 404 Not Found
│  ├─ Check: Route exists in server/routes/?
│  ├─ Check: Correct URL in frontend?
│  └─ Check: Server is running?
│
├─ 401 Unauthorized
│  ├─ Check: JWT token in localStorage?
│  ├─ Check: Login before accessing protected routes
│  └─ Check: JWT_SECRET matches?
│
├─ 500 Internal Server Error
│  ├─ Check: Server console for error message
│  ├─ Check: MongoDB connection
│  └─ Check: API key (GEMINI_API_KEY) valid?
│
├─ Connection refused or timeout
│  ├─ Server not running → Start it
│  ├─ Wrong port → Check api.js baseURL
│  ├─ Firewall blocking → Allow Node.js in firewall
│  └─ Network issue → Check internet
│
└─ Network error (no specific status code)
   ├─ Check: Internet connection
   ├─ Check: Firewall settings
   ├─ Check: VPN interfering?
   └─ Try: Different network
```

### Problem: Build Fails

**What's the error message?**

```
├─ "Cannot find module 'electron-builder'"
│  ├─ Fix: npm install
│  └─ Verify: node_modules/electron-builder exists
│
├─ "client/dist not found"
│  ├─ Run: npm run build:client (first build frontend)
│  └─ Then: npm run electron:build
│
├─ "webpack compilation error" or similar
│  ├─ Fix: cd client && npm install
│  ├─ Try: npm run build:client (alone)
│  └─ Check: No syntax errors in client code
│
├─ "NSIS error" or installer creation failed
│  ├─ Windows only - need NSIS installed
│  ├─ Fix: npm install (includes NSIS)
│  ├─ Or: Download NSIS separately
│  └─ Try: Restart and build again
│
├─ Build succeeds but no .exe created
│  ├─ Check: dist_electron/ folder exists?
│  ├─ Look for: Resume Analyzer*.exe files
│  ├─ If not there: Check full console output
│  └─ Try: Delete dist_electron/ and rebuild
│
└─ Build takes very long time (>10 minutes)
   ├─ First build is slow (app cache)
   ├─ Check: Hard drive space (need ~2GB free)
   ├─ Check: Antivirus scanning files (slow build)
   └─ Let it finish (can take 10-15 min first time)
```

### Problem: Installer Won't Run

**What happens when you run .exe?**

```
├─ Nothing happens
│  ├─ Try: Right-click → Run as Administrator
│  ├─ Try: Disable antivirus temporarily
│  ├─ Try: Check Windows Defender SmartScreen
│  └─ Try: Different Windows account
│
├─ Windows Defender warning
│  ├─ This is normal for unsigned executables
│  ├─ Click: More info → Run anyway
│  └─ Or: Sign the executable (see docs)
│
├─ "Setup failed" or installation error
│  ├─ Space: Free up disk space (need 300MB)
│  ├─ Permissions: Run as Administrator
│  ├─ Registry: Check antivirus allows registry access
│  └─ Try: Clean install (uninstall any old version first)
│
├─ Installation succeeds but app won't start
│  ├─ Check: Installed location correct?
│  │  Path: C:\Users\<User>\AppData\Local\Programs\Resume Analyzer\
│  │
│  ├─ Try: Run manually from install folder
│  │  Resume Analyzer.exe should be there
│  │
│  ├─ Check: Event Viewer for error
│  │  Windows Logs → Application → Look for errors
│  │
│  └─ Try: Reinstall (uninstall → reinstall)
│
└─ Portable .exe won't run
   ├─ No installation needed for portable
   ├─ Try: Run as Administrator
   ├─ Try: Different folder (not Program Files)
   │  └─ Program Files requires elevation for node.js
   │
   └─ Try: Move to Desktop or Documents folder
```

## Symptom → Solution Matrix

| Symptom                  | Likely Cause           | Solution                                      |
| ------------------------ | ---------------------- | --------------------------------------------- |
| "ENOENT" error           | Files missing          | `npm install` in appropriate folder           |
| Server doesn't start     | Port in use            | Kill process or change PORT in .env           |
| Blank white window       | Frontend fails to load | Check browser console (Ctrl+Shift+I)          |
| "Cannot connect" message | API down               | Verify server is running on :5000             |
| Login doesn't work       | Database error         | Check MongoDB connection string               |
| Resume upload fails      | Multer/file error      | Check server/middleware for limits            |
| Analysis hangs           | Gemini API slow        | Wait 30-60 seconds, check API key             |
| Build fails              | Wrong command          | Run: `npm run build:client` first, then build |
| No installer created     | Build incomplete       | Check for errors, run again                   |
| App slow (CPU/Memory)    | Resource leak          | Restart app, check for infinite loops         |

## Step-by-Step Fixes

### Fix 1: Reinstall Everything

```
1. Delete node_modules folders
2. npm install (root)
3. cd server && npm install
4. cd ../client && npm install
5. Try again
```

### Fix 2: Clear Caches

```
1. npm cache clean --force
2. Delete dist_electron/
3. Delete client/dist/
4. npm run electron:build
```

### Fix 3: Verify .env

```
1. Open server/.env in text editor
2. Check all 4 variables exist:
   - PORT=5000 (or your port)
   - MONGODB_URI=mongodb+srv://...
   - JWT_SECRET=any-string
   - GEMINI_API_KEY=AIzaSy...
3. Save and restart
```

### Fix 4: Check Logs

```
Development:
  └─ Look at terminal output
     - [Server] messages = backend logs
     - Console errors = frontend errors

Production (Installed):
  └─ Event Viewer
     - Run: eventvwr
     - Windows Logs → Application
     - Sort by Event ID
     - Look for recent errors
```

### Fix 5: Start Fresh Dev Build

```
1. Close all Node/Electron processes (Task Manager)
2. Delete client/dist folder
3. npm run electron:dev
4. Wait 15+ seconds
```

## Advanced Debugging

### Enable Dev Tools

Edit `main.js` line 91, uncomment:

```javascript
mainWindow.webContents.openDevTools();
```

Then rebuild and run. DevTools window shows:

- Console - JavaScript errors
- Network - API calls
- Sources - Code debugging
- Storage - LocalStorage/SessionStorage

### Check Process Tree

Windows Command Prompt:

```
wmic process where name="node.exe" list brief
wmic process where name="electron.exe" list brief
tasklist /v | find "Resume"
```

### Monitor Network

Check API calls:

1. Open DevTools (Ctrl+Shift+I)
2. Go to Network tab
3. Make a request in app
4. See request/response

### Monitor File System

Check what files are created:

- Installed app: `C:\Users\<User>\AppData\Local\Programs\Resume Analyzer\`
- Config files: `C:\Users\<User>\AppData\Roaming\Resume Analyzer\`
- Logs: `C:\Users\<User>\AppData\Local\Temp\`

## When to Report Issues

If you've tried everything above and still have problems:

1. **Collect Information:**
   - Error message (exact text)
   - Console output (full terminal)
   - Steps to reproduce
   - Your system info (Windows version)

2. **Check:**
   - GitHub issues for this project
   - Electron documentation
   - Express/MongoDB docs

3. **Questions to Ask:**
   - Did it work before? (What changed?)
   - Does it work in dev mode vs production?
   - Is it reproducible consistently?

---

**Most Common Fixes:**

1. `npm install` (80% of problems)
2. Check server/.env exists with all variables
3. Check port 5000 is free (`netstat -ano | findstr :5000`)
4. Wait longer at startup (server takes time to start)
5. Restart your computer (clears ports, temp files)

**Last Resort:**

```
Fresh start from scratch:
1. Delete: node_modules/ (all 3 locations)
2. Delete: package-lock.json (all 3 locations)
3. npm install (root)
4. cd server && npm install && cd ..
5. cd client && npm install && cd ..
6. npm run electron:dev
```
