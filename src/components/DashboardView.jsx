import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { calculateFinalScore, calculateConditionalScore } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useResponsive } from '../hooks/useResponsive';
import './DashboardView.css';

const DashboardDesktopView = ({ user, userData, totalActivities, totalBonusPoints, finalScore, selectedSemester, setSelectedSemester, handleLogout, handleRowClick, showDetailModal, selectedActivityDetail, handleCloseModal, notification }) => {
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
            <button className="btn btn-primary btn-animated">
              <FontAwesomeIcon icon={faCloudArrowUp} className="btn-icon" />
              <span className="btn-text">Upload Activity</span>
            </button>
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary btn-animated">
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="btn-icon" />
            <span className="btn-text">Sign out</span>
          </button>
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

      {notification && <div className="notification centered-text">{notification}</div>}
      
      {userData.length > 0 ? (
        <div className="activities-list">
          {userData.map((data) => (
            <div key={data.id} className="activity-card" onClick={() => handleRowClick(data)}>
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

      {showDetailModal && selectedActivityDetail && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Activity Details</h2>
            <div className="detail-item">
              <strong>Thời gian:</strong> {selectedActivityDetail['Thời gian'] && selectedActivityDetail['Thời gian'].toDate ? selectedActivityDetail['Thời gian'].toDate().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : selectedActivityDetail['Thời gian']}
            </div>
            <div className="detail-item">
              <strong>Tên hoạt động:</strong> {selectedActivityDetail['Tên hoạt động']}
            </div>
            <div className="detail-item">
              <strong>Điểm cộng:</strong> {selectedActivityDetail['Điểm cộng']}
            </div>
            <div className="detail-item">
              <strong>File:</strong> <a href={selectedActivityDetail['File upload']} target="_blank" rel="noopener noreferrer">View File</a>
            </div>
            <div className="detail-item">
              <strong>Status:</strong> {selectedActivityDetail.Status}
            </div>
            {selectedActivityDetail['Chi tiết'] && (
              <div className="detail-item">
                <strong>Chi tiết:</strong> {selectedActivityDetail['Chi tiết']}
              </div>
            )}
            <button onClick={handleCloseModal} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardMobileView = ({ user, userData, totalActivities, totalBonusPoints, finalScore, selectedSemester, setSelectedSemester, handleLogout, handleRowClick, showDetailModal, selectedActivityDetail, handleCloseModal, notification }) => {
    return (
        <div className="dashboard-container-mobile">
            <header className="dashboard-header-mobile">
                {user ? (
                <div className="welcome-message-mobile">
                    <h1>Welcome, {user.displayName || user.email}!</h1>
                    <p>Here is your activity summary.</p>
                </div>
                ) : <p>Please log in.</p>}
                <div className="header-actions-mobile">
                <Link to="/upload">
                    <button className="btn btn-primary btn-animated">
                    <span>Upload Activity</span>
                    </button>
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-animated">
                    <span>Sign out</span>
                </button>
                </div>
            </header>
            
            <div className="semester-selector-mobile">
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
                </div>
            </div>

            {notification && <div className="notification centered-text">{notification}</div>}
            
            {userData.length > 0 ? (
                <div className="activities-list-mobile">
                {userData.map((data) => (
                    <div key={data.id} className="activity-card-mobile" onClick={() => handleRowClick(data)}>
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

            {showDetailModal && selectedActivityDetail && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Activity Details</h2>
                    <div className="detail-item">
                    <strong>Thời gian:</strong> {selectedActivityDetail['Thời gian'] && selectedActivityDetail['Thời gian'].toDate ? selectedActivityDetail['Thời gian'].toDate().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }) : selectedActivityDetail['Thời gian']}
                    </div>
                    <div className="detail-item">
                    <strong>Tên hoạt động:</strong> {selectedActivityDetail['Tên hoạt động']}
                    </div>
                    <div className="detail-item">
                    <strong>Điểm cộng:</strong> {selectedActivityDetail['Điểm cộng']}
                    </div>
                    <div className="detail-item">
                    <strong>File:</strong> <a href={selectedActivityDetail['File upload']} target="_blank" rel="noopener noreferrer">View File</a>
                    </div>
                    <div className="detail-item">
                    <strong>Status:</strong> {selectedActivityDetail.Status}
                    </div>
                    {selectedActivityDetail['Chi tiết'] && (
                    <div className="detail-item">
                        <strong>Chi tiết:</strong> {selectedActivityDetail['Chi tiết']}
                    </div>
                    )}
                    <button onClick={handleCloseModal} className="modal-close-btn">Close</button>
                </div>
                </div>
            )}
        </div>
    );
};

const DashboardView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalBonusPoints, setTotalBonusPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('HK1N3');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);
  const user = auth.currentUser;
  const { isMobile } = useResponsive();

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleRowClick = (activity) => {
    setSelectedActivityDetail(activity);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedActivityDetail(null);
  };

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
    handleRowClick,
    showDetailModal,
    selectedActivityDetail,
    handleCloseModal,
    notification,
  };

  return isMobile ? <DashboardMobileView {...viewProps} /> : <DashboardDesktopView {...viewProps} />;
};

export default DashboardView;