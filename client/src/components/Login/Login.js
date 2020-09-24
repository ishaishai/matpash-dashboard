import React, { useState } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions';
import './styles.scss';
import logo from '../../assets/Matpash.png';

const SignIn = ({ login, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    if (username && password) {
      login({ username, password });
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
        <form onSubmit={handleLogin} className="ui big form">
          <div className={`field ${error.msg?.username ? 'error' : ''}`}>
            <input
              name="UserName"
              type="text"
              dir="rtl"
              onChange={e => setUsername(e.target.value)}
              value={username}
              placeholder="שם משתמש"
              required
            />
            {error.msg?.username && (
              <h4 className="ui red header">{error.msg.username}</h4>
            )}
          </div>
          <div className={`field ${error.msg?.password ? 'error' : ''}`}>
            <input
              name="Password"
              type="password"
              dir="rtl"
              onChange={e => setPassword(e.target.value)}
              value={password}
              placeholder="סיסמא"
              required
            />
            {error.msg?.password && (
              <h4 className="ui red header">{error.msg.password}</h4>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              className="custom-button ui white button"
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

const mapStateToProps = ({ error }) => ({ error });

export default connect(mapStateToProps, { login })(SignIn);
