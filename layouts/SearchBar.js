import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Search, XCircleFill } from 'react-bootstrap-icons';

const SearchBar = ({ placeholder = "Search", maxWidth = "250px" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Form
      className="d-flex align-items-center position-relative w-auto ms-auto"
      style={{ maxWidth }}
    >
      <Search className="position-absolute start-2 ms-2" style={{ fontSize: "16px" }} />
      
      {searchTerm && (
        <XCircleFill
          className="position-absolute end-0 me-2"
          style={{ fontSize: "16px", cursor: 'pointer' }}
          onClick={clearSearch} 
        />
      )}

      <Form.Control
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        className="ps-7"
        style={{ fontSize: "14px", height: "35px", WebkitAppearance: "none" }}
      />
    </Form>
  );
};

export default SearchBar;
