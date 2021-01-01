import React, { useState, useEffect, useRef } from 'react';
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

const CreateGolden = props => {
  const [tableNames, setTableNames] = useState([]);
  const [crossColumns, setCrossColumns] = useState([]);
  const [crossTableSelected, setCrossTableSelected] = useState('');
  const [crossColumnSelected, setCrossColumnSelected] = useState('');
  const [colDataList, setColDataList] = useState([]);
  const [crossColumnsData, setCrossColumnsData] = useState([]);
  const [periodSelected, setPeriodSelected] = useState('');
  const [cmpPeriodSelected, setCmpPeriodSelected] = useState('');
  const [periodColumnRange, setPeriodColumnRange] = useState([]);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [alertObj, setAlertObj] = useState({
    alertType: null,
    alertText: '',
    alertShow: false,
  });
  const [valueSelected, setValueSelected] = useState('נתון כמספר');

  const valueOptions = [
    `נתון כמספר`,
    `מש"ח - ₪`,
    `מיש"ח - ₪`,
    `מ"ד - $`,
    `מל"ד - $`,
    `אחוזים - %`,
  ];

  const colDataListRef = React.useRef(colDataList);

  const fetchTableNames = async () => {
    const response = await axios.get('/api/tables/get-names/');
    const names = response.data;
    setTableNames(names);
  };

  const fetchPeriodColumn = async () => {
    if (crossTableSelected != '') {
      let tableSelected = crossTableSelected.replace(/'/g, "''");
      tableSelected = tableSelected.replace(/"/g, `""`);

      let response = await axios.get(
        '/api/tables/get-first-column/' + encodeURIComponent(tableSelected),
      );

      const column = response.data.column;
      let columnRange = column.columnData.map(value => Object.values(value)[0]);
      // for (let value of column.columnData) {
      //   columnRange.push(value.A1);
      // }

      setPeriodColumnRange(columnRange);
    }
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

  const handleCrossColumnSelection = event => {
    const selectedColumn = event.target.innerHTML;
    setCrossColumnSelected(selectedColumn);
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

  const handlePeriodSelection = event => {
    setPeriodSelected(event.target.innerHTML);
  };

  const handleCMPPeriodSelection = event => {
    setCmpPeriodSelected(event.target.innerHTML);
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

  const handleCrossData = () => {
    if (crossTableSelected === '') {
      alertTimeout(true, 'בחר טבלה לניטור', 'fail');
    } else if (crossColumnSelected === '') {
      alertTimeout(true, 'בחר עמודה לניטור', 'fail');
    } else if (periodSelected === '') {
      alertTimeout(true, 'בחר תקופה לניטור', 'fail');
    } else if (cmpPeriodSelected === '') {
      alertTimeout(true, 'בחר תקופה להשוואה', 'fail');
    } else if (valueSelected === '') {
      alertTimeout(true, 'בחר את ערך הנתון שיוצג', 'fail');
    } else if (subTitle === '') {
      alertTimeout(true, 'מלא את שדה תת הכותרת עבור העמודה שנבחרה');
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
          <div style={{ textAlign: 'right', direction: 'rtl' }}>
            <b>כותרת העמודה </b>- {subTitle}
            <br />
            <b>שם טבלה </b>- {crossTableSelected}
            <br />
            <b>שם עמודה </b>- {crossColumnSelected}
            <br />
            <b>תקופה </b>- {periodSelected}
            <br />
            <b>תקופה להשוואה </b>- {cmpPeriodSelected}
            <br />
            <b>ערך הנתון הנבחר </b>- {valueSelected}
          </div>
        </ListGroup.Item>
      );

      let seriename = `${crossTableSelected}.${
        crossColumns.find(obj => obj[1] === crossColumnSelected)[0]
      }`;
      console.log(seriename);

      for (let data of crossColumnsData) {
        if (data.serieName === seriename) {
          alertTimeout(true, 'העמודה שנבחרה כבר הוספה', 'fail');
          setCrossColumnSelected('');
          return;
        }
      }
      console.log(`${crossTableSelected}.${crossColumnSelected}`);
      const column = {
        key: colDataList.length + 1,
        subTitle: subTitle,
        serieName: seriename,
        period: periodSelected,
        cmpPeriod: cmpPeriodSelected,
      };

      setColDataList(colDataList => [...colDataList, item]);
      setCrossColumnsData(crossColumnsData => [...crossColumnsData, column]);
      setCrossColumnSelected('');
      setPeriodSelected('');
      setCrossTableSelected('');
      setCrossColumns([]);
      setPeriodColumnRange([]);
      setSubTitle('');
      alertTimeout(true, 'עמודה להצלבה נוספה בהצלחה', 'success');
    }
  };

  const handleSubTitle = event => {
    setSubTitle(event.target.value);
  };

  const handleValueSelected = event => {
    setValueSelected(event.target.innerHTML);
  };

  const handleTitle = event => {
    setTitle(event.target.value);
  };

  const handleGoldenInfo = async event => {
    if (colDataList.length === 0) {
      alertTimeout(true, 'יש להוסיף מידע לניטור קודם', 'fail');
    } else {
      console.log('creating golden...');

      //duplicate " and ' for sql use in server
      for (let serie of crossColumnsData) {
        serie.serieName = serie.serieName
          .replace(/'/g, "''")
          .replace(/"/g, `""`);
      }

      console.log(crossColumnsData);

      const response = await axios.post('/api/dashboard/add-new-golden/', {
        goldenData: {
          title: title,
          data: crossColumnsData,
          valueType: valueSelected,
        },
      });
      alert('המוניטור נוצר');
      window.location.href = '/create-golden';
    }
  };

  const deleteCrossColumnFromArray = event => {
    console.log(event.target.id);
    let newColData = colDataListRef.current.filter(
      obj => obj.key != event.target.id,
    );
    let newCrossColumns = crossColumnsData.filter(
      obj => obj.key != event.target.id,
    );
    setColDataList(newColData);
    setCrossColumnsData(newCrossColumns);
    alertTimeout(true, 'עמודה הוסרה בהצלחה', 'success');
  };

  useEffect(() => {
    colDataListRef.current = colDataList;
    console.log(colDataList);
  }, [colDataList]);

  useEffect(() => {
    fetchPeriodColumn();
  }, [crossTableSelected]);

  useEffect(() => {
    fetchTableNames();
  }, []);

  return (
    <div className="main-div" style={{ paddingTop: '3%' }}>
      <div className="container" dir="rtl" style={{ marginTop: '50px' }}>
        <form className="ui error form">
          <h2 className="ui dividing header">יצירת מוניטור</h2>
          <h6 style={{ marginRight: '1%' }}>
            {' '}
            * יוצג מעל מסך הדשבורד הפעיל *{' '}
          </h6>
          <Container fluid="true">
            <Row sm>
              <Col>
                <Container
                  className="main-container"
                  style={{ direction: 'ltr' }}
                >
                  <Row className="form-row" style={{ height: '108px' }}>
                    <Col className="form-col">
                      <Form.Label className="FormLabel">
                        :כותרת המוניטור
                      </Form.Label>
                      <Form.Control
                        size="lg"
                        placeholder="כותרת"
                        onBlur={handleTitle}
                        className="title-input"
                      />
                    </Col>
                    <Col md="auto">
                      <Form.Label className="FormLabel">
                        :בחר את ערך הנתון שיוצג (נתון כמספר, מש"ח, מיש"ח, מ"ד,
                        מל"ד, אחוזים)
                      </Form.Label>
                      <DropdownButton
                        className="dropdown-btn"
                        type=""
                        variant="outline-primary"
                        title={valueSelected === '' ? 'בחר' : valueSelected}
                      >
                        {valueOptions.map((option, i) => (
                          <Dropdown.Item
                            key={i}
                            onClick={handleValueSelected}
                            className="dropDownItem"
                          >
                            {option}
                          </Dropdown.Item>
                        ))}
                      </DropdownButton>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
            <Row sm>
              <Col>
                <Container
                  className="main-container"
                  style={{ direction: 'ltr' }}
                >
                  <Row className="form-row">
                    <Col>
                      <Row className="inner-row">
                        <Col>
                          <Form.Label className="FormLabel">
                            בחר טבלה עבור סדרת המידע:
                          </Form.Label>
                          <DropdownButton
                            className="dropdown-btn"
                            type=""
                            variant="outline-primary"
                            title={
                              crossTableSelected === ''
                                ? 'בחר'
                                : crossTableSelected
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
                          <Form.Label className="FormLabel">
                            בחר עמודה:
                          </Form.Label>
                          <DropdownButton
                            className="dropdown-btn"
                            type=""
                            variant="outline-primary"
                            title={
                              crossColumnSelected === ''
                                ? 'בחר'
                                : crossColumnSelected
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
                        <Col>
                          <Form.Label className="FormLabel">
                            בחר את התקופה הרצויה:
                          </Form.Label>
                          <DropdownButton
                            className="dropdown-btn"
                            type=""
                            variant="outline-primary"
                            title={
                              periodSelected === '' ? 'בחר' : periodSelected
                            }
                          >
                            {periodColumnRange.map((dashboard, i) => (
                              <Dropdown.Item
                                key={dashboard}
                                onClick={handlePeriodSelection}
                                className="dropDownItem"
                              >
                                {dashboard}
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                        </Col>
                        <Col>
                          <Form.Label className="FormLabel">
                            בחר את התקופה להשוואה:
                          </Form.Label>
                          <DropdownButton
                            className="dropdown-btn"
                            type=""
                            variant="outline-primary"
                            title={
                              cmpPeriodSelected === ''
                                ? 'בחר'
                                : cmpPeriodSelected
                            }
                          >
                            {periodColumnRange.map((dashboard, i) => (
                              <Dropdown.Item
                                key={dashboard}
                                onClick={handleCMPPeriodSelection}
                                className="dropDownItem"
                              >
                                {dashboard}
                              </Dropdown.Item>
                            ))}
                          </DropdownButton>
                        </Col>
                      </Row>
                      <Row className="inner-row">
                        <Col>
                          <Form.Label className="FormLabel">
                            תת כותרת עבור העמודה הנבחרה:
                          </Form.Label>
                          <Form.Control
                            size="lg"
                            placeholder="תת כותרת"
                            className="title-input"
                            value={subTitle}
                            onChange={handleSubTitle}
                          />
                        </Col>

                        <Col style={{ marginTop: '3.2%' }}>
                          <Button
                            variant="primary"
                            type=""
                            className="add-column-btn"
                            onClick={handleCrossData}
                          >
                            הוסף
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Container>
                <Row>
                  <Col className="add-monitor-col">
                    <Button
                      variant="primary"
                      type=""
                      className="add-monitor-btn"
                      block="true"
                      onClick={handleGoldenInfo}
                    >
                      הוסף מוניטור
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </form>
      </div>
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

export default CreateGolden;
