import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import ResponsiveGrid from './ResponsiveGrid';
import axios from 'axios';
import Highcharts from 'highcharts';
import { connect } from 'react-redux';
import './Tabs.css';

require('highcharts/modules/exporting')(Highcharts);
const defaultContextMenuButtons = Highcharts.getOptions().exporting.buttons
  .contextButton.menuItems;

const DashboardTabs = props => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [layoutAfterChange, setLayoutAfterChange] = useState(null);
  const [dashboardNames, setDashboardNames] = useState(null);
  const [currentDashName,setCurrentDashName] = useState('');

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
    let defaultDashId = response.data.defaultDashboard;
    if (list.length != 0) {
      setDashboardNames(list);
      console.log(response.data.defaultDashboard);
      handleDashboardPick(list.filter((dashboard) => dashboard.index==defaultDashId)[0]);
    } else {
      setDashboardNames([]);
      handleDashboardPick(null);
      setIsViewer(false); 
    }    
  
  };


  useEffect(() => {
    fetchDashboardNames();
  }, []);

  const setLayout = event => {
    setLayoutAfterChange(event);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };
  const [responsiveGrid, setResponsiveGrid] = useState(
    <ResponsiveGrid onLayoutChange={setLayout} dashboardID={null} />,
  );
  const responsiveGridRef = React.useRef('responsiveGrid');

  const handleDashboardPick = async(dashboard) => {
    console.log("handleDashboardPick");
    let grid;
    const graphPermissions = await getUserGraphPermissions();
    grid = (
      <ResponsiveGrid userGraphOptions = {graphPermissions} permissions = {props.user.permissions}  onLayoutChange={setLayout} dashboardID={dashboard.id} />
    );
    console.log(dashboard);
    setCurrentDashName(dashboard.name);
    setResponsiveGrid(grid);
    setSelectedDashboard(dashboard.index);
  };

  useEffect(()=> {
    responsiveGridRef.current = responsiveGrid;
  },[ResponsiveGrid]);

  const saveLayout = async () => {
    console.log(layoutAfterChange);
    try {
      const response = await axios.post('/api/dashboard/update', {
        layout_grid: layoutAfterChange,
      });
      const { data } = response.data;
      alert('!התבנית נשמרה');
    } catch (error) {
      console.log(error);
    }
  };

  const saveDefaultDashboard = async () => {
    try {
      const result = await axios.post(`api/dashboard/set-default/`+selectedDashboard);
      alert(`דשבורד "${currentDashName}" נבחר כברירת מחדל`);
    }catch(error) {
      alert("קרתה שגיאה");
      console.log(error);
    }
  }
  
  const deleteDashboardHandler = async () => {
    let result = window.confirm('האם באמת למחוק את הדשבורד הזה? פעולה זו בלתי הפיכה');
    console.log(selectedDashboard);
    if (result) {
      const result = await axios.delete(
        '/api/dashboard/delete-dashboard-by-id/' + selectedDashboard,
      );
      alert('!הדשבורד נמחק');
    }

    window.location.href = '/'; 
  };

  const getUserGraphPermissions = async() => {
    const response = await axios.get('/api/permissions/getPermission/tabs');
    let filtered = Object.keys(response.data.userPriviledges).filter((key) => (response.data.userPriviledges[key]===true));
    console.log("filtered",filtered);
    
    let m_defaultContextMenuItems = [];
    console.log(defaultContextMenuButtons);
    if(filtered) {
      for(let option of Object.values(filtered)) {
        console.log(option);
        switch(option) {
          case "print": 
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[0]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[1]);
            break;
          case "pdf": 
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[5]);
            break;
          case "image": 
            m_defaultContextMenuItems.push(defaultContextMenuButtons[2]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[3]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[4]);
            m_defaultContextMenuItems.push(defaultContextMenuButtons[6]);
            break;
        }
      }
    }
    console.log("m_defaultContextMenuItems",m_defaultContextMenuItems);
    return m_defaultContextMenuItems;
  }


  return (
    <div>
      <div className="btnWrapper">
        <div className="dashboardDropDown">
          <DropdownButton id="dropdown" title="דשבורדים" className="dropdown-btn choose-dash-btn"
                  type=""
                  variant="outline-primary">
            {(dashboardNames!=null) ? dashboardNames.map(dashboard => {
              return (
                <Dropdown.Item
                  key={dashboard.index}
                  onClick={() => handleDashboardPick(dashboard)}
                >
                  {dashboard.name}
                </Dropdown.Item>
              );
            }) : ''}
          </DropdownButton>
        </div>
        {isViewer ? (
          <Button className="defaultDashboardBtn" onClick={saveDefaultDashboard}>
            שמור כברירת מחדל
          </Button>
        ) : null}
        <div className ="dashboard-title">
          <hr/>
            {currentDashName}
            
          <hr/>
      </div>
        {isViewer ? (
          <Button className="saveLayoutBtn" onClick={saveLayout}>
            שמור תבנית
          </Button>
        ) : null}
        {isViewer ? (
          <Button
            className="saveLayoutBtn"
            variant="outline-danger"
            onClick={deleteDashboardHandler}
          >
            מחיקת דשבורד
          </Button>
        ) : null}
      </div>
      
      
      {responsiveGrid}
    </div>
  );
};

const mapStateToProps = ({
  auth: {
    user
  },
}) => ({ user });
export default connect(mapStateToProps)(DashboardTabs);
