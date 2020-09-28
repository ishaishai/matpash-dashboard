import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loader from './Loader';
import Login from './Login/Login';

const ProtectedRoute = ({ isLoggedIn, ...props }) => {
  if (isLoggedIn == null) {
    return <Loader />;
  }

  return isLoggedIn ? <Route {...props} /> : <Login />;
};

export default ProtectedRoute;
