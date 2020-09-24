import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../../actions';
import './sign-in.styles.scss';
import FormInput from '../form-input/form-input.component';
import CustomButton from '../custom-button/custom-button.component';

const SignIn = ({ login, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ height: '100vh' }} className="image">
      <div className="sign-in ui big form">
        <h1> ברוכים הבאים </h1>
        <form onSubmit={handleSubmit}>
          <div class={`field ${error.msg ? 'error' : ''}`}>
            <FormInput
              name="UserName"
              type="text"
              handleChange={e => setUsername(e.target.value)}
              value={username}
              placeholder="שם משתמש"
              required
            />
          </div>
          <div class={`field ${error.msg ? 'error' : ''}`}>
            <FormInput
              name="Password"
              type="password"
              handleChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="סיסמא"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CustomButton
              type="submit"
              onClick={() => login({ username, password })}
            >
              כניסה
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ error }) => ({ error });

export default connect(mapStateToProps, { login })(SignIn);
