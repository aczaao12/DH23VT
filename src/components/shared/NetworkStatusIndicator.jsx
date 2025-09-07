import React, { useState, useEffect } from 'react';
import './NetworkStatusIndicator.css';

const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTooltip, setShowTooltip] = useState(false); // New state for tooltip visibility

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  const handleTouchStart = () => setShowTooltip(true);
  const handleTouchEnd = () => setShowTooltip(false);

  const tooltipText = isOnline ? 'Trạng thái kết nối mạng: Trực tuyến' : 'Trạng thái kết nối mạng: Ngoại tuyến';

  return (
    <div
      className={`network-status-container rounded-md p-1 shadow-md ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
      title={tooltipText} // Basic HTML tooltip
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke={isOnline ? '#4CAF50' : '#F44336'}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"
        />
      </svg>
      {showTooltip && (
        <div className="network-status-tooltip">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default NetworkStatusIndicator;