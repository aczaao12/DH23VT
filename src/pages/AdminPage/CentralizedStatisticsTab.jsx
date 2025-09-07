import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { calculateFinalScore, calculateConditionalScore } from '../../utils';

const CLUB_ACTIVITY = "Có tham gia CLB học thuật";
const RESEARCH_ACTIVITY = "Nghiên cứu khoa học (minh chứng rõ ràng nhất quán)";
const OFFICER_ACTIVITY = "Sinh viên là cán bộ lớp, đoàn, hội, CLB đội, nhóm gương mẫu, hoàn thành tốt nhiệm vụ (được GVCV lớp, các tổ chức Đoàn, Hội đánh giá và công nhận)";
const SPECIAL_ACHIEVEMENT = "Người học đạt được thành tích đặc biệt trong học tập, rèn luyện.";

const CentralizedStatisticsTab = ({ selectedSemester }) => {
  const [statisticsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sttRange, setSttRange] = useState(''); // New state for STT range

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'users', selectedSemester, 'students'));
        const querySnapshot = await getDocs(q);

        const aggregatedData = {};

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.Status === 'Phê duyệt') {
            const email = data.Email;
            const name = data.Name;

            if (!aggregatedData[email]) {
              aggregatedData[email] = { name: name, approvedActivities: [] };
            }
            aggregatedData[email].approvedActivities.push(data);
          }
        });

        const finalData = Object.keys(aggregatedData).map(email => {
          const userAggregatedData = aggregatedData[email];
          const approvedActivities = userAggregatedData.approvedActivities;

          const totalPoints = approvedActivities.reduce((sum, activity) => sum + (Number(activity['Điểm cộng']) || 0), 0);

          const conditionalScore = calculateConditionalScore(approvedActivities);
          const finalScore = calculateFinalScore(approvedActivities, conditionalScore);

          const activityConditions = {
            club: approvedActivities.some(act => act['Tên hoạt động'] === CLUB_ACTIVITY),
            research: approvedActivities.some(act => act['Tên hoạt động'] === RESEARCH_ACTIVITY),
            officer: approvedActivities.some(act => act['Tên hoạt động'] === OFFICER_ACTIVITY),
            special: approvedActivities.some(act => act['Tên hoạt động'] === SPECIAL_ACHIEVEMENT),
          };

          return {
            email: email,
            name: userAggregatedData.name,
            totalPoints: totalPoints,
            finalScore: finalScore,
            activityConditions: activityConditions,
          };
        });

        setStatisticsData(finalData);
      } catch (error) {
        console.error("Error fetching centralized statistics:", error);
        // Handle error display to user if needed
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedSemester]);

  // Apply search filter
  let filteredStatisticsData = statisticsData.filter(item =>
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Apply sorting by email prefix
  filteredStatisticsData.sort((a, b) => {
    const getEmailPrefix = (email) => {
      const match = email.match(/^(\d+)/);
      return match ? parseInt(match[1], 10) : Infinity; // Use Infinity for non-numeric prefixes to push them to the end
    };
    return getEmailPrefix(a.email) - getEmailPrefix(b.email);
  });

  // Apply STT range filter
  let finalDisplayData = [...filteredStatisticsData];
  if (sttRange) {
    const rangeParts = sttRange.split('-').map(Number);
    const start = rangeParts[0];
    const end = rangeParts[1];

    if (!isNaN(start) && !isNaN(end) && start <= end) {
      finalDisplayData = finalDisplayData.slice(start - 1, end);
    }
  }

  if (loading) {
    return <p className="centered-text">Loading statistics...</p>;
  }

  return (
    <div className="centralized-statistics-container">
      <h3>Centralized Statistics for {selectedSemester}</h3>
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Search by Name or Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <input
          type="text"
          placeholder="Filter by STT (e.g., 1-10)"
          value={sttRange}
          onChange={(e) => setSttRange(e.target.value)}
          className="stt-filter-input"
        />
      </div>
      {finalDisplayData.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Email</th>
              <th>Name</th>
              <th>Total Approved Points</th>
              <th>Final Score</th>
              <th>Conditions</th>
            </tr>
          </thead>
          <tbody>
            {finalDisplayData.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.email}</td>
                <td>{item.name}</td>
                <td>{item.totalPoints}</td>
                <td>{item.finalScore}</td>
                <td>
                  <div className="conditions-checkboxes">
                    <label>
                      <input type="checkbox" checked={item.activityConditions.club} readOnly /> CLB
                    </label>
                    <label>
                      <input type="checkbox" checked={item.activityConditions.research} readOnly /> NCKH
                    </label>
                    <label>
                      <input type="checkbox" checked={item.activityConditions.officer} readOnly /> BCS
                    </label>
                    <label>
                      <input type="checkbox" checked={item.activityConditions.special} readOnly /> Đặc biệt
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="centered-text">No approved activities found for this semester or matching your filters.</p>
      )}
    </div>
  );
};

export default CentralizedStatisticsTab;