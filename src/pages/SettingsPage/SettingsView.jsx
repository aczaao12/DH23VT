import { Link } from 'react-router-dom';
import useDarkMode from '../../hooks/useDarkMode';
import './SettingsView.css';

const SettingsView = ({ handleLogout }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
      </div>
      <ul className="settings-list">
        <li className="settings-item" onClick={toggleDarkMode}>
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
          <div className="settings-item-content">
            <h3>Dark Mode</h3>
            <p>{isDarkMode ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="toggle-switch">
            <label className="switch">
              <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
              <span className="slider round"></span>
            </label>
          </div>
        </li>
        <li className="settings-item">
          <Link to="/privacy-policy" className="settings-link">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="settings-item-content">
              <h3>Privacy Policy</h3>
            </div>
          </Link>
        </li>
        <li className="settings-item">
          <Link to="/terms-of-service" className="settings-link">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div className="settings-item-content">
              <h3>Terms of Service</h3>
            </div>
          </Link>
        </li>
        <li className="settings-item" onClick={handleLogout}>
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </div>
          <div className="settings-item-content">
            <h3>Sign out</h3>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SettingsView;
