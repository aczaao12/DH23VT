import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import NotificationPostForm from './NotificationPostForm';
import './AdminView.css';

const AdminView = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Phê duyệt');

  const fetchActivities = async () => {
    setActivities([]);
    setLoading(true);
    setError('');
    setNotification('');
    try {
      const activitiesCollectionRef = collection(db, 'users', selectedSemester, 'students');
      const querySnapshot = await getDocs(activitiesCollectionRef);
      const activitiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(activitiesList);
      setSelectedActivities([]); // Reset selection when semester changes
    } catch (err) {
      console.error("Error fetching activities: ", err);
      setError('Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [selectedSemester]);

  const handleFieldChange = (id, field, value) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === id) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const handleUpdate = async (id) => {
    const activityToUpdate = activities.find(activity => activity.id === id);
    if (!activityToUpdate) return;

    // Condition: If Status is 'Không duyệt', 'Chi tiết' must not be empty
    if (activityToUpdate.Status === 'Không duyệt' && (!activityToUpdate['Chi tiết'] || activityToUpdate['Chi tiết'].trim() === '')) {
      setError('When Status is "Không duyệt", the "Chi tiết" field cannot be empty.');
      setNotification(''); // Clear any previous success notification
      return;
    }

    try {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', id);
      const { id: docId, ...dataToUpdate } = activityToUpdate; // Exclude id from the data to be updated
      await updateDoc(activityDocRef, dataToUpdate);
      setNotification(`Activity ${activityToUpdate['Tên hoạt động']} (${id}) updated successfully.`);
      setError(''); // Clear any previous error notification
    } catch (err) {
      console.error("Error updating document: ", err);
      setError(`Failed to update activity ${id}.`);
      setNotification(''); // Clear any previous success notification
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete activity ${id}?`)) return;

    try {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', id);
      await deleteDoc(activityDocRef);
      setActivities(activities.filter(activity => activity.id !== id));
      setNotification(`Activity ${id} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError(`Failed to delete activity ${id}.`);
    }
  };

  const handleSelect = (id) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(activityId => activityId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedActivities(activities.map(a => a.id));
    } else {
      setSelectedActivities([]);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedActivities.length === 0) {
      setError("No activities selected.");
      return;
    }
    if (!window.confirm(`Are you sure you want to update ${selectedActivities.length} activities to "${selectedStatus}"?`)) return;

    setLoading(true);
    const batch = writeBatch(db);
    selectedActivities.forEach(id => {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', id);
      batch.update(activityDocRef, { Status: selectedStatus });
    });

    try {
      await batch.commit();
      setNotification(`${selectedActivities.length} activities updated successfully.`);
      fetchActivities(); // Refresh data
    } catch (err) {
      console.error("Error bulk updating documents: ", err);
      setError('Failed to update selected activities.');
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedActivities.length === 0) {
      setError("No activities selected.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedActivities.length} activities?`)) return;

    setLoading(true);
    const batch = writeBatch(db);
    selectedActivities.forEach(id => {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', id);
      batch.delete(activityDocRef);
    });

    try {
      await batch.commit();
      setNotification(`${selectedActivities.length} activities deleted successfully.`);
      fetchActivities(); // Refresh data
    } catch (err) {
      console.error("Error bulk deleting documents: ", err);
      setError('Failed to delete selected activities.');
      setLoading(false);
    }
  };


  return (
    <div className="admin-container">
      <h1>Admin - Activity Management</h1>
      <div className="semester-selector">
        <label htmlFor="semester-select">Select Semester: </label>
        <select id="semester-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="semester-select">
          <option value="HK1N1">HK1N1</option>
          <option value="HK2N1">HK2N1</option>
          <option value="HK1N2">HK1N2</option>
          <option value="HK2N2">HK2N2</option>
          <option value="HK1N3">HK1N3</option>
          <option value="HK2N3">HK2N3</option>
          <option value="HK1N4">HK1N4</option>
          <option value="HK2N4">HK2N4</option>
        </select>
      </div>

      {loading && <p className="centered-text">Loading activities...</p>}
      {error && <div className="notification error">{error}</div>}
      {notification && <div className="notification success">{notification}</div>}

      {!loading && activities.length === 0 && (
        <p className="centered-text">No activities found for this semester.</p>
      )}

      {activities.length > 0 && (
        <>
          <div className="bulk-actions">
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="status-select">
              <option value="Phê duyệt">Phê duyệt</option>
              <option value="Không duyệt">Không duyệt</option>
              <option value="Đang chờ">Đang chờ</option>
            </select>
            <button onClick={handleBulkUpdate} className="btn btn-primary">Update Selected</button>
            <button onClick={handleBulkDelete} className="btn btn-danger">Delete Selected</button>
            <span className="selected-count">{selectedActivities.length} selected</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedActivities.length === activities.length && activities.length > 0}
                    />
                  </th>
                  <th>User Email</th>
                  <th>Activity Name</th>
                  <th>Points</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Chi tiết</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map(activity => (
                  <tr key={activity.id} className={selectedActivities.includes(activity.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(activity.id)}
                        onChange={() => handleSelect(activity.id)}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={activity.Email || ''}
                        onChange={(e) => handleFieldChange(activity.id, 'Email', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={activity['Tên hoạt động'] || ''}
                        onChange={(e) => handleFieldChange(activity.id, 'Tên hoạt động', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={activity['Điểm cộng'] || 0}
                        onChange={(e) => handleFieldChange(activity.id, 'Điểm cộng', Number(e.target.value))}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <a href={activity['File upload']} target="_blank" rel="noopener noreferrer" className="file-link">
                        View File
                      </a>
                    </td>
                    <td>
                      <select value={activity.Status || 'Đang chờ'} onChange={(e) => handleFieldChange(activity.id, 'Status', e.target.value)} className="status-select">
                        <option value="Đang chờ">Đang chờ</option>
                        <option value="Phê duyệt">Phê duyệt</option>
                        <option value="Không duyệt">Không duyệt</option>
                      </select>
                    </td>
                    <td>
                      <textarea
                        value={activity['Chi tiết'] || ''}
                        onChange={(e) => handleFieldChange(activity.id, 'Chi tiết', e.target.value)}
                        className="table-textarea"
                        rows="2"
                      />
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleUpdate(activity.id)} className="btn btn-primary">Update</button>
                      <button onClick={() => handleDelete(activity.id)} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <hr className="admin-section-divider" />

      <NotificationPostForm />

    </div>
  );
};

export default AdminView;