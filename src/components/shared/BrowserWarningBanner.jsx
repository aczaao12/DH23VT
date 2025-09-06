import React from 'react';
import './BrowserWarningBanner.css';

const BrowserWarningBanner = ({ message }) => {
  return (
    <div className="browser-warning-banner">
      <p>{message}</p>
    </div>
  );
};

export default BrowserWarningBanner;
