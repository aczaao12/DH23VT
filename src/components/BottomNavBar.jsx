import { NavLink } from 'react-router-dom';
import './BottomNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCloudArrowUp, faGear, faCalculator } from '@fortawesome/free-solid-svg-icons';

const BottomNavBar = () => {
  return (
    <nav className="bottom-nav-bar">
      <NavLink to="/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faHouse} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/upload" className="nav-link">
        <FontAwesomeIcon icon={faCloudArrowUp} />
        <span>Upload</span>
      </NavLink>
      <NavLink to="/calculator" className="nav-link">
        <FontAwesomeIcon icon={faCalculator} />
        <span>Calculator</span>
      </NavLink>
      <NavLink to="/settings" className="nav-link">
        <FontAwesomeIcon icon={faGear} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomNavBar;
