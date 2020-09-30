import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { login, clearErrors } from '../../actions';
import './styles.scss';
import logo from '../../assets/Matpash.png';

const Login = ({ login, errors, clearErrors, isLoading, history }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    clearErrors();
    if (username && password) {
      login({ username, password }, history);
    }
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ height: '100vh' }} className="">
      <div className="sign-in ui big form">
        <img
          src={logo}
          height={200}
          width={150}
          style={{ marginBottom: '40px' }}
        ></img>
        <h1 style={{ marginBottom: '40px' }}> ברוכים הבאים </h1>
        <form onSubmit={handleLogin} className="ui big form" dir="rtl">
          <div className="field">
            <input
              name="UserName"
              type="text"
              dir="rtl"
              onChange={e => setUsername(e.target.value)}
              value={username}
              placeholder="שם משתמש"
              required
            />
            {errors?.username && (
              <h4 className="ui red header">{errors.username}</h4>
            )}
          </div>
          <div className="field">
            <input
              name="Password"
              type="password"
              dir="rtl"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="סיסמא"
              required
            />
          </div>
          {errors?.password && (
            <h4 className="ui red header">{errors.password}</h4>
          )}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className={`ui primary ${isLoading ? 'loading' : ''} button`}
              type="submit"
              onClick={handleLogin}
            >
              כניסה
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth, errors }) => ({
  isLoading: auth.isLoading,
  errors,
});

export default connect(mapStateToProps, { login, clearErrors })(
  withRouter(Login)
);
