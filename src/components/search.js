import React, {Component} from 'react';
import axios from 'axios';

class SearchBox extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
       console.log("SearchBox handleChange:", e.target.value);
       this.props.setSearchStr(e.target.value);
    }

    componentDidMount(){
    }

    render(){
        return(
            <div>
                <form className="form-inline mt-2 mt-md-0">
                <i class="fas fa-search" aria-hidden="true"></i>
                    <input 
                        className="form-control mr-sm-2" 
                        type="text" 
                        placeholder="שם משתמש" 
                        aria-label="Search"
                        onChange={this.handleChange}
                    />
                </form>
            </div>
        );
    }
    
}

export default SearchBox;

