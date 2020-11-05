import React from 'react'

const SelectionField = ({ label, options, placeholder, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <select className="ui dropdown">
        <option value={placeholder}>{placeholder}</option>
        {options.map(option => (
          <option value={option.value}>{option.value}</option>
        ))}
      </select>
      <div className="ui error message">
        {touched && error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default SelectionField
