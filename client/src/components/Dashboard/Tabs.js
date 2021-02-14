import React, { useState, useEffect } from 'react';
import HighChartsResponsiveGrid from './HighChartsResponsiveGrid';
import { Divider } from 'semantic-ui-react';
import axios from 'axios';
import Highcharts from 'highcharts';
import { connect } from 'react-redux';
import './Tabs.css';
import GoldenGrid from './GoldenGrid';
import {
  Button,
  Form,
  Navbar,
  Nav,
  Dropdown,
  DropdownButton,
  Col,
  Container,
  Row,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

require('highcharts/modules/exporting')(Highcharts);
const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

const DashboardTabs = props => {
  let prevLayout = [];
  const [layoutAfterChange, setLayoutAfterChange] = useState(null);
  const [goldenLayout, setGoldenLayout] = useState(null);
  const [dashboardNames, setDashboardNames] = useState(null);
  const [currentDash, setCurrentDash] = useState({});

  const setGoldensLayout = event => {
    setGoldenLayout(event);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };
  const [goldenGrid] = useState(
    <GoldenGrid user={props.user} onLayoutChange={setGoldensLayout} />,
  );
  const [isViewer, setIsViewer] = useState(() => {
    if (props.user.permissions === 'צופה') {
      return false;
    } else {
      return true;
    }
  });
  const fetchDashboardNames = async () => {
    const response = await axios.get('/api/dashboard/get-dashboard-names/tabs');
    let list = [...response.data.dashboardIdList];
    console.log(list);
    let defaultDashId = response.data.defaultDashboard;
    if (list.length != 0) {
      setDashboardNames(list);
      let defaultDash = list.filter(
        dashboard => dashboard.index == defaultDashId,
      )[0];
      if (!defaultDash) {
        defaultDash = list[0];
      }
      handleDashboardPick(defaultDash);
    } else {
      setDashboardNames([]);
      handleDashboardPick(null);
      setIsViewer(false);
    }
  };

  useEffect(() => {
    fetchDashboardNames();
  }, []);

  const setDashboardLayout = event => {
    let currentLayout = event;

    if (prevLayout.length === currentLayout.length) {
      for (let i = 0; i < prevLayout.length; i++) {
        if (
          prevLayout[i].i === currentLayout[i].i &&
          (prevLayout[i].w !== currentLayout[i].w ||
            prevLayout[i].h !== currentLayout[i].h)
        ) {
          let chartWrapper = Array.prototype.slice
            .call(document.getElementsByClassName('chartWrap'))
            .filter(chart => chart.id == prevLayout[i].i);

          let height = chartWrapper[0].style.height;
          let width = chartWrapper[0].style.width;

          let cardFront = document.getElementById(prevLayout[i].i).childNodes[0]
            .childNodes[0];
          let cardBack = document.getElementById(prevLayout[i].i).childNodes[0]
            .childNodes[1];

          cardFront.style.height = height;
          cardFront.style.width = width;
          cardBack.style.height = height;
          cardBack.style.width = width;

          //set highchart element because too much nested divs
          cardFront.childNodes[0].childNodes[0].style.height = height;
          cardFront.childNodes[0].childNodes[0].style.width = width;
        }
      }
    } else {
      prevLayout = currentLayout;
    }

    setLayoutAfterChange(event);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  const [highchartsResponsive, setHighchartsResponsive] = useState(
    <HighChartsResponsiveGrid
      onLayoutChange={setDashboardLayout}
      dashboardID={null}
    />,
  );
  const responsiveGridRef = React.useRef('highChartsResponsiveGrid');

  const handleDashboardPick = async dashboard => {
    let grid;
    let index = null;
    if (dashboard) {
      index = dashboard.index;
    }

    const graphPermissions = await getUserGraphPermissions();
    grid = (
      <HighChartsResponsiveGrid
        userGraphOptions={graphPermissions}
        permissions={props.user.permissions}
        onLayoutChange={setDashboardLayout}
        dashboardID={index}
      />
    );
    console.log(dashboard);
    setCurrentDash(dashboard);
    setHighchartsResponsive(grid);
  };

  useEffect(() => {
    responsiveGridRef.current = highchartsResponsive;
  }, [highchartsResponsive]);

  const saveLayout = async () => {
    console.log(goldenLayout);
    try {
      const response = await axios.post('/api/dashboard/update', {
        layout_grid: {
          goldensLayout: goldenLayout,
          graphsLayout: layoutAfterChange,
          dashboardID: currentDash.index,
        },
      });
      if (response.data.msg == 'ok') alert('!התבנית נשמרה');
    } catch (error) {
      console.log(error);
    }
  };

  const saveDefaultDashboard = async () => {
    try {
      alert(`דשבורד "${currentDash.name}" נבחר כברירת מחדל`);
    } catch (error) {
      alert('קרתה שגיאה');
      console.log(error);
    }
  };

  const deleteDashboardHandler = async () => {
    let result = window.confirm(
      'האם באמת למחוק את הדשבורד הזה? פעולה זו בלתי הפיכה',
    );

    if (result) {
      alert('!הדשבורד נמחק');
    }

    window.location.href = '/';
  };

  const getUserGraphPermissions = async () => {
    const response = await axios.get('/api/permissions/getPermission/tabs');
    let filtered = Object.keys(response.data.userPriviledges).filter(
      key => response.data.userPriviledges[key] === true,
    );

    let m_defaultContextMenuItems = [];
    if (filtered) {
      for (let option of Object.values(filtered)) {
        switch (option) {
          case 'print':
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[0]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[1]);
            break;
          case 'pdf':
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[5]);
            break;
          case 'image':
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[3]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[4]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[6]);
            break;
        }
      }
    }
    return m_defaultContextMenuItems;
  };

  return (
    <div>
      <Navbar
        expand="lg"
        variant={'dark'}
        className="justify-content-md-end dashNav"
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <Navbar.Brand>תפריט דשבורדים</Navbar.Brand>
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <div className="dashboardDropDown menuBtn">
              <DropdownButton
                id="dropdown"
                title="דשבורדים"
                className="dropdown-btn choose-dash-btn"
                type=""
                variant="outline-primary"
              >
                {dashboardNames != null
                  ? dashboardNames.map(dashboard => {
                      return (
                        <Dropdown.Item
                          key={dashboard.index}
                          onClick={() => handleDashboardPick(dashboard)}
                        >
                          {dashboard.name}
                        </Dropdown.Item>
                      );
                    })
                  : ''}
              </DropdownButton>
            </div>
            <div className="menuBtn defaultDashboardBtn">
              <Button className="" onClick={saveDefaultDashboard}>
                שמור כברירת מחדל
              </Button>
            </div>
            <div className="menuBtn saveLayoutBtn">
              {isViewer ? (
                <Button className="" onClick={saveLayout}>
                  שמור תבנית
                </Button>
              ) : null}
            </div>
            <div className="deleteDashboardBtn menuBtn">
              {isViewer ? (
                <Button
                  className=""
                  variant="outline-danger"
                  onClick={deleteDashboardHandler}
                >
                  מחיקת דשבורד
                </Button>
              ) : null}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <hr />
      <div className="dashboard-title">{currentDash.name}</div>
      <hr />

      <p className="lastUpdate">עדכון אחרון: {currentDash.lastupdate}</p>

      {goldenGrid}
      <Divider />
      {highchartsResponsive}
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({ user });
export default connect(mapStateToProps)(DashboardTabs);
