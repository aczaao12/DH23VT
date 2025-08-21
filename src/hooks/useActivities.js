import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase'; // Adjust path as needed
import { collection, getDocs, doc, updateDoc, deleteDoc, writeBatch, query, where } from 'firebase/firestore';

export const useActivities = (semester) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [cellErrors, setCellErrors] = useState({});

  const fetchActivities = useCallback(async () => {
    setActivities([]);
    setLoading(true);
    setError('');
    setNotification('');
    try {
      const activitiesCollectionRef = collection(db, 'users', semester, 'students');
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
  }, [semester]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const handleFieldChange = useCallback((firestoreDocId, field, value) => {
    setActivities(prevActivities => {
      const updatedActivities = prevActivities.map(activity => {
        if (activity.firestoreDocId === firestoreDocId) {
          return { ...activity, [field]: value };
        }
        return activity;
      });
      return updatedActivities;
    });
  }, []);

  const handleStatusChangeWithValidation = useCallback(async (firestoreDocId, value, activity) => {
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

    if (value === 'Phê duyệt') {
      try {
        const q = query(
          collection(db, 'users', semester, 'students'),
          where('Email', '==', activity.Email),
          where('Tên hoạt động', '==', activity['Tên hoạt động']),
          where('Status', '==', 'Phê duyệt')
        );
        const querySnapshot = await getDocs(q);

        const existingApprovedActivity = querySnapshot.docs.find(doc => doc.id !== firestoreDocId);

        if (existingApprovedActivity) {
          setCellErrors(prev => ({
            ...prev,
            [firestoreDocId]: {
              ...prev[firestoreDocId],
              Status: `Activity '${activity['Tên hoạt động']}' for user '${activity.Email}' has already been approved.`
            }
          }));
          return;
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
        return;
      }
    }
    handleFieldChange(firestoreDocId, 'Status', value);
  }, [semester, handleFieldChange]);

  const handleUpdate = useCallback(async (firestoreDocId) => {
    const activityToUpdate = activities.find(activity => activity.firestoreDocId === firestoreDocId);
    if (!activityToUpdate) return;

    if (activityToUpdate.Status === 'Không duyệt' && (!activityToUpdate['Chi tiết'] || activityToUpdate['Chi tiết'].trim() === '')) {
      setError('When Status is "Không duyệt", the "Chi tiết" field cannot be empty.');
      setNotification('');
      return;
    }

    if (activityToUpdate.Status === 'Phê duyệt') {
      try {
        const q = query(
          collection(db, 'users', semester, 'students'),
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
      const activityDocRef = doc(db, 'users', semester, 'students', firestoreDocId);
      const { firestoreDocId: _firestoreDocId, ...dataToUpdate } = activityToUpdate;
      await updateDoc(activityDocRef, dataToUpdate);
      setNotification(`Activity ${activityToUpdate['Tên hoạt động']} (${firestoreDocId}) updated successfully.`);
      setError('');
    } catch (err) {
      console.error("Error updating document: ", err);
      setError(`Failed to update activity ${firestoreDocId}.`);
      setNotification('');
    }
  }, [activities, semester]);

  const handleDelete = useCallback(async (firestoreDocId) => {
    if (!window.confirm(`Are you sure you want to delete activity ${firestoreDocId}?`)) return;

    try {
      const activityDocRef = doc(db, 'users', semester, 'students', firestoreDocId);
      await deleteDoc(activityDocRef);
      setActivities(prevActivities => prevActivities.filter(activity => activity.firestoreDocId !== firestoreDocId));
      setNotification(`Activity ${firestoreDocId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting document: ", err);
      setError(`Failed to delete activity ${firestoreDocId}.`);
    }
  }, [semester]);

  const handleSelect = useCallback((firestoreDocId) => {
    setSelectedActivities(prev =>
      prev.includes(firestoreDocId) ? prev.filter(activityId => activityId !== firestoreDocId) : [...prev, firestoreDocId]
    );
  }, []);

  const handleSelectAll = useCallback((filteredActivities) => (e) => {
    if (e.target.checked) {
      setSelectedActivities(filteredActivities.map(a => a.firestoreDocId));
    } else {
      setSelectedActivities([]);
    }
  }, []);

  const handleBulkUpdate = useCallback(async (selectedStatus) => {
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

    for (const firestoreDocId of selectedActivities) {
      const activityToUpdate = activities.find(activity => activity.firestoreDocId === firestoreDocId);
      if (!activityToUpdate) continue;

      if (selectedStatus === 'Phê duyệt') {
        try {
          const q = query(
            collection(db, 'users', semester, 'students'),
            where('Email', '==', activityToUpdate.Email),
            where('Tên hoạt động', '==', activityToUpdate['Tên hoạt động']),
            where('Status', '==', 'Phê duyệt')
          );
          const querySnapshot = await getDocs(q);

          const existingApprovedActivity = querySnapshot.docs.find(doc => doc.id !== firestoreDocId);

          if (existingApprovedActivity) {
            activitiesToSkip.push(`'${activityToUpdate['Tên hoạt động']}' for ${activityToUpdate.Email}`);
            continue;
          }
        }
        catch (validationErr) {
          console.error("Error during bulk re-approval validation: ", validationErr);
          setError("Failed to perform bulk re-approval validation.");
          setLoading(false);
          return;
        }
      }
      activitiesToUpdateInBatch.push(activityToUpdate);
    }

    if (activitiesToSkip.length > 0) {
      setError(`The following activities were skipped because they are already approved: ${activitiesToSkip.join(', ')}.`);
      if (activitiesToUpdateInBatch.length === 0) {
        setLoading(false);
        return;
      }
    }

    activitiesToUpdateInBatch.forEach(activity => {
      const activityDocRef = doc(db, 'users', semester, 'students', activity.firestoreDocId);
      batch.update(activityDocRef, { Status: selectedStatus });
    });

    try {
      await batch.commit();
      setNotification(`${activitiesToUpdateInBatch.length} activities updated successfully.`);
      fetchActivities();
    } catch (err) {
      console.error("Error bulk updating documents: ", err);
      setError('Failed to update selected activities.');
      setLoading(false);
    }
  }, [activities, selectedActivities, semester, fetchActivities]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedActivities.length === 0) {
      setError("No activities selected.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${selectedActivities.length} activities?`)) return;

    setLoading(true);
    const batch = writeBatch(db);
    selectedActivities.forEach(firestoreDocId => {
      const activityDocRef = doc(db, 'users', semester, 'students', firestoreDocId);
      batch.delete(activityDocRef);
    });

    try {
      await batch.commit();
      setNotification(`${selectedActivities.length} activities deleted successfully.`);
      fetchActivities();
    } catch (err) {
      console.error("Error bulk deleting documents: ", err);
      setError('Failed to delete selected activities.');
      setLoading(false);
    }
  }, [selectedActivities, semester, fetchActivities]);

  const handleImportJson = useCallback(async (fileToImport, importSemester) => {
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
          if (activity.firestoreDocId) {
            const activityDocRef = doc(db, 'users', importSemester, 'students', activity.firestoreDocId);
            const { firestoreDocId: _firestoreDocId, ...dataToImport } = activity;
            batch.set(activityDocRef, dataToImport, { merge: true });
            importedCount++;
          } else {
            const activityDocRef = doc(collection(db, 'users', importSemester, 'students'));
            batch.set(activityDocRef, activity);
            importedCount++;
            console.warn("Importing activity without 'firestoreDocId'. A new document ID will be generated.", activity);
          }
        }

        await batch.commit();
        setNotification(`${importedCount} activities imported successfully.`);
        fetchActivities();
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
  }, [fetchActivities]);

  const handleExportJson = useCallback(() => {
    if (selectedActivities.length === 0) {
      setError("No activities selected for export.");
      return;
    }

    const activitiesToExport = activities.filter(activity => selectedActivities.includes(activity.firestoreDocId));
    const jsonString = JSON.stringify(activitiesToExport, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_activities_${semester}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setNotification(`${selectedActivities.length} activities exported to JSON.`);
    setError('');
  }, [activities, selectedActivities, semester]);

  return {
    activities,
    loading,
    notification,
    error,
    selectedActivities,
    cellErrors,
    fetchActivities,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
    handleBulkDelete,
    handleFieldChange,
    handleStatusChangeWithValidation,
    handleSelect,
    handleSelectAll,
    setSelectedActivities, // Expose setSelectedActivities for external control (e.g., select all based on filtered data)
    setNotification, // Expose for external notification setting (e.g., from report generation)
    setError, // Expose for external error setting
    handleImportJson,
    handleExportJson,
  };
};