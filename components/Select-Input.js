import React from 'react';

function SelectInput({ id, defaultValue, options, label, handleChange, required, value }) {

  const renderLabel = (label, required) => {
    return required ? (
      <label htmlFor={id} className="form-label">
        {label}<span style={{ color: 'red' }}>*</span>
      </label>
    ) : (
      <label htmlFor={id} className="form-label">{label}</label>
    );
  };


  return (

    <div className="mb-3">
      {renderLabel(label, required)}
      <select className="form-select" id={id} onChange={handleChange}>
        <option value="" disabled selected> Selecione</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>

  );
}

export default SelectInput;