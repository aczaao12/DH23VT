import { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDatabase, ref, query as rtdbQuery, orderByChild, equalTo, get } from "firebase/database";
import { calculateFinalScore, calculateConditionalScore } from '../../utils';
import { useResponsive } from '../../hooks/useResponsive';
import SemesterSelector from '../../components/shared/SemesterSelector';
import DataModal from '../../components/shared/DataModal';
import './DashboardView.css';

const UserDropdown = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="user-dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="avatar-button">
        <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="User Avatar" className="avatar" />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="user-info">
            <p className="user-name">{user.displayName || 'No Name'}</p>
            <p className="user-email">{user.email}</p>
          </div>
          <Link to="/settings" className="dropdown-item">Settings</Link>
          <button onClick={handleLogout} className="dropdown-item">Sign out</button>
        </div>
      )}
    </div>
  );
};

const ScoresTable = ({ scores, loading }) => {
    if (loading) return <div className="centered-text">Loading scores...</div>;
    if (!scores || scores.length === 0) return <div className="centered-text">No scores data found.</div>;

    return (
        <div className="scores-table-container" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>HK/N</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Student Score</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Class</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Faculty</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>University</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((score) => (
                        <tr key={score.id}>
                                                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.HK_N}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.Student_Score}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.Class}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.Faculty}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{score.University}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const DashboardDesktopView = ({ user, userData, totalActivities, totalBonusPoints, finalScore, selectedSemester, setSelectedSemester, handleLogout, notification, searchTerm, setSearchTerm, showScores, setShowScores, scoresData, scoresLoading, showDataModal, handleOpenDataModal, handleCloseDataModal }) => {
  const filteredUserData = userData.filter(data =>
    data['Tên hoạt động'].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome, {user.displayName || user.email}!</h1>
          <p>Here is your activity summary.</p>
        </div>
        <Link to="/docs" className="docs-button" style={{ marginLeft: 'auto', marginRight: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none' }}>
          Docs
        </Link>
        <UserDropdown user={user} handleLogout={handleLogout} />
      </header>

      <div className="scores-section" style={{ margin: '20px 0', padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
        <h3 onClick={() => setShowScores(!showScores)} style={{ cursor: 'pointer', marginBottom: '15px' }}>
          Điểm rèn luyện qua các kỳ {showScores ? '▾' : '▸'}
        </h3>
        {showScores && <ScoresTable scores={scoresData} loading={scoresLoading} />}
      </div>
      
      <SemesterSelector selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} />

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
          <button onClick={handleOpenDataModal} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            View Details
          </button>
        </div>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      {notification && <div className="notification centered-text">{notification}</div>}
      
      {filteredUserData.length > 0 ? (
        <div className="activities-list">
          {filteredUserData.map((data) => (
            <div key={data.id} className="activity-card">
              <div className="card-content">
                <h3>{data['Tên hoạt động']}</h3>
                <span className="points">{data['Điểm cộng']} điểm</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !notification && <p className="centered-text">No activity data to display for this semester.</p>
      )}

      <DataModal
        title="Activity Summary"
        isOpen={showDataModal}
        onClose={handleCloseDataModal}
      >
        <p>Total Activities: {totalActivities}</p>
        <p>Final Score: {finalScore}</p>
      </DataModal>
    </div>
  );
};

const DashboardMobileView = ({ user, userData, totalActivities, totalBonusPoints, finalScore, selectedSemester, setSelectedSemester, notification, searchTerm, setSearchTerm, showScores, setShowScores, scoresData, scoresLoading, showDataModal, handleOpenDataModal, handleCloseDataModal }) => {
    const filteredUserData = userData.filter(data =>
        data['Tên hoạt động'].toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container-mobile">
            <header className="dashboard-header-mobile">
                <div className="user-info-mobile">
                    <img src={user.photoURL || 'https://via.placeholder.com/40'} alt="User Avatar" className="avatar-mobile" />
                    <div className="user-details-mobile">
                        <p className="user-name-mobile">{user.displayName || 'No Name'}</p>
                        <p className="user-email-mobile">{user.email}</p>
                    </div>
                </div>
                <Link to="/docs" className="docs-button-mobile" style={{ marginLeft: 'auto', marginRight: '10px', padding: '8px 15px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', textDecoration: 'none', fontSize: '0.8em' }}>
                    Docs
                </Link>
            </header>

            <div className="scores-section" style={{ margin: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                <h3 onClick={() => setShowScores(!showScores)} style={{ cursor: 'pointer', fontSize: '1.1em', marginBottom: '10px' }}>
                    Điểm rèn luyện qua các kỳ {showScores ? '▾' : '▸'}
                </h3>
                {showScores && <ScoresTable scores={scoresData} loading={scoresLoading} />}
            </div>
            
            <SemesterSelector selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} />

            <div className="stats-container-mobile">
                <div className="stat-card-mobile">
                <h3>Tổng hoạt động</h3>
                <p style={{color: '#17a2b8'}}>{totalActivities}</p>
                </div>
                <div className="stat-card-mobile">
                <h3>Tổng điểm cộng đã duyệt</h3>
                <p style={{color: '#ffc107'}}>{totalBonusPoints}</p>
                </div>
                <div className="stat-card-mobile">
                <h3>Điểm rèn luyện cuối cùng</h3>
                <p style={{color: '#28a745'}}>{finalScore}</p>
                <button onClick={handleOpenDataModal} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#28a745', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '0.8em' }}>
                    View Details
                </button>
                </div>
            </div>

            <div className="search-bar-container">
                <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
                />
            </div>

            {notification && <div className="notification centered-text">{notification}</div>}
            
            {filteredUserData.length > 0 ? (
                <div className="activities-list-mobile">
                {filteredUserData.map((data) => (
                    <div key={data.id} className="activity-card-mobile">
                    <div className="card-content-mobile">
                        <h3>{data['Tên hoạt động']}</h3>
                        <span className="points">{data['Điểm cộng']} điểm</span>
                    </div>
                    </div>
                ))}
                </div>
            ) : (
                !notification && <p className="centered-text">No activity data to display for this semester.</p>
            )}

            <DataModal
                title="Activity Summary"
                isOpen={showDataModal}
                onClose={handleCloseDataModal}
            >
                <p>Total Activities: {totalActivities}</p>
                <p>Final Score: {finalScore}</p>
            </DataModal>
        </div>
    );
};

const DashboardView = ({ handleLogout }) => {
  
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalBonusPoints, setTotalBonusPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScores, setShowScores] = useState(false);
  const [scoresData, setScoresData] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [showDataModal, setShowDataModal] = useState(false); // New state for the data modal
  const user = auth.currentUser;
  const { isMobile } = useResponsive();

  const handleOpenDataModal = () => setShowDataModal(true);
  const handleCloseDataModal = () => setShowDataModal(false);

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

            const approvedDocs = documents.filter(doc => doc.Status === 'Phê duyệt');
            const totalActs = documents.length;
            const bonusPoints = approvedDocs.reduce((sum, doc) => sum + (Number(doc['Điểm cộng']) || 0), 0);

            setTotalActivities(totalActs);
            setTotalBonusPoints(bonusPoints);

            const conditionalScore = calculateConditionalScore(approvedDocs);
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

    useEffect(() => {
    const fetchScores = async () => {
      if (user) {
        setScoresLoading(true);
        try {
          const rtdb = getDatabase();
          const scoresRef = ref(rtdb, 'drl');
          const q = rtdbQuery(scoresRef, orderByChild('Email'), equalTo(user.email));
          const snapshot = await get(q);
          const data = [];
          if (snapshot.exists()) {
            snapshot.forEach(childSnapshot => {
              data.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
          }
          setScoresData(data);
        } catch (error) {
          console.error('Error fetching scores from RTDB:', error);
        } finally {
          setScoresLoading(false);
        }
      } else {
        setScoresLoading(false);
      }
    };
    fetchScores();
  }, [user]);

  if (loading) {
    return <div className="centered-text">Loading...</div>;
  }

  const viewProps = {
    user,
    userData,
    totalActivities,
    totalBonusPoints,
    finalScore,
    selectedSemester,
    setSelectedSemester,
    handleLogout,
    notification,
    searchTerm,
    setSearchTerm,
    showScores,
    setShowScores,
    scoresData,
    scoresLoading,
    showDataModal, // Pass to view
    handleOpenDataModal, // Pass to view
    handleCloseDataModal, // Pass to view
  };

  return isMobile ? <DashboardMobileView {...viewProps} /> : <DashboardDesktopView {...viewProps} />;
};

export default DashboardView;
