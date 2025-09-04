import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db, rtdb, storage } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import SearchableSelect from '../../components/shared/SearchableSelect';
import ConfirmationModal from '../../components/shared/ConfirmationModal';
import Toast from '../../components/shared/Toast';
import SemesterSelector from '../../components/shared/SemesterSelector';
// import UserActivitiesTable from '../../components/shared/UserActivitiesTable'; // REMOVED
// import EditActivityModal from '../../components/shared/EditActivityModal'; // REMOVED
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
  const [isDuplicateActivitySelected, setIsDuplicateActivitySelected] = useState(false);
  // const [userActivities, setUserActivities] = useState([]); // REMOVED
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false); // REMOVED
  // const [activityToEdit, setActivityToEdit] = useState(null); // REMOVED
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

  // REMOVED: useEffect to fetch user's uploaded activities
  /*
  useEffect(() => {
    const fetchUserActivities = async () => {
      if (user && selectedSemester) {
        try {
          const q = query(
            collection(db, 'users', selectedSemester, 'students'),
            where('Email', '==', user.email)
          );
          const querySnapshot = await getDocs(q);
          const fetchedActivities = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserActivities(fetchedActivities);
        } catch (err) {
          console.error('Error fetching user activities:', err);
          setError(`Failed to load your activities: ${err.message}`);
        }
      }
    };

    fetchUserActivities();
  }, [user, selectedSemester]);
  */

  // New useEffect to check for existing activity when selectedActivity changes
  useEffect(() => {
    const checkExistingActivity = async () => {
      if (user && selectedSemester && selectedActivity && activities[selectedActivity]) {
        try {
          const activityName = activities[selectedActivity].name;
          const q = query(
            collection(db, 'users', selectedSemester, 'students'),
            where('Email', '==', user.email),
            where('Tên hoạt động', '==', activityName)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setIsDuplicateActivitySelected(true);
            setNotification('');
            setError('');
          } else {
            setIsDuplicateActivitySelected(false);
            setNotification('');
            setError('');
          }
        } catch (err) {
          console.error('Error checking existing activity:', err);
          setError(`Lỗi khi kiểm tra hoạt động: ${err.message}`);
        }
      }
    };

    checkExistingActivity();
  }, [selectedActivity, user, selectedSemester, activities]);

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

      // Check if an activity with the same 'Tên hoạt động' already exists for the user in the current semester
      const existingActivityQuery = query(
        collection(db, 'users', semester, 'students'),
        where('Email', '==', user.email),
        where('Tên hoạt động', '==', activityData.name)
      );
      const existingActivitySnapshot = await getDocs(existingActivityQuery);

      if (!existingActivitySnapshot.empty) {
        setError(`Activity "${activityData.name}" already exists for you in this semester. Please edit the existing entry or choose a different activity.`);
        setLoading(false);
        return;
      }

      const newActivityDoc = {
        Email: user.email,
        'Tên hoạt động': activityData.name,
        'Điểm cộng': activityData.points,
        'File upload': fileUrl,
        Status: 'Đang chờ',
        'Thời gian': new Date(),
        'Name': user.displayName,
      };

      // Query to check if an activity with the same Email and 'Tên hoạt động' already exists
      const q = query(
        collection(db, 'users', semester, 'students'),
        where('Email', '==', user.email),
        where('Tên hoạt động', '==', activityData.name)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If document exists, update it
        const existingDoc = querySnapshot.docs[0];
        await setDoc(doc(db, 'users', semester, 'students', existingDoc.id), newActivityDoc, { merge: true });
        setNotification('Activity updated successfully! Redirecting to dashboard...');
      } else {
        // If document does not exist, create a new one
        await addDoc(collection(db, 'users', semester, 'students'), newActivityDoc);
        setNotification('Upload successful! Redirecting to dashboard...');
      }

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

  // REMOVED: handleUpdateActivity function
  /*
  const handleUpdateActivity = async (id, updatedData, newFile) => {
    try {
      console.log('handleUpdateActivity: received newFile:', newFile);
      console.log('handleUpdateActivity: old file URL:', updatedData['File upload']);
      let fileUrl = updatedData['File upload'];

      if (newFile) {
        console.log('handleUpdateActivity: new file selected, proceeding with upload.');
        // Delete old file if it exists
        if (updatedData['File upload']) {
          const oldFileRef = storageRef(storage, updatedData['File upload']);
          try {
            await deleteObject(oldFileRef);
            console.log('Old file deleted successfully.');
          } catch (deleteErr) {
            console.warn('Could not delete old file (might not exist or permissions issue): ', deleteErr);
          }
        }

        // Upload new file
        const semester = selectedSemester;
        const studentFolder = user.uid;
        const filePath = `upload/${semester}/students/${studentFolder}/${newFile.name}`;
        const fileRef = storageRef(storage, filePath);
        await uploadBytes(fileRef, newFile);
        fileUrl = await getDownloadURL(fileRef);
        console.log('handleUpdateActivity: new file URL after upload:', fileUrl);
      }

      const docRef = doc(db, 'users', selectedSemester, 'students', id);
      await setDoc(docRef, { ...updatedData, 'File upload': fileUrl }, { merge: true });
      console.log('handleUpdateActivity: Firestore update complete. New File upload value:', fileUrl);
      setNotification('Activity updated successfully!');

      // Update local state directly instead of re-fetching
      // setUserActivities(prevActivities => // REMOVED
      //   prevActivities.map(activity =>
      //     activity.id === id ? { ...activity, ...updatedData, 'File upload': fileUrl } : activity
      //   )
      // );
    } catch (err) {
      console.error('Error updating activity:', err);
      setError(`Failed to update activity: ${err.message}`);
    }
  };
  */

  // REMOVED: handleEdit function
  /*
  const handleEdit = (activity) => {
    console.log('handleEdit called with activity:', activity);
    setActivityToEdit(activity);
    setIsEditModalOpen(true);
    console.log('isEditModalOpen after set:', true);
    console.log('activityToEdit after set:', activity);
  };
  */

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
            {isDuplicateActivitySelected && (
              <p style={{ color: 'red', marginTop: '5px' }}>
                Hoạt động "{activities[selectedActivity].name}" đã tồn tại cho bạn trong học kỳ này.
              </p>
            )}
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

      {/* REMOVED: UserActivitiesTable */}
      {/* <UserActivitiesTable activities={userActivities} onEdit={handleEdit} /> */}

      {/* REMOVED: EditActivityModal */}
      {/*
      {activityToEdit && (
        <EditActivityModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          activity={activityToEdit}
          onUpdate={handleUpdateActivity}
          activitiesList={activities}
        />
      )}
      */}
    </div>
  );
};

export default UploadView;
