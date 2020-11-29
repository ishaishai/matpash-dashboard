

import React from 'react';
import ReactDOM from "react-dom";
import Users from "./users_table";
import User_permission from "./user_permission";
import User_view_permission from "./user_view_permission";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import 'bootstrap-v4-rtl';
import './index.scss';
import './style.css';

import {BrowserRouter as Router,Switch,Route,Link,Redirect} from "react-router-dom";

class Permissions extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
      return (
        <Router>
          <div className="container-fluid">
            <nav>
              <NavTabs />
            </nav>
            <div className="container-fluid">
              <Switch>
                <Route path="/viewPerms">
                  <User_view_permission />
                </Route>
                <Route path="/users">
                  <Users/>
                </Route>
                <Redirect to="/users"/>
                <Route path="/perms">
                  <User_permission />
                </Route>
              </Switch>
            </div>
            
          </div>
        </Router>
      );
    }

  }
  


class NavTabs extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: 0
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  
  handleSelect (index) {
    this.setState({ selectedIndex: index });
  };

  handleButtonClick () {
    this.setState({ selectedIndex: 0 });
  };

  render() {
    console.log(this.state.selectedIndex)
    console.log("BAB");
    return (
      <Tabs
        selectedIndex = {this.state.selectedIndex}
        onSelect={this.handleSelect} style={{textAlign: "right",marginTop: "10px"}} >
        <TabList style={{direction: "rtl",display:"inline-block"}}>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/users" >משתמשים</Link></Tab>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/perms">הרשאות משתמשים</Link></Tab>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top" to="/viewPerms" >הרשאות צפיה בדשבורד</Link></Tab>
        </TabList>
        
      </Tabs>
    );
  }
}
  
const wrapper = document.getElementById("container");
//wrapper ? ReactDOM.render(<App />, wrapper) : false;


export default Permissions;