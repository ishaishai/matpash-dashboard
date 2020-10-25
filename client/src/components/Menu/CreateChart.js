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
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import axios from 'axios';
import { connect } from 'react-redux';

const CreateChart = props => {
  let Type;
  const [navKey, setNavKey] = useState('5');
  const [graphTypeArray, setGraphTypeArray] = useState([
    'pie',
    'bar',
    'line',
    'area',
    'column',
  ]);
  const [periodTableSelected, setPeriodTableSelected] = useState([]);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [confirmButton, setConfirmButton] = useState(true);
  const [dropdownSelection, setDropdownSelection] = useState('בחירת דשבורד');
  const [tableNames, setTableNames] = useState([]);
  const [dashboardNames, setDashboardNames] = useState([]);
  const [colNames, setColNames] = useState([]);
  const [type, setType] = useState('line');
  const [periodColumnFromRange, setPeriodColumnFromRange] = useState([]);
  const [periodColumnToRange, setPeriodColumnToRange] = useState([]);
  const [crossTableSelected, setCrossTableSelected] = useState([]);
  const [crossColumns, setCrossColumns] = useState([]);
  const [crossColumnSelected, setCrossColumnSelected] = useState([]);
  const [endPeriodSelected, setEndPeriodSelected] = useState([]);
  const [startPeriodSelected, setStartPeriodSelected] = useState([]);
  const [graphSeries, setGraphSeries] = useState([]);
  const [color, setColor] = useState('#FFFFFF');
  const [options, setOptions] = useState({
    id: 1,
    chart: {
      events: {
        load: function () {
          let btn = document.getElementsByClassName('btn');
          let chart = this;
          for (let btntmp of btn) {
            if (
              btntmp.id === 'area' ||
              btntmp.id === 'pie' ||
              btntmp.id === 'bar' ||
              btntmp.id === 'line' ||
              btntmp.id === 'column'
            ) {
              btntmp.addEventListener('click', () => {
                Type = btntmp.id;
                //setType(Type);
                //

                for (let i = 0; i < chart.series.length; i++) {
                  chart.series[i].update({ type: Type });
                }
              });
              chart.redraw();
            }
          }

          //  for (let j = 0; j < btn.length; j++) {
          //    btn[j].addEventListener('click', () => {
          //      Type = btn[j].id;
          //      //setType(Type);
          //     //
          //     for(let i=0;i<chart.series.length;i++) {
          //       chart.series[i].update({ type: Type});
          //     }
          //    });
          //  }
        },
      },
      type: type,
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
        data:
          type !== 'pie'
            ? [5, 3, 4, 7, 2]
            : [
                {
                  name: '1',
                  seleced: false,
                  sliced: false,
                  y: '25%',
                },
                {
                  name: '2',
                  seleced: false,
                  sliced: false,
                  y: '35%',
                },
                {
                  name: '3',
                  seleced: false,
                  sliced: false,
                  y: '40%',
                },
              ],
      },
    ],
    legend: {
      position: 'right',
    },
    xAxis: {
      catagories: periodColumnFromRange,
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

  let graphToAdd = {
    dashboardID: dropdownSelection,
    graph: {
      type: type,
      title: title,
      subtitle: subTitle,
      xAxisTitle: `${periodTableSelected}.A1`,
      xAxisColumn: `${periodTableSelected}.A1`,
      xAxisCatagoryRange:
        type !== 'pie'
          ? `${endPeriodSelected}$${startPeriodSelected}`
          : `${startPeriodSelected}`,
      series: graphSeries,
    },
  };

  const [chart, setChart] = useState(options);

  useEffect(() => {
    fetchTableNames();
    fetchDashboardNames();
  }, []);

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

  let colData;
  const [selected, setSelection] = useState(colData);

  const handleTitle = event => {
    setTitle(event.target.value);
  };

  const handleSubTitle = event => {
    setSubTitle(event.target.value);
  };

  const handleDashboardSelection = event => {
    const selectedDashboard = event.target.innerHTML;
    setDropdownSelection(selectedDashboard);
    setConfirmButton(false);
  };

  const handleEndPeriodSelection = event => {
    const selectedEndPeriod = event.target.innerHTML;
    setEndPeriodSelected(selectedEndPeriod);
  };

  const handleCrossColumnSelection = event => {
    const selectedColumn = event.target.innerHTML;
    setCrossColumnSelected(selectedColumn);
  };

  const handleColorChange = event => {
    setColor(event.target.value);
  };

  const fetchTableNames = async () => {
    const response = await axios.get('/api/tables/get-names/');
    const names = response.data.tableList;
    setTableNames(names);
  };

  const fetchDashboardNames = async () => {
    const response = await axios.get(
      '/api/dashboard/get-dashboard-names/create',
    );
    const dashboards = response.data.dashboardIdList;
    console.log(response.data);
    //need to add if עורך so no new dashboard addition
    if(props.permissions === 'מנהל'){
      setDashboardNames([...dashboards, 'דשבורד חדש']);
    }else{
      if(dashboards === ''){
        alert('למשתמש אין גישה לשום דשבורד - הינך מועבר לדף הבית');
        window.location.href="/"
      }
      setDashboardNames([...dashboards]);
    }
   
  };

  // const [selectedTable,setSelectedTable] = useState();

  let Table;
  const fetchColNames = async event => {
    const colName = event.target.innerHTML;
    const response = await axios.get('/api/tables/get-cols/' + colName);
    const colNames = response.data.colNamesList;
    setColNames(colNames);
    // setSelectedTable(colName)
    // Table = colName;
    // colData = <List items={colNames} click={fetchColData} />;
    // setSelection(colData);
  };

  const fetchPeriodColumn = async () => {
    let response = await axios.get(
      '/api/tables/get-first-column/' + encodeURIComponent(periodTableSelected),
    );

    const column = response.data.column;
    let columnRange = column.columnData.map(value => Object.values(value)[0]);
    // for (let value of column.columnData) {
    //   columnRange.push(value.A1);
    // }

    setPeriodColumnFromRange(columnRange);
    setPeriodColumnToRange(columnRange);
    let tmpOptions = options;
    tmpOptions.xAxis.catagories = columnRange;
    setOptions(tmpOptions);
  };

  const fetchColData = async event => {
    const colName = event.target.value;
    const response = await axios.get(
      '/api/tables/get-col-data/' + Table + '/' + colName,
    );
    const colNames = response.data.colNamesList;
    // console.log(response.data);
  };

  useEffect(() => {
    if (crossTableSelected !== '') {
      fetchCrossColumn();
    }
  }, [crossTableSelected]);
  const handleCrossTableSelection = event => {
    let tableSelected = event.target.innerHTML;
    setCrossTableSelected(tableSelected);
  };

  const fetchCrossColumn = async () => {
    const response = await axios.get(
      '/api/tables/get-cols/' + encodeURIComponent(crossTableSelected),
    );

    const columns = response.data.colNamesList;

    let crossColumnsList = [];
    for (let value of Object.entries(columns)) {
      crossColumnsList.push(value);
    }
    console.log(crossColumnsList);
    setCrossColumns(crossColumnsList);
  };

  useEffect(() => {
    if (periodTableSelected !== '') {
      fetchPeriodColumn();
    }
  }, [periodTableSelected]);

  const handlePeriodTableSelection = event => {
    let selectedPeriodTable = event.target.innerHTML;
    setPeriodTableSelected(selectedPeriodTable);
    setStartPeriodSelected('');
    setEndPeriodSelected('');
  };

  useEffect(() => {
    if (startPeriodSelected !== '') fetchToPeriodColumn();
  }, [startPeriodSelected]);

  const HandleFromPeriodSelection = event => {
    let FromPeriodTableSelected = event.target.innerHTML;
    console.log(event.target.innerHTML);
    setStartPeriodSelected(FromPeriodTableSelected);
  };

  const fetchToPeriodColumn = async () => {
    // const response = await axios.get(
    //   '/api/tables/get-period-end/' +
    //     encodeURIComponent(periodTableSelected) +
    //     '/' +
    //     encodeURIComponent(startPeriodSelected),
    // );

    const response = await axios.get(
      '/api/tables/get-first-column/' + encodeURIComponent(periodTableSelected),
    );

    const column = response.data.column;
    let columnRange = [];
    for (let value of column.columnData) {
      columnRange.push(value.A1);
    }

    setPeriodColumnToRange(columnRange);
  };

  useEffect(() => {
    console.log(graphSeries);
  }, [graphSeries]);
  const handleCrossData = () => {
    if (crossTableSelected === '') {
      alert('בחר טבלה');
    } else if (crossColumnSelected === '') {
      alert('בחר עמודה');
    } else {
      let seriename = `${crossTableSelected}.${
        crossColumns.find(obj => obj[1] === crossColumnSelected)[0]
      }`;
      let serie = {
        serieName: seriename,
        color: color,
      };

      setGraphSeries(graphSeries => [...graphSeries, serie]);
      setCrossColumnSelected([]);
      alert("!המידע נוסף לגרף בהצלחה")
    }
  };

  const [Shown, setShown] = useState(true);

  useEffect(() => {
    //options.chart.type cannot be set directly using type for some reason, so made this to set it:
    setOptions(options => {
      options.chart.type = type;
      return {
        ...options,
      };
    });

    if (type === 'pie') {
      setEndPeriodSelected('');
      setShown(false);
    } else {
      setShown(true);
    }
  }, [type]);
  const periodDropDownHandler = event => {
    setType(event.target.id);
  };

  const selectedTypeHandler = event => {
    console.log('event');
  };

  const handleGraphInfo = async event => {
    /////////////add try catch

    if (dropdownSelection === '') {
      alert('יש לבחור דשבורד');
    } else if (periodTableSelected.length === 0) {
      alert('יש לבחור טבלה עבור תקופה');
    } else if (startPeriodSelected.length === 0) {
      alert('יש לבחור את תחילת התקופה הרצויה');
    } else if (type !== 'pie' && endPeriodSelected.length === 0) {
      alert(' יש לבחור את סוף התקופה');
    } else if (graphSeries.length === 0) {
      alert('יש להוסיף עמודות מידע');
    } else {
      console.log('creating graph...');
      let newDashboardResponse = null;
      console.log(graphToAdd.graph);
      if (graphToAdd.dashboardID === 'דשבורד חדש') {
        const newDashboardResponse = await axios.post(
          '/api/dashboard/add-new-dashboard/',
        );
        graphToAdd.dashboardID = newDashboardResponse.data.dashboardId;
      }
      const response = await axios.post(
        '/api/dashboard/add-new-graph-to-dashboard/',
        {
          dashboardId: graphToAdd.dashboardID,
          graph: graphToAdd.graph,
        },
      );
      alert('!הגרף נוצר');
      window.location.href = '/create-chart';
    }
  };

  return (
    <div className="main-div">
      <div className="CreateChart">
        <Navbar
          expand="lg"
          variant={'dark'}
          className="justify-content-md-end navBar-Color"
        >
          <Navbar.Brand>סוגי טבלה</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav
              activeKey={navKey}
              className="ml-auto justify-content-lg-end"
              variant={'dark'}
              onSelect={event => {
                setNavKey(event);
              }}
            >
              <Nav.Link
                className="nav-link btn"
                id="bar"
                eventKey="1"
                onClick={periodDropDownHandler}
              >
                עמודות - אופקי
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="pie"
                eventKey="2"
                onClick={periodDropDownHandler}
              >
                עוגה
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="area"
                eventKey="3"
                onClick={periodDropDownHandler}
              >
                שטח
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="column"
                eventKey="4"
                onClick={periodDropDownHandler}
              >
                עמודות - אנכי
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="line"
                eventKey="5"
                onClick={periodDropDownHandler}
              >
                לינארי
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
      <Container fluid="true">
        <Row sm>
          <Col className="chart-demo-col">
            <Chart
              className="chart"
              id={'chart-0'}
              options={options}
              Highcharts={Highcharts}
            />
          </Col>
          <Col>
            <Container className="main-container">
              <Row className="form-row">
                <Form.Label className="title">:בחר דשבורד</Form.Label>
                <DropdownButton
                  alignRight
                  className="choose-dash-btn"
                  type=""
                  variant="outline-primary"
                  title={
                    dropdownSelection === '' ? 'DropDown' : dropdownSelection
                  }
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
                <Form className="upload-picture">
                  <Form.File
                    id="custom-file-translate-scss"
                    label="העלאת תמונה"
                    lang="en"
                    custom
                  />
                </Form>
              </Row>
              <Row className="form-row">
                <Col>
                  <Form.Label className="FormLabel">
                    :בחר טבלה עבורה תיבחר התקופה
                  </Form.Label>
                  <DropdownButton
                    alignRight
                    className="dropdown-btn"
                    type=""
                    variant="outline-primary"
                    title={
                      periodTableSelected === '' ? 'בחר' : periodTableSelected
                    }
                  >
                    {tableNames.map((dashboard, i) => (
                      <Dropdown.Item
                        key={dashboard}
                        onClick={handlePeriodTableSelection}
                      >
                        {dashboard}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col>
                  <Form.Label className="FormLabel">
                    :בחר את תחילת התקופה הרצויה
                  </Form.Label>
                  <DropdownButton
                    alignRight
                    className="dropdown-btn"
                    type=""
                    variant="outline-primary"
                    title={
                      startPeriodSelected === '' ? 'בחר' : startPeriodSelected
                    }
                  >
                    {periodColumnFromRange.map((dashboard, i) => (
                      <Dropdown.Item
                        key={dashboard}
                        onClick={HandleFromPeriodSelection}
                      >
                        {dashboard}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col>
                  {Shown ? (
                    <div>
                      <Form.Label className="FormLabel">
                        :בחר את סוף התקופה (השאר ריק לעדכון חי)
                      </Form.Label>
                      <DropdownButton
                        alignRight
                        className="dropdown-btn"
                        type=""
                        variant="outline-primary"
                        title={
                          endPeriodSelected === '' ? 'בחר' : endPeriodSelected
                        }
                      >
                        {periodColumnToRange.map((dashboard, i) => (
                          <Dropdown.Item
                            key={dashboard}
                            onClick={handleEndPeriodSelection}
                          >
                            {dashboard}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </div>
                  ) : null}
                </Col>
              </Row>
              <Row className="form-row">
                <Col>
                  <Form.Label className="FormLabel">
                    :עמודות המידע להצלבה בחר טבלה עבור המידע
                  </Form.Label>
                  <DropdownButton
                    alignRight
                    className="dropdown-btn"
                    type=""
                    variant="outline-primary"
                    title={
                      crossTableSelected === '' ? 'בחר' : crossTableSelected
                    }
                  >
                    {tableNames.map((dashboard, i) => (
                      <Dropdown.Item
                        key={dashboard}
                        onClick={handleCrossTableSelection}
                      >
                        {dashboard}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col>
                  <Form.Label className="FormLabel">:בחר עמודה</Form.Label>
                  <DropdownButton
                    alignRight
                    className="dropdown-btn"
                    type=""
                    variant="outline-primary"
                    title={
                      crossColumnSelected === '' ? 'בחר' : crossColumnSelected
                    }
                  >
                    {crossColumns.map((columnObject, i) => (
                      <Dropdown.Item
                        key={columnObject}
                        onClick={handleCrossColumnSelection}
                      >
                        {columnObject[1]}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </Col>
                <Col className="color-picker-col">
                  <Form.Label className="FormLabel">:צבע</Form.Label>
                  <input
                    type="color"
                    className="color-picker"
                    onBlur={handleColorChange}
                  />
                  <Button
                    variant="primary"
                    type=""
                    className="add-column-btn"
                    onClick={handleCrossData}
                  >
                    הוסף עמודות מידע
                  </Button>
                </Col>
              </Row>
              <Row className="form-row" style={{ height: '108px' }}>
                <Col className="form-col">
                  <Form.Control
                    size="lg"
                    placeholder="כותרת"
                    onBlur={handleTitle}
                    className="title-input"
                  />
                </Col>
                <Col>
                  <Form.Control
                    size="lg"
                    placeholder="תת כותרת"
                    className="title-input"
                    onBlur={handleSubTitle}
                  />
                </Col>
                <Col>
                  <Button
                    variant="primary "
                    type=""
                    className="add-graph-btn"
                    block="true"
                    disabled={confirmButton}
                    onClick={handleGraphInfo}
                  >
                    הוסף גרף
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};



const mapStateToProps = ({
  auth: {
    user: { permissions },
  },
}) => ({ permissions });

export default connect(mapStateToProps)(CreateChart);
// export default CreateChart;