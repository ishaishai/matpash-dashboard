import React, { useState, useEffect } from 'react';
import './CreateChart.css';
import Chart from '../Dashboard/Charts';
import Highcharts from 'highcharts';
import {
  Button,
  Form,
  Navbar,
  Nav,
  Dropdown,
  DropdownButton,
} from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateChart = props => {
  let Type = 'line';

  const [title, setTitle] = useState('כותרת');
  const [subTitle, setSubTitle] = useState('תת כותרת');
  const [confirmButton, setConfirmButton] = useState(true);
  const [dropdownSelection, setDropdownSelection] = useState('בחירת דשבורד');
  const [tableNames, setTableNames] = useState([]);
  const [dashboardNames, setDashboardNames] = useState([]);
  const [colNames, setColNames] = useState([]);
  // const [Type, setType] = useState("line");

  const [chart, setChart] = useState({
    id: 1,
    chart: {
      events: {
        load: function () {
          let btn = document.getElementsByClassName('btn');
          let chart = this;
          for (let j = 0; j < btn.length; j++) {
            btn[j].addEventListener('click', () => {
              Type = btn[j].id;
              for (let i = 0; i < chart.series.length; i++) {
                chart.series[i].update({
                  type: Type,
                });
              }
            });
          }
        },
      },
    },
    title: {
      text: title,
    },
    subtitle: {
      text: subTitle,
    },
    plotOptions: {
      series: {
        animation: {
          duration: 3000,
        },
      },
    },

    series: [
      {
        name: '1',
        data: [5, 3, 4, 7, 2],
      },
    ],
    legend: {
      position: 'right',
    },
    xAxis: {
      categories: ['מורים', 'אנשי ניקיון', 'הנהלה', 'תלמידים', 'הורים מבקרים'],
      labels: {
        style: {
          color: 'black',
        },
      },
    },
    yAxis: {
      title: {
        text: null,
      },
    },
  });

  const ListItem = ({ value, click }) => {
    return <option onClick={click}>{value}</option>;
  };

  const List = ({ items, click }) => (
    <Form.Group className="column">
      <Form.Control as="select" multiple>
        {items.map((item, i) => (
          <ListItem key={i} value={item} click={click} />
        ))}
      </Form.Control>
    </Form.Group>
  );

  let colName;
  let Table;
  let colData;
  const [selected, setSelection] = useState(colData);

  const changeTitle = event => {
    setTitle(event.target.value);
  };

  const changeSubTitle = event => {
    setSubTitle(event.target.value);
  };

  const handleDashboardSelection = event => {
    const selectedDashboard = event.target.innerHTML;
    setDropdownSelection(selectedDashboard);
    setConfirmButton(false);
  };

  useEffect(() => {
    fetchTableNames();
    fetchDashboardNames();
  }, []);

  const fetchTableNames = async () => {
    const response = await axios.get('http://localhost:5000/tables/get-names/');
    const names = response.data.tableList;
    setTableNames(names);
  };

  const fetchDashboardNames = async () => {
    const response = await axios.get(
      'http://localhost:5000/dashboard/get-dashboard-names'
    );
    const dashboardNames = response.data.dashboardIdList;
    setDashboardNames(dashboardNames);
  };

  const fetchColNames = async event => {
    colName = event.target.innerHTML;

    const response = await axios.get(
      'http://localhost:5000/tables/get-cols/' + colName
    );

    const colNames = response.data.colNamesList;
    setColNames(colNames);
    // setSelectedTable(colName)
    Table = colName;
    colData = <List items={colNames} click={fetchColData} />;

    setSelection(colData);
  };

  const fetchColData = async event => {
    const colName = event.target.value;
    console.log('col name: ' + colName);
    console.log('table name: ' + Table);
    const response = await axios.get(
      'http://localhost:5000/tables/get-col-data/' + Table + '/' + colName
    );
    const colNames = response.data.colNamesList;
    console.log(response.data);
  };

  // const saveChart = () => {
  //   const chartToSave = {
  //     layout: { height: 1, width: 1, xPos: 1, yPos:1, position: 1, layoutIndex: 1 },
  //     type: Type,
  //     title: title,
  //     subtitle: subTitle,
  //     xAxisTitle: xAxistitle,
  //     yAxisTitle: "",
  //     xAxisColumn: Table + "." + colName,
  //     yAxisColumn:
  //     xAxisCatagoryRange:
  //     yAxisCatagoryRange:
  //     legend: true
  // };

  return (
    <div>
      <div className="CreateChart">
        <Navbar
          expand="lg"
          variant={'dark'}
          className="justify-content-md-end navBar-Color"
        >
          <Navbar.Brand>סוגי טבלה</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto justify-content-lg-end" variant={'dark'}>
              <a className="nav-link" id="line" className="btn">
                Line
              </a>
              <a className="nav-link" id="bar" className="btn">
                Bar
              </a>
              <a className="nav-link" id="pie" className="btn">
                Pie
              </a>
              <a className="nav-link" id="area" className="btn">
                Area
              </a>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <div className="chartWrapDemo">
        <Chart
          className="chart"
          id={'chart-0'}
          options={chart}
          Highcharts={Highcharts}
        />
      </div>
      <div>
        <Form>
          <List click={fetchColNames} items={tableNames} />
        </Form>
        {selected}
      </div>
      <hr />
      <div className="vl" />
      <div className="title">
        <Form>
          <Form.Row>
            <Form.Group controlId="formGridCity">
              <Form.Label className="title">כותרת</Form.Label>
              <Form.Control onChange={changeTitle} className="title" />
              <Form.Label className="title">תת כותרת</Form.Label>
              <Form.Control onChange={changeSubTitle} className="title" />
              <DropdownButton
                type=""
                variant="success"
                title={dropdownSelection}
              >
                {dashboardNames.map((dashboard, i) => (
                  <Dropdown.Item
                    key={dashboard}
                    onClick={handleDashboardSelection}
                  >
                    {dashboard}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Form.Group>
            <DatePicker id="example-datepicker" />
          </Form.Row>
        </Form>
        <hr></hr>
        <Button
          variant="success "
          type=""
          className="text-lg-center buttonDesign"
          disabled={confirmButton}
        >
          אישור
        </Button>
      </div>
    </div>
  );
};

export default CreateChart;
