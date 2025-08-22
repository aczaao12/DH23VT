import React, { useState } from 'react';
import './AddActivityForm.css';

const AddActivityForm = ({ onAddActivity }) => {
  const [activityName, setActivityName] = useState('');
  const [points, setPoints] = useState('');

  const generateKey = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activityName || !points) {
      alert('Please fill in all fields.');
      return;
    }
    const activityKey = generateKey(activityName);
    onAddActivity(activityKey, activityName, parseInt(points, 10));
    setActivityName('');
    setPoints('');
  };

  return (
    <form onSubmit={handleSubmit} className="neumorphism-form">
      <h3>Add New Activity Definition</h3>
      <input
        type="text"
        value={activityName}
        onChange={(e) => setActivityName(e.target.value)}
        placeholder="Activity Name (e.g., Another Activity Name)"
        className="neumorphism-input"
      />
      <input
        type="number"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
        placeholder="Points"
        className="neumorphism-input"
      />
      <button type="submit" className="neumorphism-button">Add Activity</button>
    </form>
  );
};

export default AddActivityForm;