import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db, rtdb, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';

const UploadView = () => {
  const [activities, setActivities] = useState({});
  const [selectedActivity, setSelectedActivity] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
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
    if (!selectedActivity || !file) {
      setNotification('Please select an activity and a file.');
      return;
    }

    setLoading(true);
    setNotification('');

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
      });

      setNotification('Upload successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error uploading file:', error);
      setNotification('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Activity</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="activity-select">Tên hoạt động:</label>
          <select id="activity-select" value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
            <option value="">--Please choose an activity--</option>
            {Object.keys(activities).map((key) => (
              <option key={key} value={key}>
                {activities[key].name}
              </option>
            ))}
          </select>
        </div>
        {selectedActivity && (
          <div>
            <p>Điểm cộng: {activities[selectedActivity].points}</p>
          </div>
        )}
        <div>
          <label htmlFor="file-upload">File:</label>
          <input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {notification && <p>{notification}</p>}
    </div>
  );
};

export default UploadView;
