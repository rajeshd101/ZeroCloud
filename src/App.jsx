import React, { useState, useEffect, useRef } from 'react';
import { encryptMessage, decryptMessage } from './cryptoUtils';
const { ipcRenderer } = window.require('electron');

function App() {
  const [myInfo, setMyInfo] = useState({ hostname: '', ip: '' });
  const [peers, setPeers] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [messages, setMessages] = useState({}); // { hostname: [messages] }
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    ipcRenderer.send('get-my-info');
    ipcRenderer.on('my-info', (event, info) => setMyInfo(info));
    
    ipcRenderer.on('peers-updated', (event, updatedPeers) => {
      setPeers(updatedPeers);
    });

    ipcRenderer.on('new-message', (event, data) => {
      const decrypted = decryptMessage(data.message);
      addMessage(data.from, decrypted, 'received');
    });

    ipcRenderer.on('file-received', (event, data) => {
      addMessage(data.from, `Received file: ${data.filename}`, 'received');
    });

    ipcRenderer.on('toggle-help', () => {
      setShowHelp(prev => !prev);
    });

    ipcRenderer.on('chat-history-loaded', (event, { peerHostname, history }) => {
      setMessages(prev => ({
        ...prev,
        [peerHostname]: history
      }));
    });

    return () => {
      ipcRenderer.removeAllListeners('my-info');
      ipcRenderer.removeAllListeners('peers-updated');
      ipcRenderer.removeAllListeners('new-message');
      ipcRenderer.removeAllListeners('file-received');
      ipcRenderer.removeAllListeners('toggle-help');
    };
  }, []);

  const addMessage = (peerHostname, text, type) => {
    setMessages(prev => {
      const newHistory = [...(prev[peerHostname] || []), { text, type, timestamp: new Date().toLocaleTimeString() }];
      ipcRenderer.send('save-chat-history', { peerHostname, history: newHistory });
      return {
        ...prev,
        [peerHostname]: newHistory
      };
    });
  };

  const sendMessage = () => {
    if (!inputText.trim() || !selectedPeer) return;
    
    const encrypted = encryptMessage(inputText);
    
    ipcRenderer.send('send-message', {
      targetIp: selectedPeer.ip,
      targetPort: selectedPeer.port,
      message: encrypted
    });

    addMessage(selectedPeer.hostname, inputText, 'sent');
    setInputText('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedPeer) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sender', myInfo.hostname);

    try {
      const response = await fetch(`http://${selectedPeer.ip}:${selectedPeer.port}/upload`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        addMessage(selectedPeer.hostname, `Sent file: ${file.name}`, 'sent');
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to send file');
    }
  };

  const currentMessages = selectedPeer ? (messages[selectedPeer.hostname] || []) : [];

  // Check if there are multiple peers with the same hostname
  const hasDuplicateHostnames = (hostname) => {
    return peers.filter(p => p.hostname === hostname).length > 1;
  };

  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (selectedPeer) {
      ipcRenderer.send('load-chat-history', selectedPeer.hostname);
    }
  }, [selectedPeer]);

  const deleteHistory = () => {
    if (selectedPeer && window.confirm(`Are you sure you want to delete chat history with ${selectedPeer.hostname}?`)) {
      ipcRenderer.send('delete-chat-history', selectedPeer.hostname);
      setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[selectedPeer.hostname];
        return newMessages;
      });
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}>{myInfo.hostname}</div>
          <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>{myInfo.ip}</div>
        </div>
        <div className="peer-list">
          {peers.length === 0 && <div style={{ padding: 20, fontSize: '0.8rem', color: '#999' }}>Searching for peers...</div>}
          {peers.map((peer, index) => (
            <div 
              key={`${peer.hostname}-${peer.ip}-${index}`} 
              className={`peer-item ${selectedPeer?.ip === peer.ip ? 'active' : ''}`}
              onClick={() => setSelectedPeer(peer)}
            >
              <strong>
                {peer.hostname} 
                {hasDuplicateHostnames(peer.hostname) && <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 'normal' }}> ({peer.ip})</span>}
              </strong>
              <div style={{ fontSize: '0.7rem', color: '#666' }}>{peer.ip}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {showHelp ? (
          <div style={{ padding: '40px', overflowY: 'auto' }}>
            <h2>ZeroCloud Help & Information</h2>
            <p><strong>Your System Name:</strong> {myInfo.hostname}</p>
            <p><strong>Your IP Address:</strong> {myInfo.ip}</p>
            <hr />
            
            <h3>User Guide</h3>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              <h4>1. Connecting with Peers</h4>
              <p>ZeroCloud uses <strong>Automatic Discovery</strong>. Connect all systems to the same LAN/Wi-Fi, and they will appear in the sidebar within seconds.</p>
              
              <h4>2. Messaging</h4>
              <p>Select a peer and type your message. All messages are <strong>AES-256 encrypted</strong> end-to-end and stay within your local network.</p>
              
              <h4>3. File Sharing</h4>
              <p>Click the <strong>📎 icon</strong> to send files. Received files are saved to the <code>ZeroCloudDownloads</code> folder in your Home directory.</p>
              
              <h4>4. Chat History</h4>
              <p>History is saved locally and encrypted. You can recover chats by selecting the peer again, or delete them using the <strong>Delete History</strong> button.</p>
            </div>

            <hr />
            <h3>Credits:</h3>
            <p><strong>Name:</strong> Raj D</p>
            <p><strong>Email:</strong> <a href="mailto:drajesh@hotmail.com">drajesh@hotmail.com</a></p>
            
            <hr />
            <h3>Documentation</h3>
            <p>For full technical details, please refer to the <code>DOCUMENTATION.md</code> and <code>USER_GUIDE.md</code> files in the application directory.</p>
          </div>
        ) : selectedPeer ? (
          <>
            <div className="chat-header">
              <span>Chatting with <strong>{selectedPeer.hostname}</strong></span>
              <button 
                onClick={deleteHistory}
                style={{ background: '#dc3545', padding: '5px 10px', fontSize: '0.7rem' }}
              >
                Delete History
              </button>
            </div>
            <div className="messages-container">
              {currentMessages.map((msg, i) => (
                <div key={i} className={`message ${msg.type}`}>
                  <div>{msg.text}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: 5 }}>{msg.timestamp}</div>
                </div>
              ))}
            </div>
            <div className="input-area">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileUpload}
              />
              <button className="file-input-label" onClick={() => fileInputRef.current.click()}>
                📎
              </button>
              <input 
                type="text" 
                placeholder="Type a message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Select a peer to start communicating
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
