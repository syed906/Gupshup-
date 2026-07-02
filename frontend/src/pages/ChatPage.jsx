import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import FileUpload from '../components/FileUpload';
import { connectSocket } from '../services/socket';
import '../styles/pages/ChatPage.css';

function ChatPage() {
  const [userId] = useState('current_user_id');
  const [selectedUser, setSelectedUser] = useState('recipient_id');

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div className="chat-page">
      <aside className="sidebar">
        <h1>Gupshup</h1>
        <div className="users-list">
          {/* List of users will be populated here */}
          <div className="user-item" onClick={() => setSelectedUser('user123')}>
            <div className="avatar">👤</div>
            <div className="user-info">
              <h3>User Name</h3>
              <p>Last message...</p>
            </div>
          </div>
        </div>
      </aside>
      <main className="chat-area">
        <Chat userId={userId} recipientId={selectedUser} />
        <FileUpload userId={userId} recipientId={selectedUser} />
      </main>
    </div>
  );
}

export default ChatPage;
