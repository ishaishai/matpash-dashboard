import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios'
import ReactPaginate from 'react-paginate';


class User_permission extends Component {
    constructor(props) {
      super(props);
      this.state = {
          offset: 0,
          usersPermissionsData: [],
          updatedUsersIds: {},
          perPage: 15,
          currentPage: 0,
          mystyle: {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
          }, 
          i:0
      };
      this.handlePageClick = this.handlePageClick.bind(this);
      this.handleChange2 = this.handleChange2.bind(this);
      this.handleSave = this.handleSave.bind(this);
      
  }
    receivedData() {
        axios
            .get("http://localhost:5000/permissions/getPermission")
            .then(res => {
                this.setState({
                    usersPermissionsData: res.data.users
                });
            });
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

    handleChange2(user_id,column_name,e){
        console.log(this.state.usersPermissionsData);
        console.log("checkbox clicked for user "+user_id+" column_name:"+column_name);

        const updatedUsersPermissionsData = this.state.usersPermissionsData.map((pd) =>  {
            console.log(pd['id'], user_id, pd['id'] == user_id);
            console.log(column_name, pd[column_name]);
            
            if( pd['id'] == user_id)
            {
                const prevValue = pd[column_name];
                pd[column_name] = prevValue==true ? false : true;
                if(pd[column_name] != prevValue){
                    this.state.updatedUsersIds[user_id]=1;
                }
            }
            console.log(this.state.updatedUsersIds);
            console.log(column_name, pd[column_name]);
            return pd;
         } );

         console.log(updatedUsersPermissionsData);

         this.setState({
            updatedUsersIds: this.state.updatedUsersIds,
        });

        //const updatedUsersPermissionsData = this.state.usersPermissionsData.map((pd) =>  pd.view = false );
        this.setState({
            usersPermissionsData: updatedUsersPermissionsData,
        });
        
    };
    handleSave(e){

        const updatedUsersIdskeys = Object.keys(this.state.updatedUsersIds);
        const usersPermissionsDataToSave = this.state.usersPermissionsData.filter((pd) =>  updatedUsersIdskeys.includes(pd.id) == true );

        console.log("handleSave");
        console.log("updatedUsersIds",this.state.updatedUsersIds);
        console.log("usersPermissionsDataToSave",usersPermissionsDataToSave);
        //https://blog.logrocket.com/how-to-make-http-requests-like-a-pro-with-axios/
        axios({
            method: 'post',
            url: 'http://localhost:5000/permissions/updatePermissions',
            data: usersPermissionsDataToSave
          }).then(res => {
            console.log("response from serrver ",res.data);
            if(res.data.msg=="ok"){
                this.setState({
                    updatedUsersIds: {},
                });
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
                <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModalCenter">
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
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">ביטול</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSave}>שמור</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br></br>
            <div className="row bg-light text-dark">
                <div className="col-1 border border-dark text-center">שם משתמש</div> 
                <div className="col-1 border border-dark text-center">צופה</div> 
                <div className="col-1 border border-dark text-center">עורך</div>
                <div className="col-1 border border-dark text-center">הדפסת גרף</div>
                <div className="col-1 border border-dark text-center">ייצוא תצוגה pdf</div>
                <div className="col-1 border border-dark text-center"> ייצוא לקובץ jpg </div>
                <div className="col-1 border border-dark text-center">ייצוא לקובץ CSV</div>
                <div className="col-1 border border-dark text-center">ייצוא לקובץ XCL</div>
            </div>
            <br></br>
            {
                page.map((pd) => 
                  <div id={pd.id} key={pd.id} className="row">
                    <div className="col-1 border text-center">{pd['id']}</div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['view']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'view',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['edit']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'edit',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['print']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'print',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['pdf']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'pdf',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['image']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'image',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['csv']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'csv',e)}/></div>
                   <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['xlsx']} value="" key="" onClick={(e) => this.handleChange2(pd.id,'xlsx',e)}/></div>
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
  
  export default User_permission;