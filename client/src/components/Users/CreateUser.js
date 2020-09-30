import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createUser, clearErrors } from '../../actions/index';
import { Field, reduxForm } from 'redux-form';
import { formFields, formSelectionFields } from './formFields';
import FormField from './FormField';

const renderFormFields = () =>
  formFields.map(({ name, label}) => (
    <Field
      key={name}
      name={name}
      label={label}
      component={FormField}
    />
  ));

const renderSelectionFields = () =>
  formSelectionFields.map(({ name, label, placeholder, options }) => (
    <div className="field" key={name}>
      <label>{label}</label>
      <Field
        name={name}
        label={label}
        placeholder={placeholder}
        component="select"
      >
        <option>{placeholder}</option>
        {options.map(option => (
          <option value={option.value}>{option.value}</option>
        ))}
      </Field>
    </div>
  ));

const CreateUser = ({
  formValues,
  pristine,
  invalid,
  createUser,
  errors,
  clearErrors,
  history,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    clearErrors();
    createUser(formValues, history);
  };

  return (
    <div className="container" dir="rtl" style={{ marginTop: '50px' }}>
      <form className="ui error form" onSubmit={handleSubmit}>
        <h2 className="ui dividing header">יצירת משתמש</h2>
        {renderFormFields()}
        {renderSelectionFields()}
        <button
          type="submit"
          className="ui button primary"
          disabled={pristine || invalid}
          style={{ marginTop: '10px' }}
        >
          צור משתמש
        </button>
        {errors &&
          Object.keys(errors).map(key => (
            <div className="ui error message" key={key}>{<p>{errors[key]}</p>}</div>
          ))}
      </form>
    </div>
  );
};

const validate = ({
  username,
  firstName,
  lastName,
  id,
  password,
  organization,
  permissions,
}) => {
  const errors = {};
  if (!username) {
    errors.username = 'שדה חובה';
  } else if (username.length < 4) {
    errors.username = 'חייב להכיל לפחות 5 תווים';
  }
  if (!password) {
    errors.password = 'שדה חובה';
  } else if (password.length < 6) {
    errors.password = 'חייב להכיל לפחות 6 תווים';
  }
  if (!firstName) {
    errors.firstName = 'שדה חובה';
  } else if (firstName.length < 2) {
    errors.firstName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!lastName) {
    errors.lastName = 'שדה חובה';
  } else if (lastName.length < 2) {
    errors.lastName = 'חייב להכיל לפחות 2 תווים';
  }
  if (!id) {
    errors.id = 'שדה חובה';
  } else if (id.length !== 9) {
    errors.id = 'חייב להכיל 9 תווים';
  } else if (!/^\d+$/.test(id)) {
    errors.id = 'חייב להכיל ספרות בלבד';
  }
  if (organization === 'בחר ארגון') {
    errors.role = 'בחר ארגון';
  }
  if (permissions === 'בחר הרשאה') {
    errors.role = 'בחר הרשאה';
  }
  return errors;
};

const mapStateToProps = ({ errors, clearErrors, form }) => ({
  errors,
  clearErrors,
  formValues: form.createUserForm.values,
});

export default reduxForm({ form: 'createUserForm', validate })(
  connect(mapStateToProps, { createUser, clearErrors })(withRouter(CreateUser))
);
