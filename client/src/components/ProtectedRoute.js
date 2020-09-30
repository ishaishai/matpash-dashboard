import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Loader from './Loader';

const ProtectedRoute = ({ isLoggedIn, ...props }) => {
  if (isLoggedIn == null) {
    return <Loader />;
  }

  return isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />;
};

export default ProtectedRoute;
