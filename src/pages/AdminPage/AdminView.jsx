import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';
 // Import Firebase Functions
import NotificationPostForm from '../../pages/NotificationPage/NotificationPostForm';
import './AdminView.css';

const AdminView = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Phê duyệt');
  const [activityNameFilter, setActivityNameFilter] = useState('');
  const [fileToImport, setFileToImport] = useState(null);
  const [importSemester, setImportSemester] = useState('HK1N3'); // New state for import semester
  const [cellErrors, setCellErrors] = useState({}); // New state for cell-specific errors
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const fetchActivities = useCallback(async () => {
    setActivities([]);
    setLoading(true);
    setError('');
    setNotification('');
    try {
      const activitiesCollectionRef = collection(db, 'users', selectedSemester, 'students');
      const querySnapshot = await getDocs(activitiesCollectionRef);
      const activitiesList = querySnapshot.docs.map(doc => ({ firestoreDocId: doc.id, ...doc.data() }));
      setActivities(activitiesList);
      setSelectedActivities([]); // Reset selection when semester changes
    } catch (err) {
      console.error("Error fetching activities: ", err);
      setError('Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    fetchActivities();
  }, [selectedSemester, fetchActivities]);

  const handleFieldChange = (firestoreDocId, field, value) => {
    const updatedActivities = activities.map(activity => {
      if (activity.firestoreDocId === firestoreDocId) {
        return { ...activity, [field]: value };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const handleStatusChangeWithValidation = async (firestoreDocId, value, activity) => {
    // Clear any existing error for this cell first
    setCellErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors[firestoreDocId]) {
        delete newErrors[firestoreDocId].Status;
        if (Object.keys(newErrors[firestoreDocId]).length === 0) {
          delete newErrors[firestoreDocId];
        }
      }
      return newErrors;
    });

    // Only perform validation if the new status is 'Phê duyệt'
    if (value === 'Phê duyệt') {
      try {
        const q = query(
          collection(db, 'users', selectedSemester, 'students'),
          where('Email', '==', activity.Email),
          where('Tên hoạt động', '==', activity['Tên hoạt động']),
          where('Status', '==', 'Phê duyệt')
        );
        const querySnapshot = await getDocs(q);

        const existingApprovedActivity = querySnapshot.docs.find(doc => doc.id !== firestoreDocId);

        if (existingApprovedActivity) {
          // Set error for this specific cell
          setCellErrors(prev => ({
            ...prev,
            [firestoreDocId]: {
              ...prev[firestoreDocId],
              Status: `Activity '${activity['Tên hoạt động']}' for user '${activity.Email}' has already been approved.`
            }
          }));
          return; // Prevent status change
        }
      } catch (validationErr) {
        console.error("Error during front-end re-approval validation: ", validationErr);
        setCellErrors(prev => ({
          ...prev,
          [firestoreDocId]: {
            ...prev[firestoreDocId],
            Status: "Failed to perform validation."
          }
        }));
        return; // Prevent status change
      }
    }

    // If validation passes or status is not 'Phê duyệt', update the field
    handleFieldChange(firestoreDocId, 'Status', value);
  };

  const handleUpdate = async (firestoreDocId) => {
    const activityToUpdate = activities.find(activity => activity.firestoreDocId === firestoreDocId);
    if (!activityToUpdate) return;

    // Condition: If Status is 'Không duyệt', 'Chi tiết' must not be empty
    if (activityToUpdate.Status === 'Không duyệt' && (!activityToUpdate['Chi tiết'] || activityToUpdate['Chi tiết'].trim() === '')) {
      setError('When Status is "Không duyệt", the "Chi tiết" field cannot be empty.');
      setNotification(''); // Clear any previous success notification
      return;
    }

    // New validation: Prevent re-approving the same activity for the same user
    if (activityToUpdate.Status === 'Phê duyệt') {
      try {
        const q = query(
          collection(db, 'users', selectedSemester, 'students'),
          where('Email', '==', activityToUpdate.Email),
          where('Tên hoạt động', '==', activityToUpdate['Tên hoạt động']),
          where('Status', '==', 'Phê duyệt')
        );
        const querySnapshot = await getDocs(q);

        const existingApprovedActivity = querySnapshot.docs.find(doc => doc.id !== firestoreDocId);

        if (existingApprovedActivity) {
          setError(`Activity '${activityToUpdate['Tên hoạt động']}' for user '${activityToUpdate.Email}' has already been approved.`);
          setNotification('');
          return;
        }
      } catch (validationErr) {
        console.error("Error during re-approval validation: ", validationErr);
        setError("Failed to perform re-approval validation.");
        setNotification('');
        return;
      }
    }

    try {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', firestoreDocId);
      const { firestoreDocId: _firestoreDocId, ...dataToUpdate } = activityToUpdate; // Exclude firestoreDocId from the data to be updated
      await updateDoc(activityDocRef, dataToUpdate);
      setNotification(`Activity ${activityToUpdate['Tên hoạt động']} (${firestoreDocId}) updated successfully.`);
      setError(''); // Clear any previous error notification
    } catch (err) {
      console.error("Error updating document: ", err);
      setError(`Failed to update activity ${firestoreDocId}.`);
      setNotification(''); // Clear any previous success notification
    }
  };

  const handleDelete = async (firestoreDocId) => {
    if (!window.confirm(`Are you sure you want to delete activity ${firestoreDocId}?`)) return;

    try {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', firestoreDocId);
      await deleteDoc(activityDocRef);
      setActivities(activities.filter(activity => activity.firestoreDocId !== firestoreDocId));
      setNotification(`Activity ${firestoreDocId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError(`Failed to delete activity ${firestoreDocId}.`);
    }
  };

  const handleSelect = (firestoreDocId) => {
    setSelectedActivities(prev =>
      prev.includes(firestoreDocId) ? prev.filter(activityId => activityId !== firestoreDocId) : [...prev, firestoreDocId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedActivities(filteredActivities.map(a => a.firestoreDocId));
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
    setError('');
    setNotification('');

    const batch = writeBatch(db);
    const activitiesToSkip = [];
    const activitiesToUpdateInBatch = [];

    // Pre-validate all selected activities
    for (const firestoreDocId of selectedActivities) {
      const activityToUpdate = activities.find(activity => activity.firestoreDocId === firestoreDocId);
      if (!activityToUpdate) continue; // Should not happen

      // If the status is being set to 'Phê duyệt', check for re-approval
      if (selectedStatus === 'Phê duyệt') {
        try {
          const q = query(
            collection(db, 'users', selectedSemester, 'students'),
            where('Email', '==', activityToUpdate.Email),
            where('Tên hoạt động', '==', activityToUpdate['Tên hoạt động']),
            where('Status', '==', 'Phê duyệt')
          );
          const querySnapshot = await getDocs(q);

          const existingApprovedActivity = querySnapshot.docs.find(doc => doc.id !== firestoreDocId);

          if (existingApprovedActivity) {
            activitiesToSkip.push(`'${activityToUpdate['Tên hoạt động']}' for ${activityToUpdate.Email}`);
            continue; // Skip this activity for batch update
          }
        } catch (validationErr) {
          console.error("Error during bulk re-approval validation: ", validationErr);
          setError("Failed to perform bulk re-approval validation.");
          setLoading(false);
          return; // Stop the entire bulk update
        }
      }
      // If validation passes or status is not 'Phê duyệt', add to batch
      activitiesToUpdateInBatch.push(activityToUpdate);
    }

    if (activitiesToSkip.length > 0) {
      setError(`The following activities were skipped because they are already approved: ${activitiesToSkip.join(', ')}.`);
      // If all activities were skipped, don't proceed with batch commit
      if (activitiesToUpdateInBatch.length === 0) {
        setLoading(false);
        return;
      }
    }

    // Add only valid activities to the batch
    activitiesToUpdateInBatch.forEach(activity => {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', activity.firestoreDocId);
      batch.update(activityDocRef, { Status: selectedStatus });
    });

    try {
      await batch.commit();
      setNotification(`${activitiesToUpdateInBatch.length} activities updated successfully.`);
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
    selectedActivities.forEach(firestoreDocId => {
      const activityDocRef = doc(db, 'users', selectedSemester, 'students', firestoreDocId);
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

  const handleExportJson = () => {
    if (selectedActivities.length === 0) {
      setError("No activities selected for export.");
      return;
    }

    const activitiesToExport = activities.filter(activity => selectedActivities.includes(activity.firestoreDocId));
    const jsonString = JSON.stringify(activitiesToExport, null, 2); // Pretty print JSON

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_activities_${selectedSemester}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setNotification(`${selectedActivities.length} activities exported to JSON.`);
    setError('');
  };

  const handleImportJson = async () => {
    if (!fileToImport) {
      setError("Please select a JSON file to import.");
      return;
    }

    setLoading(true);
    setError('');
    setNotification('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!Array.isArray(importedData)) {
          setError("Imported JSON is not an array of activities.");
          setLoading(false);
          return;
        }

        const batch = writeBatch(db);
        let importedCount = 0;

        for (const activity of importedData) {
          if (activity.firestoreDocId) { // Assuming 'firestoreDocId' exists and is the document ID
            const activityDocRef = doc(db, 'users', importSemester, 'students', activity.firestoreDocId);
            const { firestoreDocId: _firestoreDocId, ...dataToImport } = activity; // Exclude firestoreDocId from data
            batch.set(activityDocRef, dataToImport, { merge: true }); // Use set with merge to update or create
            importedCount++;
          } else {
            // If no firestoreDocId, create a new document with an auto-generated ID
            const activityDocRef = doc(collection(db, 'users', importSemester, 'students'));
            batch.set(activityDocRef, activity); // Import all data as is
            importedCount++;
            console.warn("Importing activity without 'firestoreDocId'. A new document ID will be generated.", activity);
          }
        }

        await batch.commit();
        setNotification(`${importedCount} activities imported successfully.`);
        setFileToImport(null); // Clear selected file
        fetchActivities(); // Refresh data
      } catch (err) {
        console.error("Error importing JSON: ", err);
        setError(`Failed to import activities: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file.");
      setLoading(false);
    };
    reader.readAsText(fileToImport);
  };

  const handleGenerateReport = () => {
    const approvedActivities = activities.filter(activity => activity.Status === 'Phê duyệt');
    const report = approvedActivities.map((activity, index) => ({
      STT: index + 1,
      'Tên hoạt động': activity['Tên hoạt động'],
      Email: activity.Email,
      'File upload': activity['File upload'],
    }));
    setReportData(report);
    setShowReport(true);
  };

  const handleCopyReport = () => {
    const reportString = 'STT\tTên hoạt động\tEmail\tFile upload\n' + reportData.map(item => 
      `${item.STT}\t${item['Tên hoạt động']}\t${item.Email}\t${item['File upload']}`
    ).join('\n');

    navigator.clipboard.writeText(reportString).then(() => {
      setNotification('Report copied to clipboard!');
    }, () => {
      setError('Failed to copy report.');
    });
  };


  const filteredActivities = activities.filter(activity =>
    activity['Tên hoạt động'] && activity['Tên hoạt động'].toLowerCase().includes(activityNameFilter.toLowerCase())
  );

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
           <div className="import-export-section">
            <h3>Data Management</h3>
            <div className="export-group">
              <button onClick={handleExportJson} className="btn btn-info">Export JSON</button>
              <span className="selected-count">{selectedActivities.length} selected for export</span>
            </div>
            
           
            <div className="import-group">
              <div className="semester-selector import-semester-selector">
                <label htmlFor="import-semester-select">Import to Semester: </label>
                <select id="import-semester-select" value={importSemester} onChange={(e) => setImportSemester(e.target.value)} className="semester-select">
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
              <input
                type="file"
                accept=".json"
                onChange={(e) => setFileToImport(e.target.files[0])}
                className="file-input"
              />
              <button onClick={handleImportJson} className="btn btn-success" disabled={!fileToImport}>Import JSON</button>
            </div>
            <div className="reporting-section">
              <h3>Reporting</h3>
              <button onClick={handleGenerateReport} className="btn btn-info">Generate Approved Report</button>
            </div>

             <div className="filter-section">
        <label htmlFor="activity-name-filter">Filter by Activity Name: </label>
        <input
          type="text"
          id="activity-name-filter"
          value={activityNameFilter}
          onChange={(e) => setActivityNameFilter(e.target.value)}
          placeholder="Enter activity name"
          className="activity-name-filter-input"
        />
      </div>

          </div>
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
                      checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
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
                {filteredActivities.map(activity => (
                  <tr key={activity.firestoreDocId} className={selectedActivities.includes(activity.firestoreDocId) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedActivities.includes(activity.firestoreDocId)}
                        onChange={() => handleSelect(activity.firestoreDocId)}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={activity.Email || ''}
                        onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Email', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={activity['Tên hoạt động'] || ''}
                        onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Tên hoạt động', e.target.value)}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={activity['Điểm cộng'] || 0}
                        onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Điểm cộng', Number(e.target.value))}
                        className="table-input"
                      />
                    </td>
                    <td>
                      <a href={activity['File upload']} target="_blank" rel="noopener noreferrer" className="file-link">
                        View File
                      </a>
                    </td>
                    <td>
                      <select value={activity.Status || 'Đang chờ'} onChange={(e) => handleStatusChangeWithValidation(activity.firestoreDocId, e.target.value, activity)} className="status-select">
                        <option value="Đang chờ">Đang chờ</option>
                        <option value="Phê duyệt">Phê duyệt</option>
                        <option value="Không duyệt">Không duyệt</option>
                      </select>
                      {cellErrors[activity.firestoreDocId]?.Status && (
                        <div className="cell-error">{cellErrors[activity.firestoreDocId].Status}</div>
                      )}
                    </td>
                    <td>
                      <textarea
                        value={activity['Chi tiết'] || ''}
                        onChange={(e) => handleFieldChange(activity.firestoreDocId, 'Chi tiết', e.target.value)}
                        className="table-textarea"
                        rows="2"
                      />
                    </td>
                    <td className="actions-cell">
                      <button onClick={() => handleUpdate(activity.firestoreDocId)} className="btn btn-primary">Update</button>
                      <button onClick={() => handleDelete(activity.firestoreDocId)} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showReport && (
            <div className="report-container">
              <h3>Approved Activities Report</h3>
              <button onClick={handleCopyReport} className="btn btn-secondary">Copy Report</button>
              <table className="data-table report-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên hoạt động</th>
                    <th>Email</th>
                    <th>File upload</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map(item => (
                    <tr key={item.STT}>
                      <td>{item.STT}</td>
                      <td>{item['Tên hoạt động']}</td>
                      <td>{item.Email}</td>
                      <td><a href={item['File upload']} target="_blank" rel="noopener noreferrer">View File</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

       
        </>
      )}

      <hr className="admin-section-divider" />

      <NotificationPostForm />

    </div>
  );
};

export default AdminView;
