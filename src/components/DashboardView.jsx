import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { calculateFinalScore } from '../utils';

const DashboardView = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [totalActivities, setTotalActivities] = useState(0);
  const [totalBonusPoints, setTotalBonusPoints] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedSemester, setSelectedSemester] = useState('HK1N3'); // New state for semester
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setUserData([]); // Clear old data
      setNotification(''); // Clear old notifications
      try {
        if (user) {
          // Use selectedSemester in the query path and 'Email' (uppercase) as requested
          const q = query(collection(db, 'users', selectedSemester, 'students'), where('Email', '==', user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const documents = querySnapshot.docs.map(doc => doc.data());
            setUserData(documents);

            // Calculate statistics
            const totalActs = documents.length;
            const bonusPoints = documents
              .filter(doc => doc.Status === 'Phê duyệt')
              .reduce((sum, doc) => sum + (Number(doc['Điểm cộng']) || 0), 0);

            setTotalActivities(totalActs);
            setTotalBonusPoints(bonusPoints);

            // Calculate final score
            const final = calculateFinalScore(documents, 95);
            setFinalScore(final);

          } else {
            setNotification(`No data found for this user in semester ${selectedSemester}.`);
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setNotification('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSemester, user]); // Re-run effect when selectedSemester or user changes

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '15px', borderRadius: '12px' }}>
          {user.photoURL && <img src={user.photoURL} alt="User Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px' }} />}
          <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.1em' }}>Welcome, {user.displayName || user.email}!</p>
            <p style={{ margin: 0, color: '#555' }}>{user.email}</p>
          </div>
        </div>
      )}

      {/* Semester Selector */}
      <div style={{ margin: '20px 0' }}>
        <label htmlFor="semester-select">Select Semester: </label>
        <select id="semester-select" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
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

      {/* Statistics Bar - Giao diện mới */}
      <div style={{
        display: 'flex',
        gap: '20px',
        margin: '20px 0',
        fontFamily: 'Segoe UI, Arial, sans-serif'
      }}>
        {/* Thẻ Tổng hoạt động */}
        <div style={{
          flex: 1,
          padding: '24px',
          borderRadius: '12px',
          background: '#f8f9fa',
          boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
          textAlign: 'center',
          transition: 'transform 0.3s ease-in-out',
          cursor: 'pointer'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ margin: 0, color: '#495057', fontSize: '1.2em' }}>Tổng hoạt động</h3>
          <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '15px 0 0 0', color: '#17a2b8' }}>{totalActivities}</p>
        </div>

        {/* Thẻ Tổng điểm cộng đã duyệt */}
        <div style={{
          flex: 1,
          padding: '24px',
          borderRadius: '12px',
          background: '#f8f9fa',
          boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
          textAlign: 'center',
          transition: 'transform 0.3s ease-in-out',
          cursor: 'pointer'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ margin: 0, color: '#495057', fontSize: '1.2em' }}>Tổng điểm cộng đã duyệt</h3>
          <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '15px 0 0 0', color: '#ffc107' }}>{totalBonusPoints}</p>
        </div>

        {/* Thẻ Điểm rèn luyện cuối cùng */}
        <div style={{
          flex: 1,
          padding: '24px',
          borderRadius: '12px',
          background: '#f8f9fa',
          boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
          border: '1px solid #e9ecef',
          textAlign: 'center',
          transition: 'transform 0.3s ease-in-out',
          cursor: 'pointer'
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <h3 style={{ margin: 0, color: '#495057', fontSize: '1.2em' }}>Điểm rèn luyện cuối cùng</h3>
          <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '15px 0 0 0', color: '#28a745' }}>{finalScore}</p>
        </div>
      </div>

      {loading && <p>Loading data...</p>}
      {notification && <p>{notification}</p>}
      {userData.length > 0 && (
        <div>
          <h2>Your Data for {selectedSemester}:</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Tên hoạt động</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Điểm cộng</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Fileupload</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((data, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px', textAlign: 'left' }}>{data['Tên hoạt động']}</td>
                  <td style={{ padding: '8px' }}>{data['Điểm cộng']}</td>
                  <td style={{ padding: '8px' }}>
                    <a href={data['File upload']} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  </td>
                  <td style={{ padding: '8px' }}>{data.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleLogout}>Sign out</button>
      <Link to="/upload">
        <button>Upload Activity</button>
      </Link>
    </div>
  );
};

export default DashboardView;
