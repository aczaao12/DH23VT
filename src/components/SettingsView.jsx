import useDarkMode from '../hooks/useDarkMode';

const SettingsView = ({ handleLogout }) => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>
      <p>This is the settings page. You can add your settings form or options here.</p>
      <button onClick={toggleDarkMode} className="btn btn-primary">
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <button onClick={handleLogout} className="btn btn-secondary" style={{ marginLeft: '10px' }}>Sign out</button>
    </div>
  );
};

export default SettingsView;