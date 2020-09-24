import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from 'axios'
import ReactPaginate from 'react-paginate';


class User_view_permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
            offset: 0,
            data: [],
            perPage: 15,
            currentPage: 0,
            mystyle: {
              color: "white",
              backgroundColor: "DodgerBlue",
              padding: "10px",
              fontFamily: "Arial"
            }
        };
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    // componentDidMount() {
    //     fetch("http://localhost:5000/view/getViewPermission")
    //       .then(res => res.json())
    //       .then(
    //         (result) => {
    //           this.setState({
    //             value: result.users
    //           });
    //         },
    //         // Note: it's important to handle errors here
    //         // instead of a catch() block so that we don't swallow
    //         // exceptions from actual bugs in components.
    //         (error) => {
    //           // this.setState({
    //           //   isLoaded: true,
    //           //   error
    //           // });
    //         }
    //       )
    //   }

    receivedData() {
      axios
          .get("http://localhost:5000/view/getViewPermission")
          .then(res => {

              const datas = res.data.users;
              const slice = datas.slice(this.state.offset, this.state.offset + this.state.perPage)
              {console.log(slice)}
              const postData = slice.map((pd) => 
              <div key={pd['date']} key={pd.id} className="row">
                  <div className="col-1 border text-center">id</div>
                  <div className="col-1 border text-center">{pd['username']} </div>
                  <div className="col-1 border text-center"><input className="" type="checkbox" checked={pd['act']} value="" id=""/></div>
                  <div className="col-1 border text-center">{pd['date']} </div>
              </div>)

              this.setState({
                  pageCount: Math.ceil(datas.length / this.state.perPage),
                
                  postData
              })
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

    componentDidMount() {
        this.receivedData()
    }
    render() {
      return (
        <div className="align-items-center">
           
            <br></br>
            <div className="row">
              <div className="col-1 border border-dark text-center">ID	</div>
              <div className="col-1 border border-dark text-center">שם משתמשים 	</div>
              <div className="col-1 border border-dark text-center">פעולה</div>                            
              <div className="col-1 border border-dark text-center">תאריך</div>
            </div>
            {/* Pagination */}
           <br></br>
            {this.state.postData}
              {console.log(this.state.perPage)}
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