'use client';

import { useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import UploadButtonComponent from '../../components/UploadButtonComponent';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import styles from '../../styles/components.module.css';

export default function ProfilePage() {
  const { user, fetchMe } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(form);
      await fetchMe();
      setMessage('Profile updated');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAvatarUpload = async (url) => {
    try {
      await api.updateAvatar(url);
      await fetchMe();
      setMessage('Avatar updated');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container">
        <div className={styles.pageHeader}>
          <h1>Profile</h1>
        </div>
        {user?.avatarUrl && (
          <img src={user.avatarUrl} alt="Avatar" className={styles.avatar} />
        )}
        <UploadButtonComponent
          endpoint="avatarUploader"
          label="Upload Avatar"
          onUploadComplete={handleAvatarUpload}
        />
        <form className={styles.form} onSubmit={handleSave} style={{ marginTop: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>
          {message && <p style={{ color: '#15803d' }}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            Save Profile
          </button>
        </form>
        <p className={styles.cardMeta} style={{ marginTop: '1rem' }}>
          Email: {user?.email}
        </p>
      </div>
    </ProtectedRoute>
  );
}
