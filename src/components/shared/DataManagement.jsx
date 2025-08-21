import React from 'react';

const DataManagement = ({
  handleExportJson,
  selectedActivitiesCount,
  importSemester,
  setImportSemester,
  fileToImport,
  setFileToImport,
  handleImportJson,
  setReportData, // To set report data
  setShowReport, // To show report section
  activities, // Needed for report generation
  selectedActivities, // Needed for report generation
  setError, // Needed for report generation
  setNotification // Needed for report generation
}) => {

  const handleGenerateReportInternal = () => {
    const selectedAndApprovedActivities = activities.filter(activity =>
      selectedActivities.includes(activity.firestoreDocId) && activity.Status === 'Phê duyệt'
    );

    if (selectedAndApprovedActivities.length === 0) {
      setError("No selected activities with 'Phê duyệt' status to generate a report.");
      setReportData([]);
      setShowReport(false);
      return;
    }

    const report = selectedAndApprovedActivities.map((activity, index) => ({
      STT: index + 1,
      Name: activity.Name,
      Email: activity.Email,
      'File upload': activity['File upload'],
    }));
    setReportData(report);
    setShowReport(true);
    setError('');
    setNotification(''); // Clear any previous notification
  };

  return (
    <div className="import-export-section">
      <h3>Data Management</h3>
      <div className="export-group">
        <button onClick={handleExportJson} className="btn btn-info">Export JSON</button>
        <span className="selected-count">{selectedActivitiesCount} selected for export</span>
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
        <button onClick={() => handleImportJson(fileToImport, importSemester)} className="btn btn-success" disabled={!fileToImport}>Import JSON</button>
      </div>
      <div className="reporting-section">
        <h3>Reporting</h3>
        <button onClick={handleGenerateReportInternal} className="btn btn-info">Generate Approved Report</button>
      </div>
    </div>
  );
};

export default DataManagement;