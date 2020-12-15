import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Admin from './Admin';
import ManageExcel from './ManageExcel';

function AdminScreen() {
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = index => {
    setSelectedIndex(index);
  };

  const handleButtonClick = () => {
    selectedIndex(0);
  };

  return (
    <Router>
      <div className="container-fluid">
        <nav>
          <Tabs
            selectedIndex={selectedIndex}
            onSelect={handleSelect}
            style={{ textAlign: 'right', marginTop: '10px' }}
          >
            <TabList style={{ direction: 'rtl', display: 'inline-block' }}>
              <Tab>
                <Link
                  className="navbar bg-primary text-white border border-bottom-0 rounded-top "
                  to="/excel-upload"
                >
                  העלאת קבצי אקסל
                </Link>
              </Tab>
              <Tab>
                <Link
                  className="navbar bg-primary text-white border border-bottom-0 rounded-top "
                  to="/excel-manage"
                >
                  ניהול קבצי אקסל
                </Link>
              </Tab>
            </TabList>
          </Tabs>
        </nav>
        <div className="container-fluid">
          <Switch>
            <Route path="/excel-upload">
              <Admin />
            </Route>
            <Route path="/excel-manage">
              <ManageExcel />
            </Route>
            <Redirect to="/excel-upload"/>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default AdminScreen
