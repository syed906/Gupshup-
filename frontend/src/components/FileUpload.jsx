import React, { useState } from 'react';
import { filesAPI } from '../services/api';
import { getSocket } from '../services/socket';
import '../styles/FileUpload.css';

function FileUpload({ userId, recipientId }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const socket = getSocket();

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('senderId', userId);
    formData.append('recipientId', recipientId);
    formData.append('fileType', file.type.split('/')[0]); // image, video, document, etc.

    try {
      const response = await filesAPI.uploadFile(formData);
      setUploadProgress(100);
      
      // Notify recipient
      socket?.emit('file_upload_progress', {
        senderId: userId,
        recipientId,
        fileName: file.name,
        fileUrl: response.data.fileUrl,
        fileType: file.type
      });

      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="file-input" className="upload-btn">
        📎 Attach File
      </label>
      <input
        id="file-input"
        type="file"
        onChange={handleFileUpload}
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
        hidden
      />
      {uploadProgress > 0 && (
        <div className="progress-bar">
          <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
          <span>{uploadProgress}%</span>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
