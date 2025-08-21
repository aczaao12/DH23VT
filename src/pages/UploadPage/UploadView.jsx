import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db, rtdb, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../../components/shared/SearchableSelect'; // Import the new component
import './UploadView.css';

const UploadView = () => {
  const [activities, setActivities] = useState({});
  const [selectedActivity, setSelectedActivity] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const activitiesRef = ref(rtdb, 'activities');
    onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setActivities(data);
      }
    });
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotification('');

    if (!selectedActivity || !file) {
      setError('Please select an activity and a file.');
      return;
    }

    setLoading(true);

    try {
      const semester = 'HK1N3'; // As specified
      const studentFolder = user.uid;
      const filePath = `upload/${semester}/students/${studentFolder}/${file.name}`;
      const fileRef = storageRef(storage, filePath);

      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const activityData = activities[selectedActivity];

      await addDoc(collection(db, 'users', semester, 'students'), {
        Email: user.email,
        'Tên hoạt động': activityData.name,
        'Điểm cộng': activityData.points,
        'File upload': fileUrl,
        Status: 'Đang chờ',
        'Thời gian': new Date(),
        'Name': user.displayName, // Add this field to save the name of the user who collected the data
      });

      setNotification('Upload successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1 className="upload-header">Upload Activity</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="activity-select" className="form-label">Tên hoạt động:</label>
          <SearchableSelect
            options={activities}
            value={selectedActivity}
            onChange={setSelectedActivity}
            placeholder="Search for activity..."
          />
        </div>

        {selectedActivity && (
          <div className="points-display">
            <p>Điểm cộng: {activities[selectedActivity].points}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="file-upload" className="form-label">File:</label>
          <input id="file-upload" type="file" onChange={handleFileChange} className="form-file-input" required />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>

      {notification && <div className="notification success">{notification}</div>}
      {error && <div className="notification error">{error}</div>}
    </div>
  );
};

export default UploadView;