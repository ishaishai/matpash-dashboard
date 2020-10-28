import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import UpdateButoon from "./updateButton";

import MultiSelect from "react-multi-select-component";
import Select from 'react-select';


class User_view_permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      perPage: 0,
      totalCount: 0,
      pageCount: 0,
            mystyle: {
              color: "white",
              backgroundColor: "DodgerBlue",
              padding: "10px",
              fontFamily: "Arial"
            },
            index: 0
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.receivedData = this.receivedData.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

        

    }
  

    

    handleSave(){
      console.log("handleSave", this.state.data);
      let saveData = this.state.data;
      for(var i = 0 ; i < saveData.length; i++)
      {
        delete saveData[i].dashboardsSelectedOptions;
      }

     console.log("saveData", saveData);
 
     axios({
         method: 'post',
         url: 'http://localhost:5000/view/saveViewPermission',
         data: saveData
       }).then(res => {
         console.log("response from serrver ",res.data);
       });

      
    }

    handleOnChange(userid, selected){
      console.log("handleOnChange", userid, selected);
      console.log("this.state.data", this.state.data);

      let updatedData = this.state.data;

      for(var i = 0 ; i < updatedData.length; i++)
      {
        if( updatedData[i].userid == userid)
        {
          for(let k in updatedData[i].dashboards) 
            updatedData[i].dashboards[k] = false;
          //updatedData[i].dashboards = {false};
           for(let d in selected) {
              updatedData[i].dashboards[selected[d]] = true;
           }

          console.log("updatedData", updatedData);
        }
      }


      this.setState({
        data: updatedData
      });
    
      
    }

    receivedData() {
      
      const url = "http://localhost:5000/view/getViewPermission?page="+this.state.currentPage;
      axios.get(url)
      .then(res =>{

        for(var i  =0; i < res.data.users.length; i++)
        {
          res.data.users[i].dashboardsSelectedOptions = [];
          for(let k in res.data.users[i].dashboards)
          {
              if(res.data.users[i].dashboards[k] == true)
                res.data.users[i].dashboardsSelectedOptions.push(k);
          }
        }
          this.setState({
              perPage: res.data.perPage,
              pageCount: res.data.pageCount,
              totalCount: res.data.totalCount,
              data: res.data.users
          },() => {
              // this.props.usersInfoCallback(this.state.sourceData);
              
             
          })
      })
    }

    handlePageClick(e){
      const selectedPage = e.selected + 1 ;
      this.setState({
          currentPage: selectedPage,
      }, () => {
          this.receivedData();
      });

  };
   
    componentDidMount() {
        this.receivedData();
    }
    render() {
      const page = this.state.data;;//.slice(this.state.offset, this.state.offset + this.state.perPage);
  
      return (
          
          <div className="align-items-center">
 
                  <div>
                    <button type="button" className="btn btn-secondary bg-success" data-toggle="modal" data-target="#exampleModalCenter">
                    שמירת שינויים
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLongTitle"> שמירת שינויים</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                האם לבצע שינויים?
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary bg-danger" data-dismiss="modal">ביטול</button>
                                    <button type="button" className="btn btn-secondary bg-success" data-dismiss="modal"  onClick={this.handleSave}>שמור</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            <br></br>
            <div className="row">
              <div className="col-lg-2 border border-dark text-center">#	</div>
              <div className="col-lg-2 border border-dark text-center">ת״ז 	</div>
              <div className="col border border-dark text-center">דשבורדים מורשים</div>      
            </div>
            {/* Pagination */}
           <br></br>
            {/* {this.state.postData} */}
            {page.map((pd, i) => 
            
              <div key={pd['userid']} className="row">
  
                  <div className="col-lg-2 border text-center">{this.state.perPage-(this.state.perPage-i)}</div>
                  <div className="col-lg-2 border text-center">{pd['userid']} </div>
                  <div className="col border text-center ">
                   
                    <DropdownMultiselect
                      options={Object.keys(pd.dashboards)}
                      selected={pd.dashboardsSelectedOptions}
                      name="dashboard"
                      placeholder="לא נבחרה תיבת הסימון להרשאה"
                      buttonClass={""}
                      handleOnChange={(selected) => this.handleOnChange(pd['userid'],selected)}
                      ref={this.boxRef}
                    />
                  </div>
              </div>
            )}

              <ReactPaginate
                previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={"..."}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={this.state.pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}/>
        </div>
      );
    }
  }
  
  export default User_view_permission;