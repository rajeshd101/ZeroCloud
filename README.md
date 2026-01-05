# ZeroCloud

A secure, cross-platform file sharing application built with Electron and React that enables seamless file transfer between devices on the same network.

## 🚀 Features

- **Zero-configuration networking** - Automatic device discovery using mDNS
- **End-to-end encryption** - AES-256 encryption for all file transfers
- **Cross-platform support** - Windows, macOS, and Linux
- **Real-time communication** - WebSocket-based file transfer with progress tracking
- **Intuitive UI** - Modern React interface with drag-and-drop support
- **Network discovery** - Automatic detection of other ZeroCloud devices

## 📦 Installation

### Download Pre-built Binaries
Download the latest release for your platform from the [Releases](https://github.com/rajeshd101/ZeroCloud/releases) page.

### Build from Source
```bash
# Clone the repository
git clone https://github.com/rajeshd101/ZeroCloud.git
cd ZeroCloud

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Create distributable packages
npm run dist
```

## 🛠 Development

### Prerequisites
- Node.js 18+ 
- npm 8+

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:compress # Build with compression
npm run electron:dev # Run Electron in development
npm run dist         # Build distributables for all platforms
npm run dist:win     # Build for Windows
npm run dist:linux   # Build for Linux  
npm run dist:mac     # Build for macOS
npm run optimize     # Clean build artifacts and check file sizes
npm run compress     # Compress build files
```

### Project Structure
```
ZeroCloud/
├── src/                 # React source code
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # React entry point
│   ├── cryptoUtils.js  # Encryption utilities
│   └── index.css       # Global styles
├── public/             # Static assets
├── main.js             # Electron main process
├── compress.js         # Build compression utility
├── optimize.js         # Repository optimization tools
└── vite.config.js      # Vite configuration
```

## 🔒 Security

ZeroCloud implements multiple security layers:

- **AES-256 Encryption** - All files encrypted before transmission
- **Network Isolation** - Only operates on local network
- **No Cloud Storage** - Files never leave your local network
- **Secure Key Exchange** - Automatic key generation and exchange

## 🌐 How It Works

1. **Discovery** - ZeroCloud uses multicast DNS to discover other devices
2. **Connection** - Establishes WebSocket connection between devices  
3. **Encryption** - Generates unique encryption keys for each session
4. **Transfer** - Files are encrypted, transmitted, and decrypted on arrival

## 📋 System Requirements

- **Windows**: Windows 10 or later
- **macOS**: macOS 10.14 or later  
- **Linux**: Ubuntu 18.04+ or equivalent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raj D** - [drajesh@hotmail.com](mailto:drajesh@hotmail.com)

## 🐛 Issues

Found a bug? Please open an issue on the [Issues](https://github.com/rajeshd101/ZeroCloud/issues) page.

## ⭐ Support

If you find this project helpful, please give it a star on GitHub!