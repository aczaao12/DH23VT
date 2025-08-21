import React, { useState, useCallback } from 'react';
import { useActivities } from '../../hooks/useActivities'; // Adjust path as needed
import NotificationPostForm from '../../pages/NotificationPage/NotificationPostForm';
import ActivityTable from '../../components/shared/ActivityTable';
import AdminToolbar from '../../components/shared/AdminToolbar';
import DataManagement from '../../components/shared/DataManagement';
import Pagination from '../../components/shared/Pagination';
import './AdminView.css';

const AdminView = () => {
  // Local state for AdminView
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [activityNameFilter, setActivityNameFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Phê duyệt'); // For bulk update
  const [fileToImport, setFileToImport] = useState(null);
  const [importSemester, setImportSemester] = useState('HK1N3');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
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
    const reportString = 'STT\tName\tEmail\tFile upload\n' + reportData.map(item =>
      `${item.STT}\t${item.Name}\t${item.Email}\t${item['File upload']}`
    ).join('\n');

    navigator.clipboard.writeText(reportString).then(() => {
      setNotification('Report copied to clipboard!');
    }, () => {
      setError('Failed to copy report.');
    });
  }, [reportData, setNotification, setError]);


  return (
    <div className="admin-container">
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
      {error && <div className="notification error">{error}</div>}
      {notification && <div className="notification success">{notification}</div>}

      {!loading && activities.length === 0 && (
        <p className="centered-text">No activities found for this semester.</p>
      )}

      {activities.length > 0 && (
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
            setShowReport={setShowReport}
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

          {showReport && (
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
          )}
        </>
      )}

      <hr className="admin-section-divider" />

      <NotificationPostForm />
    </div>
  );
};

export default AdminView;