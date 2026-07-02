import React, { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import '../styles/pages/ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await usersAPI.getProfile('current_user_id');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (updatedData) => {
    try {
      await usersAPI.updateProfile('current_user_id', updatedData);
      setProfile(updatedData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Profile</h1>
        {profile && !editing && (
          <div className="profile-info">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Bio:</strong> {profile.bio || 'No bio'}</p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </div>
        )}
        {editing && (
          <div className="profile-edit">
            {/* Edit form will go here */}
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
