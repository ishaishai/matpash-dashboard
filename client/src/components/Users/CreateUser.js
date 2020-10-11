import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { createUser, clearErrors } from '../../actions/index';
import validate from './validation';
import { Field, reduxForm } from 'redux-form';
import Loader from '../Loader';
import { formFields, formSelectionFields } from './formFields';
import FormField from './FormField';

const renderFormFields = () =>
  formFields.map(({ name, label }) => (
    <Field key={name} name={name} label={label} component={FormField} />
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
  users,
  history,
}) => {
  const handleSubmit = e => {
    e.preventDefault();
    createUser(formValues, history);
  };

  if (users.isLoading) {
    return <Loader />;
  }

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
        {users.success && (
          <div className="ui message">{<p>המשתמש נוצר בהצלחה</p>}</div>
        )}
        {users.errors &&
          Object.keys(users.errors).map(key => (
            <div className="ui error message" key={key}>
              {<p>{users.errors[key]}</p>}
            </div>
          ))}
      </form>
    </div>
  );
};

const mapStateToProps = ({ form, users }) => ({
  users,
  formValues: form.createUserForm.values,
});

export default reduxForm({ form: 'createUserForm', validate })(
  connect(mapStateToProps, { createUser })(withRouter(CreateUser)),
);
