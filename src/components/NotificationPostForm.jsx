import React, { useState } from 'react';
import { rtdb, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as rtdbRef, push, serverTimestamp, set } from 'firebase/database';

const NotificationPostForm = () => {
  const [notificationText, setNotificationText] = useState('');
  const [notificationImage, setNotificationImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNotificationImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!notificationText && !notificationImage) {
      setError('Please enter text or select an image for the notification.');
      setLoading(false);
      return;
    }

    try {
      let imageUrl = '';
      if (notificationImage) {
        const imageRef = ref(storage, `notifications/${notificationImage.name + Date.now()}`);
        await uploadBytes(imageRef, notificationImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newNotificationRef = push(rtdbRef(rtdb, 'notifications'));
      await set(newNotificationRef, {
        text: notificationText,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        adminId: 'admin_user_id' // TODO: Replace with actual admin user ID
      });

      setMessage('Notification posted successfully!');
      setNotificationText('');
      setNotificationImage(null);
    } catch (err) {
      console.error('Error posting notification: ', err);
      setError('Failed to post notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-post-form">
      <h3>Post New Notification</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="notification-text">Notification Text:</label>
          <textarea
            id="notification-text"
            value={notificationText}
            onChange={(e) => setNotificationText(e.target.value)}
            rows="4"
            placeholder="Enter notification text here..."
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="notification-image">Notification Image:</label>
          <input
            type="file"
            id="notification-image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Notification'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default NotificationPostForm;
