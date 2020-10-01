import React, { Component } from 'react';
import axios from 'axios';
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
        color: 'white',
        backgroundColor: 'DodgerBlue',
        padding: '10px',
        fontFamily: 'Arial',
      },
      index: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  receivedData() {
    axios.get('/api/dashboard/privilages').then(res => {
      const datas = res.data.dashboardsPriviledges;
      const slice = datas.slice(
        this.state.offset,
        this.state.offset + this.state.perPage
      );
      const postData = slice.map((pd,idx) => (
        <div key={pd['date']} key={pd.id} className="row">
          <div className="col-1 border text-center">
            {idx}
          </div>
          <div className="col-1 border text-center">{pd['userId']} </div>
          <div className="col-1 border text-center">
            <input
              className=""
              type="checkbox"
              checked={pd['dashboard1']}
              value=""
              id=""
            />
          </div>
          {console.log(this.state.currentPage)}
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
        <div className="row">
          <div className="col-1 border border-dark text-center"># </div>
          <div className="col-1 border border-dark text-center">ת.ז </div>
          <div className="col-1 border border-dark text-center">
            דשבורדים מורשים
          </div>
        </div>
        {/* Pagination */}
        <br></br>
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

export default User_view_permission;
