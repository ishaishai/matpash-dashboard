import React from 'react';

const FormField = ({ input, label, meta: { error, touched } }) => {
  return (
    <div className="field">
      <label>{label}</label>
      <input {...input}  placeholder={label} style={{ marginBottom: '5px' }} />
      <div className="ui error message">
        {touched && error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default FormField;
