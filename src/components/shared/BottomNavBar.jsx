import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './BottomNavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCloudArrowUp, faGear, faCalculator, faBell, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useResponsive } from '../../hooks/useResponsive'; // Import the hook

const BottomNavBar = () => {
  const { isDesktopOrLaptop } = useResponsive(); // Use the hook
  const [isSheetVisible, setIsSheetVisible] = useState(true);

  const toggleSheetVisibility = () => {
    setIsSheetVisible(!isSheetVisible);
  };

  return (
    <>
      {isDesktopOrLaptop && (
        <button
          className={`bottom-sheet-toggle-button ${isSheetVisible ? 'visible' : 'hidden'}`}
          onClick={toggleSheetVisibility}
          aria-label={isSheetVisible ? 'Hide navigation' : 'Show navigation'}
        >
          <FontAwesomeIcon icon={isSheetVisible ? faChevronDown : faChevronUp} />
        </button>
      )}
      <nav className={`bottom-nav-bar ${isDesktopOrLaptop ? 'desktop-bottom-sheet' : ''} ${!isSheetVisible && isDesktopOrLaptop ? 'bottom-sheet-hidden' : ''}`}>
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
        <NavLink to="/notifications" className="nav-link">
          <FontAwesomeIcon icon={faBell} />
          <span>Notifications</span>
        </NavLink>
      </nav>
    </>
  );
};

export default BottomNavBar;
