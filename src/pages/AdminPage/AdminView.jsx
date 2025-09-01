import React, { useState, useCallback } from 'react';
import { useActivities } from '../../hooks/useActivities'; // Adjust path as needed
import NotificationPostForm from '../../pages/NotificationPage/NotificationPostForm';
import ActivityTable from '../../components/shared/ActivityTable';
import AdminToolbar from '../../components/shared/AdminToolbar';
import DataManagement from '../../components/shared/DataManagement';
import Pagination from '../../components/shared/Pagination';
import AddActivityForm from '../../components/shared/AddActivityForm'; // Import the new component
import Tabs from '../../components/shared/Tabs';
import Toast from '../../components/shared/Toast';
import './AdminView.css';

const AdminView = () => {
  // Local state for AdminView
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [activityNameFilter, setActivityNameFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Phê duyệt'); // For bulk update
  const [fileToImport, setFileToImport] = useState(null);
  const [importSemester, setImportSemester] = useState('HK1N3');
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);

  // Use custom hook for activities logic
  const {
    activities,
    loading,
    notification,
    error,
    selectedActivities,
    cellErrors,
    handleUpdate,
    handleDelete,
    handleBulkUpdate,
    handleBulkDelete,
    handleFieldChange,
    handleStatusChangeWithValidation,
    handleSelect,
    handleSelectAll,
    setNotification,
    setError,
    handleImportJson,
    handleExportJson,
    addActivityDefinition, // Get the new function from the hook
  } = useActivities(selectedSemester);

  // Filter activities based on activityNameFilter
  const filteredActivities = activities.filter(activity =>
    activity['Tên hoạt động'] && activity['Tên hoạt động'].toLowerCase().includes(activityNameFilter.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedActivities = filteredActivities.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredActivities.length / rowsPerPage);

  const handleCopyReport = useCallback(() => {
    let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; font-family: sans-serif;">';
    tableHTML += '<thead><tr>';
    tableHTML += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f2f2f2;">STT</th>';
    tableHTML += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f2f2f2;">Name</th>';
    tableHTML += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f2f2f2;">Email</th>';
    tableHTML += '<th style="padding: 8px; border: 1px solid #ddd; text-align: left; background-color: #f2f2f2;">File upload</th>';
    tableHTML += '</tr></thead>';
    tableHTML += '<tbody>';
    reportData.forEach(item => {
      tableHTML += '<tr>';
      tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">${item.STT}</td>`;
      tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">${item.Name}</td>`;
      tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">${item.Email}</td>`;
      tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;"><a href="${item['File upload']}" target="_blank" rel="noopener noreferrer">View File</a></td>`;
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    const blob = new Blob([tableHTML], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];

    navigator.clipboard.write(data).then(
      () => {
        setNotification('Report copied to clipboard!');
      },
      () => {
        setError('Failed to copy report.');
      }
    );
  }, [reportData, setNotification, setError]);

  const closeToast = () => {
    setNotification('');
    setError('');
  };

  const tabs = [
    {
      label: 'Activity Management',
      content: (
        <>
          <DataManagement
            handleExportJson={handleExportJson}
            selectedActivitiesCount={selectedActivities.length}
            importSemester={importSemester}
            setImportSemester={setImportSemester}
            fileToImport={fileToImport}
            setFileToImport={setFileToImport}
            handleImportJson={handleImportJson}
            setReportData={setReportData}
            activities={activities}
            selectedActivities={selectedActivities}
            setError={setError}
            setNotification={setNotification}
          />

          <AdminToolbar
            selectedActivitiesCount={selectedActivities.length}
            handleBulkUpdate={handleBulkUpdate}
            handleBulkDelete={handleBulkDelete}
            activityNameFilter={activityNameFilter}
            setActivityNameFilter={setActivityNameFilter}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            setCurrentPage={setCurrentPage}
          />

          <ActivityTable
            paginatedActivities={paginatedActivities}
            selectedActivities={selectedActivities}
            handleSelect={handleSelect}
            handleSelectAll={handleSelectAll}
            handleFieldChange={handleFieldChange}
            handleStatusChangeWithValidation={handleStatusChangeWithValidation}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            cellErrors={cellErrors}
            filteredActivities={filteredActivities}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )
    },
    {
      label: 'Add Activity',
      content: <AddActivityForm onAddActivity={addActivityDefinition} />
    },
    {
      label: 'Post Notification',
      content: <NotificationPostForm />
    },
    {
      label: 'Report',
      content: (
        <div className="report-container">
          <h3>Approved Activities Report</h3>
          <button onClick={handleCopyReport} className="btn btn-secondary">Copy Report</button>
          <table className="data-table report-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Email</th>
                <th>File upload</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(item => (
                <tr key={item.STT}>
                  <td>{item.STT}</td>
                  <td>{item.Name}</td>
                  <td>{item.Email}</td>
                  <td><a href={item['File upload']} target="_blank" rel="noopener noreferrer">View File</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
  ];

  return (
    <div className="admin-container">
      <Toast message={notification} onClose={closeToast} type="success" />
      <Toast message={error} onClose={closeToast} type="error" />
      <h1>Admin - Activity Management</h1>
      <div className="semester-selector">
        <label htmlFor="semester-select">Select Semester: </label>
        <select
          id="semester-select"
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setCurrentPage(1); // Reset page on semester change
          }}
          className="semester-select"
        >
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

      {!loading && activities.length === 0 && (
        <p className="centered-text">No activities found for this semester.</p>
      )}

      {activities.length > 0 && <Tabs tabs={tabs} />}
    </div>
  );
};

export default AdminView;