import React, { useState } from 'react';
import AddActivityForm from './AddActivityForm'; // Assuming AddActivityForm is in the same directory
import './ActivityDefinitionManager.css'; // Create this CSS file for styling

const ActivityDefinitionManager = ({
  activityDefinitions,
  addActivityDefinition,
  updateActivityDefinition,
  deleteActivityDefinition,
  loading,
  error,
  notification
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPoints, setEditPoints] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImportJson = () => {
    if (!selectedFile) {
      alert('Please select a JSON file to import.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          importedData.forEach(activity => {
            if (activity.name && activity.points) {
              const newActivityKey = `ACT-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`; // Generate a unique key
              addActivityDefinition(newActivityKey, activity.name, activity.points);
            } else {
              console.warn('Skipping malformed activity in JSON:', activity);
            }
          });
          alert('Activity definitions imported successfully!');
          setSelectedFile(null); // Clear the selected file
        } else {
          alert('Invalid JSON format. Expected an array of activity definitions.');
        }
      } catch (error) {
        alert('Error parsing JSON file: ' + error.message);
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleCreateSampleFile = () => {
    const sampleData = [
      { "name": "Hoạt động mẫu 1", "points": 10 },
      { "name": "Hoạt động mẫu 2", "points": 25 },
      { "name": "Hoạt động mẫu 3", "points": 15 }
    ];
    const jsonString = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_activities.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEdit = (definition) => {
    setEditingId(definition.id);
    setEditName(definition.name);
    setEditPoints(definition.points);
  };

  const handleSave = async (definition) => {
    await updateActivityDefinition(definition.id, definition.name, 'name', editName);
    await updateActivityDefinition(definition.id, definition.name, 'points', parseFloat(editPoints));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditPoints('');
  };

  return (
    <div className="activity-definition-manager">
      <h3>Manage Activity Definitions</h3>

      <div className="add-activity-definition-section">
        <h4>Add New Activity Definition</h4>
        <AddActivityForm onAddActivity={addActivityDefinition} />
      </div>

      <div className="import-activity-definition-section">
        <h4>Import Activity Definitions from JSON</h4>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="json-file-input"
        />
        <button onClick={handleImportJson} className="btn btn-primary import-btn">
          Import JSON
        </button>
        <button onClick={handleCreateSampleFile} className="btn btn-secondary create-sample-btn">
          Create Sample File
        </button>
      </div>

      {loading && <p>Loading activity definitions...</p>}
      {error && <p className="error-message">{error}</p>}
      {notification && <p className="success-message">{notification}</p>}

      <div className="activity-definitions-list">
        <h4>Existing Activity Definitions</h4>
        {activityDefinitions.length === 0 ? (
          <p>No activity definitions found for this semester.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activityDefinitions.map((definition) => (
                <tr key={definition.id}>
                  <td>
                    {editingId === definition.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      definition.name
                    )}
                  </td>
                  <td>
                    {editingId === definition.id ? (
                      <input
                        type="number"
                        value={editPoints}
                        onChange={(e) => setEditPoints(e.target.value)}
                      />
                    ) : (
                      definition.points
                    )}
                  </td>
                  <td>
                    {editingId === definition.id ? (
                      <>
                        <button onClick={() => handleSave(definition)} className="btn btn-primary">Save</button>
                        <button onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(definition)} className="btn btn-edit">Edit</button>
                        <button onClick={() => deleteActivityDefinition(definition.id, definition.name)} className="btn btn-delete">Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActivityDefinitionManager;
