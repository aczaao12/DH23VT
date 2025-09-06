import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

const CentralizedStatisticsTab = ({ selectedSemester }) => {
  const [statisticsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(true);

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
            const points = Number(data['Điểm cộng']) || 0;

            if (!aggregatedData[email]) {
              aggregatedData[email] = { name: name, totalPoints: 0 };
            }
            aggregatedData[email].totalPoints += points;
          }
        });

        const finalData = Object.keys(aggregatedData).map(email => ({
          email: email,
          name: aggregatedData[email].name,
          totalPoints: aggregatedData[email].totalPoints,
        }));

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

  if (loading) {
    return <p className="centered-text">Loading statistics...</p>;
  }

  return (
    <div className="centralized-statistics-container">
      <h3>Centralized Statistics for {selectedSemester}</h3>
      {statisticsData.length > 0 ? (
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Total Approved Points</th>
            </tr>
          </thead>
          <tbody>
            {statisticsData.map((item, index) => (
              <tr key={index}>
                <td>{item.email}</td>
                <td>{item.name}</td>
                <td>{item.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="centered-text">No approved activities found for this semester.</p>
      )}
    </div>
  );
};

export default CentralizedStatisticsTab;