import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import SearchBox from './search';
import './style.css';
import User from './User';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      perPage: 0,
      totalCount: 0,
      pageCount: 0,
      searchStr: '',
      mystyle: {
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '10px',
        fontFamily: 'Arial',
      },
      username: '',
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.setSearchStrCallBack = this.setSearchStrCallBack.bind(this);
    this.searchData = this.searchData.bind(this);
  }
  setSearchStrCallBack(value) {
    console.log('setSearchStrCallBack: ', value);
    let _that = this;
    this.setState(
      {
        searchStr: value,
        currentPage: 1,
      },
      () => {
        _that.searchData();
      },
    );
  }

  async searchData() {
    const url =
      '/api/users/search/' +
      this.state.currentPage +
      '?str=' +
      this.state.searchStr;
    const res = await axios.get(url);
    console.log(res);
    this.setState({
      perPage: res.data.perPage,
      pageCount: res.data.pageCount,
      totalCount: res.data.totalCount,
      data: res.data.users,
    });
    // axios.get(url).then(res => {
    //   console.log('searchData from server:', res);
    //   this.setState({
    //     perPage: res.data.perPage,
    //     pageCount: res.data.pageCount,
    //     totalCount: res.data.totalCount,
    //     data: res.data.users,
    //   });
    // });
  }

  handlePageClick(e) {
    const selectedPage = e.selected + 1;
    this.setState(
      {
        currentPage: selectedPage,
      },
      () => {
        this.searchData();
      },
    );
  }

  render() {
    const datas = this.state.data;
    const page = datas; //.slice(this.state.offset, this.state.offset + this.state.perPage);
    console.log(page);
    return (
      <div className="align-items-center ">
        <SearchBox
          setSearchStr={(str, e) => this.setSearchStrCallBack(str, e)}
        />

        <br></br>
        <div className="row bg-light text-dark">
          <div className="col border border-dark text-center">פעולה</div>
          <div className="col border border-dark text-center">הרשאות</div>
          <div className="col border border-dark text-center">ארגון</div>
          <div className="col border border-dark text-center">תפקיד</div>
          <div className="col border border-dark text-center">שם משפחה </div>
          <div className="col border border-dark text-center"> שם פרטי </div>
          <div className="col border border-dark text-center">שם משתמש</div>
          {/* <div className="col border border-dark text-center">#</div> */}
        </div>
        {/* {this.state.postData} */}
        {page
          ? page.map((pd, i) => (
              <User searchData={this.searchData} userData={pd} />
            ))
          : null}
        <ReactPaginate
          forcePage={this.state.currentPage - 1}
          initialPage={0}
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
