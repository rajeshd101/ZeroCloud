# ZeroCloud (ZC) Documentation

ZeroCloud is a secure, cross-platform application designed for seamless communication and file sharing over a Local Area Network (LAN).

## Features

- **Automatic Peer Discovery**: Uses mDNS to find other ZeroCloud instances on your network automatically.
- **Encrypted Messaging**: All messages are encrypted using AES-256 before being sent over the network.
- **Direct File Transfer**: Send files of any size directly to peers.
- **Privacy Focused**: All data stays within your local network. No cloud servers are involved.
- **Cross-Platform**: Compatible with Windows, macOS, and Linux.

## Getting Started

1. **Launch ZeroCloud**: Open the application on two or more systems connected to the same LAN.
2. **Discovery**: Wait a few seconds for the application to discover other peers. They will appear in the sidebar.
3. **Select a Peer**: Click on a system name in the sidebar to start a conversation.
4. **Chat**: Type your message and press Enter or click Send. Your messages are encrypted end-to-end.
5. **Send Files**: Click the paperclip icon (📎) to select a file and send it to the selected peer.

## File Storage

Received files are automatically saved to a folder named `ZeroCloudDownloads` in your system's Home directory.

## Security

ZeroCloud uses a shared secret key for AES encryption of all chat messages. This ensures that even if network traffic is intercepted, your messages remain private.

## Author

**Raj D**
Email: [drajesh@hotmail.com](mailto:drajesh@hotmail.com)
