import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db, rtdb, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../../components/shared/SearchableSelect'; // Import the new component
import ConfirmationModal from '../../components/shared/ConfirmationModal';
import Toast from '../../components/shared/Toast';
import SemesterSelector from '../../components/shared/SemesterSelector';
import './UploadView.css';

const UploadView = () => {
  const [activities, setActivities] = useState({});
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleOpenModal = (e) => {
    e.preventDefault();
    setError('');
    setNotification('');

    if (!selectedActivity || !file) {
      setError('Please select an activity and a file.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsModalOpen(false);

    try {
      const semester = selectedSemester;
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

  const closeToast = () => {
    setNotification('');
    setError('');
  };

  return (
    <div className="upload-container">
      <Toast message={notification} onClose={closeToast} type="success" />
      <Toast message={error} onClose={closeToast} type="error" />
      <h1 className="upload-header">Upload Activity</h1>
      <form onSubmit={handleOpenModal}>
        <div className="form-group">
          <label htmlFor="semester-select" className="form-label">Học kỳ:</label>
          <SemesterSelector selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} />
        </div>
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

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubmit}
        activityName={activities[selectedActivity]?.name}
        semester={selectedSemester}
      />
    </div>
  );
};

export default UploadView;
