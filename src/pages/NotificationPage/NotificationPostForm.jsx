import React, { useState } from 'react';
import { auth, rtdb, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ref as rtdbRef, push, serverTimestamp, set } from 'firebase/database';

const NotificationPostForm = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
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

    if (!notificationTitle || (!notificationBody && !notificationImage)) {
      setError('Please enter a title and either text or select an image for the notification.');
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

      const user = auth.currentUser;
      if (!user) {
          setError('You must be logged in to post a notification.');
          setLoading(false);
          return;
      }

      const newNotificationRef = push(rtdbRef(rtdb, 'notifications'));
      await set(newNotificationRef, {
        title: notificationTitle,
        body: notificationBody,
        imageUrl: imageUrl,
        timestamp: serverTimestamp(),
        adminId: user.displayName || 'Admin', // Use display name from auth
        authorAvatarUrl: user.photoURL || '' // Save the avatar URL
      });

      setMessage('Notification posted successfully!');
      setNotificationTitle('');
      setNotificationBody('');
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
          <label htmlFor="notification-title">Title:</label>
          <input
            type="text"
            id="notification-title"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            placeholder="Enter notification title here..."
          />
        </div>
        <div className="form-group">
          <label htmlFor="notification-body">Notification Body:</label>
          <textarea
            id="notification-body"
            value={notificationBody}
            onChange={(e) => setNotificationBody(e.target.value)}
            rows="4"
            placeholder="Enter notification body here..."
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
