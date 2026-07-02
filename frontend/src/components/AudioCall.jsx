import React, { useRef, useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import { getSocket } from '../services/socket';
import '../styles/AudioCall.css';

function AudioCall({ userId, recipientId, onCallEnd }) {
  const [peer, setPeer] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const socketSocket = getSocket();

  useEffect(() => {
    const initiateCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const newPeer = new SimplePeer({
          initiator: true,
          trickleIce: false,
          stream: stream
        });

        newPeer.on('signal', signal => {
          socketSocket?.emit('audio_call_signal', {
            callerId: userId,
            recipientId,
            signal
          });
        });

        setPeer(newPeer);
      } catch (error) {
        console.error('Error accessing audio:', error);
      }
    };

    initiateCall();

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [userId, recipientId, socketSocket]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    peer?.destroy();
    socketSocket?.emit('end_call', {
      callerId: userId,
      recipientId,
      duration: callDuration
    });
    onCallEnd();
  };

  return (
    <div className="audio-call-container">
      <div className="call-info">
        <h2>Audio Call</h2>
        <p className="duration">{formatDuration(callDuration)}</p>
      </div>
      <div className="call-controls">
        <button className="end-btn" onClick={endCall}>End Call</button>
      </div>
    </div>
  );
}

export default AudioCall;
