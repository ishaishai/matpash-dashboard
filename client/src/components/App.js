import React from 'react';
import ResponsiveGrid from './Dashboard/ResponsiveGrid';
import '../../node_modules/react-grid-layout/css/styles.css';
import '../../node_modules/react-resizable/css/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css'
// import {BrowserRouter as Router ,Switch , Route, Link} from "react-router-dom";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Statistics from './Statistics/Statistics';
import NavBar from "./Menu/NavBar";
import CreateChart from "./Menu/CreateChart";
import Tabs from './Dashboard/Tabs';
import SignIn from "./Login-Page/sign-in/sign-in.component";


function App() {
    return (
        <div style={{ height: '100vh' }}>
            <NavBar/>
            <Switch>

                <Route path="/" exact component={Tabs}/>
                <Route path="/CreateChart" component={CreateChart}/>
                <Route path="/Statistics" component={Statistics}/>
                <Route path="/SignIn" component={SignIn}/>
            </Switch>
        </div>
    );
}

export default App;
