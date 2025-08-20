import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, off } from 'firebase/database';

const NotificationView = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const notificationsRef = ref(rtdb, 'notifications');

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedNotifications = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
        setNotifications(loadedNotifications);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    }, (err) => {
      console.error('Error fetching notifications: ', err);
      setError('Failed to load notifications.');
      setLoading(false);
    });

    // Cleanup function
    return () => off(notificationsRef, 'value', unsubscribe);
  }, []);

  if (loading) {
    return <div className="notification-view">Loading notifications...</div>;
  }

  if (error) {
    return <div className="notification-view error">Error: {error}</div>;
  }

  return (
    <div className="notification-view">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <div className="notification-list">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              {notification.imageUrl && (
                <img src={notification.imageUrl} alt="Notification" className="notification-image" />
              )}
              <p className="notification-text">{notification.text}</p>
              <p className="notification-timestamp">
                {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationView;