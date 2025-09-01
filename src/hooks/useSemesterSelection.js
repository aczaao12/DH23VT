import { useState } from 'react';

const useSemesterSelection = (initialSemester = 'HK1N3') => {
  const [selectedSemester, setSelectedSemester] = useState(initialSemester);

  return { selectedSemester, setSelectedSemester };
};

export default useSemesterSelection;
