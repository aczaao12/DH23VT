import React, { useState, useRef, useEffect } from 'react';
import './SearchableSelect.css'; // We'll create this CSS file next

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (value && options[value]) {
      setDisplayValue(options[value].name);
    } else {
      setDisplayValue('');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    onChange(''); // Clear selected value when searching
  };

  const handleOptionClick = (key) => {
    onChange(key);
    setSearchTerm('');
    setIsOpen(false);
  };

  const filteredOptions = Object.keys(options).filter(key =>
    options[key].name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="searchable-select-wrapper" ref={wrapperRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={isOpen ? searchTerm : displayValue}
        onChange={handleSearchChange}
        onFocus={() => setIsOpen(true)}
        className="searchable-select-input"
      />
      {isOpen && (
        <div className="searchable-select-dropdown">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((key) => (
              <div
                key={key}
                className="searchable-select-option"
                onClick={() => handleOptionClick(key)}
              >
                {options[key].name}
              </div>
            ))
          ) : (
            <div className="searchable-select-no-results">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
