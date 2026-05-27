const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
const http = require('http');

// Load environment variables for the server
const envPath = app.isPackaged 
  ? path.join(process.resourcesPath, '.env')
  : path.join(__dirname, 'server', '.env');

dotenv.config({ path: envPath });

let mainWindow;
let serverProcess = null;

// Health check function to verify server is running
function checkServerHealth(port = 5000, maxRetries = 30, delayMs = 500) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const check = () => {
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ Server is healthy and ready');
          resolve();
        } else {
          retry();
        }
      });
      
      req.on('error', () => {
        retry();
      });
      
      req.setTimeout(1000, () => {
        req.destroy();
        retry();
      });
    };
    
    const retry = () => {
      retries++;
      if (retries < maxRetries) {
        setTimeout(check, delayMs);
      } else {
        reject(new Error(`Server health check failed after ${maxRetries} retries`));
      }
    };
    
    check();
  });
}

// Start the Express server in a child process
function startServer() {
  return new Promise((resolve, reject) => {
    const serverPath = app.isPackaged
      ? path.join(process.resourcesPath, 'server', 'index.js')
      : path.join(__dirname, 'server', 'index.js');
    
    const serverDir = app.isPackaged
      ? path.join(process.resourcesPath, 'server')
      : path.join(__dirname, 'server');
    
    console.log('🚀 Starting Express server...');
    console.log('Server path:', serverPath);
    console.log('Server dir:', serverDir);
    
    serverProcess = spawn('node', [serverPath], {
      cwd: serverDir,
      env: {
        ...process.env,
        NODE_ENV: app.isPackaged ? 'production' : 'development',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(`[Server] ${data.toString().trim()}`);
    });
    
    serverProcess.stderr.on('data', (data) => {
      console.error(`[Server Error] ${data.toString().trim()}`);
    });
    
    serverProcess.on('error', (error) => {
      console.error('Failed to start server process:', error);
      reject(error);
    });
    
    serverProcess.on('exit', (code) => {
      console.log(`Server process exited with code ${code}`);
      serverProcess = null;
    });
    
    // Wait a moment before health check to let server startup
    setTimeout(() => {
      checkServerHealth()
        .then(resolve)
        .catch(reject);
    }, 500);
  });
}

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
    // In production, load the built React app
    mainWindow.loadFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  } else {
    // In development, load the Vite dev server (assuming it runs on port 5173)
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(async () => {
  try {
    // Start the server first
    await startServer();
    console.log('✅ Server started successfully');
    
    // Create the window
    createWindow();
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    // Optionally show an error dialog to the user
    // dialog.showErrorBox('Startup Error', error.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  // Terminate server process
  if (serverProcess) {
    console.log('🛑 Terminating server process...');
    serverProcess.kill();
    serverProcess = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit to ensure cleanup
app.on('quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});
