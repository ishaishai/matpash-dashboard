import React, { useState, useEffect } from 'react';
import './CreateChart.css';
import Chart from '../Dashboard/Charts';
import Highcharts from 'highcharts';
import { SketchPicker } from 'react-color';
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
import axios from 'axios';
import { connect } from 'react-redux';
import { Checkbox } from '@material-ui/core';
import { halfPieExample } from './ExampleCharts/halfPieExample';
import { pieExample } from './ExampleCharts/pieExample';
import { lineExample } from './ExampleCharts/lineExample';
import { columnExample } from './ExampleCharts/columnExample';
import { barExample } from './ExampleCharts/barExample';
import { areaExample } from './ExampleCharts/areaExample';

const hexToRgb = hex => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const ColorsAreClose = (color1, color2, threshold = 70) => {
  let a = hexToRgb(color1);
  let z = hexToRgb(color2);
  let r = parseInt(a.r - z.r);
  let g = parseInt(a.g - z.g);
  let b = parseInt(a.b - z.b);
  return r * r + g * g + b * b <= threshold * threshold;
};

const CreateChart = props => {
  let Type;
  const [navKey, setNavKey] = useState('6');
  const [toggleHalfPie, setToggleHalfPie] = useState(false);
  const [alertObj, setAlertObj] = useState({
    alertType: null,
    alertText: '',
    alertShow: false,
  });
  const [flipXAxis, setFlipXAxis] = useState(false);
  const [yAxisTitle, setYAxisTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  const [showDashboardNameLabel, setShowDashboardNameLabel] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('דשבורד');
  const [colDataList, setColDataList] = useState([]);
  const [piePeriodLabel, setPiePeriodLabel] = useState(
    ':בחר את תחילת תקופה הרצויה',
  );
  const [periodTableSelected, setPeriodTableSelected] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [dropdownSelection, setDropdownSelection] = useState('בחירת דשבורד');
  const [tableNames, setTableNames] = useState([]);
  const [dashboardNames, setDashboardNames] = useState([]);
  const [colNames, setColNames] = useState([]);
  const [type, setType] = useState('line');
  const [periodColumnFromRange, setPeriodColumnFromRange] = useState([]);
  const [periodColumnToRange, setPeriodColumnToRange] = useState([]);
  const [crossTableSelected, setCrossTableSelected] = useState('');
  const [crossColumns, setCrossColumns] = useState([]);
  const [crossColumnSelected, setCrossColumnSelected] = useState('');
  const [endPeriodSelected, setEndPeriodSelected] = useState('');
  const [startPeriodSelected, setStartPeriodSelected] = useState('');
  const [graphSeries, setGraphSeries] = useState([]);
  const graphSeriesRef = React.useRef(graphSeries);
  const colDataListRef = React.useRef(colDataList);
  const [color, setColor] = useState('#000000');
  const [options, setOptions] = useState(lineExample());
  const [chart, setChart] = useState(
    <Chart
      className="chart"
      id={'chart-0'}
      options={options}
      Highcharts={Highcharts}
    />,
  );

  let graphToAdd = {
    dashboardID: dropdownSelection,
    graph: {
      flip: flipXAxis,
      type: type,
      title: title,
      subtitle: subTitle,
      yAxisTitle: yAxisTitle,
      xAxisTitle: `${periodTableSelected}.A1`,
      xAxisColumn: `${periodTableSelected}.A1`,
      xAxisCatagoryRange:
        type !== 'pie'
          ? `${endPeriodSelected}$${startPeriodSelected}`
          : `${startPeriodSelected}`,
      series: graphSeries,
      info: infoText,
    },
  };

  useEffect(() => {
    fetchTableNames();
    fetchDashboardNames();
  }, []);

  const ListItem = ({ value, click }) => {
    return <option onClick={click}>{value}</option>;
  };

  let colData;
  const [selected, setSelection] = useState(colData);

  const handleDashboardName = event => {
    setNewDashboardName(event.target.value);
  };

  const handleTitle = event => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    setOptions(prev => ({
      ...prev,
      title: { text: title },
      subtitle: { text: subTitle },
      yAxis: {
        title: {
          text: yAxisTitle,
        },
      },
    }));
  }, [title, subTitle, yAxisTitle]);

  const handleSubTitle = event => {
    setSubTitle(event.target.value);
  };

  const handleDashboardSelection = event => {
    const selectedDashboard = event.target.innerHTML;
    console.log(selectedDashboard);
    if (selectedDashboard == 'דשבורד חדש') {
      setShowDashboardNameLabel(true);
    } else {
      setShowDashboardNameLabel(false);
    }
    setDropdownSelection(selectedDashboard);
  };

  const handleEndPeriodSelection = event => {
    const selectedEndPeriod = event.target.innerHTML;

    setEndPeriodSelected(selectedEndPeriod);
  };

  //Insert catagories range to the example graph
  useEffect(() => {
    let catagoriesRange;
    if (startPeriodSelected != '') {
      if (type != 'pie') {
        let i = periodColumnFromRange.indexOf(startPeriodSelected);
        let j = periodColumnFromRange.indexOf(endPeriodSelected);

        catagoriesRange = periodColumnFromRange.slice(i, j + 1);
      }
    }
    // setOptions(options => {
    //   options.xAxis.categories = catagoriesRange;
    //   return {
    //     ...options,
    //   };
    // });
  }, [endPeriodSelected]);

  const handleCrossColumnSelection = event => {
    const selectedColumn = event.target.innerHTML;
    setCrossColumnSelected(selectedColumn);
  };

  const handleColorChange = event => {
    setColor(event.target.value);
  };

  const fetchTableNames = async () => {
    const response = await axios.get('/api/tables/get-names/');
    const names = response.data;
    setTableNames(names);
  };

  const fetchDashboardNames = async () => {
    const response = await axios.get(
      '/api/dashboard/get-dashboard-names/create',
    );
    const dashboards = response.data.dashboardIdList;
    console.log(dashboards);
    //need to add if עורך so no new dashboard addition
    if (props.permissions === 'מנהל') {
      setDashboardNames([...dashboards.map(item => item.name), 'דשבורד חדש']);
    } else {
      if (dashboards == '') {
        alert('למשתמש אין גישה לשום דשבורד - הינך מועבר לדף הבית');
        window.location.href = '/';
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
    let tableSelected = periodTableSelected.replace(/'/g, "''");
    tableSelected = tableSelected.replace(/"/g, `""`);

    let response = await axios.get(
      '/api/tables/get-first-column/' + encodeURIComponent(tableSelected),
    );

    const column = response.data.column;
    let columnRange = column.columnData.map(value => Object.values(value)[0]);
    // for (let value of column.columnData) {
    //   columnRange.push(value.A1);
    // }

    setPeriodColumnFromRange(columnRange);
    setPeriodColumnToRange(columnRange);
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
    if (crossTableSelected != '') {
      fetchCrossColumn();
    }
  }, [crossTableSelected]);
  const handleCrossTableSelection = event => {
    let tableSelected = event.target.innerHTML;
    console.log(event.target.innerHTML);
    setCrossTableSelected(tableSelected);
  };

  const fetchCrossColumn = async () => {
    let tableSelected = crossTableSelected.replace(/'/g, "''");
    tableSelected = tableSelected.replace(/"/g, `""`);
    const response = await axios.get(
      '/api/tables/get-cols/' + encodeURIComponent(tableSelected),
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
    if (startPeriodSelected !== '') {
      if (type != 'pie') {
        fetchToPeriodColumn();
      }
    }
  }, [startPeriodSelected]);

  const HandleFromPeriodSelection = event => {
    let FromPeriodTableSelected = event.target.innerHTML;
    setStartPeriodSelected(FromPeriodTableSelected);
  };

  const fetchToPeriodColumn = async () => {
    let tableSelected = periodTableSelected.replace(/'/g, "''");
    tableSelected = tableSelected.replace(/"/g, `""`);

    let response = await axios.get(
      '/api/tables/get-first-column/' + encodeURIComponent(tableSelected),
    );

    const column = response.data.column;
    let columnRange = [];
    for (let value of column.columnData) {
      columnRange.push(value.A1);
    }

    setPeriodColumnToRange(columnRange);
  };

  const deleteCrossColumnFromArray = event => {
    let newGraphSeries = graphSeriesRef.current.filter(
      obj => obj.id != event.target.id,
    );
    let newColData = colDataListRef.current.filter(
      obj => obj.key != event.target.id,
    );
    setGraphSeries(newGraphSeries);
    setColDataList(newColData);
  };

  useEffect(() => {
    graphSeriesRef.current = graphSeries;
    console.log(graphSeries);
  }, [graphSeries]);

  useEffect(() => {
    colDataListRef.current = colDataList;
    console.log(colDataList);
  }, [colDataList]);

  const handleCrossData = () => {
    if (crossTableSelected === '') {
      alertTimeout(true, 'בחר טבלה להצלבה', 'fail');
    } else if (crossColumnSelected === '') {
      alertTimeout(true, 'בחר עמודה כסדרת מידע להצלבה', 'fail');
    } else {
      let item = (
        <ListGroup.Item key={colDataList.length + 1}>
          <Button
            className="button-danger"
            id={colDataList.length + 1}
            variant="danger"
            onClick={event => deleteCrossColumnFromArray(event)}
          >
            הסר
          </Button>
          <input
            id={colDataList.length + 1}
            type="color"
            className="color-picked"
            value={color}
            disabled
          />
          - צבע
          <br />
          שם טבלה - {crossTableSelected}
          <br />
          שם עמודה - {crossColumnSelected}
        </ListGroup.Item>
      );

      let seriename = `${crossTableSelected}.${
        crossColumns.find(obj => obj[1] === crossColumnSelected)[0]
      }`;
      let serie = {
        id: colDataList.length + 1,
        serieName: seriename,
        color: color,
      };

      for (let tmpSerie of graphSeries) {
        if (tmpSerie.serieName === serie.serieName) {
          console.log('AF');
          alertTimeout(true, 'העמודה שנבחרה כבר הוספה', 'fail');
          setCrossColumnSelected('');
          return;
        }
        if (ColorsAreClose(tmpSerie.color, serie.color)) {
          alertTimeout(true, 'הצבע הנבחר דומה לצבע קודם שנבחר', 'fail');
          return;
        }
      }

      setGraphSeries(graphSeries => [...graphSeries, serie]);
      setColDataList(colDataList => [...colDataList, item]);

      setCrossColumnSelected('');
      alertTimeout(true, 'עמודה להצלבה נוספה בהצלחה', 'success');
    }
  };

  const [Shown, setShown] = useState(true);

  useEffect(() => {
    if (type == 'pie' || type == 'halfpie') {
      setPiePeriodLabel(':בחר את התקופה הרצויה');
      setEndPeriodSelected('');
      setShown(false);
    } else {
      setPiePeriodLabel(':בחר את תחילת התקופה הרצויה');
      setShown(true);
    }
  }, [type]);

  const periodDropDownHandler = event => {
    setType(event.target.id);
    setOptions(
      event.target.id === 'pie'
        ? pieExample()
        : event.target.id === 'halfpie'
        ? halfPieExample()
        : event.target.id === 'line'
        ? lineExample()
        : event.target.id === 'column'
        ? columnExample()
        : event.target.id === 'bar'
        ? barExample()
        : event.target.id === 'area'
        ? areaExample()
        : null,
    );
    setChart(null);
  };

  useEffect(() => {
    console.log(options);
    setChart(
      <Chart
        className="chart"
        id={'chart-0'}
        options={options}
        Highcharts={Highcharts}
      />,
    );
  }, [options]);

  useEffect(() => {
    if (toggleHalfPie == true) {
      setType('pie');
      console.log(toggleHalfPie);
    }
  }, [toggleHalfPie]);

  const handleYAxisTitle = event => {
    setYAxisTitle(event.target.value);
  };

  const handleInfoBox = event => {
    setInfoText(event.target.value);
  };

  const handleGraphInfo = async event => {
    if (dropdownSelection === 'בחירת דשבורד') {
      alertTimeout(true, 'יש לבחור דשבורד אליו יתווסף הגרף', 'fail');
    } else if (periodTableSelected.length === 0) {
      alertTimeout(true, 'יש לבחור טבלה עבור תקופה', 'fail');
    } else if (startPeriodSelected.length === 0) {
      alertTimeout(true, 'יש לבחור את תחילת התקופה הרצויה', 'fail');
    } else if (
      type != 'pie' &&
      type != 'halfpie' &&
      endPeriodSelected.length === 0
    ) {
      alertTimeout(true, ' יש לבחור את סוף התקופה', 'fail');
    } else if (graphSeries.length === 0) {
      alertTimeout(true, 'יש להוסיף עמודות מידע', 'fail');
    } else {
      console.log('creating graph...');
      let newDashboardResponse = null;
      console.log(graphToAdd.graph);
      if (graphToAdd.dashboardID === 'דשבורד חדש') {
        let regexFixedDashName = newDashboardName.replace(/'/g, "''");

        console.log(regexFixedDashName, 'fixxed');
        const newDashboardResponse = await axios.post(
          '/api/dashboard/add-new-dashboard/',
          {
            dashboardName: regexFixedDashName,
          },
        );
        graphToAdd.dashboardID = newDashboardResponse.data.dashboardId;
      }
      console.log(graphToAdd);

      //duplicate " and ' for sql use in server
      graphToAdd.graph.info = graphToAdd.graph.info.replace(/'/g, "''");
      graphToAdd.graph.title = graphToAdd.graph.title.replace(/'/g, "''");
      graphToAdd.graph.subtitle = graphToAdd.graph.subtitle.replace(/'/g, "''");
      graphToAdd.graph.yAxisTitle = graphToAdd.graph.yAxisTitle.replace(
        /'/g,
        "''",
      );
      graphToAdd.graph.xAxisTitle = graphToAdd.graph.xAxisTitle
        .replace(/'/g, "''")
        .replace(/"/g, `""`);
      graphToAdd.graph.xAxisColumn = graphToAdd.graph.xAxisColumn
        .replace(/'/g, "''")
        .replace(/"/g, `""`);

      for (let serie of graphToAdd.graph.series) {
        serie.serieName = serie.serieName
          .replace(/'/g, "''")
          .replace(/"/g, `""`);
      }

      const response = await axios.post(
        '/api/dashboard/add-new-graph-to-dashboard/',
        {
          dashboardId: graphToAdd.dashboardID,
          graph: graphToAdd.graph,
        },
      );
      alert('הגרף נוצר');
      window.location.href = '/create-chart';
    }
  };

  const alertTimeout = (show, text, type) => {
    setAlertObj({
      alertShow: show,
      alertText: text,
      alertType: type,
    });
    const sleep = m => new Promise(r => setTimeout(r, m));
    (async () => {
      await sleep(3500);
      setAlertObj({
        alertShow: false,
        alertText: '',
        alertType: 'success',
      });
    })();
  };

  return (
    <div className="main-div">
      <div className="CreateChart">
        <Navbar
          expand="lg"
          variant={'dark'}
          className="justify-content-md-end navBar-Color"
        >
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
                id="halfpie"
                eventKey="2"
                onClick={periodDropDownHandler}
              >
                חצי עוגה
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="pie"
                eventKey="3"
                onClick={periodDropDownHandler}
              >
                עוגה
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="area"
                eventKey="4"
                onClick={periodDropDownHandler}
              >
                שטח
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="column"
                eventKey="5"
                onClick={periodDropDownHandler}
              >
                עמודות - אנכי
              </Nav.Link>
              <Nav.Link
                className="nav-link btn"
                id="line"
                eventKey="6"
                onClick={periodDropDownHandler}
              >
                לינארי
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Brand>- סוגי טבלה</Navbar.Brand>
        </Navbar>
      </div>
      <Container fluid="true">
        <Row sm>
          <Col className="chart-demo-col">
            <div id="exampleContainer">{chart}</div>
            {/* {chart} */}
            {/* <Chart
              className="chart"
              id={'chart-0'}
              options={options}
              Highcharts={Highcharts}
            /> */}
          </Col>
          <Col>
            <Container className="main-container">
              <Row className="form-row">
                <Form.Label className="title">:בחר דשבורד</Form.Label>

                <DropdownButton
                  className="dropdown-btn choose-dash-btn"
                  type=""
                  variant="outline-primary"
                  title={dropdownSelection}
                >
                  {dashboardNames.map((dashboard, i) => (
                    <Dropdown.Item
                      key={dashboard}
                      onClick={handleDashboardSelection}
                      className="dropDownItem"
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
                <Col className="form-col">
                  {showDashboardNameLabel && (
                    <Form.Control
                      size="md"
                      placeholder="שם דשבורד"
                      onBlur={handleDashboardName}
                      className="dash-title-input"
                    />
                  )}
                </Col>
              </Row>
              <Row className="form-row">
                <Col>
                  <Form.Label className="FormLabel">
                    :בחר טבלה עבורה תיבחר התקופה
                  </Form.Label>
                  <DropdownButton
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
              </Row>
              <Row className="form-row">
                <Col>
                  <Form.Label className="FormLabel">
                    {piePeriodLabel}
                  </Form.Label>
                  <DropdownButton
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
                        className="dropDownItem"
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
                <Col>
                  <Form.Label className="FormLabel">
                    :להיפוך ציר הזמן{' '}
                  </Form.Label>
                  {/* <input className="xAxisFlip" type="checkbox" checked={flipXAxis} value="" key="" onClick={()=> setFlipXAxis(!flipXAxis)}/>:להיפוך ציר הזמן */}
                  <Checkbox
                    className="xAxisFlip"
                    color="primary"
                    checked={flipXAxis}
                    onChange={() => setFlipXAxis(!flipXAxis)}
                  />
                </Col>
              </Row>
              <Row className="form-row">
                <Col>
                  <Form.Label className="FormLabel">
                    :בחר טבלה עבור סדרת המידע
                  </Form.Label>
                  <DropdownButton
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
              <Row className="form-row" style={{ paddingLeft: '10%' }}>
                {Shown ? (
                  <Col className="form-col" style={{ paddingBottom: '5%' }}>
                    <Form.Label className="FormLabel">
                      :כותרת ציר אנכי
                    </Form.Label>
                    <Form.Control
                      size="lg"
                      placeholder="כותרת"
                      onBlur={handleYAxisTitle}
                      className="ytitle-input"
                    />
                  </Col>
                ) : null}
                <Col xs={6} className="form-col">
                  <Form.Label className="FormLabel">
                    :טקסט לתיאור הגרף (אופציונלי)
                  </Form.Label>
                  <Form.Control
                    className="textDescription"
                    as="textarea"
                    rows={4}
                    cols={20}
                    style={{ width: '100%' }}
                    onBlur={handleInfoBox}
                  />
                </Col>
              </Row>
              <Row className="form-row" style={{ height: '108px' }}>
                <Col className="form-col">
                  <Form.Label className="FormLabel">:כותרת הגרף</Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="כותרת"
                    onBlur={handleTitle}
                    className="title-input"
                  />
                </Col>
                <Col>
                  <Form.Label className="FormLabel">:תת כותרת הגרף</Form.Label>
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

      <ListGroup style={{ width: '40% !important' }}>{colDataList}</ListGroup>

      <div
        className={
          alertObj.alertType == 'success'
            ? 'ui message green'
            : 'ui message red'
        }
        style={{ display: alertObj.alertShow ? 'inline-block' : 'none' }}
      >
        {<p>{alertObj.alertText}</p>}
      </div>
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
