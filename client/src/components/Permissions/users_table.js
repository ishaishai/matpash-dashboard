import React, { Component } from 'react';
import axios from 'axios';
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
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '10px',
        fontFamily: 'Arial',
      },
      username: '',
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  receivedData() {
    axios.get('/api/users').then(res => {
      const datas = res.data.users;
      const slice = datas.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      const postData = slice.map((pd, idx) => (
        <div id={pd.id} key={pd.id} className="row ">
          <div className="col-1 border text-center">{++idx}</div>
          <div className="col-1 border text-center">{pd['username']}</div>
          <div className="col-1 border text-center">{pd['id']}</div>
          <div className="col-1 border text-center">{pd['firstName']}</div>
          <div className="col-1 border text-center">{pd['lastName']}</div>
          <div className="col-1 border text-center">{pd['role']}</div>
          <div className="col-1 border text-center">{pd['organization']}</div>
          <div className="col-1 border text-center">{pd['permissions']}</div>
        </div>
      ));

      this.setState({
        pageCount: Math.ceil(datas.length / this.state.perPage),
        username: res.data.users,
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
      <div className="align-items-center ">
        <form className="form-inline mt-2 mt-md-0">
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="חיפוש"
            aria-label="Search"
          />
          <button
            className="btn btn-outline-primary my-2 my-sm-0"
            type="submit"
          >
            חיפוש
          </button>
        </form>
        <br></br>
        <div className="row bg-light text-dark">
          <div className="col-1 border border-dark text-center">#</div>
          <div className="col-1 border border-dark text-center">שם משתמש</div>
          <div className="col-1 border border-dark text-center"> ת״ז</div>
          <div className="col-1 border border-dark text-center"> שם פרטי </div>
          <div className="col-1 border border-dark text-center">שם משפחה </div>
          <div className="col-1 border border-dark text-center">תפקיד</div>
          <div className="col-1 border border-dark text-center">ארגון</div>
          <div className="col-1 border border-dark text-center">הרשאות</div>
        </div>
        {this.state.postData}

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

export default Users;
