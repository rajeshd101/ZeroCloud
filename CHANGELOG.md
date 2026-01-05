# Changelog

All notable changes to ZeroCloud will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of ZeroCloud
- Cross-platform file sharing application
- End-to-end AES-256 encryption
- Automatic device discovery using mDNS
- Real-time file transfer with progress tracking
- Modern React-based user interface
- Drag-and-drop file support
- WebSocket-based communication
- Multi-platform builds (Windows, macOS, Linux)
- File size optimization and compression
- Build artifact management

### Security
- AES-256 encryption for all file transfers
- Secure key exchange mechanism
- Network isolation (local network only)
- No cloud storage dependency

### Technical
- Built with Electron and React
- Vite for fast development and building
- Socket.io for real-time communication
- Multicast DNS for device discovery
- Terser for code minification
- Gzip compression for production builds