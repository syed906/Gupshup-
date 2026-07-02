import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import '../styles/Chat.css';

function Chat({ userId, recipientId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socket = getSocket();

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (data) => {
        setMessages(prev => [...prev, data]);
      });
    }
    return () => {
      socket?.off('receive_message');
    };
  }, [socket]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const messageData = {
      senderId: userId,
      recipientId,
      text: inputText,
      timestamp: new Date()
    };

    socket?.emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}>
            <p>{msg.text}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
