import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownButton, Button } from 'react-bootstrap';
import ResponsiveGrid from './ResponsiveGrid';
import axios from 'axios';
import { connect } from 'react-redux';
import './Tabs.css';

const DashboardTabs = props => {
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [layoutAfterChange, setLayoutAfterChange] = useState(null);
  const [dashboardNames, setDashboardNames] = useState(null);
  const [currentDashName,setCurrentDashName] = useState('');
  const [isViewer, setIsViewer] = useState(() => {
    if (props.permissions == 'צופה') {
      return false;
    } else {
      return true;
    }
  });

  const fetchDashboardNames = async () => {
    const response = await axios.get('/api/dashboard/get-dashboard-names/tabs');
    let list = [...response.data.dashboardIdList];
    if (list.length != 0) {
      setDashboardNames(list);
      handleDashboardPick(list[0].index);
    } else {
      setDashboardNames([]);
      handleDashboardPick(null);
      setIsViewer(false); //if there are no dashboards hide delete dashboard and save layout buttons
    }
  };

  useEffect(()=> {
    console.log(dashboardNames);
  },[dashboardNames]);

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

  const handleDashboardPick = dashId => {
    let grid;
    grid = (
      <ResponsiveGrid permissions = {props.permissions}  onLayoutChange={setLayout} dashboardID={dashId} />
    );
    
    setResponsiveGrid(grid);
   setSelectedDashboard(dashId);
  };

  useEffect(()=> {
    if(dashboardNames!=null) {
      setCurrentDashName(dashboardNames.filter((dashboard)=>(dashboard.index==selectedDashboard))[0].name)
    }
    // console.log((dashboardNames!=null) ? dashboardNames.filter((dashboard) => (dashboard.index==selectedDashboard)).name : '');
  },[selectedDashboard]);
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

  
  const deleteDashboardHandler = async () => {
    let result = window.confirm('האם אתה בטוח?');
    if (result) {
      const result = await axios.delete(
        '/api/dashboard/delete-dashboard-by-id/' + selectedDashboard,
      );
      alert('!הדשבורד נמחק');
    }

    // setResponsiveGrid(<ResponsiveGrid onLayoutChange={setLayout} dashboardID={dashboardID} />);

    // setResponsiveGrid(<ResponsiveGrid onLayoutChange={setLayout} dashboardID={"1"} />);  להחזיר לדשבורד 1

    window.location.href = '/'; // לחזור אל הדף והוא טוען את דשבורד 1
  };

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
                  onClick={() => handleDashboardPick(dashboard.index)}
                >
                  {dashboard.name}
                </Dropdown.Item>
              );
            }) : ''}
          </DropdownButton>
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
      
      <div className ="dashboard-title">
      <hr/>
        {currentDashName}
        
      <hr/>
      </div>
      {responsiveGrid}
    </div>
  );
};

const mapStateToProps = ({
  auth: {
    user: { permissions },
  },
}) => ({ permissions });

export default connect(mapStateToProps)(DashboardTabs);
