import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, get } from "firebase/database";
import { getFunctions, httpsCallable } from 'firebase/functions';

const ActivityForm = () => {
  const [activity, setActivity] = useState('');
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState({});
  const [points, setPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRef = ref(rtdb, 'activities');
        const snapshot = await get(activitiesRef);
        if (snapshot.exists()) {
          setActivities(snapshot.val());
        } else {
          console.log("No activities data available in Realtime Database");
        }
      } catch (error) {
        console.error("Error fetching activities from Realtime Database:", error);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityChange = (e) => {
    const selectedActivityKey = e.target.value;
    setActivity(selectedActivityKey);
    if (activities[selectedActivityKey]) {
      setPoints(activities[selectedActivityKey].points);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 10) {
      alert('You can only upload a maximum of 10 files.');
      e.target.value = null;
      return;
    }
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity || !description || files.length === 0) {
      alert('Please fill out all fields and select at least one file.');
      return;
    }

    setIsSubmitting(true);

    // 1. Convert files to base64
    const filePromises = Array.from(files).map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            data: reader.result.split(',')[1], // Get only the base64 part
          });
        };
        reader.onerror = error => reject(error);
      });
    });

    try {
      const base64Files = await Promise.all(filePromises);

      // 2. Call the Cloud Function
      const functions = getFunctions();
      const submitActivity = httpsCallable(functions, 'submitActivity');
      
      const activityData = {
        activityName: activities[activity]?.name,
        description: description,
        points: points,
        files: base64Files,
      };

      const result = await submitActivity(activityData);

      if (result.data.success) {
        alert('Submission successful! Document ID: ' + result.data.docId);
        // Clear the form
        setActivity('');
        setFiles([]);
        setDescription('');
        setPoints(0);
        e.target.reset(); // Reset file input
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Submit New Activity</h2>
      <div>
        <label>Tên hoạt động:</label>
        <select value={activity} onChange={handleActivityChange} required>
          <option value="" disabled>Select an activity</option>
          {Object.entries(activities).map(([key, value]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Minh chứng (max 10 files):</label>
        <input type="file" multiple onChange={handleFileChange} required />
      </div>
      <div style={{ marginTop: '10px' }}>
        <label>Mô tả file:</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <input type="hidden" value={points} />
      <button type="submit" style={{ marginTop: '20px' }} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ActivityForm;
