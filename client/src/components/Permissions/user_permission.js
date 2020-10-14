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
  receivedData() {
    axios.get('/api/permissions').then(res => {
      const datas = res.data.permissions;
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
          <div className="col-1 border text-center">{pd['username']}</div>
          <div className="col-1 border text-center">{pd['firstName']}</div>
          <div className="col-1 border text-center">{pd['lastName']}</div>
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
        <div>
          <button
            type="button"
            class="btn btn-secondary"
            data-toggle="modal"
            data-target="#exampleModalCenter"
          >
            שמירת שינויים
          </button>
          <div
            class="modal fade"
            id="exampleModalCenter"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">
                    {' '}
                    שמירת שינויים
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">האם אתה בטוח לביצוע השינויים</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    ביטול
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-dismiss="modal"
                  >
                    שמור
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div className="row bg-light text-dark">
          <div className="col-1 border border-dark text-center">ת.ז</div>
          <div className="col-1 border border-dark text-center">שם משתמש</div>
          <div className="col-1 border border-dark text-center">שם פרטי</div>
          <div className="col-1 border border-dark text-center">שם משפחה</div>
          <div className="col-1 border border-dark text-center">צופה</div>
          <div className="col-1 border border-dark text-center">עורך</div>
          <div className="col-1 border border-dark text-center">הדפסת גרף</div>
          <div className="col-1 border border-dark text-center">
            ייצוא תצוגה pdf
          </div>
          <div className="col-1 border border-dark text-center">
            {' '}
            ייצוא לקובץ jpg{' '}
          </div>
          <div className="col-1 border border-dark text-center">
            ייצוא לקובץ CSV
          </div>
          <div className="col-1 border border-dark text-center">
            ייצוא לקובץ XCL
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
