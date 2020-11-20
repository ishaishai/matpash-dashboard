import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios'
import ReactPaginate from 'react-paginate';
//import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import {DropdownButton,Dropdown} from 'react-bootstrap';
import '../Menu/CreateChart.css';
import { Alert, AlertTitle } from '@material-ui/lab';
import { connect } from 'react-redux';

class User_permission extends Component {
    constructor(props) {
      super(props);
      this.state = {
          success: false,
          offset: 0,
          usersPermissionsData: [],
          updatedUsersIds: [],
          perPage: 15,
          currentPage: 0,
          mystyle: {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
          }, 
          pageCount: 0,
          i:0
      };
      this.handlePageClick = this.handlePageClick.bind(this);
      this.handlePermissionChange = this.handlePermissionChange.bind(this);
      this.handleSave = this.handleSave.bind(this);
      this.handleDropDown = this.handleDropDown.bind(this);
      
  }
    receivedData = async() => {
        await axios.get("/api/permissions/getPermission/userpermissions")
            .then(res => {
                console.log(res.data);
                this.setState({
                    usersPermissionsData: res.data.users,
                    pageCount: res.data.pagecount
                });
            });

            
        }
        
        handleDropDown(event,pd) {
        let usersPerms = this.state.usersPermissionsData;
        let prevUpdatedUsersIds = this.state.updatedUsersIds;
        console.log(this.state.pageCount);

        usersPerms.filter((user) => pd['id'] == user['id'])[0]['permissions'] = event.target.innerHTML;
        if(!prevUpdatedUsersIds.includes(pd['id']))
            prevUpdatedUsersIds.push(pd['id']);
        this.setState({usersPermissionsData: usersPerms
        ,updatedUsersIds: prevUpdatedUsersIds});
    }
    
