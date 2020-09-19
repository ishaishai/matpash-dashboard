import React,{useState} from 'react';
import './CreateChart.css';
// import { Button } from '@material-ui/core';
import Chart from '../Dashboard/Charts';
import Highcharts from "highcharts";
import { Form, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import {Button, Container} from 'react-bootstrap/'




const CreateChart = props =>{
  let Type = "line";

  let seriesTest = [1, 1, 1, 1, 1];

  const [title,setTitle] = useState("כותרת");
  const [subTitle,setSubTitle] = useState("תת כותרת");

  const opt =
      {
        id: 1,
        chart: {
          // type: Type,
          events:{
            load: function(){

              let btn = document.getElementsByClassName("btn");
              let chart = this;
              for(let j=0; j<btn.length;j++)
              {
                btn[j].addEventListener("click",() =>{
                  Type= btn[j].id
                  for(let i=0;i<chart.series.length;i++)
                  {
                    chart.series[i].update({
                      type: Type
                    });

                  }

                })
              }
            },
          }

        },
        title: {
          text: title,

        },
        subtitle: {
          text: subTitle,

        },
        plotOptions: {
          series: {
            animation:{
              duration: 3000,
            },
          }
        },


        series: [
          {
            name: "1",
            data: [5, 3, 4, 7, 2],
          },
          // {
          //   name: "2",
          //   data: [2,  2, 1],
          // },
          // {
          //   name: "3",
          //   data: [3, 4, 4, 2, 5],
          // },
        ],
        legend:{
          position:'right'
        },
        xAxis: {
          categories: ["מורים", "אנשי ניקיון", "הנהלה", "תלמידים", "הורים מבקרים"],
          labels: {
            style: {
              color: "black",
            },
          },

        },
        yAxis:{
          title:{
            text: null
          }

        }
      }

  let displayChart =  <Chart
      className="chart"
      id={"chart-0"}
      options={opt}
      Highcharts={Highcharts}
  />

  const [chart,setChart] = useState(opt);

  const ListItem = ({ value, onClick }) => {
    return <option onClick={fetchData}>{value}</option>
  }

  const List = ({ items }) => (
      <Form.Group className="column">
        <Form.Control as="select"  multiple>
          {
            items.map((item, i) => <ListItem key={i} value={items[i]} onClick={() => fetchData} />)
          }
        </Form.Control>
      </Form.Group>
  );


  const items = ["1","2","3"];
  let colData
  const [selected,setSelection] = useState(colData);

  const fetchData = (event) =>{
    ///get from DB into a string
    console.log("test123")
    colData = <List items={items}/>
    setSelection(colData);
  }

  var inputStyle = {
    padding:"5px",
    marging:"5px",
  };

  const changeTitle = (event) =>{
    var title = document.getElementById("Title");
    console.log(title.value)
    setTitle(title.value)
  }



  const changeSubTitle = (event) =>{
    var subTitle = document.getElementById("SubTitle");
    console.log(subTitle.value)
    setSubTitle(subTitle.value)
  }
  return(
      <div>
        <div className="CreateChart">
          <Navbar bg={{backgroundColor: '#40a8c4'}} expand="lg" className="justify-content-md-end " >
            <Navbar.Brand >סוגי טבלה</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto" >
                <a className="nav-link" id="line" className="btn" >Line</a>
                <a className="nav-link" id= "bar" className="btn">Bar</a>
                <a className="nav-link" id="pie" className="btn">Pie</a>
                <a className="nav-link" id="area" className="btn">Area</a>
              </Nav>

            </Navbar.Collapse>
          </Navbar>


          <nav className="navbar navbar-expand-md navbar-dark "style={{backgroundColor: '#40a8c4'}}>
            <button className="navbar-toggler" type="button" data-toggle="collapse basic-navbar-nav"
                    data-target="#collapsibleNavbar">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-md-end" id="collapsibleNavbar" >
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" id="line" className="btn" >Line</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id= "bar" className="btn">Bar</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="pie" className="btn">Pie</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="area" className="btn">Area</a>
                </li>
              </ul>
            </div>
          </nav>


        </div>
        <div className="chartWrapDemo">
          {displayChart}
        </div>
        <div>
          <Form >
            <List  items={items} />
          </Form>
          {selected}
        </div>
        <hr />
        <div className="vl" />
        {/*<div className="title">*/}
        {/*      /!*<span>כותרת</span>*!/*/}
        {/*      /!*<input id="Title" type="text"></input>*!/*/}
        {/*      /!*<Button onClick={changeTitle}>Change</Button>*!/*/}
        {/*      /!*<br />*!/*/}
        {/*      /!*</div>*!/*/}
        {/*      /!*<div className="title">*!/*/}
        {/*      /!*<span>תת כותרת</span>*!/*/}
        {/*      /!*<input id="SubTitle" type="text"></input>*!/*/}
        {/*      /!*<Button onClick={changeSubTitle}>Change</Button>*!/*/}
        {/*      /!*<br/>*!/*/}

        {/*      /!* <input type="checkbox" ></input> *!/*/}

        {/*</div>*/}
        <div className="title " >
          <Container >
            <Form>
              <Form.Row >
                <Button variant="outline-primary" type="submit" onClick={changeTitle}>
                  שלח
                </Button>
                <Form.Group  controlId="formGridCity">
                  <Form.Label  className="title">כותרת</Form.Label>
                  <Form.Control  className="title"/>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Button variant="outline-primary" onClick={()=>{console.log("test")}}>שלח</Button>
                <Form.Group  controlId="formGridCity">
                  <Form.Label className="title">תת כותרת</Form.Label>
                  <Form.Control className="title"/>
                </Form.Group>
              </Form.Row>
            </Form>
            <hr></hr>

            <Button  variant="outline-success " type="" className="text-lg-center buttonDesign">אישור</Button>

          </Container>

        </div>
      </div>
  );
}


export default CreateChart;