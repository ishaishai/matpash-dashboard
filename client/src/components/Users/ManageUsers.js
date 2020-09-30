import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { formFields, formSelectionFields } from './formFields';
import FormField from './FormField';
import SelectionField from './SelectionField';

const renderFormFields = () =>
  formFields.map(({ name, label }) => (
    <Field
      key={name}
      type="text"
      name={name}
      label={label}
      component={FormField}
    />
  ));

const renderSelectionFields = () =>
  formSelectionFields.map(({ name, label, placeholder, options }) => (
    <div>
      <label>{label}</label>
      <Field
        key={name}
        name={name}
        label={label}
        placeholder={placeholder}
        component="select"
      >
        {options.map(option => (
          <option value={option.value}>{option.value}</option>
        ))}
      </Field>
    </div>
  ));

const ManageUsers = () => {
  return (
    <div className="container" dir="rtl">
      <form className="ui error form">
        <h2 className="ui dividing header">יצירת משתמש</h2>
        {renderFormFields()}
        {renderSelectionFields()}
        <button type="submit" className="ui button primary" style={{ marginTop: '10px' }}>
          צור משתמש
        </button>
      </form>
    </div>
  );
};

const validate = ({ username, firstName, lastName, id, password, role }) => {
  const errors = {};
  if (!username) {
    errors.username = 'חובה';
  } else if (username.length < 5) {
    errors.username = 'חייב להכיל לפחות 5 תווים';
  }
  if (!password) {
    errors.password = 'חובה';
  } else if (password.length < 6) {
    errors.password = 'חייב להכיל לפחות 6 תווים';
  }
  if (!firstName) {
    errors.firstName = 'חובה';
  } else if (firstName.length < 2) {
    errors.firstName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!lastName) {
    errors.lastName = 'חובה';
  } else if (lastName.length < 2) {
    errors.lastName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!id) {
    errors.id = 'חובה';
  } else if (id.length < 9) {
    errors.id = 'חייב להכיל לפחות 9 תווים';
  }
  if (role === 'תפקיד') {
    errors.role = 'בחר תפקיד';
    console.log('role!!');
  }
  return errors;
};

export default reduxForm({
  form: 'createUser',
  validate,
})(ManageUsers);
