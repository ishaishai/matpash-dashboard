import React, { useEffect } from 'react';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchUser } from '../actions';

import Statistics from './Statistics/Statistics';
import NavBar from './Menu/NavBar';
import CreateChart from './Menu/CreateChart';
import Tabs from './Dashboard/Tabs';
import SignIn from './Login/sign-in/sign-in.component';
import Permissions from './Permissions/index';
import Loader from './Loader';


const App = ({ fetchUser, auth }) => {
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  switch (auth) {
    case null:
      return <Loader/>

    case false:
      return <SignIn />;

    default:
      return (
        <div style={{ height: '100vh' }}>
          <BrowserRouter>
            <NavBar />
            <Switch>
              <Route path="/" exact component={Tabs} />
              <Route path="/CreateChart" component={CreateChart} />
              <Route path="/Statistics" component={Statistics} />
              <Route path="/Permissions" component={Permissions} />
            </Switch>
          </BrowserRouter>
        </div>
      );
  }
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(mapStateToProps, { fetchUser })(App);
