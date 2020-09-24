// import React, { Component } from "react";
// import ReactDOM from "react-dom";


// class Users extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         value: []
//       };
  
//     }
//     componentDidMount() {
//       fetch("http://localhost:5000/users/getall")
//         .then(res => res.json())
//         .then(
//           (result) => {
//             this.setState({
//               value: result.users
//             });
//           },
//           // Note: it's important to handle errors here
//           // instead of a catch() block so that we don't swallow
//           // exceptions from actual bugs in components.
//           (error) => {
//             // this.setState({
//             //   isLoaded: true,
//             //   error
//             // });
//           }
//         )
//     }
  
//     render() {
//       const users = this.state.value;
//       console.log(users)
//       users.map((item, i )=> (
//         //console.log(Object.values(item))
//        console.log(item)
//       ))

//       return (
        // <div className="align-items-center">
        //    <form className="form-inline mt-2 mt-md-0">
        //         <input className="form-control mr-sm-2" type="text" placeholder="חיפוש" aria-label="Search"/>
        //         <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">חיפוש</button>
        //     </form>
        //     <br></br>
        //     <div className="row bg-light text-dark">
        //       <div className="col-1 border border-dark text-center">#</div> 
        //       <div className="col-1 border border-dark text-center">שם משתמש</div> 
        //       <div className="col-1 border border-dark text-center">סיסמה</div>
        //       <div className="col-1 border border-dark text-center"> ת״ז</div>
        //       <div className="col-1 border border-dark text-center">  שם פרטי	</div>
        //       <div className="col-1 border border-dark text-center">שם משפחה	</div>
        //       <div className="col-1 border border-dark text-center"> כתובת</div>
        //       <div className="col-1 border border-dark text-center"> תאריך לידה	</div>
        //       <div className="col-1 border border-dark text-center">תפקיד</div>
        //       <div className="col-1 border border-dark text-center">ארגון</div>
        //     </div>
            
//               {users.map(user => (
//                 <div id={user.id} key={user.id}  className="row ">

//                   <div className="col-1 border text-center">{user['id']}</div>
//                   <div className="col-1 border text-center">{user['username']}</div>
//                   <div className="col-1 border text-center"> {user['password']}	</div>
//                   <div className="col-1 border text-center">{user['id']}</div>
//                   <div className="col-1 border text-center">{user['firstName']}</div>
//                   <div className="col-1 border text-center">{user['lastName']}</div>
//                   <div className="col-1 border text-center">{user['address']}</div>
//                   <div className="col-1 border text-center">{user['dateOfBirth']}</div>
//                   <div className="col-1 border text-center">{user['role']}</div>
//                   <div className="col-1 border text-center">{user['organization']}</div>
//                 </div> 
                  
//               ))}

            
            
//         </div>
//       );
//     }
//   }



import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';

class Users extends Component {
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
  receivedData() {
      axios
          .get("http://localhost:5000/users/getall")
          .then(res => {

              const datas = res.data.users;
              const slice = datas.slice(this.state.offset, this.state.offset + this.state.perPage)
              {console.log(slice)}
              const postData = slice.map((pd) => 
              <div id={pd.id} key={pd.id}  className="row ">
                  <div className="col-1 border text-center">{pd['id']}</div>
                   <div className="col-1 border text-center">{pd['username']}</div>
                   <div className="col-1 border text-center"> {pd['password']}	</div>
                   <div className="col-1 border text-center">{pd['id']}</div>
                   <div className="col-1 border text-center">{pd['firstName']}</div>
                   <div className="col-1 border text-center">{pd['lastName']}</div>
                   <div className="col-1 border text-center">{pd['address']}</div>
                   <div className="col-1 border text-center">{pd['dateOfBirth']}</div>
                   <div className="col-1 border text-center">{pd['role']}</div>
                   <div className="col-1 border text-center">{pd['organization']}</div>
                 
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
          <div className="align-items-center ">
              <form className="form-inline mt-2 mt-md-0">
                    <input className="form-control mr-sm-2" type="text" placeholder="חיפוש" aria-label="Search"/>
                    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">חיפוש</button>
                </form>
                <br></br>
                <div className="row bg-light text-dark">
                  <div className="col-1 border border-dark text-center">#</div> 
                  <div className="col-1 border border-dark text-center">שם משתמש</div> 
                  <div className="col-1 border border-dark text-center">סיסמה</div>
                  <div className="col-1 border border-dark text-center"> ת״ז</div>
                  <div className="col-1 border border-dark text-center"> שם פרטי</div>
                  <div className="col-1 border border-dark text-center">שם משפחה</div>
                  <div className="col-1 border border-dark text-center"> כתובת</div>
                  <div className="col-1 border border-dark text-center"> תאריך לידה	</div>
                  <div className="col-1 border border-dark text-center">תפקיד</div>
                  <div className="col-1 border border-dark text-center">ארגון</div>
                </div>
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

      )
  }
}

  
export default Users;