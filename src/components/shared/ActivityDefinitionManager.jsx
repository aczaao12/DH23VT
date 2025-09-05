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

  const handleEdit = (definition) => {
    setEditingId(definition.id);
    setEditName(definition.name);
    setEditPoints(definition.points);
  };

  const handleSave = async (id) => {
    await updateActivityDefinition(id, 'name', editName);
    await updateActivityDefinition(id, 'points', parseFloat(editPoints));
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
                        <button onClick={() => handleSave(definition.id)} className="btn btn-primary">Save</button>
                        <button onClick={handleCancelEdit} className="btn btn-secondary">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(definition)} className="btn btn-edit">Edit</button>
                        <button onClick={() => deleteActivityDefinition(definition.id)} className="btn btn-delete">Delete</button>
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
