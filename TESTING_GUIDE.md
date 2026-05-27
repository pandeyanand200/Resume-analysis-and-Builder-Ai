# Electron Desktop App - Testing Guide

## Pre-Test Checklist

Before running the application, ensure:

1. ✅ **Dependencies Installed**
   - Root: `npm install` (Electron, electron-builder, concurrently, wait-on, dotenv)
   - Server: `npm install` (Express, Mongoose, Gemini, JWT, bcrypt, etc.)
   - Client: `npm install` (React, Vite, Axios, React Router, etc.)

2. ✅ **Environment Configuration**
   - `server/.env` exists with:
     - `PORT=5000`
     - `MONGODB_URI=<your-mongodb-connection-string>`
     - `JWT_SECRET=<your-jwt-secret>`
     - `GEMINI_API_KEY=<your-gemini-api-key>`

3. ✅ **File Structure**
   - `main.js` - Electron main process
   - `client/dist/` - Will be created by build
   - `server/` - Contains all backend code

## Development Testing (`npm run electron:dev`)

### What This Command Does

1. Starts Express backend on `http://localhost:5000`
2. Starts Vite dev server on `http://localhost:5173`
3. Launches Electron window loading from dev server
4. Backend output and errors visible in terminal

### Expected Behavior

```
Terminal Output:
✓ Server running on http://localhost:5000
✓ Server is healthy and ready
✓ Electron window opens
✓ Frontend loads from http://localhost:5173
✓ Can interact with the app in development mode
```

### Test Steps

1. Open a terminal and run: `npm run electron:dev`
2. Wait 10-15 seconds for server and Vite to start
3. Electron window should open automatically
4. Verify:
   - ✅ Login/register page loads
   - ✅ Can interact with form inputs
   - ✅ No console errors in DevTools (Ctrl+Shift+I)
   - ✅ Network requests to `http://localhost:5000/api` succeed

### Common Issues & Fixes

| Issue                         | Cause                                            | Fix                                                               |
| ----------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| "Server health check failed"  | Server didn't start or MongoDB connection failed | Check `.env` variables, ensure MongoDB is accessible              |
| "Cannot find module 'dotenv'" | Root dependencies not installed                  | Run `npm install` in root directory                               |
| Window shows blank white page | Vite dev server not running                      | Check terminal for Vite errors, reinstall `npm install` in client |
| CORS errors in console        | Browser loading from wrong origin                | Verify CORS config includes `http://localhost:5173`               |
| MongoDB connection timeout    | Connection string invalid or network blocked     | Verify `MONGODB_URI` in `.env`, check MongoDB Atlas IP whitelist  |

## Production Build Testing (`npm run electron:build`)

### What This Command Does

1. Builds React app for production (`client/dist/`)
2. Bundles everything with electron-builder
3. Creates Windows installer in `dist_electron/`
4. Includes `.env` file in packaged resources

### Expected Output

```
✓ Building React app...
✓ React build complete (dist/)
✓ electron-builder packaging...
✓ Installer created: dist_electron/Resume Analyzer Setup 1.0.0.exe
✓ Portable app created: dist_electron/Resume Analyzer 1.0.0.exe
```

### Test Steps

#### Step 1: Create the Build

```bash
npm run electron:build
```

- Takes 2-5 minutes depending on system
- Check `dist_electron/` folder for `.exe` files

#### Step 2: Test the Installer

- Find `Resume Analyzer Setup 1.0.0.exe` in `dist_electron/`
- Double-click to run installer
- Follow installation wizard
- Choose install location (default: `C:\Users\<User>\AppData\Local\Programs\Resume Analyzer`)
- Check "Create desktop shortcut" option

#### Step 3: Test the Installed App

- Find "Resume Analyzer" in Start menu
- Or use desktop shortcut
- Launch the app
- Verify:
  - ✅ Window opens (no console visible)
  - ✅ App loads the React frontend
  - ✅ Can log in / register
  - ✅ Can upload resume PDF
  - ✅ API calls to backend work
  - ✅ Database operations (analysis results) save correctly

#### Step 4: Uninstall & Test Portable Version

- Control Panel → Apps → Resume Analyzer → Uninstall
- Or use uninstall from Start menu
- Now test portable version: `Resume Analyzer 1.0.0.exe`
- Can run without installation, no shortcuts created

## Verification Checklist

### Development Build

- [ ] App launches without errors
- [ ] Frontend loads from dev server
- [ ] Can log in / register
- [ ] Resume upload works
- [ ] AI analysis completes
- [ ] Database saves results
- [ ] No console errors or warnings

### Production Build

- [ ] Installer runs without errors
- [ ] App installs to correct location
- [ ] Desktop shortcut created
- [ ] Start menu entry created
- [ ] App launches from shortcuts
- [ ] All features work the same as dev build
- [ ] No console window visible
- [ ] Uninstaller removes app cleanly

## Performance Notes

- First startup may take 10-15 seconds (server cold start)
- Resume analysis can take 30+ seconds depending on Gemini API response time
- App requires internet connection (MongoDB, Gemini API)

## Troubleshooting Production Build

| Issue                                 | Solution                                                                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Installer won't run                   | May need Windows Defender exception, try running as Administrator                                  |
| App crashes on startup                | Check Event Viewer > Windows Logs > Application for error details                                  |
| API calls fail                        | Verify `.env` variables are correctly packaged; check in `appdata/Local/Programs/Resume Analyzer/` |
| MongoDB connection fails in built app | Same issue as dev; check MongoDB Atlas IP whitelist includes your network                          |

## Advanced Testing

### Check Packaged Environment Variables

In the installed app directory:

```
C:\Users\<User>\AppData\Local\Programs\Resume Analyzer\resources\.env
```

Should contain:

```
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
GEMINI_API_KEY=...
```

### Verify Bundle Contents

Extract the `.exe` (it's a 7z archive) to see:

```
resources/
  ├── app/
  │   ├── main.js
  │   ├── server/
  │   ├── client/dist/
  │   └── node_modules/
  └── .env
```

### Monitor App Resources

Use Task Manager to check:

- CPU usage (should idle low, spike during analysis)
- Memory usage (typically 100-200 MB idle)
- Ensure processes terminate properly on app close
