import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination-controls">
      <button onClick={() => onPageChange(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        Previous
      </button>
      <span> Page {currentPage} of {totalPages} </span>
      <button onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
        Next
      </button>
    </div>
  );
};

export default Pagination;