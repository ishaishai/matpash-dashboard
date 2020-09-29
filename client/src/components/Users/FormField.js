import React from 'react';

const FormField = ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="ui error message">
        {touched && error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default FormField;
