import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Tabs, Tab, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import ResponsiveGrid from './ResponsiveGrid';
import axios from 'axios';
import CreateChart from '../Menu/CreateChart';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const DashboardTabs = (props) => {
  const [layoutAfterChange,setLayoutAfterChange] = useState(null);
  let [dashboardID, setDashboardID] = useState(null);


  const [dashboardNames, setDashboardNames] = useState([]);

  const fetchDashboardNames = async () => {
    const response = await axios.get('/api/dashboard/get-dashboard-names/tabs');
    const dashboardNames = response.data.dashboardIdList;
    let list = [...response.data.dashboardIdList];
    console.log(list);
    if(list.length!=0) {
      let dash = list.map(obj => ({
        name: 'dashboard' + obj,
        id: obj,
      }));

      setDashboardNames(dashboardNames);
      console.log(dash);
      handleDashboardPick((dash) ? dash[0].id : null);
    }
    else { 
      setDashboardNames([]);
      handleDashboardPick(null);
    }
  };

  useEffect(() => {
    fetchDashboardNames();
  }, []);


  const handleDashboard = () => {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'), 2000);
    });
  };

  
  const setLayout = event => {
    
    setLayoutAfterChange(event);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };


  let grid;
  const [responsiveGrid, setResponsiveGrid] = useState(<ResponsiveGrid onLayoutChange={setLayout} dashboardID={null} />);

  const handleDashboardPick = dashboardID => {
    setSelectedDashboard(dashboardID);
    grid = (
      <ResponsiveGrid onLayoutChange={setLayout} dashboardID={dashboardID} />
    );

    console.log(grid);
    setResponsiveGrid(grid);
  };

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

  const [selectedDashboard, setSelectedDashboard] = useState(null);


  const deleteDashboardHandler = async () => {
    let result = window.confirm('האם אתה בטוח?');
    if(result){
    const result = await axios.delete(
      '/api/dashboard/delete-dashboard-by-id/' + selectedDashboard,
    );
    alert('!הדשבורד נמחק');
    }

    setResponsiveGrid(<ResponsiveGrid onLayoutChange={setLayout} dashboardID={dashboardID} />);
    
    
    // setResponsiveGrid(<ResponsiveGrid onLayoutChange={setLayout} dashboardID={"1"} />);  להחזיר לדשבורד 1

    // window.location.href="/" לחזור אל הדף והוא טוען את דשבורד 1

  };


  return (
    <div>
      <div className="btnWrapper">
       <Button className="saveLayoutBtn" onClick={saveLayout}>
        שמור תבנית
      </Button>
      <div className="dashboardDropDown">
        <DropdownButton id="dropdown" title="דשבורדים">
          {dashboardNames.map(dashboard => {
            return (
              <Dropdown.Item
                key={dashboard}
                onClick={() => handleDashboardPick(dashboard)}
              >
                {dashboard}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <Button className="saveLayoutBtn" variant="outline-danger" onClick={deleteDashboardHandler}>מחיקת דשבורד</Button>
      </div>
      {responsiveGrid}
    </div>
  );
};


export default DashboardTabs;
