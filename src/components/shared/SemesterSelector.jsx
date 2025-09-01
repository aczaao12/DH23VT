import React from 'react';

const SemesterSelector = ({ selectedSemester, setSelectedSemester }) => {
  const semesters = ['H1N1', 'HK2N1', 'HK1N2', 'HK2N2','HK1N3', 'HK2N3', 'HK1N4', 'HK2N4']; // Example semesters, adjust as needed

  return (
    <div className="semester-selector">
      <label htmlFor="semester-select">Select Semester: </label>
      <select
        id="semester-select"
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="semester-select"
      >
        {semesters.map((semester) => (
          <option key={semester} value={semester}>
            {semester}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SemesterSelector;
