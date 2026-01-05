# ZeroCloud (ZC) User Guide

Welcome to **ZeroCloud**, your secure, local-only communication and file-sharing hub. This guide will help you get started and make the most of the application.

---

## 1. Installation & Launch

### Running from Source
1. Ensure you have [Node.js](https://nodejs.org/) installed.
2. Open your terminal in the project directory.
3. Run `npm install` to install dependencies.
4. Run `npm run electron:dev` to launch the application.

### Running Standalone
- Locate the `ZeroCloud` executable in your installation folder and double-click to open.
- **Note:** Only one instance of ZeroCloud can run on a system at a time. If you try to open it again, the existing window will be brought to the front.

---

## 2. Connecting with Peers

ZeroCloud uses **Automatic Discovery**. You don't need to enter IP addresses manually.
1. Connect all systems to the same Local Area Network (LAN) or Wi-Fi.
2. Open ZeroCloud on all systems.
3. Within a few seconds, other systems will appear in the **left sidebar**.
4. If multiple systems have the same name, ZeroCloud will automatically display their IP addresses next to their names to help you identify them.

---

## 3. Messaging

### Starting a Chat
1. Click on a peer's name in the sidebar.
2. Type your message in the input field at the bottom.
3. Press **Enter** or click **Send**.

### Security & Privacy
- **Encryption:** Every message is encrypted using **AES-256** before it leaves your computer. Only the intended recipient can decrypt and read it.
- **Local Only:** Your messages never leave your network. No cloud servers are used.

---

## 4. File Sharing

1. Select a peer from the sidebar.
2. Click the **Paperclip icon (📎)** next to the message input.
3. Select the file you wish to send.
4. The file will be sent directly to the peer.

### Where are files saved?
Received files are automatically saved to a folder named `ZeroCloudDownloads` in your system's **Home directory**.

---

## 5. Chat History

### Recovery
ZeroCloud automatically saves your chat history in an encrypted format. If you close the application and reopen it, your previous conversations will be restored when you select the same peer.

### Deleting History
If you wish to remove a conversation:
1. Select the peer in the sidebar.
2. Click the red **Delete History** button at the top of the chat window.
3. Confirm the deletion. This will permanently remove the encrypted history file from your system.

---

## 6. Help & System Info

To view your own system details or access this guide within the app:
1. Go to the top menu bar.
2. Select **Help > ZeroCloud Info**.
3. Here you can see your **System Name**, **IP Address**, and the **Credits**.

---

## Credits
- **Author:** Raj D
- **Email:** drajesh@hotmail.com
