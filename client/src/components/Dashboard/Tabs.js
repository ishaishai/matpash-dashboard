import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import ResponsiveGrid from './ResponsiveGrid';

const DashboardTabs = ({ permissions }) => {
  console.log('permissions:', permissions);

  let tabsInfo = [
    { title: 'home', eventKey: 'home' },
    { title: 'home2', eventKey: 'home2' },
  ];

  let dashboardsNames = [
    { name: 'dashboard1', id: '1' },
    { name: 'dashboard2', id: '2' },
    { name: 'dashboard3', id: '3' },
    { name: 'dashboard4', id: '4' },
  ];

  let layoutAfterChange = null;

  const clickAddTabHandler = e => {
    if (e === 'addTab') {
      tabsInfo.push({ title: 'home3', eventKey: 'home3' });
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
    console.log('a');
  };

  const handleDashboardPick = (name, id) => {
    console.log(id);
    tabsInfo.push({ title: name, eventKey: name });
    setTabs(NavTabs);
  };

  const dashboardDropDown = () => (
    <div className="dashboardDropDown">
      <DropdownButton id="dropdown" title="Dashboards">
        {dashboardsNames.map((dashboard, i) => (
          <Dropdown.Item
            key={dashboard.id}
            onClick={() => handleDashboardPick(dashboard.name, dashboard.id)}
          >
            {dashboard.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );

  const [dashboards, setDashboards] = useState(dashboardDropDown);

  const setLayout = useCallback(event => {
    layoutAfterChange = event;
  }, []);

  const saveLayout = () => {
    console.log(layoutAfterChange);
  };

  const NavTabs = () => (
    <div>
      {dashboards}
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
          >
            <ResponsiveGrid onLayoutChange={setLayout} />
          </Tab>
        ))}
        <Tab className="addTabBtn" title="+" eventKey="addTab"></Tab>
      </Tabs>
    </div>
  );

  const [tabs, setTabs] = useState(NavTabs);

  return <div>{tabs}</div>;
};

const mapStateToProps = ({
  auth: {
    user: { permissions },
  },
}) => ({ permissions });

export default connect(mapStateToProps)(DashboardTabs);
