# ZeroCloud Documentation

This directory contains comprehensive documentation for ZeroCloud.

## Quick Start

1. **Installation**: Download from [releases](https://github.com/rajeshd101/ZeroCloud/releases) or build from source
2. **Setup**: Run ZeroCloud on devices you want to connect
3. **Discovery**: Devices automatically discover each other on the same network
4. **Transfer**: Drag and drop files to share securely

## Security

ZeroCloud uses AES-256 encryption for all file transfers. Files are encrypted before transmission and decrypted only on the receiving device. No data is stored in the cloud or transmitted over the internet.

## Network Requirements

- All devices must be on the same local network
- Multicast DNS (mDNS) must be enabled
- Firewall may need to allow ZeroCloud connections

## Troubleshooting

### Device Not Found
- Ensure both devices are on the same network
- Check firewall settings
- Restart the application

### Transfer Failed
- Check available disk space
- Verify network connection
- Try smaller files first

### Performance Issues
- Close other network-intensive applications
- Use wired connection for large files
- Check network bandwidth

## Technical Details

- **Encryption**: AES-256-CBC
- **Discovery**: Multicast DNS (Bonjour/Avahi)
- **Communication**: WebSocket (Socket.io)
- **Platforms**: Windows, macOS, Linux

For more detailed information, see the main [README](../README.md).
