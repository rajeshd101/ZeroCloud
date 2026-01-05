const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs-extra');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mdns = require('multicast-dns')();
const multer = require('multer');

let mainWindow;
const PORT = 4567;
let currentSocketPort = 4568;
const SERVICE_NAME = 'ZeroCloud';
const HOSTNAME = os.hostname();
const DOWNLOADS_DIR = path.join(os.homedir(), 'ZeroCloudDownloads');
const CHAT_HISTORY_DIR = path.join(os.homedir(), 'ZeroCloudHistory');

// Ensure directories exist
fs.ensureDirSync(DOWNLOADS_DIR);
fs.ensureDirSync(CHAT_HISTORY_DIR);

// Single Instance Lock - only after app is ready
function initializeApp() {
  const gotTheLock = app.requestSingleInstanceLock();
  
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });
    
    createWindow();
    startDiscovery();
  }
}

app.whenReady().then(initializeApp);

// Express setup for file transfers
const expressApp = express();
const server = http.createServer(expressApp);
const io = new Server(server, {
  cors: { origin: "*" }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, DOWNLOADS_DIR),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

expressApp.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).send({ message: 'File uploaded successfully' });
  if (mainWindow) {
    mainWindow.webContents.send('file-received', {
      filename: req.file.originalname,
      from: req.body.sender || 'Unknown'
    });
  }
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    currentSocketPort = port;
    console.log(`Socket/File server running on all interfaces port ${currentSocketPort}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(currentSocketPort);

// mDNS Discovery
const peers = new Map();

function startDiscovery() {
  mdns.on('response', (response) => {
    response.answers.forEach(answer => {
      if (answer.name === SERVICE_NAME && answer.type === 'SRV') {
        const [port, target] = answer.data.target.split(':');
        // In a real scenario, we'd parse the packet better, but for simplicity:
        // We'll use the sender's IP from the packet if available or assume local
      }
    });
    
    // Simplified discovery: listen for our specific query
    response.answers.forEach(a => {
      if (a.name === SERVICE_NAME && a.type === 'TXT') {
        try {
          const data = JSON.parse(a.data.toString());
          if (data.hostname !== HOSTNAME) {
            peers.set(data.hostname, {
              hostname: data.hostname,
              ip: response.referer.address,
              port: data.port || 4568,
              lastSeen: Date.now()
            });
            updatePeers();
          }
        } catch (e) {}
      }
    });
  });

  mdns.on('query', (query) => {
    if (query.questions.some(q => q.name === SERVICE_NAME)) {
      mdns.respond({
        answers: [{
          name: SERVICE_NAME,
          type: 'TXT',
          data: JSON.stringify({ hostname: HOSTNAME, port: currentSocketPort })
        }]
      });
    }
  });

  // Broadcast presence every 5 seconds
  setInterval(() => {
    mdns.query({
      questions: [{ name: SERVICE_NAME, type: 'TXT' }]
    });
  }, 5000);
}

function updatePeers() {
  if (mainWindow) {
    mainWindow.webContents.send('peers-updated', Array.from(peers.values()));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const template = [
    {
      label: 'File',
      submenu: [{ role: 'quit' }]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'ZeroCloud Info',
          click: () => {
            mainWindow.webContents.send('toggle-help');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('get-my-info', (event) => {
  const networkInterfaces = os.networkInterfaces();
  let ip = '127.0.0.1';
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ip = iface.address;
        break;
      }
    }
  }
  event.reply('my-info', { hostname: HOSTNAME, ip: ip });
});

ipcMain.on('save-chat-history', (event, { peerHostname, history }) => {
  const filePath = path.join(CHAT_HISTORY_DIR, `${peerHostname}.json`);
  fs.writeJsonSync(filePath, history);
});

ipcMain.on('load-chat-history', (event, peerHostname) => {
  const filePath = path.join(CHAT_HISTORY_DIR, `${peerHostname}.json`);
  if (fs.existsSync(filePath)) {
    const history = fs.readJsonSync(filePath);
    event.reply('chat-history-loaded', { peerHostname, history });
  }
});

ipcMain.on('delete-chat-history', (event, peerHostname) => {
  const filePath = path.join(CHAT_HISTORY_DIR, `${peerHostname}.json`);
  if (fs.existsSync(filePath)) {
    fs.removeSync(filePath);
  }
});

ipcMain.on('send-message', (event, { targetIp, targetPort, message }) => {
  const socket = require('socket.io-client')(`http://${targetIp}:${targetPort}`);
  socket.emit('chat-message', { from: HOSTNAME, message });
  socket.disconnect();
});

io.on('connection', (socket) => {
  socket.on('chat-message', (data) => {
    if (mainWindow) {
      mainWindow.webContents.send('new-message', data);
    }
  });
});
