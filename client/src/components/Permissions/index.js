import React, { Component } from 'react';
import Users from './users_table';
import User_permission from './user_permission';
import User_view_permission from './user_view_permission';
import { Tabs, TabList, Tab } from 'react-tabs';
import 'bootstrap-v4-rtl';
import './index.scss';
import './style.css';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container-fluid" dir="rtl">
          <nav>
            <NavTabs />
          </nav>
          <div className="container-fluid">
            <Switch>
              <Route path="/Permissions/viewPerms">
                <User_view_permission />
              </Route>
              <Route path="/Permissions/users">
                <Users />
              </Route>
              <Route path="/Permissions/perms">
                <User_permission />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

class NavTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: [],
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleSelect(index) {
    this.setState({ selectedIndex: index });
  }

  handleButtonClick() {
    this.setState({ selectedIndex: 0 });
  }

  render() {
    console.log(this.state.selectedIndex);
    return (
      <Tabs
        selectedIndex={this.state.selectedIndex}
        onSelect={this.handleSelect}
      >
        <TabList>
          <Tab>
            <Link
              className="navbar bg-primary text-white border border-bottom-0 rounded-top "
              to="/Permissions/users"
            >
              משתמשים
            </Link>
          </Tab>
          <Tab>
            <Link
              className="navbar bg-primary text-white border border-bottom-0 rounded-top "
              to="/Permissions/perms"
            >
              הרשאות משתמשים
            </Link>
          </Tab>
          <Tab>
            <Link
              className="navbar bg-primary text-white border border-bottom-0 rounded-top"
              to="/Permissions/viewPerms"
            >
              הרשאות צפיה בדשבורד
            </Link>
          </Tab>
        </TabList>
      </Tabs>
    );
  }
}

export default App;
