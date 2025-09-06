import React, { useState, useCallback, useEffect } from 'react';
import { useActivities } from '../../hooks/useActivities'; // Adjust path as needed
import NotificationPostForm from '../../pages/NotificationPage/NotificationPostForm';
import ActivityTable from '../../components/shared/ActivityTable';
import AdminToolbar from '../../components/shared/AdminToolbar';
import DataManagement from '../../components/shared/DataManagement';
import Pagination from '../../components/shared/Pagination';
import AddActivityForm from '../../components/shared/AddActivityForm'; // Import the new component
import Tabs from '../../components/shared/Tabs';
import Toast from '../../components/shared/Toast';
import Modal from '../../components/shared/Modal';
import ActivityDetailModal from '../../components/shared/ActivityDetailModal';
import ActivityDefinitionManager from '../../components/shared/ActivityDefinitionManager'; // Import the new component
import './AdminView.css';

const AdminView = () => {
  // Local state for AdminView
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [activityNameFilter, setActivityNameFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Phê duyệt'); // For bulk update
  const [filterStatus, setFilterStatus] = useState('Đang chờ'); // New state for status filter
  const [fileToImport, setFileToImport] = useState(null);
  const [importSemester, setImportSemester] = useState('HK1N3');
  const [reportData, setReportData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(100);
  const [showNoActivitiesModal, setShowNoActivitiesModal] = useState(false);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);

  const handleOpenActivityDetailModal = (activity) => {
    setSelectedActivityDetail(activity);
    setShowActivityDetailModal(true);
  };

  const handleCloseActivityDetailModal = () => {
    setShowActivityDetailModal(false);
    setSelectedActivityDetail(null);
  };

  // Use custom hook for activities logic
  const {
    activities,
    activityDefinitions, // Get activity definitions from the hook
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
    addActivityDefinition,
    updateActivityDefinition, // Get new function
    deleteActivityDefinition, // Get new function
  } = useActivities(selectedSemester, filterStatus);

  useEffect(() => {
    if (!loading && activities.length === 0) {
      setShowNoActivitiesModal(true);
    } else {
      setShowNoActivitiesModal(false);
    }
  }, [loading, activities]);

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
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
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
            handleViewDetails={handleOpenActivityDetailModal} // Pass the new handler
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
      label: 'Activity Definitions',
      content: (
        <ActivityDefinitionManager
          activityDefinitions={activityDefinitions}
          addActivityDefinition={addActivityDefinition}
          updateActivityDefinition={updateActivityDefinition}
          deleteActivityDefinition={deleteActivityDefinition}
          loading={loading}
          error={error}
          notification={notification}
        />
      ),
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
      {showNoActivitiesModal && (
        <Modal
          message="No activities found for this semester."
          onClose={() => setShowNoActivitiesModal(false)}
          type="info"
        />
      )}
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

      <Tabs tabs={tabs} />

      <ActivityDetailModal
        activity={selectedActivityDetail}
        isOpen={showActivityDetailModal}
        onClose={handleCloseActivityDetailModal}
      />
    </div>
  );
};

export default AdminView;