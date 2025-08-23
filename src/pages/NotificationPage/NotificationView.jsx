import React, { useState, useEffect } from 'react';
import { auth, rtdb, storage } from '../../firebase'; // Import storage
import { ref, onValue, off, remove, set } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage'; // Import for image upload
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const NotificationView = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNotificationId, setEditingNotificationId] = useState(null);
  const [currentEditTitle, setCurrentEditTitle] = useState('');
  const [currentEditBody, setCurrentEditBody] = useState('');
  const [currentEditImage, setCurrentEditImage] = useState(null);
  const [currentEditImageUrl, setCurrentEditImageUrl] = useState('');
  const [expandedNotifications, setExpandedNotifications] = useState({}); // New state for show more/less
  const [activeMenu, setActiveMenu] = useState(null); // State for active dropdown menu

  const user = auth.currentUser; // Get current user
  const allowedAdminEmail = '23129398@st.hcmuaf.edu.vn';
  const isAdmin = user && user.email === allowedAdminEmail; // Check if current user is the allowed admin

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
    });

    // Cleanup function
    return () => off(notificationsRef, 'value', unsubscribe);
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) { // Check if current user is admin
      setError('You do not have permission to delete notifications.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await remove(ref(rtdb, `notifications/${id}`));
        // No need to update state here, onValue listener will handle it
      } catch (err) {
        console.error('Error deleting notification: ', err);
        setError('Failed to delete notification.');
      }
    }
  };

  const handleEdit = (notification) => {
    if (!isAdmin) { // Check if current user is admin
      setError('You do not have permission to edit notifications.');
      return;
    }
    setEditingNotificationId(notification.id);
    setCurrentEditTitle(notification.title);
    setCurrentEditBody(notification.body);
    setCurrentEditImageUrl(notification.imageUrl);
    setCurrentEditImage(null); // Clear file input
  };

  const handleCancelEdit = () => {
    setEditingNotificationId(null);
    setCurrentEditTitle('');
    setCurrentEditBody('');
    setCurrentEditImageUrl('');
    setCurrentEditImage(null);
  };

  const handleUpdateNotification = async (e) => {
    e.preventDefault();
    if (!isAdmin) { // Check if current user is admin
      setError('You do not have permission to edit notifications.');
      return;
    }
    if (!currentEditTitle || (!currentEditBody && !currentEditImage && !currentEditImageUrl)) {
      setError('Please enter a title and either text or select an image for the notification.');
      return;
    }

    try {
      let imageUrl = currentEditImageUrl; // Start with existing image URL

      if (currentEditImage) { // If a new image is selected
        const imageRef = ref(storage, `notifications/${currentEditImage.name + Date.now()}`);
        await uploadBytes(imageRef, currentEditImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await set(ref(rtdb, `notifications/${editingNotificationId}`), {
        title: currentEditTitle,
        body: currentEditBody,
        imageUrl: imageUrl,
        timestamp: notifications.find(n => n.id === editingNotificationId).timestamp, // Keep original timestamp
        adminId: notifications.find(n => n.id === editingNotificationId).adminId // Keep original adminId
      });

      // Reset editing state
      handleCancelEdit();
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error updating notification: ', err);
      setError('Failed to update notification.');
    }
  };

  const handleLike = async (notificationId, currentLikes) => {
    const newLikes = (currentLikes || 0) + 1;
    try {
      await set(ref(rtdb, `notifications/${notificationId}/likes`), newLikes);
    } catch (err) {
      console.error('Error liking notification: ', err);
      setError('Failed to like notification.');
    }
  };

  const handleShare = (notification) => {
    if (navigator.share) {
      navigator.share({
        title: notification.title,
        text: notification.body,
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('Share not supported on this browser, you can manually copy the link.');
    }
  };

  const toggleExpanded = (id) => {
    setExpandedNotifications(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

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
          {notifications.map(notification => {
            const rawBody = notification.body || '';
            const isLongText = rawBody.length > 300;
            const isExpanded = expandedNotifications[notification.id];

            const displayedBody = isLongText && !isExpanded
              ? rawBody.substring(0, 300) + '...'
              : rawBody;

            return (
              <div key={notification.id} className="notification-item">
                {editingNotificationId === notification.id ? (
                  // Edit Form
                  <form onSubmit={handleUpdateNotification} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                      <label htmlFor="edit-title">Title:</label>
                      <input
                        type="text"
                        id="edit-title"
                        value={currentEditTitle}
                        onChange={(e) => setCurrentEditTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-body">Body:</label>
                      <textarea
                        id="edit-body"
                        value={currentEditBody}
                        onChange={(e) => setCurrentEditBody(e.target.value)}
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-image">Image:</label>
                    {currentEditImageUrl && (
                      <div>
                        <p>Current Image:</p>
                        <img src={currentEditImageUrl} alt="Current" style={{ maxWidth: '100px' }} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="edit-image"
                      accept="image/*"
                      onChange={(e) => setCurrentEditImage(e.target.files[0])}
                    />
                  </div>
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
              ) : (
                // Display Notification
                <>
                  <header className="notification-header">
                    <img src="https://lh3.googleusercontent.com/a/ACg8ocIlzuhoxIQy9GsCl1uJK6DN-yUZZUqR1UIYU6BhixA_u6DFMYl8=s96-c" alt="Avatar" className="notification-avatar" />
                    <div className="notification-author-info">
                      <span className="notification-author-name">{notification.adminId || 'Admin'}</span>
                      <span className="notification-timestamp">
                        {notification.timestamp ? new Date(notification.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="menu-container">
                        {activeMenu === notification.id ? (
                          <div className="inline-menu-actions">
                            <button onClick={() => { handleEdit(notification); setActiveMenu(null); }}>Edit</button>
                            <button onClick={() => { handleDelete(notification.id); setActiveMenu(null); }}>Delete</button>
                            <button className="menu-button close-button" onClick={() => setActiveMenu(null)}>X</button>
                          </div>
                        ) : (
                          <button className="menu-button" onClick={() => setActiveMenu(notification.id)}>
                            …
                          </button>
                        )}
                      </div>
                    )}
                  </header>

                  <div className="notification-body-container">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(displayedBody)) }}></p>
                    {notification.imageUrl && (
                      <img src={notification.imageUrl} alt="Notification" className="notification-image" />
                    )}
                  </div>

                  {isLongText && (
                    <button onClick={() => toggleExpanded(notification.id)} className="action-button">
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}

                  <footer className="notification-footer">                    
                    <hr className="notification-divider" />
                    <div className="notification-actions">
                        <button className="action-button" onClick={() => handleLike(notification.id, notification.likes)}>{notification.likes || 0} Like</button>
                        <button className="action-button" onClick={() => handleShare(notification)}>Share</button>
                    </div>
                  </footer>
                </>
              )}
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationView;