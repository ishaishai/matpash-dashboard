
import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import SearchBox from './search';

class Users extends Component {
  constructor(props) {
      super(props);
      this.state = {
          data: [],
          currentPage: 1,
          perPage: 0,
          totalCount: 0,
          pageCount: 0,
          searchStr:'',
          mystyle: {
            color: "white",
            backgroundColor: "DodgerBlue",
            padding: "10px",
            fontFamily: "Arial"
          },
          username: ""
      };
      this.handlePageClick = this.handlePageClick.bind(this);
      this.setSearchStrCallBack = this.setSearchStrCallBack.bind(this);
     
  }
  setSearchStrCallBack(value){
      console.log("setSearchStrCallBack: ", value);
      let _that = this;
       this.setState({
          searchStr:value,
          currentPage:1
        },() => {
            _that.searchData();
        })
  }

  searchData() {
    const url = "/api/users/search/"+this.state.currentPage+"?str="+this.state.searchStr;
    axios.get(url)
    .then(res =>{
        console.log("searchData from server:",res);
        this.setState({
            perPage: res.data.perPage,
            pageCount: res.data.pageCount,
            totalCount: res.data.totalCount,
            data: res.data.users
        },() => {
            // this.props.usersInfoCallback(this.state.sourceData);
           // console.log("pagecount: ",this.state.pageCount)
        })
    })
  }

  handlePageClick(e){
      const selectedPage = e.selected + 1 ;
      this.setState({
          currentPage: selectedPage,
      }, () => {
          this.searchData();
      });

  };
  componentDidMount() {
      this.searchData()
  }

  render() {
    const datas = this.state.data;
    const page = datas;//.slice(this.state.offset, this.state.offset + this.state.perPage);

      return (
          <div className="align-items-center ">
                <SearchBox
                    setSearchStr={(str, e) => this.setSearchStrCallBack(str,e)}
                />
                
                <br></br>
                <div className="row bg-light text-dark">
                    <div className="col border border-dark text-center">הרשאות</div>
                    <div className="col border border-dark text-center">ארגון</div>
                    <div className="col border border-dark text-center">תפקיד</div>
                    <div className="col border border-dark text-center">שם משפחה	</div>
                    <div className="col border border-dark text-center">  שם פרטי	</div>
                    <div className="col border border-dark text-center">שם משתמש</div> 
                    <div className="col border border-dark text-center">#</div> 
                </div>
              {/* {this.state.postData} */ }
            {
                page.map((pd,i)=>
                    <div id={pd.id} key={pd.id}  className="row ">
                        <div className="col border text-center">{pd['permissions']}</div>
                        <div className="col border text-center">{pd['organization']}</div>
                        <div className="col border text-center">{pd['role']}</div>
                        <div className="col border text-center">{pd['lastName']}</div>
                        <div className="col border text-center">{pd['firstName']}</div>
                        <div className="col border text-center">{pd['username']}</div>
                        <div className="col border text-center">{this.state.perPage-(this.state.perPage-i)}</div>
                    </div>
                )
            }
              <ReactPaginate
                  forcePage={this.state.currentPage-1}
                  initialPage = {0}
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