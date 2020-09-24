// import React, { Component } from "react";
// import ReactDOM from "react-dom";
// import Header from "./components/header";

// import 'bootstrap-v4-rtl';
// import './scss/index.scss';

// class Root extends Component {
//     constructor(props) {
//       super(props);
  
//       this.state = {
//         value: "Hello from className Root"
//       };
  
//     }
  
//     render() {
//       return (
//         <div className="text-center justify-content-md-center">
//           <h1>index</h1>
//             <Header >
                
//             </Header>
//         </div>
//       );
//     }
//   }
  


// const wrapper = document.getElementById("container");
// wrapper ? ReactDOM.render(<Root />, wrapper) : false;


import React, {Component} from 'react';
import Users from "./users_table";
import User_permission from "./user_permission";
import User_view_permission from "./user_view_permission";
import { Tabs, TabList, Tab} from "react-tabs";
import 'bootstrap-v4-rtl';
import './index.scss';
import './style.css'

import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";

class App  extends Component {
  render(){
      return (
        <Router>
          <div className="container-fluid" dir="rtl">
            {/* <div className="text-center justify-content-md-center">
                <Header2 />
            </div> */}
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
  

// class Header2 extends Component{
//   constructor(props){
//     super(props);
//   }

//   render(){
//     return (
//       <div className="bg-primary col-md px-2">
                  
//         <div className="row w-100 mb-3 bgg">
//             <div className="col-8">
//                <Link to="/" className="btn btn-lg bg-primary text-white btn-outline-primary" >משתמשיםמתפ״ש - מערכת הרשאות </Link>
//             </div>
//         </div>
//     </div>
//     )
//   }
//   }
  
// class Tabs extends Component{
//   constructor(props){
//     super(props);
//   }
//   render(){
//     return(
//       <nav className="navbar-expand-lg navbar-light bg-light ">
//           <div className="nav nav-tabs mt-lg-0 border-primary">
//               <Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/users" >משתמשים</Link>
//               <Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/perms">הרשאות משתמשים</Link>
//               <Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top" to="/viewPerms" >הרשאות צפיה בדשבורד</Link>
//           </div>
//       </nav>
//     )
//   }
//   }


class NavTabs extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: []
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
    return (
      <Tabs
        selectedIndex={this.state.selectedIndex}
        onSelect={this.handleSelect} >
        <TabList>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/users" >משתמשים</Link></Tab>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top " to="/perms">הרשאות משתמשים</Link></Tab>
          <Tab><Link  className="navbar bg-primary text-white border border-bottom-0 rounded-top" to="/viewPerms" >הרשאות צפיה בדשבורד</Link></Tab>
        </TabList>
        
      </Tabs>
    );
  }
}
  
export default App;