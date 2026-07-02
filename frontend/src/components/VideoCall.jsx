import React, { useRef, useEffect, useState } from 'react';
import SimplePeer from 'simple-peer';
import { getSocket } from '../services/socket';
import '../styles/VideoCall.css';

function VideoCall({ userId, recipientId, onCallEnd }) {
  const [peer, setPeer] = useState(null);
  const userVideoRef = useRef();
  const recipientVideoRef = useRef();
  const socket = getSocket();

  useEffect(() => {
    const initiateCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true
        });

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        const newPeer = new SimplePeer({
          initiator: true,
          trickleIce: false,
          stream: stream
        });

        newPeer.on('signal', signal => {
          socket?.emit('video_call_signal', {
            callerId: userId,
            recipientId,
            signal
          });
        });

        newPeer.on('stream', stream => {
          if (recipientVideoRef.current) {
            recipientVideoRef.current.srcObject = stream;
          }
        });

        setPeer(newPeer);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initiateCall();

    return () => {
      userVideoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
      recipientVideoRef.current?.srcObject?.getTracks().forEach(track => track.stop());
    };
  }, [userId, recipientId, socket]);

  const endCall = () => {
    peer?.destroy();
    socket?.emit('end_call', { callerId: userId, recipientId });
    onCallEnd();
  };

  return (
    <div className="video-call-container">
      <div className="video-wrapper">
        <div className="video-box local">
          <video ref={userVideoRef} autoPlay muted playsInline />
          <span className="label">You</span>
        </div>
        <div className="video-box remote">
          <video ref={recipientVideoRef} autoPlay playsInline />
          <span className="label">Recipient</span>
        </div>
      </div>
      <div className="call-controls">
        <button className="end-btn" onClick={endCall}>End Call</button>
      </div>
    </div>
  );
}

export default VideoCall;
