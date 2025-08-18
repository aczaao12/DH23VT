import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { calculateFinalScore, calculateConditionalScore } from '../utils';
import './DashboardView.css';

const DashboardView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalBonusPoints, setTotalBonusPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setUserData([]);
      setNotification('');
      try {
        if (user) {
          const q = query(collection(db, 'users', selectedSemester, 'students'), where('Email', '==', user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserData(documents);

            // Filter for approved documents to use in calculations
            const approvedDocs = documents.filter(doc => doc.Status === 'Phê duyệt');

            const totalActs = documents.length;
            const bonusPoints = approvedDocs.reduce((sum, doc) => sum + (Number(doc['Điểm cộng']) || 0), 0);

            setTotalActivities(totalActs);
            setTotalBonusPoints(bonusPoints);

            // Dynamically calculate the conditional score based on approved activities
            const conditionalScore = calculateConditionalScore(approvedDocs);
            
            // Calculate the final score using the dynamic conditional score
            const final = calculateFinalScore(approvedDocs, conditionalScore);
            setFinalScore(final);
          } else {
            setNotification(`No data found for this user in semester ${selectedSemester}.`);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotification('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [selectedSemester, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading) {
    return <div className="centered-text">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {user ? (
          <div className="welcome-message">
            <h1>Welcome, {user.displayName || user.email}!</h1>
            <p>Here is your activity summary.</p>
          </div>
        ) : <p>Please log in.</p>}
        <div className="header-actions">
          <Link to="/upload">
            <button className="btn btn-primary btn-animated">Upload Activity</button>
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary btn-animated">Sign out</button>
        </div>
      </header>
      
      <div className="semester-selector">
        <label htmlFor="semester-select">Select Semester: </label>
        <select id="semester-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="semester-select">
          <option value="HK1N3">HK1N3</option>
          <option value="HK1N1">HK1N1</option>
          <option value="HK2N1">HK2N1</option>
          <option value="HK1N2">HK1N2</option>
          <option value="HK2N2">HK2N2</option>
          <option value="HK2N3">HK2N3</option>
          <option value="HK1N4">HK1N4</option>
          <option value="HK2N4">HK2N4</option>
        </select>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Tổng hoạt động</h3>
          <p style={{color: '#17a2b8'}}>{totalActivities}</p>
        </div>
        <div className="stat-card">
          <h3>Tổng điểm cộng đã duyệt</h3>
          <p style={{color: '#ffc107'}}>{totalBonusPoints}</p>
        </div>
        <div className="stat-card">
          <h3>Điểm rèn luyện cuối cùng</h3>
          <p style={{color: '#28a745'}}>{finalScore}</p>
        </div>
      </div>

      {notification && <p className="centered-text" style={{color: 'red'}}>{notification}</p>}
      
      {userData.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên hoạt động</th>
                <th>Điểm cộng</th>
                <th>File</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((data) => (
                <tr key={data.id}>
                  <td>{data['Tên hoạt động']}</td>
                  <td>{data['Điểm cộng']}</td>
                  <td>
                    <a href={data['File upload']} target="_blank" rel="noopener noreferrer" className="file-link">
                      View File
                    </a>
                  </td>
                  <td>{data.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !notification && <p className="centered-text">No activity data to display for this semester.</p>
      )}
    </div>
  );
};

export default DashboardView;
