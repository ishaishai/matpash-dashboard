import React, { useEffect } from 'react';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser } from '../actions';

import Statistics from './Statistics/Statistics';
import CreateUser from '../components/Users/CreateUser';
import NavBar from './Menu/NavBar';
import CreateChart from './Menu/CreateChart';
import Tabs from './Dashboard/Tabs';
import Login from './Login/Login';
import Permissions from './Permissions/Permissions';
import Admin from './Admin';
import ProtectedRoute from './ProtectedRoute';

const App = ({ fetchUser, auth }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  console.log('App')
  return (
    <div style={{ height: '100vh' }}>
      <BrowserRouter>
        <ProtectedRoute isLoggedIn={auth.user} component={NavBar} />
        <Switch>
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/"
            exact
            component={Tabs}
          />
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/create-chart"
            exact
            component={CreateChart}
          />
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/statistics"
            exact
            component={Statistics}
          />
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/users"
            exact
            component={CreateUser}
          />
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/permissions"
            exact
            component={Permissions}
          />
          <ProtectedRoute
            isLoggedIn={auth.user}
            path="/admin"
            exact
            component={Admin}
          />
          <Route path="/login" component={Login} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps, { fetchUser })(App);
