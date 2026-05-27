/**
 * main.js
 *
 * Dual-mode entry point:
 *   - When Electron is available  →  launches the desktop GUI and spawns the Express server as a child process.
 *   - When running on a plain Node server (e.g. Render)  →  boots the Express server directly, no Electron involved.
 *
 * Render sets the start command to "node main.js" via the "main" field in package.json.
 * Because Electron is listed only as a devDependency it will not be installed on Render,
 * so the require('electron') call would throw.  We guard against that here.
 */

'use strict';

const path    = require('path');
const dotenv  = require('dotenv');

// ─── Detect whether Electron is available ────────────────────────────────────
let electronApp        = null;
let electronAvailable  = false;

try {
  const electron = require('electron');
  // In Electron the default export is the app object; in a plain Node process
  // requiring 'electron' returns a string (the path to the binary), not an object.
  if (electron && typeof electron === 'object' && typeof electron.whenReady === 'function') {
    electronApp       = electron;
    electronAvailable = true;
  }
} catch (_ignored) {
  // Electron is not installed — we are running as a plain web server.
  electronAvailable = false;
}

// ─── Plain server mode (Render / any Node host) ───────────────────────────────
if (!electronAvailable) {
  console.log('ℹ️  Electron not detected. Starting in plain server mode.');

  // Load .env from the server subdirectory (mirrors what server.js does).
  dotenv.config({ path: path.join(__dirname, 'server', '.env') });

  // Delegate entirely to the Express server entry point.
  require('./server/index.js');

  // Nothing more to do — server/index.js connects to MongoDB and calls app.listen().
  return;
}

// ─── Electron desktop mode ────────────────────────────────────────────────────
const { BrowserWindow } = require('electron');
const { spawn }         = require('child_process');
const http              = require('http');

const app = electronApp;

// Load .env — packed builds store it in process.resourcesPath, dev builds in server/.env
const envPath = app.isPackaged
  ? path.join(process.resourcesPath, '.env')
  : path.join(__dirname, 'server', '.env');

dotenv.config({ path: envPath });

let mainWindow    = null;
let serverProcess = null;

/**
 * Poll the /api/health endpoint until the server responds 200 or we run out of retries.
 */
function checkServerHealth(port, maxRetries, delayMs) {
  port       = port       || 5000;
  maxRetries = maxRetries || 30;
  delayMs    = delayMs    || 500;

  return new Promise(function (resolve, reject) {
    var retries = 0;

    function check() {
      var req = http.get('http://localhost:' + port + '/api/health', function (res) {
        if (res.statusCode === 200) {
          console.log('✅ Server is healthy and ready');
          resolve();
        } else {
          retry();
        }
      });

      req.on('error', retry);
      req.setTimeout(1000, function () {
        req.destroy();
        retry();
      });
    }

    function retry() {
      retries++;
      if (retries < maxRetries) {
        setTimeout(check, delayMs);
      } else {
        reject(new Error('Server health check failed after ' + maxRetries + ' retries'));
      }
    }

    check();
  });
}

/**
 * Spawn the Express server as a child process and wait until it is healthy.
 */
function startServer() {
  return new Promise(function (resolve, reject) {
    var serverPath = app.isPackaged
      ? path.join(process.resourcesPath, 'server', 'index.js')
      : path.join(__dirname, 'server', 'index.js');

    var serverDir = app.isPackaged
      ? path.join(process.resourcesPath, 'server')
      : path.join(__dirname, 'server');

    console.log('🚀 Starting Express server...');
    console.log('Server path:', serverPath);
    console.log('Server dir:', serverDir);

    serverProcess = spawn('node', [serverPath], {
      cwd: serverDir,
      env: Object.assign({}, process.env, {
        NODE_ENV: app.isPackaged ? 'production' : 'development',
      }),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProcess.stdout.on('data', function (data) {
      console.log('[Server] ' + data.toString().trim());
    });

    serverProcess.stderr.on('data', function (data) {
      console.error('[Server Error] ' + data.toString().trim());
    });

    serverProcess.on('error', function (error) {
      console.error('Failed to start server process:', error);
      reject(error);
    });

    serverProcess.on('exit', function (code) {
      console.log('Server process exited with code ' + code);
      serverProcess = null;
    });

    // Give the child process a moment to start before we begin health-checking.
    setTimeout(function () {
      checkServerHealth()
        .then(resolve)
        .catch(reject);
    }, 500);
  });
}

/**
 * Create the Electron browser window.
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// ─── Electron lifecycle ───────────────────────────────────────────────────────
app.whenReady().then(async function () {
  try {
    await startServer();
    console.log('✅ Server started successfully');
    createWindow();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    app.quit();
  }
});

app.on('window-all-closed', function () {
  if (serverProcess) {
    console.log('🛑 Terminating server process...');
    serverProcess.kill();
    serverProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', function () {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});