    handlePageClick(e){
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });
    };

    handlePermissionChange(user_id,column_name,e) {
        let usersData = this.state.usersPermissionsData;
        let prevUpdatedUsersIds = this.state.updatedUsersIds;
        console.log(user_id,column_name,e.target.checked);
        
        usersData.filter((user) => user.id==user_id)[0][column_name] = e.target.checked;
        if(!prevUpdatedUsersIds.includes(user_id))
            prevUpdatedUsersIds.push(user_id);
        this.setState({usersPermissionsData: usersData,
            updatedUsersIds: prevUpdatedUsersIds});
    }

    // handleChange2(user_id,column_name,e){
    //     console.log(this.state.usersPermissionsData);
    //     console.log("checkbox clicked for user "+user_id+" column_name:"+column_name);

    //     const updatedUsersPermissionsData = this.state.usersPermissionsData.map((pd) =>  {
    //         console.log(pd['id'], user_id, pd['id'] == user_id);
    //         console.log(column_name, pd[column_name]);
            
    //         if( pd['id'] == user_id)
    //         {
    //             const prevValue = pd[column_name];
    //             pd[column_name] = prevValue==true ? false : true;
    //             if(pd[column_name] != prevValue){
    //                 this.state.updatedUsersIds[user_id]=1;
    //             }
    //         }
    //         console.log(this.state.updatedUsersIds);
    //         console.log(column_name, pd[column_name]);
    //         return pd;
    //      } );

    //      console.log(updatedUsersPermissionsData);

    //      this.setState({
    //         updatedUsersIds: this.state.updatedUsersIds,
    //     });

    //     //const updatedUsersPermissionsData = this.state.usersPermissionsData.map((pd) =>  pd.view = false );
    //     this.setState({
    //         usersPermissionsData: updatedUsersPermissionsData,
    //     });
        
    // };
    handleSave(e){

        const updatedUsersIdskeys = this.state.updatedUsersIds;
        //ifuserPermissionsData is empty need to send a message 'no changes made'
        const usersPermissionsDataToSave = this.state.usersPermissionsData.filter((pd) =>  updatedUsersIdskeys.includes(pd.id) == true );
        console.log(usersPermissionsDataToSave);
        console.log("updatedUsersIds",this.state.updatedUsersIds);
        console.log("usersPermissionsDataToSave",usersPermissionsDataToSave);
        axios({
            method: 'post',
            url: '/api/permissions/updatePermissions',
            data: usersPermissionsDataToSave
          }).then(res => {
            console.log("response from server ",res.data);
            if(res.data.msg=="ok"){
                this.setState({
                    updatedUsersIds: [],
                    success: true
                });
               
                console.log("success",this.state.success);
                const sleep = m => new Promise(r => setTimeout(r, m));
                (async () => {
                await sleep(2000)
                this.setState({success: false});
            })() 
            
            }
          });
    }
    componentDidMount() {
        this.receivedData()
    }
  render() {
      const page = this.state.usersPermissionsData.slice(this.state.offset, this.state.offset + this.state.perPage);
      return (
        <div className="align-items-center">
            <div>
                <button type="button" className="btn btn-secondary bg-success" data-toggle="modal" data-target="#exampleModalCenter">
                שמירת שינויים
                </button>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
                                <button type="button" className="btn btn-secondary bg-success" data-dismiss="modal" onClick={this.handleSave}>שמור</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row bg-light text-dark">
                <div className="col border border-dark text-center"> ייצוא לקובץ תמונה </div>
                <div className="col border border-dark text-center">ייצוא תצוגה pdf</div>
                <div className="col border border-dark text-center">הדפסת גרף</div>
                <div className="col border border-dark text-center">הרשאה</div> 
                <div className="col border border-dark text-center">שם משתמש</div> 
            </div>
            <br></br>
            {
                page.map((pd) => 
                  <div id={pd.id} key={pd.id} className="row">
                    <div className="col border text-center"><input className="" type="checkbox" checked={pd['image']} value="" key="" onClick={(e) => this.handlePermissionChange(pd.id,'image',e)}/></div>
                    <div className="col border text-center"><input className="" type="checkbox" checked={pd['pdf']} value="" key="" onClick={(e) => this.handlePermissionChange(pd.id,'pdf',e)}/></div>
                    <div className="col border text-center"><input className="" type="checkbox" checked={pd['print']} value="" key="" onClick={(e) => this.handlePermissionChange(pd.id,'print',e)}/></div>
                    <div className="col border text-center">
                        {/* <input className="" type="checkbox" checked={pd['admin']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'admin',e)}/> */}
                        <DropdownButton
                  
                  className="dropdown-btn"
                  type=""
                  variant="outline-primary"
                  title={
                    pd['permissions']
                  }
                  style={{width: "100%"}}
                >
                  {['מנהל','עורך','צופה'].map((perm, i) => (
                    <Dropdown.Item
                      key={perm}
                      onClick={(event) => this.handleDropDown(event,pd)}
                      className="dropDownItem"
                    >
                    {perm}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                    </div>
                    <div className="col border text-center">{pd['id']}</div>
                </div>)

              //{console.log(this.state.perPage)}
            }
             {/* Pagination */}
              <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={(this.state.pageCount != undefined) ? this.state.pageCount : 0}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}/>
                  
                  {!this.state.success && <Alert style = {{visibility: "hidden", opacity: "0",transition: "visibility 0s 2s opacity 5s linear"}} severity="success">
                    <AlertTitle>Success</AlertTitle>
                            This is a success alert — <strong>check it out!</strong>
                        </Alert>}
                        {this.state.success && <Alert style = {{visibility: "visible",  opacity: "1",transition: "opacity 2s linear"}} severity="success">
                            <AlertTitle>Success</AlertTitle>
                            This is a success alert — <strong>check it out!</strong>
                    </Alert>}
        </div>
      );
    }
  };
  
  const mapStateToProps = ({
    auth: {
      user
    },
  }) => ({ user });
  export default connect(mapStateToProps)(User_permission);
  