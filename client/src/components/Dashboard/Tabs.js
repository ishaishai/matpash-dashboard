import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tabs, Tab, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import ResponsiveGrid from './ResponsiveGrid';
import axios from 'axios';
import CreateChart from '../Menu/CreateChart';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const DashboardTabs = () => {
  let tabsInfo = [
    // { title: "home", eventKey: "home" },
  ];

  let dashboardsNames = [{ name: 'dashboard3', id: '3' }];

  let layoutAfterChange = null;

  let [dashboardID, setDashboardID] = useState();

  const [dashNames, setDashNames] = useState(dashboardsNames);

  const [dashboardNames, setDashboardNames] = useState([]);

  const fetchDashboardNames = async () => {
    const response = await axios.get('/api/dashboard/get-dashboard-names');
    const dashboardNames = response.data.dashboardIdList;
    let list = [...response.data.dashboardIdList];

    let dash = list.map(obj => ({
      name: 'dashboard' + obj,
      id: obj,
    }));

    console.log(dash);
    setDashboardNames(dashboardNames);
    setTabs(NavTabs);
  };

  useEffect(() => {
    fetchDashboardNames();
  }, []);

  const clickAddTabHandler = async e => {
    if (e === 'addTab') {
      setTabs(NavTabs);
    }
  };

  const removeTabHandler = (event, title) => {
    event.stopPropagation();
    // let obj = tabsInfo.find((o) => o.title == title);

    tabsInfo = tabsInfo.filter(function (el) {
      return el.title !== title;
    });

    setTabs(NavTabs);
  };

  const handleDashboard = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'), 2000);
    });
  };

  let grid;
  const [responsiveGrid, setResponsiveGrid] = useState();

  const handleDashboardPick = dashboardID => {
    tabsInfo.push({ title: 'dashboard' + dashboardID, eventKey: dashboardID });
    setSelectedDashboard(dashboardID);
    grid = (
      <ResponsiveGrid onLayoutChange={setLayout} dashboardID={dashboardID} />
    );
    // grid = <ResponsiveGrid onLayoutChange={setLayout} layout={layoutAfterChange} dashboardID={dashboardID}/>
    setResponsiveGrid(grid);
    setTabs(NavTabs);
  };

  const setLayout = event => {
    layoutAfterChange = event;
  };

  const saveLayout = async () => {
    console.log(layoutAfterChange);
    try {
      const response = await axios.post('/api/dashboard/update', {
        layout_grid: layoutAfterChange,
      });
      const { data } = response.data;
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedDashboard, setSelectedDashboard] = useState();

  const handleEntering = () => {
    console.log('entered');
    grid = (
      <ResponsiveGrid onLayoutChange={setLayout} dashboardID={dashboardID} />
    );

    setResponsiveGrid(grid);
    setTabs(NavTabs);
  };
  const NavTabs = () => (
    <div>
      <Button className="saveLayoutBtn" onClick={saveLayout}>
        Save Layout
      </Button>
      <Tabs
        className="Tab"
        defaultActiveKey={'home'}
        onSelect={clickAddTabHandler}
      >
        {tabsInfo.map((tab, i) => (
          <Tab
            id={tab.title}
            key={i}
            title={
              <div>
                <i>{tab.title}</i>{' '}
                <span
                  className="xBtn"
                  onClick={e => removeTabHandler(e, tab.title)}
                >
                  {' '}
                  x{' '}
                </span>
              </div>
            }
            eventKey={tab.eventKey}
            onEnter={handleDashboard}
            onEntering={handleEntering}
          >
            {/* {responsiveGrid} */}
          </Tab>
        ))}
        {/* <Tab className="addTabBtn" title="+" eventKey="addTab" ></Tab> */}
      </Tabs>
    </div>
  );

  const [tabs, setTabs] = useState(NavTabs);

  return (
    <div>
      <div className="dashboardDropDown">
        <DropdownButton id="dropdown" title="Dashboards">
          {dashboardNames.map(dashboard => (
            <Dropdown.Item
              key={dashboard}
              onClick={() => handleDashboardPick(dashboard)}
            >
              {dashboard}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </div>
      {tabs}
      {responsiveGrid}
      {/* <ResponsiveGrid onLayoutChange={setLayout} dashboardID={selectedDashboard}/> */}
    </div>
  );
};

export default DashboardTabs;
