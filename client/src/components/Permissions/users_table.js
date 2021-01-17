import React, { Component } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import SearchBox from './search';
import { Button } from 'react-bootstrap';
import './style.css';

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

  searchData() {
    const url =
      '/api/users/search/' +
      this.state.currentPage +
      '?str=' +
      this.state.searchStr;
    axios.get(url).then(res => {
      console.log('searchData from server:', res);
      this.setState(
        {
          perPage: res.data.perPage,
          pageCount: res.data.pageCount,
          totalCount: res.data.totalCount,
          data: res.data.users,
        },
        () => {
          // this.props.usersInfoCallback(this.state.sourceData);
          // console.log("pagecount: ",this.state.pageCount)
        },
      );
    });
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

  async deleteUser(e, username) {
    username = username.replace(/'/g, "''");
    username = username.replace(/"/g, `""`);
    let result = window.confirm('האם למחוק משתמש זה? פעולה זו בלתי הפיכה');
    if (result) {
      const response = await axios.delete('/api/users/delete-user/' + username);
      alert('!המשתמש נמחק');
      this.searchData();
    }
  }
  async editUser(id) {}
  componentDidMount() {
    this.searchData();
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
        {page.map((pd, i) => (
          <div id={pd.username} key={pd.username} className="row ">
            <div className="col border text-center">
              <Button
                className="ui red button buttonOption"
                onClick={e => this.deleteUser(e, pd['username'])}
              >
                מחק
              </Button>
              <Button
                className="ui button buttonOption"
                onClick={() => this.editUser(pd.id)}
              >
                ערוך
              </Button>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['permissions']}</div>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['organization']}</div>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['role']}</div>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['lastName']}</div>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['firstName']}</div>
            </div>
            <div className="col border text-center">
              <div className="innerUserDetailBox">{pd['username']}</div>
            </div>
            {/* <div className="col border text-center">
              {this.state.perPage - (this.state.perPage - i)}
            </div> */}
          </div>
        ))}
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
