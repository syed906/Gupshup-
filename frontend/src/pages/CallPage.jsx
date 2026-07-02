import React, { useState } from 'react';
import VideoCall from '../components/VideoCall';
import AudioCall from '../components/AudioCall';
import '../styles/pages/CallPage.css';

function CallPage() {
  const [callType, setCallType] = useState(null);
  const [userId] = useState('current_user_id');
  const [recipientId] = useState('recipient_id');

  const startCall = (type) => {
    setCallType(type);
  };

  const endCall = () => {
    setCallType(null);
  };

  if (callType === 'video') {
    return <VideoCall userId={userId} recipientId={recipientId} onCallEnd={endCall} />;
  }

  if (callType === 'audio') {
    return <AudioCall userId={userId} recipientId={recipientId} onCallEnd={endCall} />;
  }

  return (
    <div className="call-page">
      <div className="call-options">
        <button onClick={() => startCall('audio')} className="audio-btn">📞 Audio Call</button>
        <button onClick={() => startCall('video')} className="video-btn">📹 Video Call</button>
      </div>
    </div>
  );
}

export default CallPage;
