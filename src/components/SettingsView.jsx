const SettingsView = ({ handleLogout }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>
      <p>This is the settings page. You can add your settings form or options here.</p>
      <button onClick={handleLogout} className="btn btn-secondary">Sign out</button>
    </div>
  );
};

export default SettingsView;