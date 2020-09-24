import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';

class User_permission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      data: [],
      perPage: 15,
      currentPage: 0,
      mystyle: {
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '10px',
        fontFamily: 'Arial',
      },
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  // componentDidMount() {
  //   fetch("http://localhost:5000/permissions/getPermission")
  //     .then(res => res.json())
  //     .then(
  //       (result) => {
  //         this.setState({
  //           value: result.users
  //         });
  //       },
  //       // Note: it's important to handle errors here
  //       // instead of a catch() block so that we don't swallow
  //       // exceptions from actual bugs in components.
  //       (error) => {
  //         // this.setState({
  //         //   isLoaded: true,
  //         //   error
  //         // });
  //       }
  //     )
  // }
  receivedData() {
    axios.get('http://localhost:5000/permissions/getPermission').then(res => {
      const datas = res.data.users;
      const slice = datas.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      {
        console.log(slice);
      }
      const postData = slice.map(pd => (
        <div id={pd.id} key={pd.id} className="row">
          <div className="col-1 border text-center">{pd['id']}</div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['admin']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['view']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['edit']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['print']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['pdf']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['image']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['csv']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['xlsx']}
              value=""
              id=""
            />
          </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['dataTable']}
              value=""
              id=""
            />
          </div>
        </div>
      ));

      this.setState({
        pageCount: Math.ceil(datas.length / this.state.perPage),

        postData,
      });
    });
  }

  handlePageClick(e) {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.receivedData();
      }
    );
  }

  componentDidMount() {
    this.receivedData();
  }

  render() {
    return (
      <div className="align-items-center">
        <br></br>
        <div className="row bg-light text-dark">
          <div className="col-1 border border-dark text-center">משתמש/ id</div>
          <div className="col-1 border border-dark text-center">
            פיצ'רים/משתמש
          </div>
          <div className="col-1 border border-dark text-center">צופה</div>
          <div className="col-1 border border-dark text-center">עורך</div>
          <div className="col-1 border border-dark text-center">הדפסת גרף</div>
          <div className="col-1 border border-dark text-center">
            הורדת תצוגה pdf
          </div>
          <div className="col-1 border border-dark text-center">
            הורדת תצוגה תמונה
          </div>
          <div className="col-1 border border-dark text-center">
            הורדתה לקובץ CSV
          </div>
          <div className="col-1 border border-dark text-center">
            הורדה לקובץ XCL
          </div>
          <div className="col-1 border border-dark text-center">
            הצגת טבלת נתונים
          </div>
        </div>

        {/* Pagination */}
        <br></br>
        {this.state.postData}
        {console.log(this.state.perPage)}
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          breakLabel={'...'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
      </div>
    );
  }
}

export default User_permission;
